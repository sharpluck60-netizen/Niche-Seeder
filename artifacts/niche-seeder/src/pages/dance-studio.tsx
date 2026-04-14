import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Check,
  Copy,
  Music,
  RefreshCw,
  Sparkles,
  Wand2,
  Zap,
  Flame,
  TrendingUp,
  Video,
  Shuffle,
} from "lucide-react";

// ── Data ────────────────────────────────────────────────────────────────────

const danceStyles = [
  { id: "hiphop", label: "Hip-Hop", emoji: "🔥", trend: "VIRAL", desc: "Cypher energy, street credibility, pure sauce" },
  { id: "breaking", label: "Breaking / B-boy", emoji: "⚡", trend: "RISING", desc: "Windmills, headspins, flips — Olympic-level raw power" },
  { id: "kpop", label: "K-Pop Sync", emoji: "🌟", trend: "TRENDING", desc: "Tight group synchronisation, clean choreography" },
  { id: "afrobeats", label: "Afrobeats", emoji: "🌍", trend: "VIRAL", desc: "Fluid waist, grounded bounce, West African roots" },
  { id: "dancehall", label: "Dancehall", emoji: "🇯🇲", trend: "HOT", desc: "Jamaican riddims, wine and kotch energy" },
  { id: "waacking", label: "Waacking", emoji: "💥", trend: "NICHE", desc: "Arms whipping, 70s disco soul, pure drama" },
  { id: "locking", label: "Locking & Popping", emoji: "🤖", trend: "CLASSIC", desc: "Precision locks, electric hits, robotic isolations" },
  { id: "voguing", label: "Voguing / Ballroom", emoji: "👑", trend: "HOT", desc: "Runway realness, death drops, categories served" },
  { id: "house", label: "House / Chicago Footwork", emoji: "🎶", trend: "RISING", desc: "Footwork at 160 BPM, spiritual floor connection" },
  { id: "contemporary", label: "Contemporary", emoji: "🌊", trend: "STEADY", desc: "Fluid emotion, technique meets raw expression" },
  { id: "tutting", label: "Tutting / Geometry", emoji: "📐", trend: "NICHE", desc: "Angular precision, finger tutting illusions" },
  { id: "shuffle", label: "Shuffle / Melbourne", emoji: "🔮", trend: "TRENDING", desc: "Running man, T-step, festival floor domination" },
];

const scenes = [
  { id: "street", label: "Urban Street", desc: "Graffiti walls, concrete, cinematic city backdrop" },
  { id: "club", label: "Night Club", desc: "Strobes, smoke machines, laser beams, crowd energy" },
  { id: "studio", label: "Dance Studio", desc: "Clean mirrors, hardwood floor, rehearsal realness" },
  { id: "rooftop", label: "Rooftop at Golden Hour", desc: "City skyline, warm light, epic scale" },
  { id: "beach", label: "Beach at Sunset", desc: "Waves, golden sand, warm atmospheric light" },
  { id: "warehouse", label: "Abandoned Warehouse", desc: "Industrial, raw, dusty shafts of light" },
  { id: "parking", label: "Multi-story Car Park", desc: "Concrete columns, neon signs, urban grit" },
  { id: "stadium", label: "Stadium / Arena", desc: "Crowd of thousands, massive stage, concert scale" },
  { id: "forest", label: "Misty Forest", desc: "Morning fog, dappled light, otherworldly nature" },
  { id: "subway", label: "Subway / Underground", desc: "Tiled walls, fluorescent lights, raw city energy" },
];

const cameraStyles = [
  { id: "closeup", label: "Intimate Close-up", desc: "Tight on face and upper body — emotion and detail" },
  { id: "wide", label: "Wide Establishing", desc: "Full body in environment — scale and context" },
  { id: "slowmo", label: "Ultra Slow Motion", desc: "120–240fps — every movement stretched in time" },
  { id: "orbit", label: "360° Orbit", desc: "Camera circles the dancer — cinematic reveal" },
  { id: "lowangle", label: "Low Angle Hero", desc: "Ground-level looking up — power and dominance" },
  { id: "drone", label: "Aerial Drone", desc: "Bird's eye descent — scale and surprise" },
  { id: "tracking", label: "Tracking Shot", desc: "Camera moves with the dancer — kinetic momentum" },
  { id: "dutch", label: "Dutch Angle", desc: "Tilted frame — tension, style, visual edge" },
  { id: "pov", label: "First-Person POV", desc: "Immersive — you are in the cypher" },
  { id: "dolly", label: "Dolly Push-In", desc: "Slow cinematic push toward the subject — drama" },
];

