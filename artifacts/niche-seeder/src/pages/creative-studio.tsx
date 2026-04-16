import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Bot,
  Check,
  Copy,
  Film,
  Globe,
  Layers2,
  MapPin,
  RefreshCw,
  Search,
  Sparkles,
  Wand2,
  X,
  Zap,
  Wind,
  Star,
  Layers,
  Triangle,
  PlayCircle,
} from "lucide-react";

type VideoEffect = {
  name: string;
  category: string;
  description: string;
  prompt: string;
  tool: string;
  duration: string;
  tone: string;
};

const videoEffects: VideoEffect[] = [
  // ── Motion FX ────────────────────────────────────────────────────────────
  { name: "Dolly Zoom", category: "Motion FX", description: "Hitchcock vertigo — subject holds, world warps behind them", tone: "blue", tool: "Runway Gen-3", duration: "4–6s", prompt: "Photorealistic cinematic scene: the subject stands centered and pin-sharp while the camera simultaneously zooms in and physically pulls backward — the Hitchcock Vertigo dolly zoom. The background compresses and stretches dramatically as depth collapses, making the world behind the subject appear to warp and breathe. The subject's expression remains locked to camera throughout. Environmental detail — city street, hallway, or open landscape — sharpens in foreground while the background morphs. Anamorphic lens. Natural lighting with rim light from behind. 8 seconds, wide cinematic glass, ultra-realistic physics, no CGI quality." },
  { name: "Cinematic Parallax", category: "Motion FX", description: "Multi-layer depth scroll — foreground, mid, background move at different speeds", tone: "blue", tool: "Kling AI", duration: "5–7s", prompt: "Photorealistic cinematic scene: the camera performs a slow lateral drift across a multi-layered environment. Foreground elements — branches, architecture, or fabric — slide past quickly. The midground at medium speed. The distant background landscape barely moves. Atmospheric volumetric haze hangs between each layer creating tangible depth. Practical lighting shifts as the camera angle changes — golden rim light catches different surfaces throughout the move. Wide anamorphic lens. 6 seconds, photorealistic, no repetition, epic landscape scale." },
  { name: "Orbital Rotation", category: "Motion FX", description: "Camera orbits the subject 360° — background sweeps dramatically", tone: "purple", tool: "Runway Gen-3", duration: "6–8s", prompt: "Photorealistic cinematic scene: the camera performs a smooth, controlled 360-degree orbital arc around the centered subject. The subject remains perfectly in focus throughout the full rotation while the environment sweeps dramatically behind them — city skyline, landscape, or interior space scrolling continuously. Practical lighting tracks realistically as the camera moves — backlight becomes fill, shadows rotate, rim light shifts position. The ground plane and any environmental elements (smoke, dust, water) are visible throughout the arc. Wide lens, 8 seconds, no CGI — real physics, real light behavior." },
  { name: "Float & Levitation", category: "Motion FX", description: "Subject rises weightlessly — hair and fabric drift in zero gravity", tone: "cyan", tool: "Pika 2.0", duration: "4–6s", prompt: "Photorealistic cinematic scene: the subject slowly lifts off the ground in a dreamlike levitation. Every strand of their hair rises and fans outward, fabric flows upward as if submerged in slow water, any loose accessories drift independently. The ground beneath them recedes as they rise. Soft volumetric backlight halos them from below. The background gradually defocuses into a deep bokeh as altitude increases. A small ring of dust particles lifts from the floor at the moment of departure. Peaceful, ethereal. 5 seconds, shot on a 50mm equivalent, ultra-realistic cloth and hair physics, no wires visible." },
  { name: "Hypnotic Zoom Loop", category: "Motion FX", description: "Infinite seamless zoom — each layer reveals the next endlessly", tone: "purple", tool: "Runway Gen-3", duration: "4s loop", prompt: "Photorealistic cinematic scene: an infinite zoom tunnel pulls the viewer continuously deeper into a nested environment — a room within a painting within a mirror within a room. Each zoom layer reveals a new scene that contains another zoom in its center. The motion accelerates subtly and then resets at the apex without a visible cut — a perfect seamless loop. Colors and lighting shift warmly with each new layer. The motion is hypnotic and meditative. 4-second loop, wide lens, photorealistic texture at each depth level, no artificial glow." },
  { name: "Slow Motion Rise", category: "Motion FX", description: "Ultra-slow upward camera rise — light and shadow shift as it ascends", tone: "blue", tool: "Kling AI", duration: "7–10s", prompt: "Photorealistic cinematic scene: the camera rises in a slow vertical crane movement from ground level to high altitude, framing the subject the entire time. Shot at 240fps and slowed to 24fps — the air itself seems thick. Every particle of dust, every hair movement, every breath visible. As the camera rises, the lighting quality shifts — ground-level shadow gives way to full golden ambient light from above. The environment opens up below, revealing scale. Subject's clothing and hair respond to a gentle wind that increases slightly with height. 8 seconds, anamorphic lens, pure photorealism." },
  { name: "Push In Focus Pull", category: "Motion FX", description: "Camera pushes in — focus shifts from blurred foreground to sharp subject", tone: "slate", tool: "Runway Gen-3", duration: "4–5s", prompt: "Photorealistic cinematic scene: a shallow depth of field shot begins with a blurred, out-of-focus foreground element filling the near frame — a candle flame, raindrops on glass, a hand, or plant life. The camera slowly pushes forward while a precise rack focus pull snaps the subject in the background into sharp clarity, the foreground dissolving into smooth bokeh. The transition is imperceptibly smooth. Practical lighting from a single source — a window, lamp, or candle — creates a chiaroscuro quality. 4 seconds, 85mm lens wide open, cinematic depth, no artifice." },
  { name: "Tilt-Shift Miniature", category: "Motion FX", description: "World looks like a tiny diorama — selective focus band, saturated colors", tone: "green", tool: "Pika 2.0", duration: "5–6s", prompt: "Photorealistic cinematic scene: a high-angle shot of a busy urban scene — street, market, or transport hub — is rendered with tilt-shift lens simulation. A single horizontal band of sharp focus bisects the frame while the top and bottom thirds blur into smooth bokeh, making cars, people, and buildings look like scale model toys. Colors are slightly oversaturated and warm. Motion is slightly accelerated — 4x speed — making people scurry like ants. A gentle tilt of the focus plane slowly drifts through the scene. 5 seconds, top-down 45-degree angle, photorealistic miniature aesthetic." },

  // ── Transform FX ─────────────────────────────────────────────────────────
  { name: "Smoke Dissolve", category: "Transform FX", description: "Subject disintegrates into directional smoke that blows away", tone: "slate", tool: "Runway Gen-3", duration: "5–7s", prompt: "Photorealistic cinematic scene: the subject begins to disintegrate from one side of their body — particles and wisps of colored smoke peel away from their form progressively. Each particle carries the color of the area of the body it originated from — skin tones, clothing colors — bleeding into the dissipating cloud. A gentle directional wind pushes the smoke diagonally across the frame. The remaining half of the subject is perfectly detailed and sharp — the contrast between solid and disintegrating is dramatic. Moody backlighting rimming the smoke. 6 seconds, anamorphic, ultra-realistic fluid simulation, photographic realism." },
  { name: "Crystal Shattering", category: "Transform FX", description: "Subject explodes into thousands of glass shards with full physics", tone: "cyan", tool: "Kling AI", duration: "3–5s", prompt: "Photorealistic cinematic scene: the subject shatters explosively into thousands of glass crystal fragments — the break initiates at a single point of impact and radiates outward in a bloom of fracturing planes. Each shard is physically simulated — tumbling, spinning, refracting studio light into rainbow prisms as it arcs through the air. The shards catch and scatter light individually. The background remains intact and in focus, showing the full space where the subject just stood. Shot at 240fps. Slow motion reveals every micro-fracture. 4 seconds, wide lens, no CGI quality — pure photorealistic shatter physics." },
  { name: "Morphing Transform", category: "Transform FX", description: "Subject liquefies and smoothly morphs into another form entirely", tone: "purple", tool: "Runway Gen-3", duration: "5–7s", prompt: "Photorealistic cinematic scene: the subject's body begins a seamless, organic morphing transformation — their form softens and flows like warm wax, features rearranging fluidly into an entirely different subject, animal, or stylized version of themselves. The morph ripples across the body like a wave. Skin texture transitions cell by cell. No jump cuts — a continuous liquid flow from one identity to another. Studio lighting catches every stage of the transformation with consistent shadows and highlights. 6 seconds, tight portrait lens, uncanny and cinematic, no artifice or CGI feel." },
  { name: "Pixel Burst Explode", category: "Transform FX", description: "Subject shatters into colored voxels that scatter with physics", tone: "purple", tool: "Pika 2.0", duration: "3–4s", prompt: "Photorealistic cinematic scene: the subject detonates outward in a burst of individual colored pixels and voxels — each square fragment maintaining the exact color from its origin point in the original image, creating a chromatic explosion cloud that expands outward. The voxels tumble with gravity and air resistance. Shot at 300fps — slowed to maximum slowdown, each pixel's trajectory visible and unique. The background is dark to maximize the color contrast of the exploding fragments. 3 seconds, low angle looking up into the explosion, pure digital destruction physics." },
  { name: "Water Ripple Reveal", category: "Transform FX", description: "A water drop lands — concentric ripples transform the entire scene", tone: "blue", tool: "Kling AI", duration: "4–5s", prompt: "Photorealistic cinematic scene: a single water droplet falls from above and strikes the surface of the image — visible as if the scene itself were a liquid film. The impact creates concentric photorealistic ripple waves that radiate outward from the center of the frame. As each ripple ring passes, it transforms the scene underneath — warm grade to cool, day to night, summer to autumn. Water surface tension, light refraction arcing across the ripples, and displaced micro-droplets all render with accurate physics. 5 seconds, macro close-up optic, photorealistic fluid dynamics." },
  { name: "Paper Tear Reveal", category: "Transform FX", description: "The scene tears like thick paper from center out, revealing another world", tone: "amber", tool: "Runway Gen-3", duration: "5–6s", prompt: "Photorealistic cinematic scene: the visual frame tears apart like a thick piece of photographic paper being ripped by invisible hands — starting from a single point at the center and tearing outward in an irregular, organic crack. The torn paper edges are thick, layered, and textured with depth — the white paper core visible between the ripping surfaces. Behind the tear, an entirely different world or environment is revealed. The torn fragments curl and cast shadows on each other. Practical warm light from the revealed world spills through the tear. 5 seconds, tight lens, physical paper simulation." },
  { name: "Glitch Corruption", category: "Transform FX", description: "Digital corruption wave tears through the frame — RGB split, pixel storms", tone: "cyan", tool: "Pika 2.0", duration: "2–4s", prompt: "Photorealistic cinematic scene: a wave of intense digital corruption sweeps across the frame from one edge — RGB channels split and offset, horizontal scan lines tear and misalign, macro pixel blocks shift and displace revealing fragments of corrupted color underneath, signal noise storms burst in patches. The corruption moves like a physical wave with momentum. The uncorrupted portion of the frame remains photorealistic and in focus — the contrast between clean and corrupted makes each half more extreme. 3 seconds, full frame, cyberpunk signal-death aesthetic." },
  { name: "Sand Dissolution", category: "Transform FX", description: "Subject crumbles from one side to the other — Thanos-level dust", tone: "amber", tool: "Runway Gen-3", duration: "6–8s", prompt: "Photorealistic cinematic scene: the subject begins dissolving progressively from one side of their body — skin, clothing, and hair converting into individual sand particles and dust flakes that are swept away by an invisible directional wind. The dissolution creeps across the body at a deliberate pace, leaving a trail of swirling particles mid-air that retain the original color of each area. The remaining solid half is rendered in crisp photographic detail, making the contrast between being and disintegrating deeply striking. Rim backlight halos the particle cloud. 7 seconds, wide lens, photorealistic particle simulation." },

  // ── Atmosphere FX ─────────────────────────────────────────────────────────
  { name: "Petal Cascade", category: "Atmosphere FX", description: "Thousands of petals fall through the scene — each one catching the light individually", tone: "pink", tool: "Pika 2.0", duration: "6–8s", prompt: "Photorealistic cinematic scene: the subject stands centered while thousands of cherry blossom or rose petals fall through the frame from above. Each petal has unique size, rotation, and drift path — responding to micro-currents in the air with accurate aerodynamic physics. Some petals spiral lazily, some fall fast. Individual petals land on the subject's hair and shoulders. Warm golden backlight filters through the petal cloud, each translucent petal glowing softly where light passes through it. The falling petals create a gentle depth of field layering — near petals blurred, mid petals sharp. 7 seconds, wide lens, photorealistic petal physics." },
  { name: "Neon Rain", category: "Atmosphere FX", description: "Neon-colored rain streaks down — every puddle reflects the chromatic light", tone: "cyan", tool: "Kling AI", duration: "5–6s", prompt: "Photorealistic cinematic scene: the subject stands in a dark urban environment as vivid neon-colored rain falls — each raindrop streak carrying a different spectral color: cyan, magenta, electric blue, acid yellow. The wet ground surface reflects every neon streak in sharp mirror-like puddles that distort with each new impact. Rain soaks the subject's clothing and flattens their hair realistically. The air itself is misted with fine spray that catches and diffracts the colored light. Shallow depth of field. 6 seconds, anamorphic lens flares from neon sources, photorealistic rain physics and surface interactions." },
  { name: "Floating Embers", category: "Atmosphere FX", description: "Hot orange embers rise through heat haze — some glow bright before dying", tone: "orange", tool: "Pika 2.0", duration: "6–7s", prompt: "Photorealistic cinematic scene: the subject stands in a fire-lit environment as hundreds of hot orange and deep red embers float upward through the frame, each on its own organic drift path. Heat haze visibly distorts the background behind the rising embers, making the scene shimmer. Individual embers glow at their brightest and then fade to dark ash mid-flight. Some land on nearby surfaces and briefly scorch. The subject's face is illuminated by warm, flickering fire light from below. 6 seconds, wide lens, photorealistic pyrotechnic physics, volumetric heat distortion." },
  { name: "Aurora Borealis", category: "Atmosphere FX", description: "Ribbons of northern lights ripple across the sky — colors shift through the spectrum", tone: "green", tool: "Runway Gen-3", duration: "7–10s", prompt: "Photorealistic cinematic scene: the subject stands in a vast dark wilderness — tundra, mountain clearing, or frozen lake — as massive ribbons of aurora borealis unfurl and ripple across the entire sky above them. The aurora colors shift slowly through vivid green, ethereal violet, and rare crimson in slow fluid waves driven by invisible solar wind. Individual stars are visible through the aurora bands. The reflected light from the aurora softly illuminates the subject's upturned face and the ground surface around them, painting them in shifting spectral color. 8 seconds, wide angle, photorealistic atmospheric physics." },
  { name: "Snow Globe", category: "Atmosphere FX", description: "Snow fills and swirls around the scene — each flake uniquely lit", tone: "blue", tool: "Pika 2.0", duration: "5–7s", prompt: "Photorealistic cinematic scene: the subject stands in a warmly-lit interior space as heavy snow falls and swirls around them as if inside a snow globe that has just been shaken. Snowflakes vary from large fluffy clusters to tiny fast-moving specks, each catching warm interior light individually. Some snowflakes land on the subject's hair, eyelashes, and shoulders and melt. The swirling snow creates circular air-current patterns visible in the varying drift directions of each flake. Warm amber interior light against the cold white creates a cozy tension. 6 seconds, 50mm equivalent, photorealistic snow physics." },
  { name: "Fog Creep", category: "Atmosphere FX", description: "Dense low-lying fog rolls in slowly — wrapping around every surface", tone: "slate", tool: "Kling AI", duration: "7–9s", prompt: "Photorealistic cinematic scene: a thick, dense wall of low-lying ground fog slowly rolls into the frame from the edges, creeping along the floor and wrapping around the subject's feet and ankles. The fog is genuinely volumetric — it responds to the subject's presence, parting slightly around their legs and swirling in their wake. Individual tendrils of fog curl upward from the main mass. A single cold key light catches the fog from one side, creating visible rays of light within the mist. The subject above the fog line remains sharply lit while below is gradually consumed. 8 seconds, wide lens, physically-simulated fog dynamics." },
  { name: "Confetti Explosion", category: "Atmosphere FX", description: "Confetti detonates upward and rains down — slow motion captures each piece", tone: "pink", tool: "Pika 2.0", duration: "4–5s", prompt: "Photorealistic cinematic scene: a massive confetti cannon detonates from below the frame, launching thousands of circular discs and paper streamers upward in an explosive burst. Shot at 240fps — slow motion reveals each individual piece tumbling and spinning, catching studio light on their faces and edges as they rise and then begin to rain back down. Streamers twist and curl in the air currents. The subject stands centered, arms raised, as the confetti fills every plane of the frame around them. 4 seconds of peak slow motion, then ramps back to real time. Pure practical particle physics." },
  { name: "Golden Dust Storm", category: "Atmosphere FX", description: "Swirling golden particles orbit the subject in a magical storm of light", tone: "amber", tool: "Runway Gen-3", duration: "5–7s", prompt: "Photorealistic cinematic scene: thousands of golden dust particles and micro-sparkles swirl around the subject in a controlled orbital storm — flowing in wide arcs and tight spirals around their silhouette without ever obscuring their face. Each particle catches a bright directional backlight, creating a halo of scattered gold light. Some particles drift slowly while others zip past in fast trails of motion blur. The ground around the subject scatters with individual particle impacts. 6 seconds, shallow depth of field, anamorphic bokeh from the backlight, cinematic luxury aesthetic, photorealistic particle fluid dynamics." },

  // ── Cinematic FX ──────────────────────────────────────────────────────────
  { name: "Film Grain Noir", category: "Cinematic FX", description: "Heavy 35mm grain, chiaroscuro shadows, intermittent film flicker", tone: "slate", tool: "Runway Gen-3", duration: "5–8s", prompt: "Photorealistic cinematic scene: the subject is shot in deep black and white with heavy authentic 35mm film grain texture — coarse, organic, and dense in the shadows. Strong chiaroscuro lighting with a single practical source creates hard shadows that define every facial plane. Intermittent film gate weave makes the frame breathe slightly. Film burn flares orange at the edges in brief bursts. The shutter artifact is subtly visible at motion peaks. The subject wears period clothing or is framed in an architectural setting with strong geometric shadows. 6 seconds, 35mm anamorphic emulation, 1950s Hollywood film look." },
  { name: "Anamorphic Lens Flare", category: "Cinematic FX", description: "Long horizontal blue-streak flares sweep across the frame", tone: "blue", tool: "Kling AI", duration: "4–6s", prompt: "Photorealistic cinematic scene: the subject is backlit or side-lit by a strong practical light source — sun, streetlight, or film light — and as the camera subtly shifts angle, long horizontal anamorphic lens flares sweep dramatically across the frame: electric blue-white streaks extending to both frame edges. Secondary circular bokeh flares scatter in the mid-ground. The subject is simultaneously front-lit softly from camera left with warm fill. Additional internal lens element reflections create a layered, multi-flare composition. 5 seconds, 2.39:1 anamorphic aspect ratio, Hollywood cinematography quality." },
  { name: "VHS Glitch", category: "Cinematic FX", description: "VHS tracking errors, signal bleed, 80s home video realism", tone: "purple", tool: "Pika 2.0", duration: "4–5s", prompt: "Photorealistic cinematic scene: the footage is rendered entirely in the authentic VHS cassette aesthetic — coarse luminance noise fills the shadows, color information bleeds and smears horizontally at high-contrast edges, horizontal tracking error bands drift up and down the frame unpredictably. A date-time stamp counter appears in the lower corner in pixelated orange font. Dropout bands momentarily strip the image. The magnetic tape's characteristic soft ghosting behind moving subjects trails by 1–2 frames. The subject is shot in an 80s-styled space — big hair, bold colors, practical lamps. 4 seconds, 4:3 aspect ratio, authentic analog degradation." },
  { name: "Neon Color Grade", category: "Cinematic FX", description: "Blade Runner cyberpunk grade — shadows blue-black, highlights neon", tone: "cyan", tool: "Runway Gen-3", duration: "5–7s", prompt: "Photorealistic cinematic scene: the subject stands in a rain-slicked urban night environment bathed in a bold cyberpunk color grade — deep shadows crushed to blue-black, highlights boosted into neon cyan and magenta, mid-tones shifted into electric teal. Neon signage and wet street reflections dominate. The subject's face is lit by a split between a cyan source and magenta source, rendering skin in an otherworldly spectral palette. Haze in the air catches the colored light in volumetric rays. 6 seconds, anamorphic lens, Blade Runner 2049 cinematography quality, zero CGI look." },
  { name: "Orange & Teal Grade", category: "Cinematic FX", description: "Classic Hollywood blockbuster color split — warm skin, cold environment", tone: "orange", tool: "Kling AI", duration: "5–8s", prompt: "Photorealistic cinematic scene: the subject is shot in the definitive Hollywood blockbuster orange-and-teal color grade — skin tones and highlights pushed into rich amber-orange warmth, while shadows, backgrounds, and cool surfaces are driven into deep teal-blue. The separation between the warm subject and cold environment creates strong visual punch. Shot in a cinematic outdoor environment — desert, city rooftop, or coast — with golden hour natural light as the foundation. 6 seconds, anamorphic 2.39:1, professional colorist-level grade, no desaturation." },
  { name: "Dreamy Bleach Bypass", category: "Cinematic FX", description: "Silver retention — gritty metallic high contrast, muted color", tone: "slate", tool: "Runway Gen-3", duration: "5–7s", prompt: "Photorealistic cinematic scene: the footage is rendered in the photochemical bleach bypass look — color saturation dramatically reduced, silver halide grain retained creating a metallic, gritty texture throughout every frame. Highlights are clipped bright without detail. Shadows are dense and impenetrable. The desaturation is partial — primary colors bleed through faintly, particularly reds and skin tones. The subject is shot in a gritty environment — industrial, military, or documentary context — with strong single-source hard lighting. 6 seconds, anamorphic, Saving Private Ryan / Jarhead grade quality." },
  { name: "Wes Anderson Palette", category: "Cinematic FX", description: "Perfect bilateral symmetry, muted pastels, deadpan framing", tone: "pink", tool: "Kling AI", duration: "5–7s", prompt: "Photorealistic cinematic scene: the shot is composed with perfect bilateral symmetry — the subject stands centered in a symmetrical interior space (hotel lobby, corridor, library) with equal negative space on each side. The color palette is muted and pastel: warm yellows, dusty rose, sage green, ivory. Flat frontal lighting eliminates dramatic shadows, giving the scene a storybook artificiality. Props and set dressing are period-specific and obsessively curated. The subject performs a small deadpan gesture directly to camera. 5 seconds, 1.85:1 aspect ratio, perfectly balanced composition, no hand-held." },
  { name: "Super 8 Vintage", category: "Cinematic FX", description: "Kodachrome Super 8 warmth — oversaturated, light-leaky, sun-soaked", tone: "amber", tool: "Pika 2.0", duration: "5–7s", prompt: "Photorealistic cinematic scene: the subject is captured entirely in the Super 8 Kodachrome film aesthetic — reds and oranges are rich and oversaturated, skin glows warmly, blues are slightly suppressed. The image is slightly overexposed in the highlights with a soft, diffused quality at the edges — the vintage Super 8 lens vignette. Film grain is coarser and more visible than 35mm. Intermittent light leaks bleed orange and pink from the right edge. The shutter flickers rhythmically. Subject is outdoors in golden afternoon light — summer, beach, or garden. 6 seconds, 4:3 aspect ratio, 1970s home movie warmth." },

  // ── Portrait & Character FX ───────────────────────────────────────────────
  { name: "Particle Burst Avatar", category: "Portrait FX", description: "Portrait explodes into a particle cloud and reforms as a new version", tone: "purple", tool: "Runway Gen-3", duration: "5–7s", prompt: "Photorealistic cinematic scene: a close-up portrait of the subject suddenly detonates outward — every pixel of the face and shoulders exploding into thousands of glowing, individually-rendered particles that carry the subject's exact color and texture. The particle cloud swirls dramatically outward for two beats, spiraling in a wide arc, before reversing — all particles rushing back inward and reconverging into a transformed version of the portrait: different lighting, different mood, or stylized aesthetic. The moment of full dissolution is held for a beat. 6 seconds, tight 85mm portrait lens, dramatic studio backlight, photorealistic particle physics." },
  { name: "Anime Face Transform", category: "Portrait FX", description: "Real portrait smoothly morphs into anime art style — linework appears, eyes expand", tone: "cyan", tool: "Kling AI", duration: "4–6s", prompt: "Photorealistic cinematic scene beginning in live-action: a tight portrait shot of the subject's face, lit cleanly with soft box from camera left. Slowly, the transformation begins — eyes enlarge and become more expressive with lash definition, skin tone becomes cel-shaded with clean anime-style rendering, linework appears at edges and features, hair stylizes into defined graphic shapes. The morph is gradual and wave-like — transforming from chin upward. Background transitions from photographic depth to illustrated. 5 seconds, continuous uncut transformation, character design quality equal to Studio Trigger or Kyoto Animation." },
  { name: "Echo Trail", category: "Portrait FX", description: "Every movement leaves stroboscopic echo trails — motion becomes art", tone: "blue", tool: "Pika 2.0", duration: "5–7s", prompt: "Photorealistic cinematic scene: the subject performs a slow deliberate movement — raising an arm, turning their head, or walking a few steps — as stroboscopic motion echo trails follow every part of their body. Each echo is a semi-transparent ghost of a previous frame, layered at slightly reduced opacity and delayed by 3–5 frames. Trails fade out over 10–15 frames. The overall effect makes movement feel like long-exposure dance photography come to life. Cool-toned studio lighting maximizes the ghosting effect. 6 seconds, medium shot, wide aperture, the movement itself has been choreographed for maximum visual impact." },
  { name: "Silhouette & Neon", category: "Portrait FX", description: "Subject's silhouette becomes a pulsing neon outline against total black", tone: "cyan", tool: "Runway Gen-3", duration: "4–6s", prompt: "Photorealistic cinematic scene: the subject's body and face are backlit by an overwhelming practical light source until they become a pure clean silhouette against a jet-black background. Then an electric neon outline traces every contour — the precise shape of the hair, shoulders, and features — pulsing with luminous electric energy in slowly shifting colors: cyan to magenta to gold. An outer glow corona softly halos the neon line. Individual sparks arc briefly between features. The subject shifts weight or turns slightly — the neon outline tracks every movement in real time. 5 seconds, tight lens, pure black background, no fill light on subject." },
  { name: "Mirror Kaleidoscope", category: "Portrait FX", description: "Portrait multiplies into a symmetrical kaleidoscope mandala that rotates", tone: "pink", tool: "Pika 2.0", duration: "5–7s", prompt: "Photorealistic cinematic scene: a close-up portrait of the subject is reflected, rotated, and tiled symmetrically into an eight-fold kaleidoscope mandala arrangement. Face fragments, eyes, lips, and hair become the geometric elements of a rotating mandala. The pattern slowly rotates clockwise while the individual portrait elements also animate subtly — blinking eyes, a subtle breath, moving hair. Colors are vivid and saturated — jewel tones pulled from the subject's actual coloring. The mandala breathes and pulses gently. 6 seconds, perfectly centered, hypnotic rotation, high-detail portrait quality preserved in each facet." },
  { name: "AI Hologram", category: "Portrait FX", description: "Subject becomes a semi-transparent blue holographic projection with scan lines", tone: "blue", tool: "Kling AI", duration: "4–6s", prompt: "Photorealistic cinematic scene: the subject's full body appears as a holographic projection in a dark room — semi-transparent, with a deep electric blue tint and subtle scan line interference pattern running vertically across the form. Occasional holographic static causes partial flicker and momentary dropout of sections of the body. A soft outer glow corona halos the entire projection. Small floating data particles and geometric HUD elements orbit the hologram. The physical projector device is visible on the floor, emitting a focused beam upward. 5 seconds, wide shot, Iron Man-level hologram quality, dark environment with a single cyan key light." },
  { name: "Paint Stroke Reveal", category: "Portrait FX", description: "Invisible brushstrokes progressively paint the subject into existence", tone: "amber", tool: "Runway Gen-3", duration: "6–8s", prompt: "Photorealistic cinematic scene — but rendered in an oil painting aesthetic: the canvas begins blank and warm white, and an invisible brush begins applying thick strokes of oil paint that progressively build up the subject's portrait from background to foreground. Each stroke reveals texture and color simultaneously — the impasto thickness of each mark casts micro-shadows. The reveal moves in waves from background colors to mid-tones to face detail. The final strokes are the eyes — applied last, at which point the portrait is complete and the painting becomes photorealistic and alive. 7 seconds, single fixed camera angle, painterly-to-photorealistic blend." },
  { name: "Ink Drop Bloom", category: "Portrait FX", description: "Portrait forms from ink drops blooming in water — dendritic fluid patterns", tone: "slate", tool: "Kling AI", duration: "6–7s", prompt: "Photorealistic cinematic scene: shot top-down over a basin of still water, individual drops of ink fall from above and bloom outward in dendritic organic patterns — branching like frost or lightning with perfect fluid dynamics. Each drop carries a specific color: skin tones, clothing colors, hair color. The blooming ink patterns collectively build up the subject's portrait from the ground up, ink-cloud by ink-cloud. The water stays fully clear and photorealistic throughout. Final result: a recognizable portrait assembled entirely from organic fluid ink forms. 6 seconds, overhead camera, macro optic, photorealistic fluid simulation, no shortcuts." },

  // ── Fantasy & Sci-Fi FX ───────────────────────────────────────────────────
  { name: "Portal Vortex", category: "Fantasy FX", description: "A dimensional portal tears open — another world visible through it", tone: "purple", tool: "Runway Gen-3", duration: "5–7s", prompt: "Photorealistic cinematic scene: in the environment behind the subject, reality tears open in a swirling dimensional portal — rings of crackling energy in electric blue and deep violet spiral outward from a central point. The air around the portal edge distorts with gravitational lensing — nearby objects bend toward it. Through the portal aperture, an entirely different world is visible in perfect clarity: alien landscape, underwater abyss, or mirror dimension. Debris and particles are pulled toward the event horizon. The subject stands in foreground, dwarfed by the scale of the portal. 6 seconds, wide anamorphic, photorealistic energy and environmental physics." },
  { name: "Magic Particle Storm", category: "Fantasy FX", description: "Subject conjures particle storm from their hands — light orbits and arcs outward", tone: "amber", tool: "Pika 2.0", duration: "5–7s", prompt: "Photorealistic cinematic scene: the subject raises their hands and a storm of magical glowing particles erupts from their palms and fingertips — dense swirling vortices of gold, white, and electric blue that orbit their body in wide arcs. The particles have weight and momentum — they trail motion blur and cast dynamic light on the subject's face and clothing. Larger bolts of energy arc outward from the main vortex, striking the ground and leaving brief scorch marks. The subject's eyes catch the reflected particle light. 6 seconds, medium shot, dramatic underlighting from the conjured energy, photorealistic magical physics." },
  { name: "Lightning Surge", category: "Fantasy FX", description: "Electric lightning arcs radiate from the subject's body — air distorts with charge", tone: "blue", tool: "Kling AI", duration: "3–5s", prompt: "Photorealistic cinematic scene: the subject is surrounded by an intense electrical storm emanating from their own body — branching white-blue lightning bolts arc outward from their hands, shoulders, and spine, striking the surrounding environment and dissipating into the air. The air itself distorts visibly with electromagnetic heat shimmer around each bolt. Brief superwhite flash frames overexpose the scene at peak discharge. The subject's hair stands on end. Ground surface shows radial scorch patterns. 4 seconds, wide low-angle shot, continuous practical lightning with photorealistic plasma channel physics, no artificial glow rings." },
  { name: "Crystal Formation", category: "Fantasy FX", description: "Ice crystal formations grow across the scene — branching dendritic patterns", tone: "cyan", tool: "Runway Gen-3", duration: "5–7s", prompt: "Photorealistic cinematic scene: ice crystal formations begin growing from a single nucleation point — spreading rapidly across the ground, up walls, and over surfaces in accelerating dendritic branches. The crystal structures are translucent and catch light beautifully, refracting it into spectral prismatic patterns. Large geometric spires of ice rise vertically. The growth accelerates in a burst and then slows as the formation completes. The environment's temperature change is implied by condensation forming on warm surfaces. 6 seconds, wide lens, photorealistic ice crystal physics and optical light behavior." },
  { name: "Cosmic Energy Aura", category: "Fantasy FX", description: "Galaxy-scale nebula aura radiates from the subject — stars orbit their silhouette", tone: "purple", tool: "Kling AI", duration: "6–8s", prompt: "Photorealistic cinematic scene: the subject stands arms outstretched as a galaxy-scale cosmic aura radiates outward from their silhouette — swirling nebula clouds in deep purple, magenta, and electric blue orbit their body like a personal universe. Actual star particles sparkle and drift within the aura. Gravitational lensing subtly distorts the space at the aura's outer edge. The nebula colors cast vivid spectral light on the subject's skin and clothing. The camera slowly pulls back to reveal the full scale — the aura eventually filling the entire frame. 7 seconds, photorealistic space physics." },
  { name: "Time Reverse", category: "Fantasy FX", description: "Scene plays in cinematic reverse — gravity inverted, physics unwinding", tone: "slate", tool: "Runway Gen-3", duration: "5–7s", prompt: "Photorealistic cinematic scene: the scene plays in full temporal reverse — shattered glass fragments reconverge and repair themselves, spilled liquid flows upward back into its container, dust lifts from surfaces and returns to origin, a match flame grows brighter as smoke re-enters it. The reverse physics are perfectly simulated — not simply footage played backwards, but forward-simulated reverse physics. The subject moves in reverse through the environment interacting with objects that also reverse. 6 seconds, wide lens, Tenet-level temporal mechanics, photorealistic simulation of every reversed physical process." },
  { name: "Angel Wings Unfurl", category: "Fantasy FX", description: "Massive luminous wings expand from behind the subject — feathers catch divine light", tone: "amber", tool: "Pika 2.0", duration: "6–8s", prompt: "Photorealistic cinematic scene: the subject stands with back slightly turned, arms at sides, as two massive feathered wings begin to slowly unfurl from behind their shoulder blades. The reveal is gradual and epic — primaries extending first, then the full wingspan spreading to fill the frame. Each feather is individually rendered — catching divine white and golden backlight with translucent edges. Wind generated by the unfurling moves through the feathers and the subject's hair simultaneously. The final wingspan is enormous, dwarfing the subject. 7 seconds, low-angle wide shot, warm divine backlight, photorealistic feather physics and scale." },
  { name: "Shadow Clone Split", category: "Fantasy FX", description: "Subject separates into multiple shadow clones that step outward — each transparent", tone: "slate", tool: "Runway Gen-3", duration: "4–6s", prompt: "Photorealistic cinematic scene: the subject stands centered and then splits — four semi-transparent dark-tinted echo clones step out simultaneously from the original body in four cardinal directions, each carrying a slightly delayed version of the subject's same motion. The original remains fully solid and brightly lit at center. The clones are darker, with reduced opacity, as if made of smoke and shadow. Each clone performs a slightly different version of the same movement. They hold the pose for a beat. 5 seconds, wide overhead and medium shots intercut, dramatic directional side lighting, photorealistic shadow physics." },

  // ── Transition FX ─────────────────────────────────────────────────────────
  { name: "Swirl Vortex Cut", category: "Transition FX", description: "A whirlpool vortex expands from center and swallows the scene entirely", tone: "purple", tool: "Pika 2.0", duration: "2–4s", prompt: "Photorealistic cinematic scene: a swirling whirlpool vortex nucleates at the exact center of the frame and rapidly expands outward — the spiral consuming the existing scene in an accelerating rotation. The vortex has volumetric depth — it is a true dimensional tunnel, not a flat spin. The edges of the scene are pulled inward as if the frame itself is being sucked down a drain. At the moment of full coverage, the center blooms open with a flash of light to reveal the next scene. 3 seconds, perfect rotational physics, dramatic scale increase in vortex speed, cinematic energy." },
  { name: "Zoom Blur Smash Cut", category: "Transition FX", description: "Camera blasts forward at extreme speed — radial blur wipes to the next scene", tone: "orange", tool: "Runway Gen-3", duration: "1–2s", prompt: "Photorealistic cinematic scene: the camera lurches forward at maximum speed in a sudden explosive zoom — extreme radial motion blur radiates from the center of the frame as the scene's center point rushes toward the lens. The entire transition completes in under 2 seconds and hits like a punch. Environmental elements — walls, trees, architecture — streak past at impossible speed. At the peak of the blast, the scene cuts to the next location in a hard smash cut. 1.5 seconds, pure kinetic energy, action film pacing, visceral impact." },
  { name: "Ink Wash Wipe", category: "Transition FX", description: "Black ink flows across the frame like a living wave — revealing the next scene", tone: "slate", tool: "Kling AI", duration: "3–5s", prompt: "Photorealistic cinematic scene: liquid black ink flows from one edge of the frame across the entire image in a slow, deliberate wave — the ink has natural fluid dynamics with bloom patterns, feathered bleed edges, and pools of varying density. The ink wipe covers the existing scene as it advances. As it reaches the opposite edge, the ink clears from the same direction it entered, revealing an entirely different scene beneath. The ink reacts to any geometry in the frame — pooling at low points, running faster on steep angles. 4 seconds, Chinese ink wash aesthetic, perfect fluid simulation." },
  { name: "Light Beam Sweep", category: "Transition FX", description: "A divine white light beam sweeps the frame — bleaches scene, reveals the next", tone: "amber", tool: "Pika 2.0", duration: "2–4s", prompt: "Photorealistic cinematic scene: a powerful white-gold light beam sweeps horizontally across the frame from left to right, carrying such intensity that it bleaches the existing scene to overexposed white as it passes. Dust particles and atmospheric haze are visible in the beam's column of light. As the beam exits frame right, the new scene fades in from the white. The practical light source — a massive sun beam breaking through clouds or a studio arc light — is visible at the frame edge generating the sweep. 3 seconds, wide angle, cinematic divine light quality, photorealistic lens bloom." },
  { name: "Glitch Slice Transition", category: "Transition FX", description: "Digital glitch slices cut the frame into shifting bands that reveal the next scene", tone: "cyan", tool: "Runway Gen-3", duration: "1–3s", prompt: "Photorealistic cinematic scene: the frame is cut into horizontal bands that shift and slide independently — each band revealing a different horizontal slice of the next scene underneath the current one. The bands misalign, creating a tearing mosaic. RGB channel split accompanies each slice's movement, with red, green, and blue channels offsetting independently. The overall effect is a digital signal tearing in half. The transition completes in under 2 seconds with a final snap-lock into the new scene. Cyberpunk broadcast signal death aesthetic, maximum channel artifact realism." },
  { name: "Origami Paper Fold", category: "Transition FX", description: "Scene folds along crease lines like origami — panels reveal the next scene", tone: "green", tool: "Kling AI", duration: "4–5s", prompt: "Photorealistic cinematic scene: the image behaves as if printed on a thick sheet of paper that is being folded — geometric crease lines appear and the frame begins folding along diagonal and horizontal lines in sequence, like origami. Each folded panel carries the existing scene on its surface but reveals the new scene on its back face. Fold shadows and paper thickness are physically accurate. The folds complete a specific origami pattern — crane, geometric star, or accordion — before the final form opens to reveal the next scene entirely. 4 seconds, clean geometric satisfaction, photorealistic paper physics and shadow." },
  { name: "Shatter Glass Cut", category: "Transition FX", description: "Frame shatters like a glass pane — shards fall to reveal the next scene behind", tone: "blue", tool: "Pika 2.0", duration: "2–4s", prompt: "Photorealistic cinematic scene: the entire frame behaves as if it were a pane of glass that receives a single impact point — cracks radiate from that point outward in an authentic fracture pattern. Then the shards begin to fall — each one carrying a fragment of the current scene on its surface, reflecting and refracting light as it tumbles. The new scene is revealed fully behind the falling shards. Individual large shards hit an invisible ground plane and shatter into secondary fragments. 3 seconds, photorealistic glass fracture and physics simulation, practical studio key light catching every shard surface." },
  { name: "Waterfall Dissolve", category: "Transition FX", description: "Scene liquefies from top to bottom — flows away as a waterfall of pixels", tone: "blue", tool: "Runway Gen-3", duration: "3–5s", prompt: "Photorealistic cinematic scene: the existing image begins to liquify from the top edge — pixels become fluid droplets that stream downward, gathering speed as they cascade like a waterfall. The flow accelerates, and the image below the waterfall front is revealed as the new scene. The falling liquid streams carry the colors of the scene they are dissolving, creating a chromatic waterfall of image pixels. Splashes at the base where streams meet the new scene below. 4 seconds, physically-simulated fluid cascading, light refracting through each stream, cinematic slow-motion peak." },

  // ── Veo 3 FX ─────────────────────────────────────────────────────────────
  { name: "Storm Portrait", category: "Veo 3 FX", description: "Subject stands in a raging supercell — lightning, wind, rain all physically interact with them", tone: "green", tool: "Veo 3", duration: "7–8s", prompt: "Photorealistic cinematic scene: the subject stands centered in an open field or rooftop as a massive rotating supercell storm rages overhead. Dark churning clouds billow and rotate. Intense branching lightning arcs across the sky and strikes nearby in the distance, each bolt casting a harsh white flash of light that illuminates the subject and environment with a single-frame strobe. Heavy rain streaks diagonally across the frame with powerful wind force — soaking the subject's clothing and driving their hair sideways. The wind is visibly affecting every loose element in the scene. The subject stands unmoved, expression composed. 8 seconds, wide cinematic lens, photorealistic weather physics, zero CGI quality — ultra-realistic lightning, rain, and wind simulation. No repetition." },
  { name: "Fluid Physics Master", category: "Veo 3 FX", description: "Water, fire, and smoke interact with the subject — each element physically accurate", tone: "blue", tool: "Veo 3", duration: "6–8s", prompt: "Photorealistic cinematic scene: the subject stands as three fluid elements simultaneously interact with their environment. Water crashes around their feet with accurate surface tension, foam, and splash physics. Fire burns on a surface behind them with convection currents pulling smoke upward. The smoke billows with turbulent fluid dynamics, lit from below by the fire and from above by a studio light. Each element responds to the others — fire makes smoke, smoke diffuses light, water reflects the fire glow. 7 seconds, wide cinematic lens, photorealistic fluid dynamics for all three elements simultaneously, scientifically accurate physics." },
  { name: "Crowd Life Simulation", category: "Veo 3 FX", description: "Photorealistic crowd surrounds the subject — every person unique, natural, and alive", tone: "slate", tool: "Veo 3", duration: "6–8s", prompt: "Photorealistic cinematic scene: the subject stands in the center of a dense crowd of several hundred diverse individuals — all moving naturally with unique gaits, conversations, and interactions with each other. No two people are identical in clothing, face, body language, or movement. The crowd's ambient energy — chatter, movement, occasional laughter — is implied by the visual behavior. The camera slowly pushes through the crowd toward the subject, who is the only still point in the sea of motion. 7 seconds, wide-to-medium push shot, photorealistic crowd simulation, zero cloning artifacts." },
  { name: "Weather Event Spectacle", category: "Veo 3 FX", description: "Tornado, blizzard, or dust storm moves through the scene — physics fully accurate", tone: "slate", tool: "Veo 3", duration: "7–10s", prompt: "Photorealistic cinematic scene: a dramatic meteorological event moves through the environment in full real-time — a tornado snakes across a flat landscape, debris orbiting its funnel. Or a sudden blizzard hits with whiteout conditions and wind-driven snow. Or a red dust storm wall rolls across desert terrain. The subject is present at the edge of the event — safe but close enough that the atmospheric pressure change, wind, and flying debris physically affect their clothing, hair, and posture. Lighting changes dramatically as the storm alters the sky. 8 seconds, wide lens, ultra-realistic atmospheric physics simulation." },
  { name: "Macro Organism World", category: "Veo 3 FX", description: "Extreme macro reveals a world inside a drop of water — life at microscopic scale", tone: "green", tool: "Veo 3", duration: "7–8s", prompt: "Photorealistic cinematic scene: the camera begins at human scale on a single water drop clinging to a leaf or surface. The camera slowly zooms into the drop — macro lens simulation — until the entire frame is filled with the interior of the droplet. Inside, a microscopic world is revealed in perfect detail: plankton move, single-cell organisms pulsate, micro-bubbles rise, light refracts through the curved water lens into rainbow prisms. The camera continues deeper — microscopic to sub-microscopic — revealing new layers of organic structure. 8 seconds, continuous uncut zoom, photorealistic microscopy aesthetics, scientifically accurate organisms." },
  { name: "Supernova Shockwave", category: "Veo 3 FX", description: "A star explodes — shockwave expands outward and engulfs the camera", tone: "amber", tool: "Veo 3", duration: "6–8s", prompt: "Photorealistic cinematic space scene: a distant star suddenly brightens to maximum luminosity, then detonates in a supernova explosion. The shockwave — a sphere of superheated plasma and electromagnetic energy — expands outward at relativistic speed. Surrounding nebula gas illuminates in concentric rings as the shockwave passes through. Nearby planets are bathed in the flash. The shockwave reaches the camera and engulfs the lens in a total white bloom. NASA-level astrophysical photorealism. 7 seconds, wide space environment establishing shot, accurate supernova physics, no fantasy aesthetic — pure science." },
  { name: "Underwater Bioluminescence", category: "Veo 3 FX", description: "Deep ocean at night — creatures glow in absolute darkness, pulsing light in black water", tone: "cyan", tool: "Veo 3", duration: "7–9s", prompt: "Photorealistic cinematic scene: total darkness of the deep ocean — 1000m below the surface. No sunlight reaches here. The only illumination comes from bioluminescent organisms: jellyfish trail glowing cyan tentacles thirty meters long, anglerfish bioluminescent lures pulse with soft blue-white light, plankton disturbed by movement explode in drifting sparks of blue-green light. A large whale passes through frame, its wake disturbing thousands of plankton into a galaxy of micro-light. The pressure and cold are implied in the absolute stillness of the water. 8 seconds, absolute dark environment, ultra-realistic bioluminescent organism physics and light." },
  { name: "Architecture Cinematic Reveal", category: "Veo 3 FX", description: "Camera moves through and around stunning architecture — materials and light are photographic", tone: "amber", tool: "Veo 3", duration: "6–8s", prompt: "Photorealistic cinematic scene: the camera begins tightly on a single architectural detail — a carved stone column base, a glass curtain wall joint, a timber beam junction. It pulls back in a smooth controlled arc, revealing progressively more of the structure. Each surface material renders with photographic accuracy — glass refracts, concrete catches directional light in its texture, steel reflects the sky. The final frame is a wide reveal of the complete building's facade or interior atrium, light streaming through a skylight in volumetric shafts. 7 seconds, Architectural Digest photography quality, photorealistic materials and light." },
  { name: "Animal Behavior Close", category: "Veo 3 FX", description: "A wild animal filmed at extreme close range — eyes alive, breath visible, BBC quality", tone: "amber", tool: "Veo 3", duration: "6–8s", prompt: "Photorealistic cinematic scene: extreme close-up portrait of a wild animal in its native habitat — a wolf, eagle, lion, or great ape. The camera is impossibly close — filling the frame with the face. Eyes are alive and intelligent, irises catching environmental light with photographic accuracy. Each breath is visible as a micro-movement of the nostrils. Individual hairs and whiskers are rendered. The animal reacts to something off-camera — ears pivot, pupils dilate, weight shifts. The moment is tense. Natural backlighting catches the rim of fur. 7 seconds, extreme telephoto lens simulation, BBC Earth documentary quality, photorealism in every pore." },
  { name: "Cosmic Space Environment", category: "Veo 3 FX", description: "Photorealistic deep space — nebula, planets, stars — camera moves through it all", tone: "purple", tool: "Veo 3", duration: "7–9s", prompt: "Photorealistic cinematic space scene: the camera drifts slowly through a vast nebula — massive pillars of gas and dust in deep crimson, gold, and cobalt surround the camera on all sides. Stars form inside the nebula's densest regions. A rocky planet with accurate atmospheric scatter drifts through frame, partially lit by a distant orange star. An asteroid field of irregular fragments tumbles slowly in the foreground. The nebula gas is volumetric and three-dimensional — the camera moves through it, not in front of it. 8 seconds, NASA-level photorealistic space physics, no fantasy aesthetic — pure scientific visualisation at cinema quality." },

  // ── Veo 3 Impossible FX ───────────────────────────────────────────────────
  { name: "Gravity Inversion", category: "Veo 3 Impossible", description: "Gravity reverses mid-scene — everything falls upward with full physics", tone: "purple", tool: "Veo 3", duration: "6–8s", prompt: "Photorealistic cinematic scene: the subject stands in a normally-lit room or outdoor space when gravity silently inverts. Every loose object in the environment — glasses, coins, books, chairs, water in cups — simultaneously begins falling upward with perfect photorealistic physics. The subject's hair rises and floats. Dust lifts from every surface in a cloud. Objects hit the ceiling (or sky) and scatter. Water inverts mid-pour, streaming upward. The subject grabs a fixed anchor and holds on, clothing pulling upward. The camera remains stable throughout, framing the impossible scene from a low angle. 7 seconds, wide cinematic lens, zero CGI quality — pure photorealistic inverted physics simulation." },
  { name: "Time Freeze Frame", category: "Veo 3 Impossible", description: "Everything freezes mid-action except the subject — who walks through frozen time", tone: "blue", tool: "Veo 3", duration: "7–9s", prompt: "Photorealistic cinematic scene: the subject stands in a busy urban environment — traffic, pedestrians, falling rain, a fountain mid-spray — when time stops for everything except the subject. Every person is frozen mid-step, mid-gesture, mid-conversation. Rain droplets hang in the air at every height, perfectly still. A coffee cup knocked mid-fall hovers inches from the ground. The subject walks calmly through the frozen scene, ducking under suspended rain, touching frozen pedestrians who rock slightly then resettle. The camera tracks the subject through the frozen world. 8 seconds, photorealistic stopped-time simulation, wide tracking shot, no slow motion — full stop." },
  { name: "Scale Collapse", category: "Veo 3 Impossible", description: "The subject is normal size in one room — steps through a door and is an ant-size in a vast space", tone: "amber", tool: "Veo 3", duration: "6–8s", prompt: "Photorealistic cinematic scene: the subject stands in a normal-scale kitchen and walks toward a doorway. They step through — and on the other side, they are now a centimeter tall, standing on the surface of a dining table. The salt shaker is a monolith. A fork is a steel arch bridge. A crumb is a boulder. The camera follows them through the scale transition — the size change is not a jump cut but a continuous physical transition, as if the door itself changed their scale. The macro world of the table surface is photorealistic in every dust particle and wood grain. 7 seconds, wide-to-macro transition, photorealistic physics at both scales." },
  { name: "Material Phase Shift", category: "Veo 3 Impossible", description: "Solid architecture slowly turns to liquid and flows — walls melt and pool on the floor", tone: "cyan", tool: "Veo 3", duration: "6–8s", prompt: "Photorealistic cinematic scene: the subject stands in a concrete and glass building as the walls, floor sections, and ceiling begin to slowly turn liquid and flow. Concrete walls ripple like water and begin to pour downward, pooling on the floor in slow viscous rivers. Glass windows soften and drip. A brick wall collapses in a slow honey-like flow rather than a dry crumble. The structural elements that remain solid contrast starkly with the melting sections. The subject navigates around flowing architecture. 7 seconds, photorealistic material-phase simulation — each material maintains its color and texture as it liquefies, no fantasy aesthetic." },
  { name: "Infinite Mirror World", category: "Veo 3 Impossible", description: "Mirrors multiply the subject infinitely — each reflection contains a different version", tone: "purple", tool: "Veo 3", duration: "7–8s", prompt: "Photorealistic cinematic scene: the subject stands between two facing mirrors in a corridor, creating an infinite reflection tunnel. But each successive reflection is not identical — the first shows the subject in different clothing, the second in a different location, the third with a different emotional state, the fourth in a different art style. The differences are subtle at first and grow more extreme with each depth layer. The subject slowly turns to examine the variations in their infinite selves. The mirror physics are perfect — each reflection has correct diminishing brightness. 8 seconds, photorealistic mirror simulation, no repetition in the reflection content." },
  { name: "Architectural Impossibility", category: "Veo 3 Impossible", description: "M.C. Escher staircase — subject walks up stairs that loop back to start", tone: "slate", tool: "Veo 3", duration: "7–9s", prompt: "Photorealistic cinematic scene: the subject walks up a grand staircase in a monumental stone building — but the staircase is an Escher impossible loop. They ascend confidently, rounding corner after corner — and arrive back where they started without descending. The architecture is rendered in photorealistic stone, plaster, and light — absolutely convincing as a real building. The camera slowly orbits the staircase structure, revealing the impossible geometry from different angles. The subject appears multiple times simultaneously in different sections of the loop. 8 seconds, wide orbiting camera move, photorealistic architectural materials, continuous loop impossible geometry." },
  { name: "Object Rain", category: "Veo 3 Impossible", description: "Hundreds of identical everyday objects rain from a clear blue sky with full physics", tone: "green", tool: "Veo 3", duration: "6–8s", prompt: "Photorealistic cinematic scene: on an ordinary sunny day, hundreds of identical household objects begin falling from a completely clear blue sky — chairs, umbrellas, clocks, fish, loaves of bread — each one tumbling with physically-accurate aerodynamics and bouncing with realistic impact physics when they hit the ground. The subject stands looking up, dodging falling objects. The sky remains perfectly clear and blue — no storm, no cloud, no explanation. The objects are photorealistic, casting accurate shadows, bouncing with correct elasticity. 7 seconds, wide shot establishing the scale of the impossible rain, photorealistic physics simulation for hundreds of independent objects." },
  { name: "Growing Architecture", category: "Veo 3 Impossible", description: "Buildings grow like plants in timelapse — concrete and steel sprouting from the ground", tone: "amber", tool: "Veo 3", duration: "7–8s", prompt: "Photorealistic cinematic scene: filmed in timelapse style — an empty urban lot. Then from the earth, a building begins to grow organically, like a plant. Steel beams sprout upward like branches, concrete floors extend and solidify, glass windows bloom outward from frames. The building grows floor by floor in an accelerating organic rhythm. Scaffolding appears and disappears like leaves. The entire process — from empty lot to completed 20-story tower — unfolds in 7 seconds. Photorealistic construction materials with organic growth motion. Time lapse lighting shifts: morning to noon to afternoon as the building rises. Wide establishing shot." },

  // ── Grok FX ──────────────────────────────────────────────────────────────
  { name: "Surreal Dream Reality", category: "Grok FX", description: "Photorealistic but physically impossible world — Dalí precision with real camera work", tone: "purple", tool: "Grok Aurora", duration: "6–8s", prompt: "Photorealistic cinematic scene that defies physics but maintains photographic visual fidelity: the subject stands in an architecturally impossible space — staircases ascend to nowhere and connect to ceilings, doors open onto other doors, shadows fall toward the light source, the horizon curves upward and meets itself. A melting clock drapes over an edge. A fish swims through the air. The subject walks through it all as if it were entirely normal. Everything is lit with consistent practical lighting — a single warm afternoon sun from an impossible angle. The camera performs a smooth tracking shot. 7 seconds, Dalí meets Kubrick, photorealistic impossible world, zero CGI aesthetic." },
  { name: "Abstract Dimension Storm", category: "Grok FX", description: "Pure geometry and color — fractal dimensions collide in a living art piece", tone: "pink", tool: "Grok Aurora", duration: "5–7s", prompt: "Cinematic abstract scene: swirling non-Euclidean geometric forms in deep jewel tones — sapphire, ruby, amber, emerald — collide and orbit in a dimensionless space. Fractals unfold at the edges of each form, revealing nested identical patterns at infinite depth. Color fields bleed into each other like oil in water. Impossible 3D shapes rotate in multiple axes simultaneously — a Möbius strip, a Klein bottle, a 4D hypercube projected into 3D. The motion is rhythmic and pulsing, like music made visual. 6 seconds, Kandinsky meets James Turrell meets physics simulation, no figurative elements, pure abstract geometry and color." },
  { name: "Cyberpunk Mega-City", category: "Grok FX", description: "Night city at maximum detail — holograms, rain, flying vehicles, neon density", tone: "cyan", tool: "Grok Aurora", duration: "6–8s", prompt: "Photorealistic cinematic scene: a sprawling cyberpunk mega-city from a high vantage point at night. Every surface — from street level to the tops of kilometer-tall arcologies — is alive with neon signage in Japanese, Arabic, and Latin scripts. Holographic advertisements the size of buildings project into the air. Flying vehicles stream in organized lanes between skyscrapers. Rain-slicked streets at ground level reflect everything from above. A dense pedestrian population — humans and cyborgs — crowds the sidewalks. The camera slowly descends from altitude to street level in one unbroken move. 8 seconds, Blade Runner 2049 meets Ghost in the Shell density, photorealistic night environment." },
  { name: "Fantasy Epic Horizon", category: "Grok FX", description: "A world of dragon-scale mountains, floating islands, and three moons at dusk", tone: "amber", tool: "Grok Aurora", duration: "6–8s", prompt: "Cinematic establishing shot of an epic fantasy world at golden dusk: in the far distance, mountain ranges of impossible scale — each peak twenty times taller than Everest — pierce cloud layers. Closer, floating islands bear ruined ancient citadels with cascading waterfalls that fall thousands of meters before dissipating into mist. In the middle ground, a vast dark forest with bioluminescent foliage begins to glow as the three moons rise — each a different color: gold, blue, blood-red. The camera slowly pushes forward from a cliff edge, revealing greater scale with each meter of movement. 8 seconds, wide anamorphic lens, Tolkien meets Studio Ghibli world-building quality." },
  { name: "Psychedelic Reality Break", category: "Grok FX", description: "Reality fractures into overlapping dimensions — each one a different visual universe", tone: "pink", tool: "Grok Aurora", duration: "5–7s", prompt: "Cinematic scene: reality fractures from the center of the frame outward, peeling back layers of visual dimensions like pages of a book. Behind the first layer of visible reality is a psychedelic dimension of vivid color fields and geometric forms. Behind that, a dimension of pure black-and-white line art. Behind that, one of fire and crystal. Each layer is distinct and complete — its own visual universe. The fracture lines are physically rendered — like breaking glass — with each shard revealing the layer beneath. Mandala geometry rotates within the colored dimensions. 6 seconds, Alex Grey meets IMAX, multi-dimensional visual complexity, photorealistic fracture physics." },
  { name: "Biopunk Living World", category: "Grok FX", description: "All architecture is grown flesh — walls breathe, veins pulse, organs are buildings", tone: "green", tool: "Grok Aurora", duration: "7–9s", prompt: "Cinematic scene: the subject moves through an entirely biological city — every structure grown from living tissue. Buildings are formed from bone and cartilage, facades pulse with subcutaneous breathing rhythm. Enormous veins of bioluminescent fluid run vertically through structural columns. Floors are smooth skin-like material. Windows are stretched transparent membrane. The city breathes — inhale and exhale — with a slow 8-second cycle. Mycelium networks connect every building at street level. Bioluminescent light pulses through the vein network in waves. H.R. Giger meets Miyazaki organic city. 8 seconds, wide tracking shot, photorealistic biological material simulation." },
  { name: "Neon Noir Rain City", category: "Grok FX", description: "Extreme neon-saturated rain noir — every surface reflects, steam rises, shadows are color", tone: "cyan", tool: "Grok Aurora", duration: "7–9s", prompt: "Photorealistic cinematic scene: rain-soaked noir city at 2am — every surface reflecting. Neon signs in magenta, acid yellow, and electric blue cast vivid pools of colored shadow — shadows here are not dark, they are colored. Steam rises from every grate and manhole, catching neon light in colored wisps. A lone figure walks in deep silhouette toward camera in the rain. Every raindrop catches a different color from its position under different neon sources. Upper floors of buildings disappear into black fog. The camera is low and wide — water level — making puddles reflect the entire cityscape. 8 seconds, ultra-atmospheric neon noir, maximum color and detail density." },
  { name: "Mythological Creature Alive", category: "Grok FX", description: "A dragon, leviathan, or phoenix rendered with National Geographic animal behavior realism", tone: "amber", tool: "Grok Aurora", duration: "6–9s", prompt: "Photorealistic cinematic scene: a mythological creature exists in a physically believable real-world environment — a dragon perched on a clifftop, its scales refracting direct sunlight into spectral highlights, its chest expanding with each breath, eyes tracking a movement off-camera with reptilian intelligence. Or a leviathan surfacing in a stormy ocean, bioluminescent patterns pulsing down its body, water cascading from its massive form. The creature does not attack or breathe fire — it simply lives, believably, as a real animal would. The environment reacts realistically to its presence — birds flee, trees bend. BBC Earth meets myth. 8 seconds, wide naturalistic lens, photorealistic biology." },
  { name: "Interdimensional Rift", category: "Grok FX", description: "Two completely different realities bleed through a tear in space — objects from both mix", tone: "purple", tool: "Grok Aurora", duration: "7–9s", prompt: "Photorealistic cinematic scene: a rift tears open in the air in the center of the frame — a physical tear in space with gravitational lensing distorting light at its edges. On the left of the rift: a lush green rainforest in full sunlight. On the right: a barren alien desert at alien dusk with a gas giant on the horizon. The rift is two-way — warm rainforest air visibly mixes with alien dust at the boundary, creating a micro-weather system at the tear. Leaves from the forest blow through and land on alien soil. Alien dust blows into the forest. The subject stands close to the rift, reaching a hand through. 8 seconds, wide shot, photorealistic dimensional boundary simulation." },
  { name: "Living Abstract Data", category: "Grok FX", description: "Information becomes physical, luminous, and organic — data flows like a living river", tone: "blue", tool: "Grok Aurora", duration: "6–8s", prompt: "Cinematic scene: abstract data takes on physical organic form — luminous rivers of code flow like bioluminescent water through a dark three-dimensional space. Data nodes pulse and contract like neurons firing. Network graphs become towering three-dimensional webs of glowing threads that the camera flies through. Algorithmic patterns bloom outward like flowers, unfold like fractals, and collapse like dying stars. The motion has biological rhythm — breathing, pulsing, growing. Colors shift from electric blue to gold to deep violet as the data density changes. 7 seconds, continuous camera flight through the data landscape, beautiful and intelligent-feeling motion art, no text or literal code visible." },

  // ── Grok Impossible Hooks ─────────────────────────────────────────────────
  { name: "Mirror Has No Reflection", category: "Grok Impossible", description: "Subject stands at a mirror — the reflection is a completely different person doing different things", tone: "purple", tool: "Grok Aurora", duration: "6–8s", prompt: "Photorealistic cinematic scene: the subject stands at an ornate bathroom or hallway mirror. Their reflection is a completely different person — different gender, age, clothing, and emotional state — performing entirely different actions. The subject raises their right hand; the reflection does not mirror it — instead it turns away, picks up an object, or walks deeper into the mirror world. The reflection's world behind the glass is a different room entirely. The camera slowly pushes toward the mirror to fill the frame with the impossible reflection. Photorealistic mirror physics except for the reflection content itself. 7 seconds, 85mm portrait lens, uncanny and unsettling, no CGI quality." },
  { name: "Shadow Disobeys", category: "Grok Impossible", description: "The subject's shadow moves independently — acting on its own agenda", tone: "slate", tool: "Grok Aurora", duration: "6–8s", prompt: "Photorealistic cinematic scene: the subject stands in a sunlit environment — the light source consistent and directional. Their shadow falls normally on the ground or wall. Then the shadow begins to move independently — while the subject stands still, the shadow slowly raises an arm, turns its head, or walks away. The shadow physics are otherwise perfect — correct distortion, correct edge softness, correct ground interaction. The subject notices and tries to synchronize with their shadow — which continues to defy them. Eventually the shadow walks away entirely, leaving the subject shadowless. 7 seconds, wide shot, photorealistic shadow simulation with impossible autonomy." },
  { name: "Food Physics Reversal", category: "Grok Impossible", description: "A meal unserves itself — food flies back to ingredients, ingredients to raw form, raw to earth", tone: "amber", tool: "Grok Aurora", duration: "6–8s", prompt: "Photorealistic cinematic scene: a beautifully plated restaurant meal sits on a table. Then in perfect reverse physics, it unserves itself — the dish flies back to the kitchen, components separate mid-air back to pre-cooked form, vegetables uncut and reconstitute, meat returns to raw, raw ingredients fly to their origin containers, which fly back to shelves. The entire chain of cooking and preparation reverses in one continuous photorealistic sequence. Each step maintains perfect food physics — oil droplets reconverge, steam is inhaled back, nothing teleports, everything travels by correct trajectory. 7 seconds, wide kitchen + table shot, photorealistic food and cooking physics in full reverse." },
  { name: "Infinite Room Zoom", category: "Grok Impossible", description: "Camera zooms into a painting on the wall — and the painting is the same room, with a painting", tone: "cyan", tool: "Grok Aurora", duration: "7–8s", prompt: "Photorealistic cinematic scene: the camera slowly zooms toward a painting hanging on the wall of a room. The painting depicts the exact same room — same furniture, same lighting, same painting on the wall inside the painting. The camera zooms into the painted version — and the painted room is equally detailed, with its own painting within it. The camera continues zooming into each nested version — each one rendered in the same photorealistic style, just slightly smaller. The sequence continues for five levels of depth before the innermost room is too small to resolve and blooms into light. 8 seconds, slow continuous zoom, perfect nested room simulation at each layer." },

  // ── Location Zoom FX ─────────────────────────────────────────────────────
  { name: "Earth to Street Descent", category: "Location Zoom FX", description: "Space to street level — one unbroken continuous zoom, no cuts", tone: "blue", tool: "Veo 3", duration: "8–10s", prompt: "Photorealistic cinematic scene: the camera begins in low Earth orbit — the curve of the planet visible against the star field, city lights visible on the night side. It descends rapidly through the upper atmosphere — thin air glow, then cloud layers parting below. Continents resolve into coastlines, into urban grids, into specific neighborhood blocks. The descent slows as altitude drops — rooftops become sharper, streets resolve, individual trees are visible. The camera lands at street level, revealing the subject standing precisely at their location, framed in a natural medium shot. No cuts — one continuous unbroken descent from space to face. 9 seconds, ultra-realistic continuous zoom, photorealistic at every altitude, no resolution jumps." },
  { name: "Google Maps Pin Drop", category: "Location Zoom FX", description: "Stylized map tiles zoom from world view — pin drops, reality phase-shifts in", tone: "cyan", tool: "Runway Gen-3", duration: "6–8s", prompt: "Photorealistic cinematic scene with a stylized transition: a digital satellite map of Earth is shown from altitude — flat 2D map tiles loading and resolving. The camera zooms progressively — continent tiles, country tiles, city tiles, street tiles. At the final zoom level, a red location pin drops with realistic spring physics and plants itself on the target street. Then reality phases in — the flat map texture gradually becomes a photorealistic aerial view, then descends to street level, revealing the subject standing exactly where the pin landed. The transition from map to reality is seamless and gradual. 7 seconds, clean digital-to-photorealistic transition." },
  { name: "Satellite to Rooftop", category: "Location Zoom FX", description: "Top-down satellite view descends to a rooftop and pivots to reveal the subject standing on it", tone: "slate", tool: "Veo 3", duration: "8s", prompt: "Photorealistic cinematic scene: a directly overhead satellite view of a city block — building footprints, rooftop HVAC units, and shadow patterns visible. The camera begins its descent, resolution increasing as altitude drops — individual rooftop details sharpening. The descent targets a specific rooftop. As it approaches, the camera gradually pivots from top-down to a low horizon angle — revealing the subject standing on the rooftop against the city skyline in the background. The final frame is a medium wide shot of the subject on the roof at golden hour. 8 seconds, seamless angle pivot during descent, photorealistic aerial-to-ground camera movement." },
  { name: "Stadium Crowd Finder", category: "Location Zoom FX", description: "Wide aerial stadium shot descends into the crowd and finds one specific person", tone: "amber", tool: "Veo 3", duration: "8–10s", prompt: "Photorealistic cinematic scene: a wide aerial shot of a fully-packed stadium — 80,000 people, all different, all in motion. The camera begins its purposeful descent, scanning the crowd from above. As it descends, sections of crowd resolve from abstract color pattern to individual faces. The camera homes in on a specific section — people becoming sharply distinct — then slows, zeroing in on one person among thousands. The final frame is a tight portrait of the subject surrounded by the blurred crowd, completely isolated in focus. The descent from aerial to intimate portrait is one continuous unbroken camera move. 9 seconds, photorealistic crowd simulation, zero repetition." },
  { name: "City Window Find", category: "Location Zoom FX", description: "Wide night skyline — camera descends between buildings to find one lit window with subject inside", tone: "purple", tool: "Kling AI", duration: "8s", prompt: "Photorealistic cinematic scene: a wide night cityscape shows dozens of lit office and residential windows across multiple buildings. The camera begins a slow deliberate descent — navigating between skyscrapers, passing other lit windows at street level and on ascending floors. The movement has purpose and intention — hunting one specific window. The camera locks onto a particular lit window on an upper floor and slowly zooms in until the window fills the frame. The subject is visible inside — reading, working, or looking out. The camera holds on the framed portrait through glass. 8 seconds, warm interior versus cool blue exterior lighting contrast, photorealistic night city environment." },
  { name: "Beach Horizon Zoom", category: "Location Zoom FX", description: "Aerial ocean horizon descends to a beach — finds the subject at the waterline", tone: "cyan", tool: "Veo 3", duration: "8–10s", prompt: "Photorealistic cinematic scene: a wide aerial shot over the open ocean looking toward a distant coastline — the horizon is far, the coastline a sliver of color. The camera moves forward and descends simultaneously — the horizon line rising in frame as altitude drops. The coastline grows from a sliver to a visible beach, then to individual waves and sand textures. The descent slows as it approaches the waterline, leveling out at a low angle to reveal the subject standing at the water's edge, waves washing over their feet. Golden hour light and long shadows. 9 seconds, continuous forward descent movement, photorealistic ocean and coastal environment." },
  { name: "Mountain Summit Reveal", category: "Location Zoom FX", description: "Satellite zoom narrows from full range to a single person at the highest peak", tone: "slate", tool: "Veo 3", duration: "8–10s", prompt: "Photorealistic cinematic scene: a high satellite view of a mountain range — white peaks against blue sky, the scale vast. The camera begins descending toward the highest peak. Snow fields and rocky ridges sharpen. The descent slows dramatically as it approaches the summit — the final reveal: a lone figure standing at the highest point, wind driving snow horizontally past them, the entire mountain range visible below in all directions. The scale contrast — the vast geological world beneath one small human figure — is the emotional payload. 9 seconds, one continuous descent, photorealistic mountain physics and atmospheric conditions at altitude." },
  { name: "Festival Ground Zoom", category: "Location Zoom FX", description: "Bird's eye festival view descends into the crowd — locks on one dancing person", tone: "pink", tool: "Runway Gen-3", duration: "8s", prompt: "Photorealistic cinematic scene: a bird's-eye aerial view of a massive outdoor music festival — stages, crowd, lights, and camping all visible from altitude. The camera descends with kinetic energy, matching the rhythm of the implied music. As it descends, individual people become distinct — a sea of waving hands and dancing bodies. The camera homes in on one specific person dancing freely in the crowd. As it reaches them, the world blurs — crowd energy soft around them — and the final frame is an intimate portrait: the subject, mid-dance, fully in their element, festival atmosphere glowing around them. 8 seconds, photorealistic crowd simulation, warm festival lighting." },
  { name: "Neighborhood Drop-In", category: "Location Zoom FX", description: "Aerial suburb view descends to a single front door — subject steps out as camera arrives", tone: "green", tool: "Kling AI", duration: "7–8s", prompt: "Photorealistic cinematic scene: wide aerial view of a residential neighborhood — uniform suburban grid of houses, trees, driveways. The camera descends toward one specific house, approaching from above and behind. Roof tiles sharpen. The drone-like descent curves around to the front facade, settling at ground level facing the front door. A beat. Then the front door opens and the subject steps out, looking directly into camera with a natural expression — as if they knew it was coming. Warm late afternoon neighborhood light. 8 seconds, smooth drone descent to ground level, photorealistic residential environment." },
  { name: "Night Club VIP Zoom", category: "Location Zoom FX", description: "Aerial descent into a club — passes through the roof into a dance floor, finds the subject", tone: "purple", tool: "Runway Gen-3", duration: "7–8s", prompt: "Photorealistic cinematic scene: exterior aerial view of a city block at night — a nightclub with a queue outside. The camera descends toward the building and visually phases through the roof (a cinematic impossible camera move) into the interior above the dance floor. Below: a heaving crowd illuminated by strobes, laser grids, and colored wash lights. Fog machines layer the atmosphere. The camera descends through the smoke and light, pressing through the crowd at head height, until it locks onto the subject dancing with confidence in the center of the floor — a final medium close-up hold. 8 seconds, photorealistic club environment physics." },

  // ── Neon & Glow FX ───────────────────────────────────────────────────────
  { name: "Neon City Blaze", category: "Neon & Glow", description: "Subject ignites with electric neon light — body becomes a living sign", tone: "pink", tool: "Runway Gen-3", duration: "5–7s", prompt: "Photorealistic cinematic scene: the subject stands in a dark urban environment. Veins of electric neon light — hot pink, electric blue, acid yellow — begin to trace across their skin and clothing from fingertips inward, accelerating until the entire body pulses with saturated neon energy. The light is physically emitted — it reflects off nearby surfaces, wet pavement, and walls. Each exhale releases a puff of luminous mist. The subject's eyes glow solidly. The background city signs flicker in resonance with the body light. 6 seconds, physically accurate light emission and reflection, ultra-neon saturation." },
  { name: "Bioluminescent Pulse", category: "Neon & Glow", description: "Deep ocean bioluminescence blooms across skin — pulsing blue-green light in darkness", tone: "cyan", tool: "Kling AI", duration: "5–7s", prompt: "Photorealistic cinematic scene: in near-total darkness, the subject's skin begins to emit soft bioluminescent light — deep ocean blue-green — in rhythmic pulses originating from their fingertips and spreading across their body like a tide. The pulses are biological and organic — uneven, breathing-rhythm-matched. Their outline in the darkness is defined entirely by this self-generated light. Tiny floating particles in the air around them catch and scatter the light. Like a deep-sea creature brought to surface. 6 seconds, absolute darkness surrounding, ultra-precise bioluminescent light physics, no artificial CGI feel." },
  { name: "Aurora Surge", category: "Neon & Glow", description: "Northern lights collapse from the sky and wrap around the subject like a cloak", tone: "cyan", tool: "Veo 3", duration: "6–8s", prompt: "Photorealistic cinematic scene: a night sky blazes with the Northern Lights — vast curtains of green, violet, and white rippling overhead. Then the aurora begins to descend — not collapse, but intentionally reach down toward the subject standing below. The light curtains wrap around the subject like living silk, their body illuminated from all directions by shifting aurora color. The light touches their skin and hair, casting dramatic chromatic shadows. The aurora continues to swirl around them before lifting and returning to the sky. 7 seconds, physically accurate aurora light behavior, photorealistic night atmosphere." },
  { name: "Electric Storm Halo", category: "Neon & Glow", description: "Ball lightning orbits the subject — static discharge arcs between their hands", tone: "purple", tool: "Runway Gen-3", duration: "5–6s", prompt: "Photorealistic cinematic scene: the air around the subject begins to crackle with electrostatic energy — hair rises, fabric clings and floats. A ball of plasma lightning materializes and begins orbiting the subject in a slow elliptical path at shoulder height. White-blue arc discharges snap between the plasma ball and the subject's hands when they raise them. The arc sounds are implied by visual impact. Residual corona discharge glows where arcs connect. The plasma ball's orbit accelerates and the arcs become continuous before the ball dissipates into scattered sparks. 5 seconds, physically accurate plasma and static discharge physics, no cartoon lightning feel." },
  { name: "Golden Particle Ascension", category: "Neon & Glow", description: "Gold dust particles rise from the ground and converge on the subject — luminous abundance", tone: "amber", tool: "Pika 2.0", duration: "5–7s", prompt: "Photorealistic cinematic scene: in a dark environment, thousands of tiny gold particles begin rising from the ground around the subject — like dust lifted in slow thermal updraft. The particles catch light as they rise, glittering individually. They converge on the subject from all directions, swirling around their form in an upward spiral before dispersing and rising above. The subject stands at the center of this luminous particle vortex — the particles so dense they create a golden halo effect. The ground beneath them reflects the particle light in shimmer patterns. 6 seconds, physically accurate particle dynamics and light scatter, warm gold light emission." },
  { name: "Laser Grid Body Scan", category: "Neon & Glow", description: "Red laser grid sweeps the subject — data points and wireframe body map appear", tone: "slate", tool: "Runway Gen-3", duration: "5–6s", prompt: "Photorealistic cinematic scene: in a dark space, a horizontal red laser grid descends from above the subject's head to their feet in a slow scanning sweep. As it passes over each part of their body, a wireframe mesh — the exact shape of their form — appears in glowing green and remains after the laser passes. By the time the scan completes, the subject is overlaid with a precise glowing wireframe body map while remaining physically visible beneath it. Data points pulse at key skeletal junctions. The wireframe rotates slightly while the subject holds still. 5 seconds, accurate 3D scan visualization aesthetic, technical and clean." },

  // ── Time FX ──────────────────────────────────────────────────────────────
  { name: "Time Freeze Shatter", category: "Time FX", description: "The world freezes mid-motion and shatters into suspended glass shards — subject walks through", tone: "blue", tool: "Runway Gen-3", duration: "6–8s", prompt: "Photorealistic cinematic scene: the world freezes — rain drops hang perfectly suspended, a spilled coffee mid-fall holds in the air, birds freeze mid-wingbeat. Then the frozen scene shatters into thousands of glass-like shards — each shard holding its slice of the frozen moment. The shards float in a precise crystalline formation in space. The subject — unfrozen — walks calmly through the suspended debris field, reaching out to touch a floating shard which gently rotates at their touch. 7 seconds, photorealistic glass physics, perfect suspension of physical objects, zero CGI feel." },
  { name: "Rewind Reality", category: "Time FX", description: "Everything around the subject reverses at 2x speed while they remain in forward time", tone: "purple", tool: "Kling AI", duration: "6–8s", prompt: "Photorealistic cinematic scene: the subject stands still or moves normally forward in time. Everything around them reverses at approximately 2x speed — people walk backward, cars drive in reverse, spilled liquid rises back into glasses, falling leaves rise back to branches. The subject's hair and clothing do not reverse — they move forward in real time — creating a stark visual contrast at every edge of their body. The reverse physics are precisely accurate — not mirrored video, but properly reverse-simulated physics. The subject calmly observes the backward world. 7 seconds, photorealistic reverse physics simulation." },
  { name: "Age Warp Drift", category: "Time FX", description: "The environment around the subject ages decades in seconds — paint peels, plants grow, dust settles", tone: "amber", tool: "Veo 3", duration: "7–9s", prompt: "Photorealistic cinematic scene: the subject stands in a room that begins to age rapidly around them — not them personally, but the environment. Paint peels in time-lapse, plaster cracks, plants in pots grow, flower, wither, and die in seconds. Wooden floors darken and warp. Metal oxidizes with spreading rust blooms. Dust accumulates in drifting layers across every surface. A newspaper on a table yellows and crumbles. Spider webs grow across corners. The subject remains perfectly unchanged — their clothing fresh, their expression calm — while 50 years of entropy happens around them in 7 seconds. 8 seconds, photorealistic material aging simulation." },
  { name: "Bullet Time Spiral", category: "Time FX", description: "Action freezes in ultra-slow motion — camera spirals 360° around the frozen moment", tone: "cyan", tool: "Runway Gen-3", duration: "5–7s", prompt: "Photorealistic cinematic scene: the subject performs one decisive physical action — a jump, a throw, a punch, an explosion of movement. At the apex of the action, time slows to 1% speed — then freezes entirely. The camera, however, continues to move at full speed — executing a 360-degree orbital spiral around the completely frozen subject in their peak-action pose. Water droplets, dust particles, and fabric in mid-motion are all suspended perfectly. After completing the orbit, time snaps back to full speed and the action completes. 6 seconds, Matrix-style freeze-orbit, photorealistic suspended physics." },
  { name: "Temporal Echo", category: "Time FX", description: "The subject moves normally but leaves 3–5 ghosted time-echoes of their previous positions", tone: "slate", tool: "Pika 2.0", duration: "5–7s", prompt: "Photorealistic cinematic scene: the subject moves through space — walking, turning, gesturing. As they move, they leave behind semi-transparent temporal echoes — exact reproductions of themselves at each previous position, 0.5 seconds apart, fading from 60% opacity nearest to 10% furthest. The echoes hold the exact pose of that moment and fade slowly, creating a chronophotographic trail of motion. The effect is poetic and scientific simultaneously. When the subject stops, the echoes catch up and merge back into them. 6 seconds, accurate position-echo simulation, soft edge between echo and reality." },

  // ── Surreal Morph FX ─────────────────────────────────────────────────────
  { name: "Human to Sculpture", category: "Surreal Morph", description: "Subject gradually transforms into a classical marble or bronze sculpture — texture spreading", tone: "slate", tool: "Runway Gen-3", duration: "6–8s", prompt: "Photorealistic cinematic scene: the subject stands in a museum or gallery. Slowly, from their feet upward, their body transforms into white Carrara marble — the texture spreading like stone crystallizing, with photorealistic veining and cool subsurface reflectivity. Clothing becomes draped fabric carved from stone. Skin becomes polished marble. Hair becomes sculpted stone waves. The transformation is not violent — it is gradual and elegant. The final frame is a photorealistic museum sculpture where a living person stood. 7 seconds, museum lighting, physically accurate marble texture, classical sculpture proportions maintained." },
  { name: "Into Painting", category: "Surreal Morph", description: "Subject and environment transform into a specific fine art painting style — brush strokes spreading", tone: "amber", tool: "Kling AI", duration: "6–8s", prompt: "Photorealistic cinematic scene: the subject stands in their environment. Slowly, from the edges of the frame inward, the world transforms into oil painting — visible brush strokes appear, colors flatten and saturate, canvas texture becomes apparent under all surfaces. The transformation advances across the scene like a visible wave, converting photorealistic reality into a painted world. The subject is the last thing to transform — for a moment they are the only real thing in a painted world. Then the brush strokes complete them too. The final frame is entirely an oil painting in motion. 7 seconds, Rembrandt or Klimt style — specify at prompt use — photorealistic transformation wave." },
  { name: "Glass Body", category: "Surreal Morph", description: "Subject's body becomes transparent glass — internal light sources visible through them", tone: "cyan", tool: "Veo 3", duration: "6–8s", prompt: "Photorealistic cinematic scene: the subject's body gradually becomes translucent glass — beginning from the core and spreading outward through their form. As the glass transformation advances, their interior becomes visible — an internal glow (warm amber) illuminates from within their chest, refracting through their glass limbs and casting prismatic light patterns on nearby surfaces. The glass has accurate refraction, caustic light bending, and internal reflection. The subject moves during the transformation — the glass body has natural motion but crystal clarity. Clothing becomes glass fabric with micro-refraction. 7 seconds, physically accurate glass optics simulation." },
  { name: "Nature Reclaims", category: "Surreal Morph", description: "Plants, moss, and flowers grow across the subject's body — nature consuming them in beauty", tone: "green", tool: "Veo 3", duration: "6–8s", prompt: "Photorealistic cinematic scene: the subject stands still as small green shoots begin emerging from their clothing and hair — not painfully, but organically and peacefully. Moss spreads across their shoulders and arms. Flowers bloom from their hair in time-lapse — roses, wisteria, wildflowers — each in photorealistic petal detail. Vines spiral gently up their limbs. Their face remains clearly visible through a frame of natural growth. The final frame: the subject as a living garden sculpture — entirely beautiful, entirely botanical, their identity still present within the nature. 7 seconds, photorealistic plant growth physics, warm green light, peaceful mood." },
  { name: "Ink Bleed Transform", category: "Surreal Morph", description: "Subject dissolves into black ink spreading through water — then reforms from ink into color", tone: "slate", tool: "Runway Gen-3", duration: "6–8s", prompt: "Photorealistic cinematic scene: the subject begins to dissolve at their edges — their outline bleeding into black ink that spreads into a surrounding body of water (the world becomes liquid). The ink clouds billow and drift in physically accurate fluid dynamics, the subject's form fully dispersed into an ink cloud. Then the ink cloud begins to converge — pulled by an invisible force — condensing back from dispersed cloud into a standing human form. The reconstituted subject is the same, but their clothing and environment may be different. 7 seconds, physically accurate ink-in-water fluid simulation, dramatic contrast of dense black on clear liquid." },

  // ── Weather & Elements FX ────────────────────────────────────────────────
  { name: "Lightning Strike Entrance", category: "Weather FX", description: "Subject materializes from a bolt of lightning — charged particles form their silhouette", tone: "purple", tool: "Runway Gen-3", duration: "4–5s", prompt: "Photorealistic cinematic scene: a lightning bolt descends from above and strikes the ground with full photorealistic electrical discharge — the arc, the branching, the ground scatter, the shockwave of light. In the milliseconds after the strike, the charged particle field at the impact point begins to resolve into a human shape — silhouette first, then detail — as if the lightning deposited the subject. The final form is the subject standing in post-strike smoke, clothes undisturbed, the residual corona of the strike still visible at their outline. 4 seconds, photorealistic lightning physics, atmospheric shockwave, electric particle formation." },
  { name: "Sandstorm Emergence", category: "Weather FX", description: "A desert sandstorm rolls in and when it passes, the subject is revealed standing within it", tone: "amber", tool: "Kling AI", duration: "6–8s", prompt: "Photorealistic cinematic scene: a wall of desert sand fills the frame from one side — a full haboob — the light going from clear to orange-brown atmospheric density as it arrives. The sandstorm envelopes the entire frame. Visibility near zero — just swirling particulate density. Then the storm begins to clear — sand dispersing — and as visibility returns, the subject is revealed, standing perfectly still in the settling sand, dust still falling, light returning to golden afternoon. They are completely composed. 7 seconds, photorealistic atmospheric particle density, dust-settling physics." },
  { name: "Rain that Falls Up", category: "Weather FX", description: "A rain storm plays in reverse — drops rise from wet ground into a clearing sky", tone: "blue", tool: "Pika 2.0", duration: "5–7s", prompt: "Photorealistic cinematic scene: a saturated rain-soaked environment — puddles on the ground, water running down surfaces. Then the rain reverses: individual droplets lift from the puddles and wet surfaces, rising upward in physically accurate upward fluid dynamics — not teleporting, but genuinely reversing their descent in perfect physics. The droplets rise in formation, the sky above clearing as water retreats from the frame. The subject stands in the rising rain, water lifting off their clothing and skin in streams that arc upward. 6 seconds, physically accurate reverse rain simulation, wet surface reflections, atmospheric clearing." },
  { name: "Snowfall Freeze Frame", category: "Weather FX", description: "Snowstorm suddenly freezes mid-air — subject walks through millions of suspended flakes", tone: "slate", tool: "Runway Gen-3", duration: "6–8s", prompt: "Photorealistic cinematic scene: a heavy snowstorm — thick, swirling snow in all directions. Then everything freezes: every flake stops in mid-air in its exact position, creating a crystalline three-dimensional snow field through which the subject can now move. The subject walks calmly through the frozen snow field — the flakes do not move or brush off as they pass; they hold absolutely still in space. The subject moves their hand through the frozen snow and watches it remain motionless. The camera drifts slowly through the suspended field. 7 seconds, photorealistic snow physics at freeze point, crystalline detail of individual flakes." },
  { name: "Volcano Silhouette", category: "Weather FX", description: "Subject stands as silhouette against active lava flow — embers and heat distortion surround them", tone: "amber", tool: "Veo 3", duration: "6–8s", prompt: "Photorealistic cinematic scene: from a low-angle shot, the subject is a solid black silhouette against an active lava flow behind them — bright molten orange-red filling the background. Heat distortion visibly warps the air around their form. Embers and small sparks drift upward past the silhouette from both sides. The lava flows slowly, surface cooling to black crust while bright molten veins open and close. The silhouette is crisp and dramatic — the detail of the active volcano behind them providing all the visual information. 7 seconds, photorealistic lava flow physics, atmospheric heat distortion, dramatic silhouette." },
];

