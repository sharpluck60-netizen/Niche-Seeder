import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Plus,
  Trash2,
  ChevronLeft,
  Users,
  Clapperboard,
  Film,
  Sparkles,
  AlertCircle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

const BASE = () => import.meta.env.BASE_URL.replace(/\/$/, "");

type DramaSeries = {
  id: number;
  title: string;
  genre: string;
  tone: string;
  setting: string;
  premise: string;
  visualStyle: string;
  createdAt: string;
  characters?: DramaCharacter[];
  episodes?: DramaEpisode[];
};

type DramaCharacter = {
  id: number;
  seriesId: number;
  name: string;
  role: string;
  age: string;
  appearance: string;
  personality: string;
  relationships: Array<{ character: string; relation: string }>;
};

type DramaEpisode = {
  id: number;
  seriesId: number;
  episodeNumber: number;
  title: string;
  premise: string;
  mainConflict: string;
  resolution: string;
  cliffhanger: string;
  status: string;
  sceneData: unknown;
};

const SETTING_EXAMPLES = [
  { label: "Lagos luxury", value: "Upscale Lagos restaurants, luxury penthouse apartments, corporate boardrooms, gated estates" },
  { label: "Atlanta church & hood", value: "Atlanta suburban homes, megachurch halls, neighborhood barbershop and beauty salon, courthouse" },
  { label: "Nairobi elite", value: "Nairobi gated community estates, rooftop lounges, private hospital corridors, Westlands boutiques" },
  { label: "London diaspora", value: "London Nigerian diaspora households, Peckham market, family-owned restaurant, council estate vs. mansion" },
  { label: "Houston drama", value: "Houston luxury condos, upscale malls, church parking lots, barbeque spots and hospital waiting rooms" },
  { label: "Accra coastal", value: "Accra beach resort villas, government ministry offices, mansion compound, outdoor market and courtroom" },
];

const PREMISE_EXAMPLES = [
  { label: "Mother-in-law war", value: "A young mother marries into Lagos old money and must fight her toxic mother-in-law who will do anything to destroy her marriage and take her child." },
  { label: "Secret second family", value: "When a hardworking woman discovers her husband has been hiding a second family across town, she must choose between revenge and protecting her children — all while rebuilding herself." },
  { label: "Return & reclaim", value: "After 10 years abroad, a woman returns home to reclaim the inheritance her own family stole from her — but the man standing in her way is the one she never stopped loving." },
  { label: "Sisters vs. same man", value: "Two sisters fall for the same man without knowing it. When the truth comes out, it tears the family apart — and forces them to decide whether blood or love comes first." },
  { label: "Pastor's wife secret", value: "A respected church first lady discovers her pastor husband's hidden affairs and corrupt dealings. She must decide how far she will go to protect her reputation — and her soul." },
  { label: "Corporate comeback", value: "After being set up and fired by her jealous colleague, a woman rebuilds herself into a CEO from scratch — only to find that same woman is now her employee begging for mercy." },
];

const GENRES = ["Drama", "Telenovela", "Thriller", "Romance", "Family Drama", "Workplace Drama", "Crime Drama", "Supernatural Drama"];
const TONES = ["Intense & Emotional", "Dark & Gritty", "Uplifting & Hopeful", "Mysterious & Suspenseful", "Passionate & Romantic", "Tense & Unpredictable"];
const VISUAL_STYLES = ["Realistic 3D", "Hyper-realistic CGI", "Stylized 3D Anime", "Cinematic Live-Action Look", "Oil Painting Style", "Neon Noir 3D"];
const ROLES = ["Protagonist", "Antagonist", "Love Interest", "Mentor", "Comic Relief", "Villain", "Supporting", "Mystery Character"];
const SCENE_PURPOSES = ["Opening Hook", "Confrontation", "Revelation", "Climax", "Resolution", "Twist", "Romance", "Betrayal"];