const vibes = [
  { id: "hype", label: "Hype / Energetic", color: "orange", desc: "Maximum energy — crowd-starter, instant dopamine hit" },
  { id: "cinematic", label: "Cinematic / Epic", color: "blue", desc: "Director-level — feels like a movie trailer" },
  { id: "underground", label: "Underground / Raw", color: "slate", desc: "No-frills authenticity — cipher realness" },
  { id: "ethereal", label: "Ethereal / Dreamy", color: "purple", desc: "Floating, soft, otherworldly emotion" },
  { id: "luxury", label: "Luxury / Editorial", color: "amber", desc: "High fashion — glossy, aspirational, polished" },
  { id: "viral", label: "Viral / TikTok Energy", color: "cyan", desc: "Hook in 2 seconds — built for the algorithm" },
  { id: "dark", label: "Dark / Moody", color: "slate", desc: "Shadows, tension, brooding artistic weight" },
  { id: "joyful", label: "Joyful / Celebration", color: "pink", desc: "Pure happiness — infectious energy, feel-good" },
];

const lightingStyles = [
  { id: "neon", label: "Neon & Cyberpunk", desc: "Cyan, magenta, electric blue — vivid night palette" },
  { id: "golden", label: "Golden Hour Magic", desc: "Warm orange-gold, long shadows, cinematic warmth" },
  { id: "strobe", label: "Club Strobe Flash", desc: "Stroboscopic freeze frames — motion and freeze" },
  { id: "softbox", label: "Studio Softbox", desc: "Even, flattering, professional studio quality" },
  { id: "backlit", label: "Dramatic Backlight", desc: "Silhouette rim light — subject glows from behind" },
  { id: "natural", label: "Natural Daylight", desc: "Raw and real — documentary authentic light" },
  { id: "smoke", label: "Haze & Fog Beam", desc: "Spotlights cut through atmospheric fog and haze" },
  { id: "uv", label: "UV / Black Light", desc: "Day-glo colors explode under ultraviolet" },
];

const aiTools = [
  { id: "kling", label: "Kling AI", badge: "bg-blue-500/20 border-blue-400/40 text-blue-300", desc: "Best for fluid motion & realistic physics" },
  { id: "runway", label: "Runway Gen-3", badge: "bg-purple-500/20 border-purple-400/40 text-purple-300", desc: "Cinematic camera moves & visual FX" },
  { id: "pika", label: "Pika 2.0", badge: "bg-pink-500/20 border-pink-400/40 text-pink-300", desc: "Fast generation, great for short clips" },
  { id: "veo3", label: "Veo 3", badge: "bg-emerald-500/20 border-emerald-400/40 text-emerald-300", desc: "Photorealistic — highest fidelity output" },
  { id: "sora", label: "Sora", badge: "bg-amber-500/20 border-amber-400/40 text-amber-300", desc: "Long clips, consistent world physics" },
];

const trendMap: Record<string, string> = {
  VIRAL: "bg-red-500/20 border-red-400/40 text-red-300",
  RISING: "bg-orange-500/20 border-orange-400/40 text-orange-300",
  TRENDING: "bg-cyan-500/20 border-cyan-400/40 text-cyan-300",
  HOT: "bg-pink-500/20 border-pink-400/40 text-pink-300",
  CLASSIC: "bg-amber-500/20 border-amber-400/40 text-amber-300",
  NICHE: "bg-purple-500/20 border-purple-400/40 text-purple-300",
  STEADY: "bg-slate-400/20 border-slate-300/30 text-slate-300",
};

const vibeColors: Record<string, string> = {
  orange: "from-orange-500/20 to-orange-500/5 border-orange-400/40 text-orange-200",
  blue: "from-blue-500/20 to-blue-500/5 border-blue-400/40 text-blue-200",
  slate: "from-slate-400/20 to-slate-400/5 border-slate-300/30 text-slate-200",
  purple: "from-purple-500/20 to-purple-500/5 border-purple-400/40 text-purple-200",
  amber: "from-amber-500/20 to-amber-500/5 border-amber-400/40 text-amber-200",
  cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-400/40 text-cyan-200",
  pink: "from-pink-500/20 to-pink-500/5 border-pink-400/40 text-pink-200",
};