const effectCategories = ["All", ...Array.from(new Set(videoEffects.map((e) => e.category)))];

const toneClasses: Record<string, string> = {
  cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-400/40 text-cyan-200",
  blue: "from-blue-500/20 to-blue-500/5 border-blue-400/40 text-blue-200",
  amber: "from-amber-500/20 to-amber-500/5 border-amber-400/40 text-amber-200",
  pink: "from-pink-500/20 to-pink-500/5 border-pink-400/40 text-pink-200",
  green: "from-emerald-500/20 to-emerald-500/5 border-emerald-400/40 text-emerald-200",
  purple: "from-purple-500/20 to-purple-500/5 border-purple-400/40 text-purple-200",
  slate: "from-slate-400/20 to-slate-400/5 border-slate-300/30 text-slate-200",
  orange: "from-orange-500/20 to-orange-500/5 border-orange-400/40 text-orange-200",
};

const toolBadgeColors: Record<string, string> = {
  "Runway Gen-3": "bg-purple-500/20 border-purple-400/40 text-purple-300",
  "Kling AI": "bg-blue-500/20 border-blue-400/40 text-blue-300",
  "Pika 2.0": "bg-pink-500/20 border-pink-400/40 text-pink-300",
  "Veo 3": "bg-emerald-500/20 border-emerald-400/40 text-emerald-300",
  "Grok Aurora": "bg-orange-500/20 border-orange-400/40 text-orange-300",
};

