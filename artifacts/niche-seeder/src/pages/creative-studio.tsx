import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Check,
  Copy,
  Film,
  RefreshCw,
  Search,
  Sparkles,
  Wand2,
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
  { name: "Dolly Zoom", category: "Motion FX", description: "Hitchcock vertigo — subject holds, world warps", tone: "blue", tool: "Runway Gen-3", duration: "3–5s", prompt: "Dolly zoom effect (Vertigo effect): the camera simultaneously zooms in while physically pulling back, keeping the subject the same size while the background dramatically compresses or expands. Subject stays pin-sharp and in frame. Smooth cinematic motion. High production value." },
  { name: "Cinematic Parallax", category: "Motion FX", description: "Multi-layer depth scroll, epic landscape feel", tone: "blue", tool: "Kling AI", duration: "4–6s", prompt: "Cinematic parallax camera movement: foreground elements move faster than the midground, which moves faster than the background, creating a stunning layered depth effect. Slow lateral camera drift. Atmospheric haze between layers. Epic landscape scale." },
  { name: "Orbital Rotation", category: "Motion FX", description: "Camera circles the subject 360°, dramatic reveal", tone: "purple", tool: "Runway Gen-3", duration: "5–8s", prompt: "Smooth orbital 360-degree camera rotation around the subject, maintaining perfect focus on the center subject while the background sweeps dramatically around them. Cinematic lighting remains consistent throughout rotation. Smooth and controlled arc." },
  { name: "Float & Levitation", category: "Motion FX", description: "Subject rises and drifts weightlessly", tone: "cyan", tool: "Pika 2.0", duration: "3–5s", prompt: "The subject gently levitates and floats upward with a soft dreamlike motion. Hair and fabric move as if weightless in slow motion. Soft atmospheric light surrounds them. The background slowly defocuses as they rise. Peaceful ethereal mood." },
  { name: "Hypnotic Zoom Loop", category: "Motion FX", description: "Infinite zoom that loops seamlessly", tone: "purple", tool: "Runway Gen-3", duration: "4s loop", prompt: "Infinite hypnotic zoom that continuously pulls the viewer deeper into the image with a seamless loop. Each layer reveals the next with perfect continuity. Dreamlike and meditative. The motion accelerates subtly then resets. Psychedelic depth illusion." },
  { name: "Slow Motion Rise", category: "Motion FX", description: "Ultra-slow upward drift, majestic pace", tone: "blue", tool: "Kling AI", duration: "6–10s", prompt: "Ultra-slow motion upward vertical camera rise, moving smoothly from a low angle to a high angle reveal. Every detail captured in high frame rate slow motion. Golden or atmospheric light shifts as the camera rises. Cinematic grandeur and scale." },
  { name: "Push In Focus Pull", category: "Motion FX", description: "Camera pushes in while focus shifts foreground", tone: "slate", tool: "Runway Gen-3", duration: "4s", prompt: "Cinematic camera push-in combined with a rack focus pull: starts with a soft blurred foreground element in focus, then snaps to crisp sharp focus on the background subject as the camera slowly moves forward. Cinematic depth and tension building." },
  { name: "Tilt-Shift Miniature", category: "Motion FX", description: "World shrinks to a tiny diorama in motion", tone: "green", tool: "Pika 2.0", duration: "5s", prompt: "Tilt-shift miniature effect applied to a moving scene: selective focus band makes the world look like a tiny scale model in motion. Saturated colors, fast-forwarded movement, blurred top and bottom with a sharp central strip. Playful and charming." },

  // ── Transform FX ─────────────────────────────────────────────────────────
  { name: "Smoke Dissolve", category: "Transform FX", description: "Subject disintegrates into flowing smoke particles", tone: "slate", tool: "Runway Gen-3", duration: "4–6s", prompt: "The subject gracefully dissolves into flowing smoke and particle wisps, dispersing into the air in a beautiful ethereal dissipation. The smoke flows directionally with a slight breeze. Colors from the subject bleed into the smoke. Cinematic and atmospheric." },
  { name: "Crystal Shattering", category: "Transform FX", description: "Subject fractures into glass shards with physics", tone: "cyan", tool: "Kling AI", duration: "3–4s", prompt: "The subject explosively shatters into thousands of glass crystal fragments with photorealistic physics simulation. Each shard reflects and refracts light beautifully. The shattering begins at a center point and radiates outward. High-speed camera slow motion capture." },
  { name: "Morphing Transform", category: "Transform FX", description: "Smooth AI-driven morph to another subject or style", tone: "purple", tool: "Runway Gen-3", duration: "4–6s", prompt: "Seamless AI morphing transformation where the subject smoothly and organically transitions into a different subject or visual style. The morph moves through the face and body with a liquid-like fluidity. No hard cuts — pure continuous transformation. Cinematic and uncanny." },
  { name: "Pixel Burst Explode", category: "Transform FX", description: "Shatters into flying digital pixels", tone: "purple", tool: "Pika 2.0", duration: "3s", prompt: "The subject explodes into thousands of flying digital pixels and voxels that scatter dynamically into the frame. Each pixel maintains the original color of the area it came from, creating a beautiful cloud of color. Energetic and digital aesthetic. Slow motion particle physics." },
  { name: "Water Ripple Reveal", category: "Transform FX", description: "Ripple effect transforms the scene", tone: "blue", tool: "Kling AI", duration: "4s", prompt: "A water droplet lands on the image, creating concentric ripple waves that radiate outward and transform the scene underneath as they pass. The ripple acts as a wipe transition, revealing a new visual state beneath. Realistic water physics with light refraction." },
  { name: "Paper Tear Reveal", category: "Transform FX", description: "Scene tears like paper to reveal another world", tone: "amber", tool: "Runway Gen-3", duration: "4–5s", prompt: "The scene tears dramatically like a piece of paper being ripped from the center outward, revealing a completely different world or scene underneath. The torn paper edges are detailed with depth and shadow. The tearing motion is fast and physical." },
  { name: "Glitch Corruption", category: "Transform FX", description: "Digital corruption tears through the frame", tone: "cyan", tool: "Pika 2.0", duration: "2–3s", prompt: "Intense digital glitch corruption sweeps through the frame: RGB channel splitting, horizontal scan line tearing, pixel block displacement, color noise bursts, and digital artifact storms. The corruption moves like a wave through the image. High energy cyberpunk aesthetic." },
  { name: "Sand Dissolution", category: "Transform FX", description: "Thanos snap — subject crumbles to dust", tone: "amber", tool: "Runway Gen-3", duration: "5–6s", prompt: "The subject crumbles and dissolves into flowing sand particles that are swept away by an invisible wind, inspired by the disintegration effect. Particles maintain the subject's color as they disperse. The dissolution moves from one side of the body to the other progressively." },

  // ── Atmosphere FX ─────────────────────────────────────────────────────────
  { name: "Petal Cascade", category: "Atmosphere FX", description: "Cherry blossoms or rose petals fall in scene", tone: "pink", tool: "Pika 2.0", duration: "5–8s", prompt: "A beautiful cascade of cherry blossom or rose petals gently falls through the scene with natural physics. Petals spiral and drift in the breeze, catching soft warm light. Some petals land on the subject. Romantic and dreamy atmosphere. Soft depth of field bokeh behind the petals." },
  { name: "Neon Rain", category: "Atmosphere FX", description: "Cyberpunk neon-colored rain streams down", tone: "cyan", tool: "Kling AI", duration: "5s", prompt: "Cyberpunk neon rain falls in vivid electric colors — cyan, magenta, and electric blue streaks. The rain reflects off wet surfaces creating colorful light pools. Rain streaks are slightly long-exposure style. The scene is bathed in neon glow from unseen signs. Dark atmospheric background." },
  { name: "Floating Embers", category: "Atmosphere FX", description: "Hot orange embers drift upward from fire", tone: "orange", tool: "Pika 2.0", duration: "6s", prompt: "Hot glowing orange and red embers float upward through the scene, drifting and swirling in the heat haze. Some embers glow brightly before fading. The background has a warm fire glow. The motion is organic and varied. Atmospheric and dramatic lighting effect." },
  { name: "Aurora Borealis", category: "Atmosphere FX", description: "Northern lights ribbons fill the sky", tone: "green", tool: "Runway Gen-3", duration: "6–10s", prompt: "Stunning aurora borealis green and purple ribbons of light ripple and dance across a dark sky behind the subject. The aurora moves in slow fluid waves. Stars are visible through the aurora. The light from the aurora softly illuminates the subject from above. Breathtaking natural spectacle." },
  { name: "Snow Globe", category: "Atmosphere FX", description: "Snow swirls around the scene like a snow globe", tone: "blue", tool: "Pika 2.0", duration: "5s", prompt: "Gentle snow falls and swirls around the scene as if inside a snow globe. Snowflakes are varying sizes and catch the light. The snow motion is peaceful and mesmerizing. Warm interior light contrasts with cold snow. Cozy festive atmosphere with soft bokeh." },
  { name: "Fog Creep", category: "Atmosphere FX", description: "Low-lying fog rolls in slowly, moody atmosphere", tone: "slate", tool: "Kling AI", duration: "6–8s", prompt: "Dense atmospheric low-lying fog slowly rolls into the scene from the edges, creeping along the ground and swirling around the subject's feet. The fog is thick and volumetric, catching any available light. Creates an eerie, mysterious, or romantic mood. Very slow organic motion." },
  { name: "Confetti Explosion", category: "Atmosphere FX", description: "Colorful confetti bursts in celebration", tone: "pink", tool: "Pika 2.0", duration: "3–4s", prompt: "An explosion of colorful confetti bursts from below and rains down through the frame. Circular and rectangular pieces catch the light in their various colors. Streamers twist and curl. The burst is energetic and joyful. Slow motion captures every piece individually. Celebration and festive energy." },
  { name: "Golden Dust Storm", category: "Atmosphere FX", description: "Swirling golden sparkle dust surrounds the subject", tone: "amber", tool: "Runway Gen-3", duration: "5s", prompt: "Swirling golden dust and sparkle particles flow around the subject in a magical storm of light. The particles catch and refract light creating a glittering halo effect. The motion is dynamic — particles orbit and swirl but never obscure the subject's face. Luxury and magic combined." },

  // ── Cinematic FX ──────────────────────────────────────────────────────────
  { name: "Film Grain Noir", category: "Cinematic FX", description: "Heavy 35mm film grain, flickering black-and-white", tone: "slate", tool: "Runway Gen-3", duration: "4–8s", prompt: "Heavy authentic 35mm film grain texture overlaid on the footage with intermittent film flicker and gate weave. Black and white conversion with strong chiaroscuro shadows. Film burn at the edges. Shutter artifact subtly visible. Authentic 1940s-1950s cinema aesthetic." },
  { name: "Anamorphic Lens Flare", category: "Cinematic FX", description: "Horizontal blue-streak lens flares, cinema quality", tone: "blue", tool: "Kling AI", duration: "3–5s", prompt: "Anamorphic lens flares sweep horizontally across the frame in long blue-white streaks as a light source moves or the camera shifts angle. Additional circular bokeh flares and light scatter. Shot on anamorphic cinema lenses look. High-end Hollywood production quality." },
  { name: "VHS Glitch", category: "Cinematic FX", description: "VHS tape wobble, tracking lines, 80s nostalgia", tone: "purple", tool: "Pika 2.0", duration: "4s", prompt: "VHS cassette tape aesthetic: horizontal tracking error lines, color bleeding, signal degradation stripes, analog noise grain, occasional dropout bands, timecode overlay, and the characteristic soft luminance ghosting of magnetic tape. Authentic 1980s home video nostalgia." },
  { name: "Neon Color Grade", category: "Cinematic FX", description: "Electric neon color grade, cyberpunk palette", tone: "cyan", tool: "Runway Gen-3", duration: "5s", prompt: "Bold neon cyberpunk color grade: shadows pushed deep into blue-black, highlights blown into neon cyan and magenta. Teal-orange complementary split-tone. Heavy saturation boost on neon signage and lights. Blade Runner 2049 meets Enter the Void color language." },
  { name: "Orange & Teal Grade", category: "Cinematic FX", description: "Hollywood blockbuster orange-teal color split", tone: "orange", tool: "Kling AI", duration: "5–8s", prompt: "Classic Hollywood orange-and-teal color grade: skin tones and highlights pushed warm orange-amber, shadows and backgrounds cooled to deep teal. High contrast with rich blacks. The quintessential blockbuster summer film look. Professional colorist-quality grade." },
  { name: "Dreamy Bleach Bypass", category: "Cinematic FX", description: "Desaturated high contrast, silver retention look", tone: "slate", tool: "Runway Gen-3", duration: "5s", prompt: "Bleach bypass photochemical process look: reduced color saturation, increased contrast, silver halide retention creating a gritty metallic texture to the image. Highlights are clipped bright, shadows are dense. Jarhead and Saving Private Ryan cinematic aesthetic." },
  { name: "Wes Anderson Palette", category: "Cinematic FX", description: "Perfect symmetry, pastel color grade, quirky storybook", tone: "pink", tool: "Kling AI", duration: "5s", prompt: "Wes Anderson color grade and composition: perfectly balanced bilateral symmetry, muted pastel color palette with warm yellows, dusty pinks, and sage greens. Flat lighting from the front, minimal shadows. Deadpan camera movement if any. Dollhouse set quality." },
  { name: "Super 8 Vintage", category: "Cinematic FX", description: "Kodachrome Super 8 film warmth, home movie feel", tone: "amber", tool: "Pika 2.0", duration: "4–6s", prompt: "Kodachrome Super 8 film aesthetic: warm oversaturated colors with reds and oranges rich, slight overexposure, soft focus edges, film grain specific to Super 8 gauge, intermittent light leaks on the edges, shutter flicker. Nostalgic 1970s home movie quality." },

  // ── Portrait & Character FX ───────────────────────────────────────────────
  { name: "Particle Burst Avatar", category: "Portrait FX", description: "Face dissolves into epic particle burst and reforms", tone: "purple", tool: "Runway Gen-3", duration: "5–6s", prompt: "The subject's portrait explodes outward into a stunning burst of glowing particles — each particle maintaining a fragment of the original portrait. The particles swirl dramatically then rapidly converge and re-form the face in a new transformed style. Epic cinematic energy." },
  { name: "Anime Face Transform", category: "Portrait FX", description: "Smooth morph from real face to anime style", tone: "cyan", tool: "Kling AI", duration: "4s", prompt: "Seamless smooth transformation of a real portrait into a Japanese anime art style — eyes grow larger and more expressive, linework appears, skin becomes cel-shaded, hair stylizes. The morph is gradual and fluid. Clean and beautiful character design quality." },
  { name: "Echo Trail", category: "Portrait FX", description: "Movement leaves translucent motion echo trails", tone: "blue", tool: "Pika 2.0", duration: "4–5s", prompt: "The subject's movements leave beautiful translucent motion echo trails — ghost images of each position layered semi-transparently. The trails fade out over 10–15 frames. Creates a time-lapse-within-a-moment effect. Stroboscopic and artistic. Movement feels like abstract dance." },
  { name: "Silhouette & Neon", category: "Portrait FX", description: "Subject becomes glowing neon silhouette", tone: "cyan", tool: "Runway Gen-3", duration: "4s", prompt: "The subject's portrait transforms into a glowing electric neon silhouette outline against a deep black background. The neon outline pulses gently with electricity, tracing every detail of the face and hair. Inner glow and outer corona. Color shifts slowly through the neon spectrum." },
  { name: "Mirror Kaleidoscope", category: "Portrait FX", description: "Face multiplies into kaleidoscope symmetry", tone: "pink", tool: "Pika 2.0", duration: "5s", prompt: "The portrait multiplies and mirrors into a stunning kaleidoscope pattern — face fragments reflected and rotated symmetrically into a mandala-like arrangement. The pattern slowly rotates. Colors are vivid and saturated. Psychedelic and hypnotic visual effect." },
  { name: "AI Hologram", category: "Portrait FX", description: "Subject becomes a blue holographic projection", tone: "blue", tool: "Kling AI", duration: "4–5s", prompt: "The subject appears as a blue holographic projection: semi-transparent blue tint, scan line interference pattern, occasional holographic flicker and static, soft outer glow, data stream particles floating around them. Futuristic tech aesthetic. Iron Man display quality." },
  { name: "Paint Stroke Reveal", category: "Portrait FX", description: "Brushstrokes paint the subject into existence", tone: "amber", tool: "Runway Gen-3", duration: "5–6s", prompt: "The subject is progressively painted into existence by invisible brushstrokes moving across the canvas — each stroke reveals more of the portrait in an oil painting or watercolor style. The reveal moves from top to bottom or in swirling patterns. Artistic and captivating." },
  { name: "Ink Drop Bloom", category: "Portrait FX", description: "Ink drops bloom to form the portrait", tone: "slate", tool: "Kling AI", duration: "5s", prompt: "The subject's portrait forms from ink drops falling into water and blooming outward — each drop spreading in a dendritic organic pattern that fills in more and more of the image. The ink is deep black or vivid color. Shot top-down. Beautiful fluid dynamics." },

  // ── Fantasy & Sci-Fi FX ───────────────────────────────────────────────────
  { name: "Portal Vortex", category: "Fantasy FX", description: "Swirling dimensional portal opens in the scene", tone: "purple", tool: "Runway Gen-3", duration: "5–6s", prompt: "A swirling dimensional portal vortex opens dramatically — spiraling rings of energy in electric blue and purple, with gravitational distortion pulling surrounding elements toward the center. Light bends around the edges. Distant world visible through the portal. Epic fantasy or sci-fi scale." },
  { name: "Magic Particle Storm", category: "Fantasy FX", description: "Spellcasting particle storm emanates from subject", tone: "amber", tool: "Pika 2.0", duration: "4–5s", prompt: "The subject conjures a storm of magical glowing particles that emanate from their hands or body — swirling vortices of light in gold, white, and electric blue. Particles orbit the subject then shoot outward in dramatic arcs. Fantasy spellcasting aesthetic. Cinematic magic." },
  { name: "Lightning Surge", category: "Fantasy FX", description: "Electric lightning arcs from subject with power", tone: "blue", tool: "Kling AI", duration: "3–4s", prompt: "Electric lightning energy arcs and surges from the subject — branching bolts of white-blue electricity jump outward from their body. The surrounding air distorts with the electromagnetic energy. Brief white flash illuminates the scene. Thor-level superhero power aesthetic." },
  { name: "Crystal Formation", category: "Fantasy FX", description: "Ice or crystal structures grow across the scene", tone: "cyan", tool: "Runway Gen-3", duration: "5–6s", prompt: "Ice or crystal structures rapidly grow and spread across the scene in a branching dendritic pattern — geometric crystal spires and frost ferns expand outward. The crystals are translucent and catch light beautifully in teal and blue hues. Frozen in time, magical and cold." },
  { name: "Cosmic Energy Aura", category: "Fantasy FX", description: "Galaxy-level energy aura surrounds the subject", tone: "purple", tool: "Kling AI", duration: "5–7s", prompt: "The subject radiates a galaxy-scale cosmic energy aura — swirling nebula colors in deep purple, magenta, and electric blue orbit their silhouette. Star particles sparkle within the aura. Gravity lensing distorts the space around them. Universe-level power and scale." },
  { name: "Time Reverse", category: "Fantasy FX", description: "Scene plays in reverse with Tenet-style physics", tone: "slate", tool: "Runway Gen-3", duration: "5s", prompt: "The scene plays in dramatic reverse — particles flow backward against gravity, falling objects rise, water flows upward, scattered elements reconverge. The reverse motion is perfectly smooth and cinematic, not simply speed-reversed. Tenet and Interstellar temporal mechanics aesthetic." },
  { name: "Angel Wings Unfurl", category: "Fantasy FX", description: "Luminous wings expand dramatically from the subject", tone: "amber", tool: "Pika 2.0", duration: "5–6s", prompt: "Massive luminous feathered wings gradually unfurl from behind the subject in an epic slow reveal. Each feather catches divine golden or white light. Wind moves through the feathers. The wingspan expands to fill the frame. Sacred and powerful energy. Angelic or divine creature aesthetic." },
  { name: "Shadow Clone Split", category: "Fantasy FX", description: "Subject splits into multiple shadow echo clones", tone: "slate", tool: "Runway Gen-3", duration: "4s", prompt: "The subject splits into multiple shadow clone versions of themselves that step outward in different directions — each clone is slightly transparent and dark-tinted, with the original remaining fully solid at the center. Naruto shadow clone jutsu aesthetic. Dynamic ninja power move." },

  // ── Transition FX ─────────────────────────────────────────────────────────
  { name: "Swirl Vortex Cut", category: "Transition FX", description: "Whirlpool vortex swallows scene, reveals next", tone: "purple", tool: "Pika 2.0", duration: "2–3s", prompt: "A swirling whirlpool vortex appears in the center of the frame and rapidly expands, consuming the entire scene in a spinning spiral transition before the new scene is revealed from the center of the vortex. High-energy and cinematic. Natural spinning physics." },
  { name: "Zoom Blur Smash Cut", category: "Transition FX", description: "Explosive zoom blur wipes to the next scene", tone: "orange", tool: "Runway Gen-3", duration: "1–2s", prompt: "An explosive zoom blur transition — the camera rushes forward at extreme speed with radial motion blur, smashing through the scene and cutting to the next. The transition lasts under 2 seconds and feels like a punch. Action film energy. Sound design dependent effect." },
  { name: "Ink Wash Wipe", category: "Transition FX", description: "Ink wash spreads across the frame to transition", tone: "slate", tool: "Kling AI", duration: "3–4s", prompt: "An ink wash spreads across the frame from one edge, painting over the scene in flowing black ink that then reveals a new scene underneath. The ink has natural fluid dynamics with bloom and bleed at the edges. Artistic and elegant transition. Chinese ink wash aesthetic." },
  { name: "Light Beam Sweep", category: "Transition FX", description: "Divine light beam sweeps the transition", tone: "amber", tool: "Pika 2.0", duration: "2–3s", prompt: "A bright divine light beam sweeps horizontally or vertically across the frame, bleaching out the existing scene in pure white light before the new scene fades in from the same direction. Particles and dust are visible in the light beam. Cinematic and epic." },
  { name: "Glitch Slice Transition", category: "Transition FX", description: "Digital glitch slices cut between two scenes", tone: "cyan", tool: "Runway Gen-3", duration: "1–2s", prompt: "Rapid digital glitch slices cut through the scene — horizontal bands of the frame misalign and shift to reveal fragments of the next scene. RGB split accompanies each slice. The transition completes in under 2 seconds with a final lock-in to the new scene. Cyberpunk editing aesthetic." },
  { name: "Origami Paper Fold", category: "Transition FX", description: "Scene folds like origami paper to reveal next", tone: "green", tool: "Kling AI", duration: "3–4s", prompt: "The scene folds along geometric crease lines like a piece of origami paper — triangular and rectangular panels fold away in sequence to reveal the next scene underneath. The folds cast realistic shadows on each other. Clean, geometric, and satisfying to watch." },
  { name: "Shatter Glass Cut", category: "Transition FX", description: "Frame shatters like a mirror, reveals new scene", tone: "blue", tool: "Pika 2.0", duration: "2–3s", prompt: "The current scene shatters like a mirror or glass pane into hundreds of fragments, revealing the new scene behind it. Each glass shard catches and reflects light as it falls away. The break begins from a point of impact and radiates outward. High-impact dramatic transition." },
  { name: "Waterfall Dissolve", category: "Transition FX", description: "Scene liquefies and flows down like a waterfall", tone: "blue", tool: "Runway Gen-3", duration: "3–4s", prompt: "The pixels of the current scene liquify and flow downward like a waterfall of digital water, dissolving the image from top to bottom in flowing streams. The new scene is revealed underneath as the old scene washes away. Beautiful fluid simulation with light refraction." },
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
};

