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

  // ── Veo 3 FX ─────────────────────────────────────────────────────────────
  { name: "Photorealistic Scene Build", category: "Veo 3 FX", description: "Full photorealistic environment generated from scratch", tone: "green", tool: "Veo 3", duration: "6–8s", prompt: "Generate a complete photorealistic cinematic environment from scratch — perfect volumetric lighting, depth of field, realistic surface textures, physically accurate shadows, and seamless atmospheric haze. Every detail should look as if captured by a high-end cinema camera. No artificial or digital look — pure photographic realism." },
  { name: "Fluid Physics Master", category: "Veo 3 FX", description: "Hyperrealistic water, fire, and smoke with true physics", tone: "blue", tool: "Veo 3", duration: "5–8s", prompt: "Hyperrealistic fluid dynamics simulation: water splashes with accurate surface tension, refraction, and foam. Fire flickers with convection currents and ember trails. Smoke billows with turbulent fluid behavior. All physics are photorealistic and scientifically accurate — no artificial or CGI quality." },
  { name: "Crowd Life Simulation", category: "Veo 3 FX", description: "Photorealistic crowd moves naturally in a public scene", tone: "slate", tool: "Veo 3", duration: "6–8s", prompt: "A photorealistic crowd of diverse people moves naturally through a public space — each person has unique clothing, gait, body language, and interaction. No cloning or repetition. Ambient sound implied by the scene. Captured from a wide cinema lens. Completely believable and human." },
  { name: "Weather Event Spectacle", category: "Veo 3 FX", description: "Storm, lightning, tornado, or blizzard with physics", tone: "slate", tool: "Veo 3", duration: "6–10s", prompt: "A dramatic meteorological event unfolds with photorealistic physics: dark storm clouds rotate and billow, lightning arcs from sky to earth with branching patterns, rain streaks at high speed, wind bends trees with realistic force. The atmospheric pressure and light change are palpable. Ultra-cinematic weather." },
  { name: "Nature Timelapse Bloom", category: "Veo 3 FX", description: "Flower blooms, seasons change, clouds roll — all real", tone: "green", tool: "Veo 3", duration: "8s", prompt: "A photorealistic nature timelapse compressed into 8 seconds: flowers unfurl petal by petal, sunlight traces arcs across the sky, clouds build and dissolve, shadows shift dramatically. Every element — plant cell growth, dew forming, insects visiting — is captured with macro realism. Pure organic beauty." },
  { name: "Wildlife Documentary", category: "Veo 3 FX", description: "Naturalistic animal behavior, BBC documentary grade", tone: "amber", tool: "Veo 3", duration: "6–8s", prompt: "A photorealistic wildlife documentary-quality scene: an animal behaves completely naturally in its native habitat — breathing, blinking, reacting to surroundings. Coat or skin texture is perfect. Eyes are alive and expressive. Natural lighting, shallow depth of field. David Attenborough BBC Earth production level." },
  { name: "Aerial Drone Reveal", category: "Veo 3 FX", description: "Cinematic drone camera rises to epic aerial reveal", tone: "blue", tool: "Veo 3", duration: "6–8s", prompt: "A cinematic drone camera rises smoothly from ground level, revealing a sweeping aerial landscape below. The motion is perfectly stabilized with slight atmospheric shimmer. Below, streets, buildings, or natural terrain come into full view. Golden hour or blue hour lighting. Epic establishing shot quality." },
  { name: "Underwater Bioluminescence", category: "Veo 3 FX", description: "Glowing deep sea life drifts through dark ocean", tone: "cyan", tool: "Veo 3", duration: "6–8s", prompt: "A photorealistic deep ocean environment: bioluminescent creatures emit pulsing blue-green light in the total darkness of the deep sea. Jellyfish trail glowing tentacles, plankton sparkle, strange fish drift past. Water pressure and volumetric light rays create authentic deep-sea atmosphere. Awe-inspiring and otherworldly." },
  { name: "Architecture Cinematic Reveal", category: "Veo 3 FX", description: "Sweeping cinematic camera reveals stunning architecture", tone: "amber", tool: "Veo 3", duration: "5–8s", prompt: "A smooth cinematic camera movement reveals a piece of architecture in a dramatic sweep — from a tight detail to the full facade, or a wide exterior to an interior reveal. Light plays perfectly across surfaces. The building's materiality — glass, stone, wood, metal — is photorealistic. Architectural photography magazine quality." },
  { name: "Cosmic Space Environment", category: "Veo 3 FX", description: "Photorealistic nebula, planets, and asteroids in space", tone: "purple", tool: "Veo 3", duration: "6–8s", prompt: "A photorealistic space environment: a massive nebula fills the background with gas and dust in deep reds, purples, and blues. Planets hang in the void with accurate atmospheric glow and surface detail. An asteroid field drifts past. A star burns in the far distance. NASA-quality cosmic photorealism." },

  // ── Grok FX ──────────────────────────────────────────────────────────────
  { name: "Surreal Dream Reality", category: "Grok FX", description: "Impossible dreamlike world with photographic detail", tone: "purple", tool: "Grok Aurora", duration: "6–8s", prompt: "A surreal dreamlike reality that defies physics but feels visually photographic — impossible architecture floats in sky, stairways lead to clouds, clocks melt, shadows fall in wrong directions. Salvador Dalí meets hyperrealism. Every impossible element is rendered with photographic precision and emotional resonance." },
  { name: "Abstract Dimension Storm", category: "Grok FX", description: "Swirling abstract dimensions, color, and geometry collide", tone: "pink", tool: "Grok Aurora", duration: "5–7s", prompt: "An explosive abstract dimension: swirling geometric forms in vivid neon and jewel tones collide and orbit. Fractals unfold infinitely, color fields bleed into each other, impossible shapes rotate in non-Euclidean space. The motion is rhythmic and hypnotic. Kandinsky meets digital physics." },
  { name: "Cyberpunk Mega-City", category: "Grok FX", description: "Vast neon cyberpunk city at night, extreme detail", tone: "cyan", tool: "Grok Aurora", duration: "6–8s", prompt: "A sprawling cyberpunk mega-city at night: holographic advertisements tower above rain-soaked streets, flying vehicles stream between skyscrapers, neon kanji signs reflect in puddles. Dense population of diverse humans and androids. Blade Runner 2049 production design meets Ghost in the Shell density. Hyper-detailed world-building." },
  { name: "Fantasy Epic Horizon", category: "Grok FX", description: "Sweeping fantasy world with mountains, magic, and scale", tone: "amber", tool: "Grok Aurora", duration: "6–8s", prompt: "An epic fantasy world panorama: dragon-scale mountain ranges pierce clouds, floating islands bear ancient castles, rivers of molten gold wind through mystical forests. The sky has three moons. Massive scale makes humans feel microscopic. Tolkien meets Studio Ghibli meets concept art grandeur." },
  { name: "Psychedelic Reality Break", category: "Grok FX", description: "Visual reality fractures into multi-dimensional psychedelia", tone: "pink", tool: "Grok Aurora", duration: "5–6s", prompt: "Reality fractures and unfolds into multi-layered psychedelic dimensions: fractal patterns cascade from the center outward, rainbow light diffracts through impossible prisms, geometric mandalas rotate in multiple axes simultaneously. DMT aesthetic meets fine art precision. Alex Grey meets IMAX." },
  { name: "Biopunk Living World", category: "Grok FX", description: "Organic biological architecture breathes and pulses", tone: "green", tool: "Grok Aurora", duration: "6–8s", prompt: "A biopunk world where all architecture is grown from living biological material: buildings have skin-like facades that breathe and pulse, veins of bioluminescent fluid run through structural columns, organs the size of houses pump visible fluids. Grotesque yet beautiful. H.R. Giger meets Hayao Miyazaki organics." },
  { name: "Neon Noir Rain City", category: "Grok FX", description: "Rain-drenched noir city drenched in neon and shadow", tone: "cyan", tool: "Grok Aurora", duration: "6–8s", prompt: "A rain-soaked noir city at night: neon signs in magenta, electric blue, and acid yellow reflect in every wet surface. Steam rises from grates. A lone figure walks in silhouette. Every raindrop catches a different colored light. Smoke and fog obscure the upper floors of buildings. Dark, moody, impossibly beautiful." },
  { name: "Mythological Creature", category: "Grok FX", description: "Photorealistic ancient mythological creature in the wild", tone: "amber", tool: "Grok Aurora", duration: "5–8s", prompt: "A photorealistic mythological creature exists in its natural habitat with complete believability: scales, fur, feathers, or skin have perfect biological detail. Eyes are intelligent and alive. Movement is naturalistic and weighted. The environment reacts to its presence — birds flee, water ripples, trees bend. National Geographic meets myth." },
  { name: "Interdimensional Rift", category: "Grok FX", description: "Two realities tear open and merge through a rift", tone: "purple", tool: "Grok Aurora", duration: "6–8s", prompt: "Reality tears open at a central rift, and two entirely different dimensions bleed into each other — one might be a lush forest, the other a barren alien world. The rift distorts light around its edges with gravitational lensing. Objects and particles from both worlds mix at the boundary. Epic scale and production quality." },
  { name: "Living Abstract Data", category: "Grok FX", description: "Information becomes living visual art in motion", tone: "blue", tool: "Grok Aurora", duration: "5–7s", prompt: "Abstract data takes on physical form and moves like a living organism: information flows as luminous rivers of light, data nodes pulse and connect like neurons, algorithms visualized as blooming fractals, network graphs become three-dimensional webs of glowing threads. Beautiful, intelligent-feeling motion art." },

  // ── Location Zoom FX ─────────────────────────────────────────────────────
  { name: "Earth to Street Descent", category: "Location Zoom FX", description: "Google Earth-style zoom from space down to the subject", tone: "blue", tool: "Veo 3", duration: "8–10s", prompt: "Begin from outer space — the curve of the Earth visible against a star field. The camera descends rapidly through the atmosphere, clouds parting below. Continents resolve into countries, countries into cities, cities into neighborhoods, neighborhoods into a single street. The descent ends at ground level, revealing the subject standing at their exact location. Cinematic satellite-to-street reveal. Ultra-realistic continuous zoom, no cuts." },
  { name: "Google Maps Pin Drop", category: "Location Zoom FX", description: "Animated map tiles zoom from world view to a street pin", tone: "cyan", tool: "Runway Gen-3", duration: "6–8s", prompt: "Start with a stylized satellite map view of the world. Digital map tiles zoom in progressively — continent tiles load, then country tiles, then city tiles, then neighborhood street view. A red location pin drops and plants into the street at the final zoom level. The camera then transitions from the map aesthetic to a photorealistic street view of the location with the subject standing there. Clean cinematic motion, Google Maps aesthetic." },
  { name: "Satellite to Rooftop", category: "Location Zoom FX", description: "Satellite view zooms to a rooftop, subject revealed from above", tone: "slate", tool: "Veo 3", duration: "8s", prompt: "Aerial satellite imagery zooms in on a city block from directly above. Resolution increases as altitude drops — the roof tiles and building details sharpen. The descent slows as it reaches a specific rooftop. The camera pivots smoothly from top-down to a low angled shot, revealing the subject standing on the rooftop with the city skyline behind them. Cinematic drone reveal." },
  { name: "Stadium Crowd Finder", category: "Location Zoom FX", description: "Aerial stadium zoom — finding one person in a packed crowd", tone: "amber", tool: "Veo 3", duration: "8–10s", prompt: "Wide aerial shot of a packed stadium full of thousands of people. The camera begins to zoom in with purpose, scanning and descending. The crowd becomes larger and more detailed. The zoom slows as it homes in on one specific person in the crowd — the subject. The final frame is a close-up portrait of the subject surrounded by the blurred crowd. Dramatic documentary-style focus pull." },
  { name: "City Window Find", category: "Location Zoom FX", description: "Night cityscape zoom — finding a character at their lit window", tone: "purple", tool: "Kling AI", duration: "8s", prompt: "Wide shot of a glittering city skyline at night. Windows are lit across dozens of buildings. The camera begins a slow deliberate zoom toward one specific building, descending between skyscrapers. The zoom locks onto one particular lit window. Through the window the subject is visible inside — the camera closes in until the window fills the frame and we can see the subject clearly. Cinematic city noir reveal." },
  { name: "Beach Horizon Zoom", category: "Location Zoom FX", description: "Aerial ocean horizon zooms to beach to find the subject", tone: "cyan", tool: "Veo 3", duration: "8–10s", prompt: "Wide aerial shot looking out from above the ocean toward a distant coastline. The camera moves forward and descends simultaneously — the horizon approaches, the coastline grows, the beach resolves in increasing detail. The zoom slows as it approaches the shoreline, revealing the subject standing on the sand at the water's edge. Golden hour light, gentle waves, cinematic reveal." },
  { name: "Mountain Summit Reveal", category: "Location Zoom FX", description: "Satellite zoom from mountain range to a lone summit climber", tone: "slate", tool: "Veo 3", duration: "8–10s", prompt: "Satellite view of a mountain range — peaks sharp against a blue sky. The camera descends and zooms toward the highest summit. As altitude decreases, individual ridges and snow fields come into focus. The descent slows dramatically as it approaches the very top, revealing a lone subject standing at the summit, wind in their clothes, the world spread below them. Epic scale contrast — vast mountains, one person." },
  { name: "Festival Ground Zoom", category: "Location Zoom FX", description: "Aerial festival zoom finds a single dancing person in thousands", tone: "pink", tool: "Runway Gen-3", duration: "8s", prompt: "Aerial birds-eye view of a massive outdoor festival — thousands of people, stages, lights, crowds spread across a wide field. The camera descends with an energetic rhythm, zooming toward the crowd. It homes in on a specific section of dancing people and slows, finally locking onto the subject dancing freely in the middle of the crowd. The final frame is an intimate portrait — the subject in their element, festival energy all around." },
  { name: "Neighborhood Drop-In", category: "Location Zoom FX", description: "Drone zooms from suburb aerial to a front door, subject inside", tone: "green", tool: "Kling AI", duration: "7–8s", prompt: "Wide aerial shot of a suburban neighborhood — streets, houses, trees visible from above. The drone descends toward one specific house, approaching from above and slightly behind. The camera slows as it reaches the front of the house, settling at ground level facing the front door. The subject steps out of the doorway to greet the camera. Warm neighborhood light, natural environment, intimate and personal reveal." },
  { name: "Night Club VIP Zoom", category: "Location Zoom FX", description: "Aerial zoom into a club, finds the subject on the dance floor", tone: "purple", tool: "Runway Gen-3", duration: "7–8s", prompt: "Exterior aerial view of a city block at night. The camera descends toward one building with neon lights and a queue outside — a nightclub. The zoom passes through the exterior, into the interior, above the dance floor. Strobes, fog, and colored lights illuminate thousands of moving people below. The camera descends and locks onto the subject dancing confidently in the middle of the floor. Cinematic party energy reveal." },
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
  "Grok FX": Bot,
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
                select an AI video effect, describe your subject, then copy the generated prompt into Runway Gen-3, Kling AI, Pika 2.0, Veo 3, or Grok Aurora. New: Veo 3 FX and Grok FX categories now available.
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
