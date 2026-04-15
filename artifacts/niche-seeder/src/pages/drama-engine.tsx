import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Copy,
  Sparkles,
  Film,
  MessageSquare,
  Camera,
  Volume2,
  Zap,
  ChevronDown,
  BookOpen,
  Users,
  AlertCircle,
  Download,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useSearch } from "wouter";

const BASE = () => import.meta.env.BASE_URL.replace(/\/$/, "");

type DramaCharacter = {
  id: number;
  name: string;
  role: string;
  age: string;
  appearance: string;
  personality: string;
};

type SeriesDetail = {
  id: number;
  title: string;
  genre: string;
  tone: string;
  setting: string;
  premise: string;
  visualStyle: string;
  characters: DramaCharacter[];
  episodes: Array<{ id: number; episodeNumber: number; title: string; mainConflict: string }>;
};

type ManualChar = {
  name: string;
  role: string;
  age: string;
  appearance: string;
  personality: string;
};

type ShotDialogue = { character: string; line: string };

type Shot = {
  number: number;
  type: string;
  setting: string;
  charactersPresent: string[];
  action: string;
  dialogue: ShotDialogue[];
  cameraAngle: string;
  lighting: string;
  sound: string;
  emotionalBeat: string;
  imagePrompt: string;
};

type SceneResult = {
  sceneTitle: string;
  sceneLogline: string;
  openingHook: string;
  emotionalArc: string;
  shots: Shot[];
  captionHook: string;
  viralAngle: string;
  nextEpisodeTeaser: string;
};

const SCENE_PURPOSES = ["Opening Hook", "Confrontation", "Revelation", "Climax", "Resolution", "Twist", "Romance", "Betrayal"];
const DIALOGUE_LEVELS = ["None", "Minimal", "Moderate", "Heavy"];
const ROLES = ["Protagonist", "Antagonist", "Love Interest", "Mentor", "Supporting", "Villain"];
const VISUAL_STYLES = ["Realistic 3D", "Hyper-realistic CGI", "Stylized 3D Anime", "Cinematic Live-Action Look", "Oil Painting Style", "Neon Noir 3D"];

const SHOT_COLORS: Record<string, string> = {
  "Establishing Shot": "text-blue-400 border-blue-500/30 bg-blue-500/5",
  "Close-Up": "text-red-400 border-red-500/30 bg-red-500/5",
  "Two-Shot": "text-emerald-400 border-emerald-500/30 bg-emerald-500/5",
  "Reaction Shot": "text-amber-400 border-amber-500/30 bg-amber-500/5",
  "Insert Shot": "text-purple-400 border-purple-500/30 bg-purple-500/5",
  "Over-the-Shoulder": "text-cyan-400 border-cyan-500/30 bg-cyan-500/5",
  "Wide": "text-blue-400 border-blue-500/30 bg-blue-500/5",
  "POV": "text-pink-400 border-pink-500/30 bg-pink-500/5",
};

function getShotColor(type: string) {
  for (const key of Object.keys(SHOT_COLORS)) {
    if (type.toLowerCase().includes(key.toLowerCase())) return SHOT_COLORS[key];
  }
  return "text-muted-foreground border-border bg-secondary/20";
}

