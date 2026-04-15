import { Router, type IRouter } from "express";
import { openai } from "../lib/openai";

const router: IRouter = Router();

type UploadedImage = {
  imageBase64: string;
  mimeType?: string;
  fileName?: string;
};

type DirectorControls = {
  dialogueMode?: string;
  tone?: string;
  pace?: string;
  style?: string;
  actionMode?: string;
};

type VisionFrame = {
  imageNumber: number;
  whatIsVisible: string;
  cinematicRole: string;
  storyMeaning: string;
  continuityNotes: string;
};

type VisionResult = {
  frames?: VisionFrame[];
  continuitySeed?: string;
  movieSeed?: string;
  visibleCharacters?: string[];
  visibleProps?: string[];
  tone?: string;
};

function extractJson(content: string) {
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`Failed to parse AI response: ${content.slice(0, 400)}`);
  }
  return JSON.parse(jsonMatch[0]);
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(`${label} timed out`)), ms);
    }),
  ]);
}

function fallbackResult(vision: VisionResult, controls: DirectorControls, userIdea: string, imageCount: number) {
  const shotTarget = imageCount === 1 ? 6 : imageCount === 2 ? 7 : 8;
  const frames = vision.frames?.length
    ? vision.frames
    : Array.from({ length: imageCount }, (_, index) => ({
        imageNumber: index + 1,
        whatIsVisible: "Uploaded cinematic anchor image requiring director interpretation.",
        cinematicRole: index === 0 ? "Opening anchor" : index === imageCount - 1 ? "Reveal anchor" : "Escalation anchor",
        storyMeaning: "A key visual beat in the developing scene.",
        continuityNotes: "Use this as an anchor frame and build connective shots around it.",
      }));
  const title = vision.movieSeed?.split(/[.!?]/)[0]?.slice(0, 48) || "The Signal Between Frames";
  const tone = controls.tone ?? vision.tone ?? "cinematic suspense";
  const pace = controls.pace ?? "measured cinematic pacing";
  const dialogueMode = controls.dialogueMode ?? "balanced dialogue";
  const idea = userIdea.trim() || vision.movieSeed || "A strange visual event pulls the characters into a larger mystery.";
  const drivingRequested = [controls.actionMode, userIdea, vision.movieSeed, vision.continuitySeed, ...(vision.visibleProps ?? [])]
    .join(" ")
    .toLowerCase()
    .match(/driv|car|vehicle|steering|pedal|gear|highway|street|traffic|passenger|overtak/);
  const shots = Array.from({ length: shotTarget }, (_, index) => {
    const shotNumber = index + 1;
    const anchor = frames.find((frame) => frame.imageNumber === Math.min(imageCount, Math.max(1, Math.ceil((shotNumber / shotTarget) * imageCount))));
    const isAnchor = imageCount > 0 && [1, Math.ceil(shotTarget / 2), shotTarget - 1].includes(shotNumber) && anchor;
    return {
      shotNumber,
      source: isAnchor ? `Anchor image ${anchor.imageNumber}` : "Generated connective shot",
      title: isAnchor ? `${anchor.cinematicRole}` : ["Atmosphere setup", "Prop insert", "Reaction beat", "Movement bridge", "Cliffhanger turn"][index % 5],
      description: isAnchor ? anchor.whatIsVisible : `A supporting cinematic beat extends the ${tone} mood and connects the anchor frames into one coherent scene.`,
      cameraAngle: shotNumber === 1 ? "Wide establishing angle" : shotNumber === shotTarget ? "Tight low-angle reveal" : "Controlled medium-to-close cinematic framing",
      cameraMovement: pace.includes("fast") ? "Quick motivated push with a sharp cut" : "Slow push-in with restrained drift",
      lighting: "Motivated cinematic light shaped around the strongest visible source in the uploaded image.",
      sfx: "Layered environmental textures, low impact pulses, and subtle object details.",
      vfx: "Use restrained atmospheric enhancement only where it supports the story world.",
      ambience: "Room tone, distant movement, air pressure, and location-specific background sound.",
      music: tone.includes("hope") ? "Low warm motif rising under the reveal." : "Sparse bass drone with quiet harmonic tension.",
      action: isAnchor ? anchor.storyMeaning : "A small visual action guides the audience into the next anchor moment.",
      dialogue: dialogueMode.includes("No dialogue") || dialogueMode.includes("pure visual") ? "" : shotNumber === Math.ceil(shotTarget / 2) ? "This was never meant to be found." : "",
      transition: shotNumber === shotTarget ? "Cut to black on the unresolved question." : "Motivated visual or sound bridge into the next shot.",
      imagePrompt: `Cinematic ${tone} frame, ${isAnchor ? anchor.whatIsVisible : "connective film shot between uploaded anchor frames"}, ${pace}, detailed camera direction, atmospheric lighting, high-end short film still`,
    };
  });

  const result = {
    movieIdea: {
      title: drivingRequested ? "Full Throttle Confession" : title,
      genre: drivingRequested ? "Grounded cinematic driving thriller" : tone.includes("hope") ? "Cinematic mystery with hopeful sci-fi undertones" : "Cinematic mystery thriller",
      logline: drivingRequested ? idea || "A driver pushes through live traffic while the passenger beside them forces a truth into the open." : idea,
      emotionalHook: drivingRequested ? "The audience feels physically inside the car: hands on wheel, foot on pedal, passenger tension, traffic danger, and speed building shot by shot." : "The audience is pulled in by the feeling that the uploaded frames are fragments of a larger hidden story.",
      coreConflict: drivingRequested ? "The driver must control the vehicle, the road, and the passenger-side pressure while deciding whether to overtake or back off." : "The characters must understand what the visual anomaly means before it changes their world.",
    },
    anchorImages: frames,
    continuity: {
      status: imageCount > 1 ? "Partial continuity" : "Single anchor continuity",
      reading: vision.continuitySeed || "The uploaded images work as anchor frames, with generated inserts and reaction shots needed to create full cinematic flow.",
      contradictions: [],
      creativeRescueOptions: [
        {
          title: "Memory fracture",
          method: "unreliable narrator",
          howItWorks: "Any mismatch becomes evidence that the scene is being remembered incorrectly or reconstructed from damaged footage.",
        },
        {
          title: "Parallel cut",
          method: "parallel timeline",
          howItWorks: "Different lighting or wardrobe can represent simultaneous versions of the same event unfolding across timelines.",
        },
        {
          title: "Dream evidence",
          method: "dream sequence",
          howItWorks: "The mismatch becomes surreal evidence that a character is seeing the truth before reality catches up.",
        },
      ],
    },
    scene: {
      sceneTitle: "The First Signal",
      scenePurpose: "Establish the world, introduce the central mystery, and create a visual cliffhanger that can grow into Episode 1.",
      shots,
    },
    directorNotes: "I treated your uploaded images as anchor frames rather than the entire scene, then added connective inserts, atmosphere, and reaction beats to create real cinematic rhythm. Silence is used where the image can carry tension better than dialogue, while any dialogue is placed only where it pushes the next shot forward.",
    nextImages: [
      {
        title: "The reaction close-up",
        purpose: "Gives the audience emotional access to the mystery.",
        prompt: "Close-up cinematic reaction shot of the main subject processing the impossible event, shallow depth of field, expressive eyes, atmospheric light, high-end film still.",
      },
      {
        title: "The prop answer",
        purpose: "Turns the scene from mood into plot.",
        prompt: "Macro insert shot of the key object or clue revealed by the anchor image, textured surface, dramatic rim light, subtle VFX glow, cinematic realism.",
      },
      {
        title: "The world reveal",
        purpose: "Expands the story beyond the uploaded frames.",
        prompt: "Wide cinematic reveal showing the larger environment reacting to the mystery, atmospheric depth, scale, tension, premium short-film composition.",
      },
    ],
    episodeDirection: {
      episodeTitle: "Episode 1: The First Signal",
      actPath: "Act 1 discovers the anomaly, Act 2 proves it is connected to a hidden force, and Act 3 reveals the cost of following it.",
      cliffhanger: "The final frame reveals the signal is not coming from outside the world, but from someone already inside the scene.",
      episodeTwoSeed: "Episode 2 follows the first deliberate contact and the consequences of answering back.",
    },
    styleRegenerationIdeas: [
      "Same story with colder psychological-thriller tension",
      "Same story with slow spiritual pacing and longer silences",
      "Same story as a neon cyberpunk mystery",
      "Same story as grounded found-footage realism",
    ],
  };

  if (drivingRequested) {
    return {
      ...result,
      drivingSequence: {
        mode: "Realistic in-car cinematic driving",
        vehicleSetup: "Use the uploaded car interior as the hero cabin reference: driver hand on steering wheel, dashboard instruments, center console, windshield road view, and passenger seat geography.",
        continuityRules: [
          "Keep the same driver wardrobe, hand position, dashboard layout, windshield weather, and road direction across all shots.",
          "Cut between wide cabin, steering wheel, pedal insert, gear shift insert, passenger reaction, road POV, exterior tracking, and overtaking shots without changing the car identity.",
          "Make pedal and gear shots functional: foot presses accelerator or brake, hand shifts/uses paddle, engine note changes, car responds with visible motion.",
        ],
        cabinCoverage: [
          { angle: "Driver POV through windshield", purpose: "Shows the road, lane position, speed feeling, and approaching vehicles.", prompt: "Cinematic driver POV from inside a luxury car on a highway, hand on steering wheel, dashboard visible, passenger edge in frame, trees and traffic through windshield, realistic motion blur, premium action film still." },
          { angle: "Low pedal insert", purpose: "Shows the foot pressing accelerator and brake like a real movie driving beat.", prompt: "Low close-up inside car footwell, driver's sneaker pressing accelerator pedal, brake pedal nearby, realistic interior shadows, engine vibration, cinematic macro detail, action thriller lighting." },
          { angle: "Gear/console insert", purpose: "Shows the driver changing gear or engaging paddle shift before acceleration.", prompt: "Close-up of driver's hand changing gear on luxury center console, dashboard glow, tactile motion, shallow depth of field, cinematic realism, high-speed driving scene." },
          { angle: "Passenger two-shot", purpose: "Shows the passenger beside the driver reacting to speed, danger, or dialogue.", prompt: "Wide interior two-shot from back seat showing driver at wheel and passenger beside them, highway visible through windshield, tense cinematic conversation, natural daylight, realistic car cabin geography." },
        ],
        motionBeats: [
          { beat: 1, title: "Cabin lock-in", driverAction: "Driver steadies one hand on the wheel and checks the lane.", camera: "Wide dashboard-to-windshield angle from the passenger side.", roadAction: "Traffic flows ahead with one slower vehicle in the target lane.", sound: "Low cabin rumble, tire hiss, faint indicator tick.", prompt: "Wide in-car cinematic shot from passenger side, driver hand on steering wheel, full dashboard, passenger beside them, highway traffic ahead, real daylight, tense movie realism." },
          { beat: 2, title: "Pedal commitment", driverAction: "Foot presses the accelerator smoothly, then hovers near the brake.", camera: "Low footwell macro insert with vibrating floor and pedals.", roadAction: "The car begins closing distance on the vehicle ahead.", sound: "Engine note rises, road noise thickens.", prompt: "Low cinematic footwell close-up, driver's foot pressing accelerator pedal, brake pedal visible, realistic car interior, motion vibration, action film detail." },
          { beat: 3, title: "Gear change", driverAction: "Driver changes gear or taps paddle shift before pulling out.", camera: "Tight console/steering insert with hand movement.", roadAction: "Lane gap opens beside a slower car.", sound: "Sharp gear click, engine drops then surges.", prompt: "Close-up of hand shifting gear or tapping paddle shifter in luxury car, dashboard lights, speed rising, shallow depth of field, cinematic action realism." },
          { beat: 4, title: "Passenger pressure", driverAction: "Driver glances to passenger for half a second, then back to road.", camera: "Back-seat two-shot showing both driver and passenger.", roadAction: "A red car appears ahead as the overtaking lane clears.", sound: "Passenger breath, seat leather creak, indicator tick.", prompt: "Back seat wide interior shot of driver and passenger in luxury car, driver focused, passenger tense, highway visible ahead, realistic road motion, cinematic thriller frame." },
          { beat: 5, title: "Overtake", driverAction: "Driver signals, turns out, accelerates past the slower vehicle, then returns to lane.", camera: "Exterior tracking shot beside the car, then windshield POV cut.", roadAction: "Hero car overtakes another vehicle with safe but dramatic speed.", sound: "Wind rush, tires over lane markers, engine push.", prompt: "Exterior tracking shot of luxury car overtaking another vehicle on highway, trees on both sides, realistic motion blur, grounded movie action, premium cinematic daylight." },
        ],
        safetyNote: "Keep the scene cinematic but controlled: no reckless impact, no dangerous stunt instruction, just realistic film coverage of a tense driving moment.",
      },
    };
  }

  return result;
}