const categoryIcons: Record<string, React.ElementType> = {
  "Motion FX": Wind,
  "Transform FX": Zap,
  "Atmosphere FX": Sparkles,
  "Cinematic FX": Film,
  "Portrait FX": Star,
  "Fantasy FX": Triangle,
  "Transition FX": Layers,
};

function buildVideoPrompt(effect: VideoEffect, subject: string): string {
  const subjectLine = subject.trim()
    ? `Subject / scene: ${subject.trim()}. `
    : "";
  return `${subjectLine}${effect.prompt} Recommended tool: ${effect.tool}. Suggested duration: ${effect.duration}.`;
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
  const [refreshCount, setRefreshCount] = useState(0);
  const [refreshMsg, setRefreshMsg] = useState("");

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
    setSelectedEffect(effect);
    setPromptDraft(buildVideoPrompt(effect, subject));
    setCopied(false);
    setRefreshMsg(`${effect.name} loaded`);
  };

  const handleSubjectChange = (value: string) => {
    setSubject(value);
    setPromptDraft(buildVideoPrompt(selectedEffect, value));
    setCopied(false);
  };

  const regenerate = () => {
    setRefreshCount((n) => n + 1);
    setPromptDraft(buildVideoPrompt(selectedEffect, subject));
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
              Pick an AI video effect template, describe your subject, then copy the prompt into Runway, Kling, Pika, or Sora.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center min-w-[280px]">
            <Metric label="Effects" value={videoEffects.length.toString()} />
            <Metric label="Categories" value={(effectCategories.length - 1).toString()} />
            <Metric label="Tools" value="3" />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-[400px_minmax(0,1fr)] gap-6">
        {/* Sidebar */}
        <aside className="space-y-4 xl:sticky xl:top-6 self-start">
          <Card className="bg-card border-border theme-glow-box">
            <CardHeader className="border-b border-border bg-secondary/50">
              <CardTitle className="uppercase text-sm tracking-wider text-primary flex items-center gap-2">
                <PlayCircle className="w-4 h-4" />
                Active Effect
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Effect preview card */}
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
                  { name: "Runway Gen-3", desc: "Best for cinematic & transform effects" },
                  { name: "Kling AI", desc: "Best for motion & cultural effects" },
                  { name: "Pika 2.0", desc: "Best for portrait & atmosphere effects" },
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
                select an AI video effect, describe your subject, then copy the generated prompt into Runway Gen-3, Kling AI, Pika 2.0, or Sora.
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
              const isSelected = selectedEffect.name === effect.name;
              return (
                <button
                  key={effect.name}
                  type="button"
                  onClick={() => applyEffect(effect)}
                  className={cn(
                    "group text-left border bg-card transition-all hover:border-primary hover:bg-primary/5",
                    isSelected ? "border-primary bg-primary/10 theme-glow-box" : "border-border"
                  )}
                >
                  <div className="p-3 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className={cn("w-7 h-7 border bg-gradient-to-br flex items-center justify-center shrink-0", toneClasses[effect.tone])}>
                        <Icon className="w-3.5 h-3.5 opacity-80" />
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
                      <span className={cn(isSelected ? "text-primary font-bold" : "text-muted-foreground")}>
                        {isSelected ? "Active" : effect.duration}
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