export function DramaEngine() {
  const { toast } = useToast();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const seriesIdParam = params.get("seriesId");
  const episodeIdParam = params.get("episodeId");

  const [useBible, setUseBible] = useState(!!seriesIdParam);
  const [seriesList, setSeriesList] = useState<Array<{ id: number; title: string; genre: string }>>([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState<number | null>(seriesIdParam ? parseInt(seriesIdParam) : null);
  const [seriesDetail, setSeriesDetail] = useState<SeriesDetail | null>(null);
  const [selectedCharIds, setSelectedCharIds] = useState<number[]>([]);
  const [selectedEpId, setSelectedEpId] = useState<number | null>(episodeIdParam ? parseInt(episodeIdParam) : null);

  const [manualChars, setManualChars] = useState<ManualChar[]>([
    { name: "", role: "Protagonist", age: "", appearance: "", personality: "" },
  ]);

  const [sceneSettings, setSceneSettings] = useState({
    location: "",
    conflict: "",
    emotionalBeat: "Fury",
    scenePurpose: "Confrontation",
    shotCount: 6,
    dialogueLevel: "Moderate",
    visualStyle: "Realistic 3D",
  });

  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<SceneResult | null>(null);
  const [expandedShot, setExpandedShot] = useState<number | null>(null);

  useEffect(() => {
    if (useBible) fetchSeriesList();
  }, [useBible]);

  useEffect(() => {
    if (selectedSeriesId) fetchSeriesDetail(selectedSeriesId);
  }, [selectedSeriesId]);

  async function fetchSeriesList() {
    try {
      const r = await fetch(`${BASE()}/api/drama-series`);
      if (!r.ok) return;
      const data = await r.json();
      if (Array.isArray(data)) setSeriesList(data);
    } catch { /* silent */ }
  }

  async function fetchSeriesDetail(id: number) {
    try {
      const r = await fetch(`${BASE()}/api/drama-series/${id}`);
      const data: SeriesDetail = await r.json();
      setSeriesDetail(data);
      setSelectedCharIds(data.characters.map((c) => c.id));
      if (episodeIdParam) {
        const ep = data.episodes.find((e) => e.id === parseInt(episodeIdParam));
        if (ep) {
          setSceneSettings((s) => ({
            ...s,
            conflict: ep.mainConflict,
            location: data.setting,
            visualStyle: data.visualStyle,
          }));
        }
      } else {
        setSceneSettings((s) => ({
          ...s,
          location: s.location || data.setting,
          visualStyle: data.visualStyle,
        }));
      }
    } catch { /* silent */ }
  }

  function toggleChar(id: number) {
    setSelectedCharIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function copyText(text: string, label: string) {
    navigator.clipboard.writeText(text).then(() =>
      toast({ title: `${label} copied` })
    );
  }

  function copyAllPrompts() {
    if (!result) return;
    const text = result.shots
      .map((s) => `=== SHOT ${s.number}: ${s.type.toUpperCase()} ===\n${s.imagePrompt}`)
      .join("\n\n");
    navigator.clipboard.writeText(text).then(() =>
      toast({ title: `All ${result.shots.length} image prompts copied` })
    );
  }

  function downloadPDF() {
    if (!result) return;
    const seriesInfo = useBible && seriesDetail
      ? `<p style="margin:0 0 4px"><strong>Series:</strong> ${seriesDetail.title} (${seriesDetail.genre})</p>`
      : "";
    const episodeInfo = selectedEpId && seriesDetail
      ? `<p style="margin:0 0 4px"><strong>Episode:</strong> ${seriesDetail.episodes.find(e => e.id === selectedEpId)?.title ?? ""}</p>`
      : "";

    const shotsHtml = result.shots.map((shot) => {
      const dialogueHtml = shot.dialogue.length > 0
        ? `<div style="margin:10px 0;padding:8px 12px;border-left:3px solid #dc2626;background:#fff5f5;">
            <div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#888;margin-bottom:6px;">Dialogue</div>
            ${shot.dialogue.map(d => `<div style="margin-bottom:4px;"><strong style="color:#dc2626">${d.character}:</strong> <em>"${d.line}"</em></div>`).join("")}
          </div>`
        : "";
      return `
        <div style="page-break-inside:avoid;margin-bottom:24px;border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;">
          <div style="background:#1f2937;color:#fff;padding:10px 14px;display:flex;align-items:center;gap:10px;">
            <span style="font-size:22px;font-weight:900;opacity:.3;min-width:28px;text-align:center">${shot.number}</span>
            <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;border:1px solid #4b5563;padding:2px 8px;border-radius:3px">${shot.type}</span>
            <span style="font-size:10px;color:#9ca3af">${shot.charactersPresent.join(", ")}</span>
            <span style="margin-left:auto;font-size:10px;color:#6b7280;font-style:italic">${shot.emotionalBeat}</span>
          </div>
          <div style="padding:12px 14px;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;font-size:11px;">
              <div><span style="font-size:9px;text-transform:uppercase;letter-spacing:.08em;color:#6b7280;display:block;margin-bottom:2px">Setting</span>${shot.setting}</div>
              <div><span style="font-size:9px;text-transform:uppercase;letter-spacing:.08em;color:#6b7280;display:block;margin-bottom:2px">Camera</span>${shot.cameraAngle}</div>
              <div><span style="font-size:9px;text-transform:uppercase;letter-spacing:.08em;color:#6b7280;display:block;margin-bottom:2px">Lighting</span>${shot.lighting}</div>
              <div><span style="font-size:9px;text-transform:uppercase;letter-spacing:.08em;color:#6b7280;display:block;margin-bottom:2px">Sound</span>${shot.sound}</div>
            </div>
            <div style="font-size:11px;margin-bottom:8px;"><span style="font-size:9px;text-transform:uppercase;letter-spacing:.08em;color:#6b7280;display:block;margin-bottom:2px">Action</span>${shot.action}</div>
            ${dialogueHtml}
            <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:4px;padding:10px;margin-top:10px;">
              <div style="font-size:9px;text-transform:uppercase;letter-spacing:.08em;color:#dc2626;font-weight:700;margin-bottom:6px">Image Prompt</div>
              <div style="font-size:11px;line-height:1.6;font-family:monospace;">${shot.imagePrompt}</div>
            </div>
          </div>
        </div>`;
    }).join("");

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${result.sceneTitle}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 12px; color: #111; margin: 0; padding: 32px; max-width: 860px; margin: 0 auto; }
    @media print {
      body { padding: 16px; }
      .no-print { display: none !important; }
      @page { margin: 20mm; size: A4; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="background:#1d4ed8;color:#fff;padding:10px 16px;margin-bottom:20px;border-radius:6px;display:flex;align-items:center;justify-content:space-between;">
    <span style="font-size:13px;font-weight:600;">Save as PDF: press Ctrl+P (or Cmd+P) → choose "Save as PDF"</span>
    <button onclick="window.print()" style="background:#fff;color:#1d4ed8;border:none;padding:6px 16px;border-radius:4px;font-weight:700;cursor:pointer;font-size:12px;">Print / Save PDF</button>
  </div>

  <div style="margin-bottom:24px;border-bottom:3px solid #dc2626;padding-bottom:16px;">
    <div style="font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:#888;margin-bottom:6px">Drama Engine — Scene Export</div>
    <h1 style="margin:0 0 6px;font-size:24px;font-weight:900;text-transform:uppercase;letter-spacing:-.02em">${result.sceneTitle}</h1>
    <p style="margin:0 0 10px;font-size:14px;font-style:italic;color:#4b5563;">"${result.sceneLogline}"</p>
    ${seriesInfo}${episodeInfo}
    <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:8px;">
      <span style="font-size:10px;background:#f3f4f6;padding:3px 8px;border-radius:3px">${sceneSettings.scenePurpose}</span>
      <span style="font-size:10px;background:#f3f4f6;padding:3px 8px;border-radius:3px">${result.shots.length} Shots</span>
      <span style="font-size:10px;background:#f3f4f6;padding:3px 8px;border-radius:3px">${sceneSettings.dialogueLevel} Dialogue</span>
      <span style="font-size:10px;background:#f3f4f6;padding:3px 8px;border-radius:3px">${sceneSettings.visualStyle}</span>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;padding:14px;background:#f9fafb;border-radius:6px;font-size:11px;">
    <div><strong style="display:block;font-size:9px;text-transform:uppercase;letter-spacing:.08em;color:#6b7280;margin-bottom:4px">Opening Hook</strong>${result.openingHook}</div>
    <div><strong style="display:block;font-size:9px;text-transform:uppercase;letter-spacing:.08em;color:#6b7280;margin-bottom:4px">Emotional Arc</strong>${result.emotionalArc}</div>
    <div><strong style="display:block;font-size:9px;text-transform:uppercase;letter-spacing:.08em;color:#6b7280;margin-bottom:4px">Viral Caption Hook</strong><span style="font-size:13px;font-weight:700;">${result.captionHook}</span></div>
    <div><strong style="display:block;font-size:9px;text-transform:uppercase;letter-spacing:.08em;color:#6b7280;margin-bottom:4px">Viral Angle</strong>${result.viralAngle}</div>
  </div>

  <h2 style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#6b7280;margin:0 0 14px;font-weight:700;">Shot Breakdown</h2>

  ${shotsHtml}

  ${result.nextEpisodeTeaser ? `
  <div style="margin-top:24px;border:1px solid #f59e0b;background:#fffbeb;padding:14px;border-radius:6px;">
    <div style="font-size:9px;text-transform:uppercase;letter-spacing:.08em;color:#d97706;font-weight:700;margin-bottom:6px">Next Episode Teaser</div>
    <p style="margin:0;font-style:italic;font-size:13px;">"${result.nextEpisodeTeaser}"</p>
  </div>` : ""}
</body>
</html>`;

    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  }

  async function generate() {
    const characters = useBible && seriesDetail
      ? seriesDetail.characters.filter((c) => selectedCharIds.includes(c.id))
      : manualChars.filter((c) => c.name.trim());

    if (characters.length === 0) {
      toast({ title: "Add at least one character", variant: "destructive" });
      return;
    }
    if (!sceneSettings.conflict.trim() || !sceneSettings.location.trim()) {
      toast({ title: "Fill in location and conflict", variant: "destructive" });
      return;
    }

    setGenerating(true);
    setResult(null);
    try {
      const payload = {
        series: useBible && seriesDetail ? {
          title: seriesDetail.title,
          genre: seriesDetail.genre,
          tone: seriesDetail.tone,
          setting: seriesDetail.setting,
          premise: seriesDetail.premise,
          visualStyle: seriesDetail.visualStyle,
        } : null,
        characters,
        sceneSettings,
        episodeId: selectedEpId,
      };
      const r = await fetch(`${BASE()}/api/drama-engine/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error(await r.text());
      const data = await r.json();
      setResult(data);
      setTimeout(() => {
        document.getElementById("drama-result")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      toast({ title: "Generation failed", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  }

  function updateManualChar(i: number, field: keyof ManualChar, value: string) {
    setManualChars((prev) => prev.map((c, idx) => idx === i ? { ...c, [field]: value } : c));
  }

  function addManualChar() {
    setManualChars((prev) => [...prev, { name: "", role: "Supporting", age: "", appearance: "", personality: "" }]);
  }

  function removeManualChar(i: number) {
    setManualChars((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-black uppercase tracking-tight">Drama Engine</h1>
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider">AI Scene Generator</Badge>
          </div>
          <p className="text-sm text-muted-foreground font-mono">
            Generate viral drama scenes with shot-by-shot breakdowns and image prompts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 items-start">

        {/* Left Panel: Config */}
        <div className="space-y-4">

          {/* Story Bible Toggle */}
          <div className="border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest">Story Bible</span>
              </div>
              <button
                onClick={() => setUseBible(!useBible)}
                className={cn(
                  "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                  useBible ? "bg-primary" : "bg-secondary"
                )}
              >
                <span className={cn("inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform", useBible ? "translate-x-4" : "translate-x-0.5")} />
              </button>
            </div>
            {useBible ? (
              <div className="space-y-3">
                <select
                  value={selectedSeriesId ?? ""}
                  onChange={(e) => { setSelectedSeriesId(parseInt(e.target.value)); setSelectedCharIds([]); setSeriesDetail(null); }}
                  className="w-full bg-background border border-border px-3 py-2 text-xs font-mono focus:outline-none focus:border-primary"
                >
                  <option value="">Select a series...</option>
                  {seriesList.map((s) => <option key={s.id} value={s.id}>{s.title} ({s.genre})</option>)}
                </select>

                {seriesDetail && (
                  <>
                    {/* Episode selector */}
                    {seriesDetail.episodes.length > 0 && (
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Episode (optional)</label>
                        <select
                          value={selectedEpId ?? ""}
                          onChange={(e) => {
                            const id = e.target.value ? parseInt(e.target.value) : null;
                            setSelectedEpId(id);
                            if (id) {
                              const ep = seriesDetail.episodes.find((x) => x.id === id);
                              if (ep) setSceneSettings((s) => ({ ...s, conflict: ep.mainConflict }));
                            }
                          }}
                          className="w-full bg-background border border-border px-3 py-2 text-xs font-mono focus:outline-none focus:border-primary"
                        >
                          <option value="">No episode selected</option>
                          {seriesDetail.episodes.map((ep) => (
                            <option key={ep.id} value={ep.id}>EP {ep.episodeNumber}: {ep.title}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Character selector */}
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5 flex items-center gap-1.5">
                        <Users className="w-3 h-3" /> Characters in this scene
                      </label>
                      <div className="space-y-1">
                        {seriesDetail.characters.map((char) => (
                          <label key={char.id} className="flex items-center gap-2.5 cursor-pointer group py-1">
                            <input
                              type="checkbox"
                              checked={selectedCharIds.includes(char.id)}
                              onChange={() => toggleChar(char.id)}
                              className="accent-primary"
                            />
                            <span className="text-xs font-mono text-foreground/80 group-hover:text-foreground">{char.name}</span>
                            <span className="text-[9px] text-muted-foreground uppercase tracking-wider">{char.role}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <p className="text-[10px] text-muted-foreground font-mono">Use manually entered characters below.</p>
            )}
          </div>

          {/* Manual Characters */}
          {!useBible && (
            <div className="border border-border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" /> Characters
                </span>
                <button onClick={addManualChar} className="text-[10px] text-primary hover:underline font-mono">+ Add</button>
              </div>
              {manualChars.map((char, i) => (
                <div key={i} className="border border-border p-3 space-y-2 relative">
                  {manualChars.length > 1 && (
                    <button onClick={() => removeManualChar(i)} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive">
                      <AlertCircle className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <input value={char.name} onChange={(e) => updateManualChar(i, "name", e.target.value)} className="bg-background border border-border px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-primary" placeholder="Name *" />
                    <select value={char.role} onChange={(e) => updateManualChar(i, "role", e.target.value)} className="bg-background border border-border px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-primary">
                      {ROLES.map((r) => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <input value={char.age} onChange={(e) => updateManualChar(i, "age", e.target.value)} className="w-full bg-background border border-border px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-primary" placeholder="Age (e.g. Late 20s)" />
                  <Textarea value={char.appearance} onChange={(e) => updateManualChar(i, "appearance", e.target.value)} className="text-xs font-mono resize-none rounded-none" rows={2} placeholder="Appearance: skin tone, hair, clothing, accessories..." />
                  <Textarea value={char.personality} onChange={(e) => updateManualChar(i, "personality", e.target.value)} className="text-xs font-mono resize-none rounded-none" rows={1} placeholder="Personality..." />
                </div>
              ))}
            </div>
          )}

          {/* Scene Settings */}
          <div className="border border-border bg-card p-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-1">
              <Film className="w-4 h-4 text-primary" /> Scene Settings
            </span>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Location *</label>
              <input value={sceneSettings.location} onChange={(e) => setSceneSettings((s) => ({ ...s, location: e.target.value }))} className="w-full bg-background border border-border px-3 py-2 text-xs font-mono focus:outline-none focus:border-primary" placeholder="e.g. Upscale restaurant, warm amber lighting" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Central Conflict *</label>
              <Textarea value={sceneSettings.conflict} onChange={(e) => setSceneSettings((s) => ({ ...s, conflict: e.target.value }))} className="text-xs font-mono resize-none rounded-none" rows={2} placeholder="e.g. A mother confronts her mother-in-law for striking her child in public" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Scene Purpose</label>
                <select value={sceneSettings.scenePurpose} onChange={(e) => setSceneSettings((s) => ({ ...s, scenePurpose: e.target.value }))} className="w-full bg-background border border-border px-3 py-2 text-xs font-mono focus:outline-none focus:border-primary">
                  {SCENE_PURPOSES.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Emotional Beat</label>
                <input value={sceneSettings.emotionalBeat} onChange={(e) => setSceneSettings((s) => ({ ...s, emotionalBeat: e.target.value }))} className="w-full bg-background border border-border px-3 py-2 text-xs font-mono focus:outline-none focus:border-primary" placeholder="e.g. Fury, Shock, Betrayal" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Dialogue</label>
                <select value={sceneSettings.dialogueLevel} onChange={(e) => setSceneSettings((s) => ({ ...s, dialogueLevel: e.target.value }))} className="w-full bg-background border border-border px-3 py-2 text-xs font-mono focus:outline-none focus:border-primary">
                  {DIALOGUE_LEVELS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Shots: {sceneSettings.shotCount}</label>
                <input type="range" min={4} max={10} value={sceneSettings.shotCount} onChange={(e) => setSceneSettings((s) => ({ ...s, shotCount: parseInt(e.target.value) }))} className="w-full mt-1.5 accent-primary" />
              </div>
            </div>
            {!useBible && (
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Visual Style</label>
                <select value={sceneSettings.visualStyle} onChange={(e) => setSceneSettings((s) => ({ ...s, visualStyle: e.target.value }))} className="w-full bg-background border border-border px-3 py-2 text-xs font-mono focus:outline-none focus:border-primary">
                  {VISUAL_STYLES.map((v) => <option key={v}>{v}</option>)}
                </select>
              </div>
            )}
          </div>

          <Button onClick={generate} disabled={generating} className="w-full gap-2 py-3">
            {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating Scene...</> : <><Zap className="w-4 h-4" /> Generate Scene</>}
          </Button>
        </div>

        {/* Right Panel: Results */}
        <div>
          {!result && !generating && (
            <div className="border border-dashed border-border bg-card/40 flex flex-col items-center justify-center p-16 text-center min-h-[400px]">
              <Film className="w-12 h-12 text-muted-foreground/40 mb-4" />
              <p className="text-sm text-muted-foreground">Your scene will appear here</p>
              <p className="text-xs text-muted-foreground/60 font-mono mt-1">Configure your characters and scene settings, then generate</p>
            </div>
          )}

          {generating && (
            <div className="border border-primary/20 bg-card flex flex-col items-center justify-center p-16 text-center min-h-[400px]">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-sm font-mono text-primary">Writing your scene...</p>
              <p className="text-xs text-muted-foreground mt-1">Building {sceneSettings.shotCount} shots with image prompts</p>
            </div>
          )}

          {result && (
            <div id="drama-result" className="space-y-4">

              {/* Scene Header */}
              <div className="border border-border bg-card overflow-hidden">
                <div className="bg-gradient-to-r from-red-950/40 to-background border-b border-border p-5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent" />
                  <div className="relative z-10">
                    <div className="flex gap-2 mb-3 flex-wrap">
                      <Badge variant="outline" className="text-[9px] uppercase tracking-wider bg-background">Drama Scene</Badge>
                      <Badge variant="outline" className="text-[9px] uppercase tracking-wider bg-background border-red-500/30 text-red-400">{sceneSettings.scenePurpose}</Badge>
                      <Badge variant="outline" className="text-[9px] uppercase tracking-wider bg-background">{result.shots.length} shots</Badge>
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-2">{result.sceneTitle}</h2>
                    <p className="text-base font-serif italic text-muted-foreground border-l-2 border-red-500 pl-3 py-0.5">"{result.sceneLogline}"</p>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Opening Hook</span>
                    <p className="text-foreground/80">{result.openingHook}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Emotional Arc</span>
                    <p className="text-foreground/80">{result.emotionalArc}</p>
                  </div>
                </div>
              </div>

              {/* Caption Hook */}
              <div className="border border-primary/30 bg-primary/5 p-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-primary mb-1.5">Viral Caption Hook</p>
                  <p className="text-lg font-bold">{result.captionHook}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-1">{result.viralAngle}</p>
                </div>
                <button onClick={() => copyText(result.captionHook, "Caption")} className="text-muted-foreground hover:text-primary shrink-0">
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              {/* Shots */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Camera className="w-3.5 h-3.5" /> Shot Breakdown
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyAllPrompts}
                      className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground hover:text-primary border border-border hover:border-primary/50 px-2.5 py-1 transition-colors"
                      title="Copy all image prompts to clipboard"
                    >
                      <ClipboardList className="w-3 h-3" /> Copy All Prompts
                    </button>
                    <button
                      onClick={downloadPDF}
                      className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground hover:text-primary border border-border hover:border-primary/50 px-2.5 py-1 transition-colors"
                      title="Download full scene as PDF"
                    >
                      <Download className="w-3 h-3" /> Download PDF
                    </button>
                  </div>
                </div>
                {result.shots.map((shot) => {
                  const isOpen = expandedShot === shot.number;
                  const colorClass = getShotColor(shot.type);
                  return (
                    <div key={shot.number} className="border border-border bg-card overflow-hidden">
                      <button
                        className="w-full text-left p-4 flex items-start gap-4 hover:bg-secondary/20 transition-colors"
                        onClick={() => setExpandedShot(isOpen ? null : shot.number)}
                      >
                        <span className="text-3xl font-black text-foreground/10 leading-none shrink-0 w-8 text-center">
                          {shot.number}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={cn("text-[9px] font-bold uppercase tracking-widest border px-2 py-0.5", colorClass)}>{shot.type}</span>
                            {shot.charactersPresent.map((c) => (
                              <span key={c} className="text-[9px] text-muted-foreground font-mono">{c}</span>
                            ))}
                          </div>
                          <p className="text-xs font-mono text-foreground/80 truncate">{shot.action}</p>
                          {shot.dialogue.length > 0 && (
                            <p className="text-[11px] text-muted-foreground font-mono mt-0.5 italic truncate">
                              "{shot.dialogue[0].character}: {shot.dialogue[0].line}"
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={(e) => { e.stopPropagation(); copyText(shot.imagePrompt, `Shot ${shot.number} prompt`); }}
                            className="text-muted-foreground hover:text-primary"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
                        </div>
                      </button>

                      {isOpen && (
                        <div className="border-t border-border p-4 space-y-4 bg-secondary/10">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                            <div>
                              <span className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Setting</span>
                              <p className="text-foreground/80">{shot.setting}</p>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1 flex items-center gap-1"><Camera className="w-3 h-3" /> Camera</span>
                              <p className="text-foreground/80">{shot.cameraAngle}</p>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Lighting</span>
                              <p className="text-foreground/80">{shot.lighting}</p>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1 flex items-center gap-1"><Volume2 className="w-3 h-3" /> Sound</span>
                              <p className="text-foreground/80">{shot.sound}</p>
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Action</span>
                            <p className="text-xs font-mono text-foreground/80">{shot.action}</p>
                          </div>
                          {shot.dialogue.length > 0 && (
                            <div>
                              <span className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-2 flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Dialogue</span>
                              <div className="space-y-1.5">
                                {shot.dialogue.map((d, i) => (
                                  <div key={i} className="flex items-start gap-2 text-xs font-mono">
                                    <span className="text-primary shrink-0 font-bold">{d.character}:</span>
                                    <span className="text-foreground/80 italic">"{d.line}"</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <div>
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Emotional Beat</span>
                            <p className="text-xs font-mono text-foreground/70">{shot.emotionalBeat}</p>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Image Prompt</span>
                              <button onClick={() => copyText(shot.imagePrompt, `Shot ${shot.number} prompt`)} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary font-mono">
                                <Copy className="w-3 h-3" /> Copy
                              </button>
                            </div>
                            <p className="text-[11px] font-mono text-foreground/70 bg-background border border-border p-3 leading-relaxed">{shot.imagePrompt}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Next Episode Teaser */}
              {result.nextEpisodeTeaser && (
                <div className="border border-amber-500/20 bg-amber-500/5 p-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-amber-500 mb-1.5">Next Episode Teaser</p>
                    <p className="text-sm font-mono text-foreground/80 italic">"{result.nextEpisodeTeaser}"</p>
                  </div>
                  <button onClick={() => copyText(result.nextEpisodeTeaser, "Teaser")} className="text-muted-foreground hover:text-amber-400 shrink-0">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