// ── Prompt Builder ──────────────────────────────────────────────────────────

function buildPrompt(
  style: typeof danceStyles[0] | null,
  scene: typeof scenes[0] | null,
  camera: typeof cameraStyles[0] | null,
  vibe: typeof vibes[0] | null,
  lighting: typeof lightingStyles[0] | null,
  tool: typeof aiTools[0] | null,
  customNotes: string
): string {
  if (!style && !scene && !camera && !vibe && !lighting) return "";

  const parts: string[] = [];

  const danceLine = style
    ? `A ${style.label} dancer performs with explosive skill and authentic style — ${style.desc}.`
    : "A skilled dancer performs with explosive energy and authentic style.";
  parts.push(danceLine);

  if (scene) {
    parts.push(`The setting is ${scene.label}: ${scene.desc}.`);
  }

  if (vibe) {
    const vibeDescriptions: Record<string, string> = {
      hype: "The energy is maximum — every frame should feel like a drop, infectious and impossible to ignore.",
      cinematic: "The production quality is cinematic — this feels like a music video or movie trailer, not a phone clip.",
      underground: "The aesthetic is raw and unpolished — authentic cipher energy, no artifice, real street credibility.",
      ethereal: "The mood is dreamy and otherworldly — movements feel weightless and emotionally charged.",
      luxury: "The visual language is high fashion and editorial — glossy, aspirational, every frame magazine-worthy.",
      viral: "Designed to hook within 2 seconds — fast cut energy, recognisable movement, built for the algorithm.",
      dark: "The mood is dark and brooding — shadows dominate, tension crackles, artistic weight in every frame.",
      joyful: "Pure joy and celebration radiates from every movement — infectious happiness, feel-good energy.",
    };
    parts.push(vibeDescriptions[vibe.id] || `The overall vibe is ${vibe.label}.`);
  }

  if (camera) {
    const cameraDescriptions: Record<string, string> = {
      closeup: "Frame as an intimate close-up — tight on the face and upper body, capturing raw emotion and every detail of the performance.",
      wide: "Wide establishing shot — full body visible with the environment providing context and scale.",
      slowmo: "Shot at ultra slow motion (120–240fps) — every muscle movement, fabric ripple, and sweat droplet stretched in cinematic time.",
      orbit: "A smooth 360-degree orbital camera move circles the dancer continuously, revealing them from all angles in a cinematic sweep.",
      lowangle: "Low angle hero shot — camera sits close to the ground looking up, making the dancer appear powerful and dominant.",
      drone: "Aerial drone camera descends from above and slowly reveals the dancer from a birds-eye perspective.",
      tracking: "The camera tracks dynamically with the dancer — moving laterally and forward, matching their kinetic energy.",
      dutch: "Dutch angle framing — the camera is deliberately tilted, adding tension and visual style to the composition.",
      pov: "First-person POV immersion — the viewer is inside the cypher, surrounded by the performance.",
      dolly: "Slow cinematic dolly push-in — the camera gradually moves toward the dancer, building drama and intimacy.",
    };
    parts.push(cameraDescriptions[camera.id] || `Camera: ${camera.desc}.`);
  }

  if (lighting) {
    const lightDescriptions: Record<string, string> = {
      neon: "Lighting is vivid neon — cyan, magenta, and electric blue cast dramatic colored shadows across the dancer.",
      golden: "Golden hour warmth — long orange shadows, rim-lit edges, cinematic warmth that makes skin glow.",
      strobe: "Club strobe lighting — staccato freeze frames of movement, the darkness between flashes charged with tension.",
      softbox: "Clean professional studio softbox lighting — even, flattering, broadcast-quality.",
      backlit: "Dramatic rim backlight — the dancer is silhouetted with a glowing corona of light behind them.",
      natural: "Natural daylight — honest, documentary, raw and unmanipulated.",
      smoke: "Spotlights cut through atmospheric haze and fog, the beams of light visible and dramatic.",
      uv: "UV black light — day-glo colors explode, whites become electric, everything glows.",
    };
    parts.push(lightDescriptions[lighting.id] || `Lighting: ${lighting.desc}.`);
  }

  parts.push("The dancer's movements are technically precise yet emotionally authentic — every transition is intentional, every freeze lands with impact.");
  parts.push("Capture the full dynamic range from explosive bursts to controlled stillness. The choreography should feel spontaneous yet masterfully composed.");

  if (tool) {
    const toolHints: Record<string, string> = {
      kling: "Optimised for Kling AI — prioritise realistic cloth physics, body weight, and fluid motion dynamics.",
      runway: "Optimised for Runway Gen-3 — emphasise cinematic camera motion and visual atmosphere.",
      pika: "Optimised for Pika 2.0 — clean short clip, tight composition, high visual contrast.",
      veo3: "Optimised for Veo 3 — push for maximum photorealism, accurate lighting physics, and ultra-detailed texture.",
      sora: "Optimised for Sora — build a consistent world with stable physics throughout the clip duration.",
    };
    if (toolHints[tool.id]) parts.push(toolHints[tool.id]);
  }

  if (customNotes.trim()) {
    parts.push(`Additional direction: ${customNotes.trim()}`);
  }

  parts.push("Cinematic production quality. No amateur or phone-video aesthetic.");

  return parts.join(" ");
}