router.post("/director-lab/analyze", async (req, res): Promise<void> => {
  const { images, controls = {}, userIdea = "" } = req.body ?? {};

  if (!Array.isArray(images) || images.length < 1 || images.length > 3) {
    res.status(400).json({ error: "Upload 1 to 3 images for Director Lab." });
    return;
  }

  const validImages = images as UploadedImage[];
  const invalidImage = validImages.find(
    (image) =>
      !image ||
      typeof image.imageBase64 !== "string" ||
      image.imageBase64.length < 20 ||
      (image.mimeType && typeof image.mimeType !== "string"),
  );

  if (invalidImage) {
    res.status(400).json({ error: "Each image must include imageBase64 and a valid mimeType." });
    return;
  }

  const directorControls = controls as DirectorControls;
  const cleanUserIdea = typeof userIdea === "string" ? userIdea : "";
  const shotTarget = validImages.length === 1 ? 6 : validImages.length === 2 ? 7 : 8;

  try {
    const imageContent = validImages.flatMap((image, index) => [
      {
        type: "text" as const,
        text: `ANCHOR IMAGE ${index + 1}${image.fileName ? ` (${image.fileName})` : ""}: visually inspect this image for characters, setting, props, lighting, mood, genre, and story meaning.`,
      },
      {
        type: "image_url" as const,
        image_url: {
          url: `data:${image.mimeType ?? "image/jpeg"};base64,${image.imageBase64}`,
          detail: "high" as const,
        },
      },
    ]);

    const visionResponse = (await withTimeout(
      openai.chat.completions.create({
        model: "gpt-5.2",
        max_completion_tokens: 2200,
        messages: [
          {
            role: "system",
            content:
              'Visually inspect uploaded cinematic anchor images. Return compact valid JSON only: {"frames":[{"imageNumber":1,"whatIsVisible":"specific visual inventory","cinematicRole":"opening/escalation/reveal/etc","storyMeaning":"narrative implication","continuityNotes":"connection notes"}],"continuitySeed":"how they connect or mismatch","movieSeed":"strong movie premise inferred from the images","visibleCharacters":["characters"],"visibleProps":["props"],"tone":"cinematic tone"}',
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Read these ${validImages.length} image(s) as anchor frames for Director Lab. User idea: ${cleanUserIdea.trim() || "infer from images"}`,
              },
              ...imageContent,
            ],
          },
        ],
      }),
      30000,
      "Director Lab visual read",
    )) as { choices?: Array<{ message?: { content?: string | null } }> };

    const vision = extractJson(visionResponse.choices?.[0]?.message?.content ?? "{}") as VisionResult;

    try {
      const sceneResponse = (await withTimeout(
        openai.chat.completions.create({
          model: "gpt-5-mini",
          max_completion_tokens: 3000,
          messages: [
            {
              role: "system",
            content: `You are Director Lab. Build a compact but complete cinematic package from a visual image read. Use exactly ${shotTarget} shots. Uploaded images are anchor frames, not the full scene. Add missing establishing, insert, prop, reaction, atmosphere, transition, and cliffhanger shots. Include Director Notes, Creative Rescue, next image prompts, and style regeneration ideas.

If the user asks for driving, cars, streets, highway movement, gear changes, pedals, passengers, overtaking, or if the uploaded image visibly shows a vehicle interior/exterior, add an extra "drivingSequence" object. It must make the character/model feel like they are really driving in a movie. Include: mode, vehicleSetup, continuityRules, cabinCoverage, motionBeats, and safetyNote.

Driving requirements when applicable:
- Include driver hand/steering continuity.
- Include a low camera cutaway of legs/feet pressing accelerator and brake pedals.
- Include a close-up gear change or paddle shift shot.
- Include a full interior/cabin shot showing dashboard, windshield, center console, driver, and passenger seat geography.
- Include passenger beside the driver with reaction/dialogue potential.
- Include streets/highway seen through windshield and exterior tracking shots.
- Include car motion, lane change, acceleration, and overtaking other vehicles as cinematic beats.
- Keep it realistic and filmable; no unsafe crash instructions.

Return valid JSON only with keys: movieIdea, anchorImages, continuity, scene, directorNotes, nextImages, episodeDirection, styleRegenerationIdeas, and optional drivingSequence.`,
            },
            {
              role: "user",
              content: JSON.stringify({
                vision,
                controls: directorControls,
                userIdea: cleanUserIdea,
                requiredShape: {
                  movieIdea: { title: "", genre: "", logline: "", emotionalHook: "", coreConflict: "" },
                  anchorImages: "use the vision frames array",
                  continuity: { status: "", reading: "", contradictions: [], creativeRescueOptions: [{ title: "", method: "", howItWorks: "" }] },
                  scene: {
                    sceneTitle: "",
                    scenePurpose: "",
                    shots: [{ shotNumber: 1, source: "", title: "", description: "", cameraAngle: "", cameraMovement: "", lighting: "", sfx: "", vfx: "", ambience: "", music: "", action: "", dialogue: "", transition: "", imagePrompt: "" }],
                  },
                  directorNotes: "",
                  nextImages: [{ title: "", purpose: "", prompt: "" }],
                  episodeDirection: { episodeTitle: "", actPath: "", cliffhanger: "", episodeTwoSeed: "" },
                  styleRegenerationIdeas: [],
                  drivingSequence: {
                    mode: "",
                    vehicleSetup: "",
                    continuityRules: [""],
                    cabinCoverage: [{ angle: "", purpose: "", prompt: "" }],
                    motionBeats: [{ beat: 1, title: "", driverAction: "", camera: "", roadAction: "", sound: "", prompt: "" }],
                    safetyNote: "",
                  },
                },
              }),
            },
          ],
        }),
        15000,
        "Director Lab scene build",
      )) as { choices?: Array<{ message?: { content?: string | null } }> };

      res.json(extractJson(sceneResponse.choices?.[0]?.message?.content ?? "{}"));
    } catch (sceneError) {
      req.log.warn(
        {
          error:
            sceneError instanceof Error
              ? { name: sceneError.name, message: sceneError.message }
              : sceneError,
        },
        "Director Lab scene build fell back to deterministic package",
      );
      res.json(fallbackResult(vision, directorControls, cleanUserIdea, validImages.length));
    }
  } catch (error) {
    req.log.error(
      {
        error:
          error instanceof Error
            ? { name: error.name, message: error.message, stack: error.stack }
            : error,
      },
      "Director Lab analysis failed",
    );
    res.status(500).json({
      error:
        "Director Lab could not analyze these images. Try smaller JPG/PNG images or adjust your creative controls.",
    });
  }
});

export default router;