export function StoryBible() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [view, setView] = useState<"library" | "detail">("library");
  const [activeTab, setActiveTab] = useState<"overview" | "characters" | "episodes">("overview");
  const [seriesList, setSeriesList] = useState<DramaSeries[]>([]);
  const [activeSeries, setActiveSeries] = useState<DramaSeries | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCreateSeries, setShowCreateSeries] = useState(false);
  const [showAddChar, setShowAddChar] = useState(false);
  const [showAddEp, setShowAddEp] = useState(false);

  const [newSeries, setNewSeries] = useState({ title: "", genre: "Drama", tone: "Intense & Emotional", setting: "", premise: "", visualStyle: "Realistic 3D" });
  const [newChar, setNewChar] = useState({ name: "", role: "Supporting", age: "", appearance: "", personality: "" });
  const [newEp, setNewEp] = useState({ episodeNumber: 1, title: "", premise: "", mainConflict: "", resolution: "", cliffhanger: "" });

  useEffect(() => { fetchSeries(); }, []);

  async function fetchSeries() {
    setLoading(true);
    try {
      const r = await fetch(`${BASE()}/api/drama-series`);
      setSeriesList(await r.json());
    } catch { toast({ title: "Failed to load series", variant: "destructive" }); }
    finally { setLoading(false); }
  }

  async function fetchSeriesDetail(id: number) {
    setLoading(true);
    try {
      const r = await fetch(`${BASE()}/api/drama-series/${id}`);
      const data = await r.json();
      setActiveSeries(data);
      setView("detail");
    } catch { toast({ title: "Failed to load series", variant: "destructive" }); }
    finally { setLoading(false); }
  }

  async function createSeries() {
    if (!newSeries.title.trim()) return;
    try {
      const r = await fetch(`${BASE()}/api/drama-series`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newSeries) });
      await r.json();
      setNewSeries({ title: "", genre: "Drama", tone: "Intense & Emotional", setting: "", premise: "", visualStyle: "Realistic 3D" });
      setShowCreateSeries(false);
      fetchSeries();
      toast({ title: "Series created" });
    } catch { toast({ title: "Failed to create series", variant: "destructive" }); }
  }

  async function deleteSeries(id: number) {
    try {
      await fetch(`${BASE()}/api/drama-series/${id}`, { method: "DELETE" });
      setSeriesList((s) => s.filter((x) => x.id !== id));
      toast({ title: "Series deleted" });
    } catch { toast({ title: "Failed to delete", variant: "destructive" }); }
  }

  async function addCharacter() {
    if (!activeSeries || !newChar.name.trim()) return;
    try {
      const r = await fetch(`${BASE()}/api/drama-series/${activeSeries.id}/characters`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newChar) });
      const char = await r.json();
      setActiveSeries((s) => s ? { ...s, characters: [...(s.characters ?? []), char] } : s);
      setNewChar({ name: "", role: "Supporting", age: "", appearance: "", personality: "" });
      setShowAddChar(false);
      toast({ title: "Character added" });
    } catch { toast({ title: "Failed to add character", variant: "destructive" }); }
  }

  async function deleteCharacter(charId: number) {
    if (!activeSeries) return;
    try {
      await fetch(`${BASE()}/api/drama-series/${activeSeries.id}/characters/${charId}`, { method: "DELETE" });
      setActiveSeries((s) => s ? { ...s, characters: (s.characters ?? []).filter((c) => c.id !== charId) } : s);
    } catch { toast({ title: "Failed to delete character", variant: "destructive" }); }
  }

  async function addEpisode() {
    if (!activeSeries || !newEp.title.trim()) return;
    try {
      const r = await fetch(`${BASE()}/api/drama-series/${activeSeries.id}/episodes`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newEp) });
      const ep = await r.json();
      setActiveSeries((s) => s ? { ...s, episodes: [...(s.episodes ?? []), ep].sort((a, b) => a.episodeNumber - b.episodeNumber) } : s);
      setNewEp({ episodeNumber: (activeSeries.episodes?.length ?? 0) + 2, title: "", premise: "", mainConflict: "", resolution: "", cliffhanger: "" });
      setShowAddEp(false);
      toast({ title: "Episode added" });
    } catch { toast({ title: "Failed to add episode", variant: "destructive" }); }
  }

  async function deleteEpisode(epId: number) {
    if (!activeSeries) return;
    try {
      await fetch(`${BASE()}/api/drama-series/${activeSeries.id}/episodes/${epId}`, { method: "DELETE" });
      setActiveSeries((s) => s ? { ...s, episodes: (s.episodes ?? []).filter((e) => e.id !== epId) } : s);
    } catch { toast({ title: "Failed to delete episode", variant: "destructive" }); }
  }

  const statusColor: Record<string, string> = {
    planned: "text-muted-foreground border-muted-foreground/30",
    generated: "text-blue-400 border-blue-500/30",
    published: "text-green-400 border-green-500/30",
  };

  if (view === "detail" && activeSeries) {
    return (
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <button onClick={() => { setView("library"); setActiveTab("overview"); }} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mt-1">
            <ChevronLeft className="w-3.5 h-3.5" /> Back
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-black uppercase tracking-tight">{activeSeries.title}</h1>
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider">{activeSeries.genre}</Badge>
            </div>
            <p className="text-xs text-muted-foreground font-mono">{activeSeries.tone} · {activeSeries.visualStyle}</p>
          </div>
          <Button
            size="sm"
            onClick={() => navigate(`/drama-engine?seriesId=${activeSeries.id}`)}
            className="gap-2 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" /> Generate Scene
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-border">
          {(["overview", "characters", "episodes"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2.5 text-xs font-bold uppercase tracking-widest border-b-2 -mb-px transition-colors",
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">Setting</p>
                <p className="text-sm font-mono text-foreground/80">{activeSeries.setting || <span className="text-muted-foreground italic">Not specified</span>}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">Series Premise</p>
                <p className="text-sm font-mono text-foreground/80 leading-relaxed">{activeSeries.premise || <span className="text-muted-foreground italic">Not specified</span>}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="border border-border bg-card p-4 space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Series Stats</p>
                <div className="flex justify-between text-xs font-mono pt-1">
                  <span className="text-muted-foreground">Characters</span>
                  <span className="text-foreground font-bold">{activeSeries.characters?.length ?? 0}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-muted-foreground">Episodes</span>
                  <span className="text-foreground font-bold">{activeSeries.episodes?.length ?? 0}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-muted-foreground">Generated</span>
                  <span className="text-blue-400 font-bold">{activeSeries.episodes?.filter((e) => e.status === "generated").length ?? 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Characters */}
        {activeTab === "characters" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button size="sm" variant="outline" onClick={() => setShowAddChar(!showAddChar)} className="gap-2">
                <Plus className="w-3.5 h-3.5" /> Add Character
              </Button>
            </div>

            {showAddChar && (
              <Card className="border-primary/30 rounded-none">
                <CardHeader className="border-b border-border py-3 px-4 bg-primary/5">
                  <CardTitle className="text-xs uppercase tracking-widest flex items-center justify-between">
                    New Character
                    <button onClick={() => setShowAddChar(false)}><X className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Name *</label>
                      <input value={newChar.name} onChange={(e) => setNewChar((p) => ({ ...p, name: e.target.value }))} className="w-full bg-background border border-border px-3 py-2 text-xs font-mono focus:outline-none focus:border-primary" placeholder="e.g. Kezia" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Role</label>
                      <select value={newChar.role} onChange={(e) => setNewChar((p) => ({ ...p, role: e.target.value }))} className="w-full bg-background border border-border px-3 py-2 text-xs font-mono focus:outline-none focus:border-primary">
                        {ROLES.map((r) => <option key={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Age</label>
                    <input value={newChar.age} onChange={(e) => setNewChar((p) => ({ ...p, age: e.target.value }))} className="w-full bg-background border border-border px-3 py-2 text-xs font-mono focus:outline-none focus:border-primary" placeholder="e.g. Late 20s" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Appearance *</label>
                    <Textarea value={newChar.appearance} onChange={(e) => setNewChar((p) => ({ ...p, appearance: e.target.value }))} className="text-xs font-mono resize-none rounded-none" rows={3} placeholder="Dark skin, long black wavy hair, floral blouse, gold jewelry, confident posture..." />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Personality</label>
                    <Textarea value={newChar.personality} onChange={(e) => setNewChar((p) => ({ ...p, personality: e.target.value }))} className="text-xs font-mono resize-none rounded-none" rows={2} placeholder="Fierce, protective mother. Speaks her mind. Does not back down..." />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <Button size="sm" variant="outline" onClick={() => setShowAddChar(false)}>Cancel</Button>
                    <Button size="sm" onClick={addCharacter} disabled={!newChar.name.trim()}>Save Character</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {(activeSeries.characters ?? []).length === 0 && !showAddChar && (
              <div className="border border-dashed border-border p-10 text-center">
                <Users className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No characters yet. Add your cast to get started.</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(activeSeries.characters ?? []).map((char) => (
                <div key={char.id} className="border border-border bg-card p-4 space-y-2 relative group">
                  <button onClick={() => deleteCharacter(char.id)} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{char.name}</span>
                    <Badge variant="outline" className="text-[9px] uppercase tracking-wider">{char.role}</Badge>
                    {char.age && <span className="text-[10px] text-muted-foreground font-mono">{char.age}</span>}
                  </div>
                  <p className="text-[11px] font-mono text-muted-foreground leading-relaxed">{char.appearance}</p>
                  {char.personality && <p className="text-[11px] font-mono text-foreground/60 border-t border-border/50 pt-2">{char.personality}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Episodes */}
        {activeTab === "episodes" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button size="sm" variant="outline" onClick={() => setShowAddEp(!showAddEp)} className="gap-2">
                <Plus className="w-3.5 h-3.5" /> Add Episode
              </Button>
            </div>

            {showAddEp && (
              <Card className="border-primary/30 rounded-none">
                <CardHeader className="border-b border-border py-3 px-4 bg-primary/5">
                  <CardTitle className="text-xs uppercase tracking-widest flex items-center justify-between">
                    New Episode
                    <button onClick={() => setShowAddEp(false)}><X className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Episode #</label>
                      <input type="number" value={newEp.episodeNumber} onChange={(e) => setNewEp((p) => ({ ...p, episodeNumber: parseInt(e.target.value) || 1 }))} className="w-full bg-background border border-border px-3 py-2 text-xs font-mono focus:outline-none focus:border-primary" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Title *</label>
                      <input value={newEp.title} onChange={(e) => setNewEp((p) => ({ ...p, title: e.target.value }))} className="w-full bg-background border border-border px-3 py-2 text-xs font-mono focus:outline-none focus:border-primary" placeholder="e.g. The Restaurant Confrontation" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Premise</label>
                    <Textarea value={newEp.premise} onChange={(e) => setNewEp((p) => ({ ...p, premise: e.target.value }))} className="text-xs font-mono resize-none rounded-none" rows={2} placeholder="What happens in this episode..." />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Main Conflict</label>
                    <input value={newEp.mainConflict} onChange={(e) => setNewEp((p) => ({ ...p, mainConflict: e.target.value }))} className="w-full bg-background border border-border px-3 py-2 text-xs font-mono focus:outline-none focus:border-primary" placeholder="e.g. Mother confronts mother-in-law who struck her child" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Resolution</label>
                      <input value={newEp.resolution} onChange={(e) => setNewEp((p) => ({ ...p, resolution: e.target.value }))} className="w-full bg-background border border-border px-3 py-2 text-xs font-mono focus:outline-none focus:border-primary" placeholder="How it ends..." />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Cliffhanger</label>
                      <input value={newEp.cliffhanger} onChange={(e) => setNewEp((p) => ({ ...p, cliffhanger: e.target.value }))} className="w-full bg-background border border-border px-3 py-2 text-xs font-mono focus:outline-none focus:border-primary" placeholder="What hooks them to the next..." />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <Button size="sm" variant="outline" onClick={() => setShowAddEp(false)}>Cancel</Button>
                    <Button size="sm" onClick={addEpisode} disabled={!newEp.title.trim()}>Save Episode</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {(activeSeries.episodes ?? []).length === 0 && !showAddEp && (
              <div className="border border-dashed border-border p-10 text-center">
                <Clapperboard className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No episodes yet. Plan your series arc.</p>
              </div>
            )}

            <div className="space-y-3">
              {(activeSeries.episodes ?? []).map((ep) => (
                <div key={ep.id} className="border border-border bg-card p-4 group relative">
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => navigate(`/drama-engine?seriesId=${activeSeries.id}&episodeId=${ep.id}`)}
                      className="text-muted-foreground hover:text-primary text-[10px] font-mono uppercase tracking-widest flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" /> Generate
                    </button>
                    <button onClick={() => deleteEpisode(ep.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-muted-foreground">EP {String(ep.episodeNumber).padStart(2, "0")}</span>
                    <span className="font-bold text-sm">{ep.title}</span>
                    <span className={cn("text-[9px] uppercase tracking-widest border px-2 py-0.5 font-bold ml-auto mr-16", statusColor[ep.status] ?? statusColor.planned)}>
                      {ep.status}
                    </span>
                  </div>
                  {ep.premise && <p className="text-[11px] font-mono text-muted-foreground mb-1.5">{ep.premise}</p>}
                  {ep.mainConflict && (
                    <p className="text-[11px] font-mono text-foreground/60 flex items-start gap-1.5">
                      <AlertCircle className="w-3 h-3 shrink-0 mt-0.5 text-destructive/60" /> {ep.mainConflict}
                    </p>
                  )}
                  {ep.cliffhanger && (
                    <p className="text-[11px] font-mono text-foreground/50 border-t border-border/40 mt-2 pt-2 flex items-start gap-1.5">
                      <Film className="w-3 h-3 shrink-0 mt-0.5 text-primary/60" /> {ep.cliffhanger}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-black uppercase tracking-tight">Story Bible</h1>
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider">Series Manager</Badge>
          </div>
          <p className="text-sm text-muted-foreground font-mono">
            Build your cast, plan episode arcs, and keep every series consistent across scenes.
          </p>
        </div>
        <Button onClick={() => setShowCreateSeries(!showCreateSeries)} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" /> New Series
        </Button>
      </div>

      {showCreateSeries && (
        <Card className="border-primary/30 rounded-none">
          <CardHeader className="border-b border-border py-3 px-4 bg-primary/5">
            <CardTitle className="text-xs uppercase tracking-widest flex items-center justify-between">
              Create New Series
              <button onClick={() => setShowCreateSeries(false)}><X className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5">Series Title *</label>
              <input value={newSeries.title} onChange={(e) => setNewSeries((p) => ({ ...p, title: e.target.value }))} className="w-full bg-background border border-border px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-primary" placeholder='e.g. "Lagos High Society"' />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5">Genre</label>
                <select value={newSeries.genre} onChange={(e) => setNewSeries((p) => ({ ...p, genre: e.target.value }))} className="w-full bg-background border border-border px-3 py-2 text-xs font-mono focus:outline-none focus:border-primary">
                  {GENRES.map((g) => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5">Tone</label>
                <select value={newSeries.tone} onChange={(e) => setNewSeries((p) => ({ ...p, tone: e.target.value }))} className="w-full bg-background border border-border px-3 py-2 text-xs font-mono focus:outline-none focus:border-primary">
                  {TONES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5">Visual Style</label>
                <select value={newSeries.visualStyle} onChange={(e) => setNewSeries((p) => ({ ...p, visualStyle: e.target.value }))} className="w-full bg-background border border-border px-3 py-2 text-xs font-mono focus:outline-none focus:border-primary">
                  {VISUAL_STYLES.map((v) => <option key={v}>{v}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5">Setting</label>
              <input value={newSeries.setting} onChange={(e) => setNewSeries((p) => ({ ...p, setting: e.target.value }))} className="w-full bg-background border border-border px-3 py-2 text-xs font-mono focus:outline-none focus:border-primary" placeholder="Where does your story take place?" />
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="text-[9px] text-muted-foreground uppercase tracking-widest self-center mr-0.5">Try:</span>
                {SETTING_EXAMPLES.map((s) => (
                  <button key={s.label} type="button" onClick={() => setNewSeries((p) => ({ ...p, setting: s.value }))}
                    className="text-[9px] font-mono px-2 py-1 border border-border hover:border-primary hover:text-primary text-muted-foreground transition-colors">
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5">Series Premise</label>
              <Textarea value={newSeries.premise} onChange={(e) => setNewSeries((p) => ({ ...p, premise: e.target.value }))} className="text-xs font-mono resize-none rounded-none" rows={3} placeholder="What is your story about? Who is the main character, what do they want, and what stands in their way?" />
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="text-[9px] text-muted-foreground uppercase tracking-widest self-start mt-1 mr-0.5">Try:</span>
                <div className="flex flex-wrap gap-1.5">
                  {PREMISE_EXAMPLES.map((p) => (
                    <button key={p.label} type="button" onClick={() => setNewSeries((prev) => ({ ...prev, premise: p.value }))}
                      className="text-[9px] font-mono px-2 py-1 border border-border hover:border-primary hover:text-primary text-muted-foreground transition-colors text-left">
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateSeries(false)}>Cancel</Button>
              <Button onClick={createSeries} disabled={!newSeries.title.trim()}>Create Series</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="text-center py-16 text-muted-foreground font-mono text-xs">Loading series...</div>
      )}

      {!loading && seriesList.length === 0 && !showCreateSeries && (
        <div className="border border-dashed border-border p-16 text-center">
          <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
          <p className="text-sm text-muted-foreground mb-2">No series yet</p>
          <p className="text-xs text-muted-foreground/60 font-mono mb-6">Create your first series to start building your story universe</p>
          <Button onClick={() => setShowCreateSeries(true)} className="gap-2"><Plus className="w-4 h-4" /> Create Your First Series</Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {seriesList.map((series) => (
          <div
            key={series.id}
            onClick={() => fetchSeriesDetail(series.id)}
            className="border border-border bg-card p-5 cursor-pointer hover:border-primary/50 transition-all group relative"
          >
            <button
              onClick={(e) => { e.stopPropagation(); deleteSeries(series.id); }}
              className="absolute top-3 right-3 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-start gap-2 mb-3">
              <Badge variant="outline" className="text-[9px] uppercase tracking-wider shrink-0">{series.genre}</Badge>
            </div>
            <h3 className="font-bold text-base uppercase tracking-tight mb-1 pr-6">{series.title}</h3>
            <p className="text-[11px] text-muted-foreground font-mono mb-3 line-clamp-2">{series.premise || "No premise yet"}</p>
            <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground border-t border-border/50 pt-3">
              <span>{series.tone}</span>
              <span className="ml-auto text-primary/60 group-hover:text-primary transition-colors">Open →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { SCENE_PURPOSES };