// ── Section Component ───────────────────────────────────────────────────────

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-primary" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">{title}</span>
        <div className="flex-1 h-px bg-border/60" />
      </div>
      {children}
    </div>
  );
}

// ── Selectable Pill ─────────────────────────────────────────────────────────

function Pill({
  label,
  selected,
  onClick,
  extra,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  extra?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-left px-3 py-2 border text-[11px] tracking-wide transition-all duration-150 flex items-center gap-2",
        selected
          ? "border-primary bg-primary/20 text-primary font-bold theme-glow-box"
          : "border-border bg-card text-muted-foreground hover:border-primary/60 hover:text-foreground"
      )}
    >
      {selected && <Check className="w-3 h-3 shrink-0" />}
      <span>{label}</span>
      {extra}
    </button>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────

export function DanceStudio() {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedScene, setSelectedScene] = useState<string | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [selectedLighting, setSelectedLighting] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<string | null>("kling");
  const [customNotes, setCustomNotes] = useState("");
  const [copied, setCopied] = useState(false);

  const style = danceStyles.find((s) => s.id === selectedStyle) ?? null;
  const scene = scenes.find((s) => s.id === selectedScene) ?? null;
  const camera = cameraStyles.find((s) => s.id === selectedCamera) ?? null;
  const vibe = vibes.find((s) => s.id === selectedVibe) ?? null;
  const lighting = lightingStyles.find((s) => s.id === selectedLighting) ?? null;
  const tool = aiTools.find((s) => s.id === selectedTool) ?? null;

  const prompt = useMemo(
    () => buildPrompt(style, scene, camera, vibe, lighting, tool, customNotes),
    [style, scene, camera, vibe, lighting, tool, customNotes]
  );

  const readyCount = [selectedStyle, selectedScene, selectedCamera, selectedVibe, selectedLighting].filter(Boolean).length;

  const handleCopy = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRandom = () => {
    setSelectedStyle(danceStyles[Math.floor(Math.random() * danceStyles.length)].id);
    setSelectedScene(scenes[Math.floor(Math.random() * scenes.length)].id);
    setSelectedCamera(cameraStyles[Math.floor(Math.random() * cameraStyles.length)].id);
    setSelectedVibe(vibes[Math.floor(Math.random() * vibes.length)].id);
    setSelectedLighting(lightingStyles[Math.floor(Math.random() * lightingStyles.length)].id);
  };

  const handleReset = () => {
    setSelectedStyle(null);
    setSelectedScene(null);
    setSelectedCamera(null);
    setSelectedVibe(null);
    setSelectedLighting(null);
    setCustomNotes("");
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <Music className="w-5 h-5 text-primary theme-glow-icon" />
          <h1 className="text-xl font-bold tracking-tight uppercase text-foreground">
            Dance Studio
          </h1>
          <Badge className="bg-primary/20 border-primary/40 text-primary text-[9px] uppercase tracking-widest">
            Prompt Generator
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Build high-converting AI dance video prompts for Kling, Runway, Pika, Veo 3 &amp; Sora — pick your style, scene, and vibe, then fire.
        </p>
      </div>

      {/* Trending Styles banner */}
      <div className="border border-border bg-card/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Trending Right Now</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {danceStyles
            .filter((s) => ["VIRAL", "TRENDING", "HOT"].includes(s.trend))
            .map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedStyle(s.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 border text-[11px] transition-all",
                  selectedStyle === s.id
                    ? "border-primary bg-primary/20 text-primary theme-glow-box"
                    : "border-border bg-card text-muted-foreground hover:border-primary/60 hover:text-foreground"
                )}
              >
                <span>{s.emoji}</span>
                <span className="font-semibold">{s.label}</span>
                <Badge className={cn("text-[8px] px-1.5 py-0 border", trendMap[s.trend])}>
                  {s.trend}
                </Badge>
              </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8">
        {/* Left: Selectors */}
        <div className="space-y-8">

          {/* Dance Style */}
          <Section title="Dance Style" icon={Flame}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {danceStyles.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedStyle(selectedStyle === s.id ? null : s.id)}
                  className={cn(
                    "text-left p-3 border transition-all duration-150 group",
                    selectedStyle === s.id
                      ? "border-primary bg-primary/15 theme-glow-box"
                      : "border-border bg-card hover:border-primary/60"
                  )}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{s.emoji}</span>
                      <span className={cn(
                        "text-[11px] font-bold uppercase tracking-wide",
                        selectedStyle === s.id ? "text-primary" : "text-foreground/80"
                      )}>
                        {s.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge className={cn("text-[8px] px-1.5 py-0 border", trendMap[s.trend])}>
                        {s.trend}
                      </Badge>
                      {selectedStyle === s.id && <Check className="w-3 h-3 text-primary" />}
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{s.desc}</p>
                </button>
              ))}
            </div>
          </Section>

          {/* Scene */}
          <Section title="Scene / Setting" icon={Video}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {scenes.map((s) => (
                <Pill
                  key={s.id}
                  label={s.label}
                  selected={selectedScene === s.id}
                  onClick={() => setSelectedScene(selectedScene === s.id ? null : s.id)}
                  extra={
                    <span className="text-[9px] text-muted-foreground ml-1 truncate">{s.desc}</span>
                  }
                />
              ))}
            </div>
          </Section>

          {/* Camera */}
          <Section title="Camera Style" icon={Zap}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {cameraStyles.map((s) => (
                <Pill
                  key={s.id}
                  label={s.label}
                  selected={selectedCamera === s.id}
                  onClick={() => setSelectedCamera(selectedCamera === s.id ? null : s.id)}
                  extra={
                    <span className="text-[9px] text-muted-foreground ml-1 truncate">{s.desc}</span>
                  }
                />
              ))}
            </div>
          </Section>

          {/* Vibe */}
          <Section title="Vibe / Mood" icon={Sparkles}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {vibes.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVibe(selectedVibe === v.id ? null : v.id)}
                  className={cn(
                    "p-3 border bg-gradient-to-b text-left transition-all duration-150",
                    selectedVibe === v.id
                      ? cn(vibeColors[v.color], "theme-glow-box")
                      : "border-border bg-card hover:border-primary/60"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-wide",
                      selectedVibe === v.id
                        ? vibeColors[v.color].split(" ").find((c) => c.startsWith("text-")) ?? "text-foreground"
                        : "text-foreground/80"
                    )}>
                      {v.label}
                    </span>
                    {selectedVibe === v.id && <Check className="w-3 h-3 text-primary" />}
                  </div>
                  <p className="text-[9px] text-muted-foreground leading-snug">{v.desc}</p>
                </button>
              ))}
            </div>
          </Section>

          {/* Lighting */}
          <Section title="Lighting Style" icon={Flame}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {lightingStyles.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setSelectedLighting(selectedLighting === l.id ? null : l.id)}
                  className={cn(
                    "p-3 border text-left transition-all duration-150",
                    selectedLighting === l.id
                      ? "border-primary bg-primary/15 text-primary theme-glow-box"
                      : "border-border bg-card hover:border-primary/60 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wide">
                      {l.label}
                    </span>
                    {selectedLighting === l.id && <Check className="w-3 h-3 shrink-0" />}
                  </div>
                  <p className="text-[9px] leading-snug opacity-70">{l.desc}</p>
                </button>
              ))}
            </div>
          </Section>

          {/* Custom Notes */}
          <Section title="Custom Direction (Optional)" icon={Wand2}>
            <textarea
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="e.g. 'The dancer wears red and white sneakers' · 'End on a freeze pose' · 'Include other dancers in the background' · 'Fast-paced edit with quick cuts'"
              rows={3}
              className="w-full bg-card border border-border text-foreground text-[12px] p-3 placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary resize-none font-mono"
            />
          </Section>
        </div>

        {/* Right: Tool selector + Output */}
        <div className="space-y-6">

          {/* AI Tool */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-[11px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Video className="w-3 h-3 text-primary" />
                AI Video Tool
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {aiTools.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTool(selectedTool === t.id ? null : t.id)}
                  className={cn(
                    "w-full text-left p-3 border transition-all flex items-center gap-3",
                    selectedTool === t.id
                      ? "border-primary bg-primary/15 theme-glow-box"
                      : "border-border bg-background hover:border-primary/60"
                  )}
                >
                  {selectedTool === t.id
                    ? <Check className="w-3 h-3 text-primary shrink-0" />
                    : <span className="w-3 h-3 shrink-0" />
                  }
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={cn("text-[10px] font-bold uppercase tracking-wide", selectedTool === t.id ? "text-primary" : "text-foreground/80")}>
                        {t.label}
                      </span>
                      <Badge className={cn("text-[8px] px-1.5 py-0 border", t.badge)}>
                        ACTIVE
                      </Badge>
                    </div>
                    <p className="text-[9px] text-muted-foreground">{t.desc}</p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Progress */}
          <Card className="border-border bg-card">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Signal Strength</span>
                <span className="text-[11px] font-bold text-primary">{readyCount}/5</span>
              </div>
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div
                    key={n}
                    className={cn(
                      "flex-1 h-1.5 transition-all duration-300",
                      n <= readyCount ? "bg-primary theme-glow-box" : "bg-border"
                    )}
                  />
                ))}
              </div>
              <div className="grid grid-cols-5 gap-1 text-[8px] text-center text-muted-foreground uppercase tracking-wide">
                <span className={selectedStyle ? "text-primary" : ""}>Style</span>
                <span className={selectedScene ? "text-primary" : ""}>Scene</span>
                <span className={selectedCamera ? "text-primary" : ""}>Cam</span>
                <span className={selectedVibe ? "text-primary" : ""}>Vibe</span>
                <span className={selectedLighting ? "text-primary" : ""}>Light</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleRandom}
              className="flex-1 flex items-center justify-center gap-2 border border-border bg-card text-muted-foreground hover:border-primary hover:text-primary py-2.5 text-[11px] uppercase tracking-wider transition-all"
            >
              <Shuffle className="w-3.5 h-3.5" />
              Random
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 flex items-center justify-center gap-2 border border-border bg-card text-muted-foreground hover:border-destructive hover:text-destructive py-2.5 text-[11px] uppercase tracking-wider transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Generated Prompt */}
          <Card className={cn(
            "border transition-all duration-300",
            prompt ? "border-primary/40 bg-primary/5 theme-glow-box" : "border-border bg-card"
          )}>
            <CardHeader className="pb-2">
              <CardTitle className="text-[11px] uppercase tracking-widest text-muted-foreground flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-3 h-3 text-primary" />
                  Generated Prompt
                </div>
                {prompt && (
                  <Badge className="bg-primary/20 border-primary/40 text-primary text-[8px]">
                    READY TO FIRE
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="min-h-[180px] bg-background border border-border p-3 text-[11px] font-mono text-foreground/80 leading-relaxed">
                {prompt || (
                  <span className="text-muted-foreground/40 italic">
                    Select a dance style to start building your prompt...
                  </span>
                )}
              </div>
              {prompt && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-3 border text-[12px] uppercase tracking-wider font-bold transition-all duration-200",
                    copied
                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                      : "border-primary bg-primary/20 text-primary hover:bg-primary/30 theme-glow-box"
                  )}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied — Paste into your AI tool
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Prompt
                    </>
                  )}
                </button>
              )}
            </CardContent>
          </Card>

          {/* Tip */}
          {prompt && tool && (
            <div className="border border-amber-400/20 bg-amber-500/5 p-3">
              <p className="text-[10px] text-amber-200/70 leading-relaxed">
                <span className="font-bold text-amber-300 uppercase tracking-wide">Pro tip · </span>
                This prompt is optimised for <span className="text-amber-300">{tool.label}</span>.
                For best results, set duration to 5–8s and enable motion strength at max.
                Add your reference image if the tool supports it.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