const categoryIcons: Record<string, React.ElementType> = {
  "Motion FX": Wind,
  "Transform FX": Zap,
  "Atmosphere FX": Sparkles,
  "Cinematic FX": Film,
  "Portrait FX": Star,
  "Fantasy FX": Triangle,
  "Transition FX": Layers,
  "Veo 3 FX": Globe,
  "Veo 3 Impossible": PlayCircle,
  "Grok FX": Bot,
  "Grok Impossible": Bot,
  "Location Zoom FX": MapPin,
};

function buildVideoPrompt(effect: VideoEffect, subject: string): string {
  const subjectLine = subject.trim()
    ? `Subject / scene: ${subject.trim()}. `
    : "";
  return `${subjectLine}${effect.prompt} Recommended tool: ${effect.tool}. Suggested duration: ${effect.duration}.`;
}

function buildStackPrompt(primary: VideoEffect, secondary: VideoEffect, subject: string): string {
  const subjectLine = subject.trim() ? `Subject / scene: ${subject.trim()}. ` : "";
  const tools = primary.tool === secondary.tool ? primary.tool : `${primary.tool} or ${secondary.tool}`;
  const dur = primary.duration === secondary.duration ? primary.duration : `${primary.duration} / ${secondary.duration}`;
  return `${subjectLine}This video stacks two cinematic effects simultaneously in a single continuous shot:\n\n[EFFECT 1 — ${primary.name}]: ${primary.prompt}\n\n[EFFECT 2 — ${secondary.name}]: ${secondary.prompt}\n\nBoth effects must coexist and reinforce each other — composited together, not sequential. The combined result should feel intentional and cinematic. Recommended tool: ${tools}. Suggested duration: ${dur}.`;
}

export function CreativeStudio() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedEffect, setSelectedEffect] = useState<VideoEffect>(videoEffects[0]);
  const [subject, setSubject] = useState("");
  const [promptDraft, setPromptDraft] = useState(() =>
    buildVideoPrompt(videoEffects[0], "")
  );
  const [copied, setCopied] = useState(false);
  const [refreshMsg, setRefreshMsg] = useState("");

  // Stack mode state
  const [stackMode, setStackMode] = useState(false);
  const [stackPrimary, setStackPrimary] = useState<VideoEffect | null>(null);
  const [stackSecondary, setStackSecondary] = useState<VideoEffect | null>(null);

  const filteredEffects = useMemo(() => {
    const q = query.trim().toLowerCase();
    return videoEffects.filter((e) => {
      const matchCat = activeCategory === "All" || e.category === activeCategory;
      const matchQ =
        q.length === 0 ||
        `${e.name} ${e.category} ${e.description} ${e.tool}`.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [activeCategory, query]);

  const applyEffect = (effect: VideoEffect) => {
    if (stackMode) {
      if (!stackPrimary || (stackPrimary && stackSecondary)) {
        setStackPrimary(effect);
        setStackSecondary(null);
        setSelectedEffect(effect);
        setPromptDraft(buildVideoPrompt(effect, subject));
        setRefreshMsg(`Stack primary: ${effect.name}`);
      } else if (stackPrimary && effect.name !== stackPrimary.name) {
        setStackSecondary(effect);
        setSelectedEffect(effect);
        setPromptDraft(buildStackPrompt(stackPrimary, effect, subject));
        setRefreshMsg(`Stack built: ${stackPrimary.name} + ${effect.name}`);
      }
    } else {
      setSelectedEffect(effect);
      setPromptDraft(buildVideoPrompt(effect, subject));
      setRefreshMsg(`${effect.name} loaded`);
    }
    setCopied(false);
  };

  const toggleStack = () => {
    const next = !stackMode;
    setStackMode(next);
    if (!next) {
      setStackPrimary(null);
      setStackSecondary(null);
      setPromptDraft(buildVideoPrompt(selectedEffect, subject));
      setRefreshMsg("Stack cleared");
    } else {
      setStackPrimary(selectedEffect);
      setStackSecondary(null);
      setRefreshMsg("Stack on — pick a second effect");
    }
    setCopied(false);
  };

  const handleSubjectChange = (value: string) => {
    setSubject(value);
    if (stackMode && stackPrimary && stackSecondary) {
      setPromptDraft(buildStackPrompt(stackPrimary, stackSecondary, value));
    } else {
      setPromptDraft(buildVideoPrompt(selectedEffect, value));
    }
    setCopied(false);
  };

  const regenerate = () => {
    if (stackMode && stackPrimary && stackSecondary) {
      setPromptDraft(buildStackPrompt(stackPrimary, stackSecondary, subject));
    } else {
      setPromptDraft(buildVideoPrompt(selectedEffect, subject));
    }
    setCopied(false);
    setRefreshMsg("Prompt refreshed");
  };

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(promptDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const CategoryIcon = categoryIcons[selectedEffect.category] ?? Wand2;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="border-b border-border pb-6">
        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4">
          <div>
            <div className="dw-encrypted mb-3">
              <Sparkles className="w-3 h-3" />
              AI Video Effects Engine
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary uppercase tracking-widest theme-glow-text flex items-center gap-3">
              <Film className="w-9 h-9" />
              Creative Studio
            </h1>
            <p className="text-muted-foreground mt-2 font-mono text-sm max-w-3xl">
              Pick an AI video effect template, describe your subject, then copy the prompt into Runway Gen-3, Kling AI, Pika 2.0, Veo 3, or Grok Aurora.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center min-w-[280px]">
            <Metric label="Effects" value={videoEffects.length.toString()} />
            <Metric label="Categories" value={(effectCategories.length - 1).toString()} />
            <Metric label="Tools" value="5" />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-[400px_minmax(0,1fr)] gap-6">
        {/* Sidebar */}
        <aside className="space-y-4 xl:sticky xl:top-6 self-start">
          <Card className="bg-card border-border theme-glow-box">
            <CardHeader className="border-b border-border bg-secondary/50">
              <CardTitle className="uppercase text-sm tracking-wider text-primary flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <PlayCircle className="w-4 h-4" />
                  {stackMode ? "Effect Stack" : "Active Effect"}
                </span>
                <button
                  type="button"
                  onClick={toggleStack}
                  className={cn(
                    "flex items-center gap-1.5 border px-2.5 py-1 text-[9px] uppercase tracking-wider font-bold transition-colors",
                    stackMode
                      ? "bg-amber-500/20 border-amber-500/60 text-amber-400 hover:bg-amber-500/30"
                      : "border-border text-muted-foreground hover:text-amber-400 hover:border-amber-500/50"
                  )}
                >
                  {stackMode ? <X className="w-3 h-3" /> : <Layers2 className="w-3 h-3" />}
                  {stackMode ? "Clear Stack" : "Stack FX"}
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Stack mode banner */}
              {stackMode && (
                <div className={cn(
                  "border px-3 py-2 text-[11px] leading-relaxed",
                  stackPrimary && stackSecondary
                    ? "border-amber-500/40 bg-amber-500/5 text-amber-200/80"
                    : "border-amber-500/30 bg-amber-500/5 text-amber-300/80"
                )}>
                  <span className="text-amber-400 font-bold uppercase tracking-wider">Stack Mode</span>
                  {" — "}
                  {!stackPrimary
                    ? "Click any effect to set it as Layer 1."
                    : !stackSecondary
                    ? `Layer 1: ${stackPrimary.name}. Now click a second effect to set Layer 2.`
                    : `${stackPrimary.name} + ${stackSecondary.name} — prompt merged. Click any card to restart the stack.`}
                </div>
              )}

              {/* Effect preview card — single or stacked */}
              {stackMode && stackPrimary && stackSecondary ? (
                <div className="space-y-1.5">
                  <div className={cn("border bg-gradient-to-br p-3", toneClasses[stackPrimary.tone])}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] uppercase tracking-widest text-foreground/60 font-bold">Layer 1</span>
                      <Badge className="bg-background/80 text-primary border border-primary/40 uppercase text-[8px]">
                        {stackPrimary.category}
                      </Badge>
                    </div>
                    <p className="text-base font-bold text-foreground leading-tight">{stackPrimary.name}</p>
                    <span className={cn("text-[9px] border px-1.5 py-0.5 mt-1.5 inline-block uppercase tracking-wider", toolBadgeColors[stackPrimary.tool])}>
                      {stackPrimary.tool}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 py-0.5">
                    <Layers2 className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[9px] uppercase tracking-widest text-amber-400 font-bold">Stack +</span>
                    <Layers2 className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className={cn("border bg-gradient-to-br p-3", toneClasses[stackSecondary.tone])}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] uppercase tracking-widest text-foreground/60 font-bold">Layer 2</span>
                      <Badge className="bg-background/80 text-primary border border-primary/40 uppercase text-[8px]">
                        {stackSecondary.category}
                      </Badge>
                    </div>
                    <p className="text-base font-bold text-foreground leading-tight">{stackSecondary.name}</p>
                    <span className={cn("text-[9px] border px-1.5 py-0.5 mt-1.5 inline-block uppercase tracking-wider", toolBadgeColors[stackSecondary.tool])}>
                      {stackSecondary.tool}
                    </span>
                  </div>
                </div>
              ) : (
                <div className={cn("border bg-gradient-to-br p-4", toneClasses[selectedEffect.tone])}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-background/80 text-primary border border-primary/40 uppercase text-[10px]">
                          {selectedEffect.category}
                        </Badge>
                      </div>
                      <h2 className="text-2xl font-bold text-foreground">{selectedEffect.name}</h2>
                      <p className="text-sm mt-2 text-foreground/75 leading-relaxed">
                        {selectedEffect.description}
                      </p>
                    </div>
                    <CategoryIcon className="w-8 h-8 opacity-80 shrink-0" />
                  </div>
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-foreground/20">
                    <span className={cn("text-[9px] border px-2 py-0.5 uppercase tracking-wider", toolBadgeColors[selectedEffect.tool] ?? "bg-secondary text-muted-foreground border-border")}>
                      {selectedEffect.tool}
                    </span>
                    <span className="text-[9px] text-foreground/60 uppercase tracking-wider">
                      ⏱ {selectedEffect.duration}
                    </span>
                  </div>
                </div>
              )}

              {/* Prompt output */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                    Generated Prompt
                  </p>
                  <div className="flex items-center gap-3">
                    {refreshMsg && (
                      <span className="text-[10px] text-primary uppercase tracking-wider">
                        {refreshMsg}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={regenerate}
                      className="text-[10px] text-primary hover:text-primary/80 flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Refresh
                    </button>
                    <button
                      type="button"
                      onClick={copyPrompt}
                      className="text-[10px] text-primary hover:text-primary/80 flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
                <textarea
                  readOnly
                  value={promptDraft}
                  className="w-full min-h-52 bg-secondary/50 border border-border p-3 text-xs text-foreground/80 leading-relaxed font-mono focus:outline-none resize-y"
                />
              </div>

              {/* Subject input */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2 block">
                  Subject / Scene Description
                </label>
                <textarea
                  value={subject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  placeholder="Example: a woman in a red dress standing in Times Square at night, close-up portrait, confident expression..."
                  className="w-full min-h-24 bg-secondary/40 border border-border px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
                />
              </div>

              {/* Copy button */}
              <button
                type="button"
                onClick={copyPrompt}
                className="w-full bg-primary text-primary-foreground py-2.5 text-[11px] uppercase tracking-widest font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Prompt Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Effect Prompt
                  </>
                )}
              </button>

              {/* Tool guide */}
              <div className="border border-border bg-secondary/20 p-3 space-y-2">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">
                  Recommended AI Tools
                </p>
                {[
                  { name: "Runway Gen-3", desc: "Cinematic & transform effects" },
                  { name: "Kling AI", desc: "Motion & parallax effects" },
                  { name: "Pika 2.0", desc: "Portrait & atmosphere effects" },
                  { name: "Veo 3", desc: "Photorealistic scenes & physics" },
                  { name: "Grok Aurora", desc: "Surreal & creative generation" },
                ].map((t) => (
                  <div key={t.name} className="flex items-center justify-between text-[10px]">
                    <span className={cn("border px-1.5 py-0.5 uppercase tracking-wider", toolBadgeColors[t.name])}>
                      {t.name}
                    </span>
                    <span className="text-muted-foreground text-right">{t.desc}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Main panel */}
        <section className="space-y-4 min-w-0">
          <Card className="bg-card border-border">
            <CardContent className="p-3 space-y-3">
              <div className="border border-primary/30 bg-primary/5 px-3 py-2 text-[11px] text-foreground/80 leading-relaxed">
                <span className="text-primary font-bold uppercase tracking-wider">How it works:</span>{" "}
                select an effect, describe your subject, then copy the cinematic prompt — each one is engineered with camera move + physics + lighting + technical specs. New: <span className="text-primary font-bold">Veo 3 Impossible</span> and <span className="text-primary font-bold">Grok Impossible</span> categories with reality-breaking hooks that stop the scroll.
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search effects, categories, or tools..."
                  className="w-full bg-secondary/40 border border-border pl-9 pr-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {effectCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "px-2.5 py-1 text-[9px] uppercase tracking-wider border transition-colors",
                      activeCategory === cat
                        ? "bg-primary text-primary-foreground border-primary theme-glow-box"
                        : "border-border text-muted-foreground hover:text-primary hover:border-primary/70"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between border-b border-border pb-2">
            <div className="text-xs uppercase tracking-wider text-primary font-bold flex items-center gap-2">
              <Film className="w-3.5 h-3.5" />
              Effect Library
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {filteredEffects.length} visible
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-2.5">
            {filteredEffects.map((effect) => {
              const Icon = categoryIcons[effect.category] ?? Wand2;
              const isLayer1 = stackMode && stackPrimary?.name === effect.name;
              const isLayer2 = stackMode && stackSecondary?.name === effect.name;
              const isSelected = !stackMode && selectedEffect.name === effect.name;
              return (
                <button
                  key={effect.name}
                  type="button"
                  onClick={() => applyEffect(effect)}
                  className={cn(
                    "group text-left border bg-card transition-all",
                    isSelected
                      ? "border-primary bg-primary/10 theme-glow-box"
                      : isLayer1
                      ? "border-primary bg-primary/10 theme-glow-box"
                      : isLayer2
                      ? "border-amber-500/70 bg-amber-500/10"
                      : "border-border hover:border-primary hover:bg-primary/5"
                  )}
                >
                  <div className="p-3 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className={cn("w-7 h-7 border bg-gradient-to-br flex items-center justify-center shrink-0", toneClasses[effect.tone])}>
                        {isLayer2 ? (
                          <Layers2 className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <Icon className="w-3.5 h-3.5 opacity-80" />
                        )}
                      </div>
                      <Badge className="bg-secondary/60 text-primary border border-primary/30 uppercase text-[8px] px-1.5 py-0.5 max-w-[110px] truncate">
                        {effect.category}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground leading-tight truncate">
                        {effect.name}
                      </h3>
                      <p className="text-[10px] text-muted-foreground leading-relaxed mt-1 line-clamp-2 min-h-[32px]">
                        {effect.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[9px] uppercase tracking-wider pt-1 border-t border-border/50">
                      <span className={cn("text-[8px] border px-1.5 py-0.5", toolBadgeColors[effect.tool] ?? "border-border text-muted-foreground")}>
                        {effect.tool}
                      </span>
                      <span className={cn(
                        isLayer1 ? "text-primary font-bold" :
                        isLayer2 ? "text-amber-400 font-bold" :
                        isSelected ? "text-primary font-bold" :
                        "text-muted-foreground"
                      )}>
                        {isLayer1 ? "Layer 1" : isLayer2 ? "Layer 2" : isSelected ? "Active" : effect.duration}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {filteredEffects.length === 0 && (
            <Card className="bg-card border-border">
              <CardContent className="p-10 text-center">
                <Film className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground font-mono">
                  No effects matched that search. Try another category or keyword.
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border bg-card px-3 py-2">
      <div className="text-lg font-bold text-primary">{value}</div>
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
