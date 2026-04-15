import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Clapperboard,
  Upload,
  Loader2,
  Image as ImageIcon,
  X,
  Play,
  FileText,
  Volume2,
  Camera,
  Film,
  AlertCircle,
  Copy,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Sparkles,
  MonitorPlay,
  Lightbulb,
  AlertTriangle,
  MoveRight,
  Car,
  Gauge,
  Footprints,
  UserRound,
  MapPinned
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import drivingReferenceUrl from "@assets/a7b5fca3de097f2d91401093c8afeee1_1776227284038.jpg";

type UploadedImage = {
  id: string;
  dataUrl: string;
  base64: string;
  mimeType: string;
  fileName: string;
};

type AnalysisResult = {
  movieIdea: {
    title: string;
    genre: string;
    logline: string;
    emotionalHook: string;
    coreConflict: string;
  };
  anchorImages: Array<{
    imageNumber: number;
    whatIsVisible: string;
    cinematicRole: string;
    storyMeaning: string;
    continuityNotes: string;
  }>;
  continuity: {
    status: string;
    reading: string;
    contradictions: string[];
    creativeRescueOptions: string[];
  };
  scene: {
    sceneTitle: string;
    scenePurpose: string;
    shots: Array<{
      shotNumber: number;
      source: string;
      title: string;
      description: string;
      cameraAngle: string;
      cameraMovement: string;
      lighting: string;
      sfx: string;
      vfx: string;
      ambience: string;
      music: string;
      action: string;
      dialogue: string;
      transition: string;
      imagePrompt: string;
    }>;
  };
  directorNotes: string;
  nextImages: Array<{
    title: string;
    purpose: string;
    prompt: string;
  }>;
  episodeDirection: {
    episodeTitle: string;
    actPath: string;
    cliffhanger: string;
    episodeTwoSeed: string;
  };
  styleRegenerationIdeas: string[];
  drivingSequence?: {
    mode: string;
    vehicleSetup: string;
    continuityRules: string[];
    cabinCoverage: Array<{
      angle: string;
      purpose: string;
      prompt: string;
    }>;
    motionBeats: Array<{
      beat: number;
      title: string;
      driverAction: string;
      camera: string;
      roadAction: string;
      sound: string;
      prompt: string;
    }>;
    safetyNote: string;
  };
};

const DIALOGUE_MODES = ["None", "Minimal", "Heavy", "Voiceover Only"];
const TONES = ["Dark & Gritty", "Uplifting & Bright", "Mysterious & Tense", "Surreal & Dreamy", "Action-Packed", "Melancholic"];
const PACES = ["Slow Burn", "Steady", "Fast & Kinetic", "Frenetic"];
const STYLES = ["Cinematic Realism", "Anime / Cel Shaded", "Cyberpunk", "Vintage 35mm", "Neon Noir", "Ethereal Fantasy"];
const ACTION_MODES = ["Auto Detect", "Driving Scene", "Dialogue Scene", "Chase / Escape", "Interior Tension", "World Reveal"];

export function DirectorLab() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [controls, setControls] = useState({
    dialogueMode: "Minimal",
    tone: "Dark & Gritty",
    pace: "Steady",
    style: "Cinematic Realism",
    actionMode: "Auto Detect"
  });
  const [userIdea, setUserIdea] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const processFiles = useCallback((files: FileList | File[]) => {
    const validFiles = Array.from(files).filter(f => f.type.startsWith("image/") && f.size <= 15 * 1024 * 1024);
    
    if (validFiles.length === 0) {
      toast({ title: "Invalid files", description: "Please upload valid images under 15MB.", variant: "destructive" });
      return;
    }

    if (images.length + validFiles.length > 3) {
      toast({ title: "Too many images", description: "You can only upload up to 3 images.", variant: "destructive" });
      return;
    }

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const base64 = dataUrl.split(",")[1];
        setImages(prev => [...prev, {
          id: Math.random().toString(36).substring(7),
          dataUrl,
          base64,
          mimeType: file.type,
          fileName: file.name
        }].slice(0, 3));
      };
      reader.readAsDataURL(file);
    });
  }, [images, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const loadDrivingReference = async () => {
    if (images.length >= 3) {
      toast({ title: "Maximum reached", description: "Remove an image before adding the driving reference.", variant: "destructive" });
      return;
    }

    try {
      const response = await fetch(drivingReferenceUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const base64 = dataUrl.split(",")[1];
        setImages(prev => [...prev, {
          id: `driving-${Date.now()}`,
          dataUrl,
          base64,
          mimeType: blob.type || "image/jpeg",
          fileName: "driving-reference.jpg"
        }].slice(0, 3));
        setControls(prev => ({ ...prev, actionMode: "Driving Scene", pace: "Fast & Kinetic", style: "Cinematic Realism" }));
        setUserIdea((current) => current || "Make my character/model drive like a real movie: changing gear, pedal cutaways, full car interior, passenger beside them, streets through the windshield, car movement, lane changes, and overtaking other vehicles.");
      };
      reader.readAsDataURL(blob);
    } catch {
      toast({ title: "Could not load reference", description: "Try uploading the driving image manually.", variant: "destructive" });
    }
  };

  const handleSubmit = async () => {
    if (images.length === 0) {
      toast({ title: "No images", description: "Upload at least 1 image.", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");
      const response = await fetch(`${baseUrl}/api/director-lab/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: images.map(img => ({
            imageBase64: img.base64,
            mimeType: img.mimeType,
            fileName: img.fileName
          })),
          controls,
          userIdea: userIdea.trim() || undefined
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Analysis failed");
      }

      const data = await response.json();
      setResult(data);
      
      setTimeout(() => {
        document.getElementById("cinematic-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      toast({ title: "Analysis Failed", description: msg, variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyText = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} copied to clipboard.` });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="border-b border-border pb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-red-900/5 z-0 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-red-500 uppercase tracking-widest flex items-center gap-3" style={{ textShadow: '0 0 15px rgba(239,68,68,0.4)' }}>
              <Clapperboard className="w-8 h-8" />
              Director Lab
            </h1>
            <p className="text-muted-foreground mt-2 font-mono text-sm max-w-2xl">
              Turn 1-3 cinematic images into a connected short-movie sequence.
              Extract continuity, sound design, camera language, and next-shot prompts.
            </p>
          </div>
          <div className="px-4 py-2 border border-red-500/30 bg-red-500/10 text-red-500 text-xs uppercase font-bold tracking-widest self-start md:self-auto">
            Cinematic Co-Director
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-card border-border overflow-hidden">
            <CardHeader className="border-b border-border bg-secondary/30 py-4">
              <CardTitle className="uppercase text-sm tracking-wider text-foreground flex items-center gap-2">
                <Upload className="w-4 h-4 text-red-500" /> Upload Frames (Max 3)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div 
                className={cn(
                  "p-6 border-b border-border flex flex-col items-center justify-center min-h-[200px] transition-all cursor-pointer text-center",
                  dragActive ? "bg-red-500/10 border-red-500 border-dashed" : "bg-card hover:bg-secondary/20",
                  images.length >= 3 && "opacity-50 pointer-events-none"
                )}
                onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => images.length < 3 && fileInputRef.current?.click()}
              >
                <ImageIcon className="w-10 h-10 text-muted-foreground mb-3" />
                <p className="text-sm font-bold uppercase tracking-wider mb-1">
                  {images.length >= 3 ? "Maximum reached" : "Drop frames here"}
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  {images.length}/3 uploaded
                </p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  multiple
                  onChange={handleFileChange}
                />
              </div>

              {images.length > 0 && (
                <div className="p-4 grid grid-cols-3 gap-3 bg-secondary/10">
                  {images.map((img, i) => (
                    <div key={img.id} className="relative aspect-video group border border-border bg-black">
                      <img src={img.dataUrl} alt={`Frame ${i+1}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-1 left-1 bg-black/80 px-1.5 py-0.5 text-[9px] font-mono text-white">
                        {i + 1}
                      </div>
                      <button 
                        onClick={() => removeImage(img.id)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {images.length < 3 && (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-video border border-dashed border-border flex items-center justify-center cursor-pointer hover:border-red-500/50 hover:bg-red-500/5 transition-all text-muted-foreground hover:text-red-500"
                    >
                      <Upload className="w-4 h-4" />
                    </div>
                  )}
                </div>
              )}
              {images.length < 3 && (
                <div className="p-4 border-t border-border bg-red-950/10">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={loadDrivingReference}
                    className="w-full rounded-none border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 uppercase tracking-wider text-xs"
                  >
                    <Car className="w-4 h-4 mr-2" />
                    Use Attached Driving Reference
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border bg-secondary/30 py-4">
              <CardTitle className="uppercase text-sm tracking-wider text-foreground flex items-center gap-2">
                <MonitorPlay className="w-4 h-4 text-red-500" /> Creative Direction
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tone</label>
                    <select 
                      className="w-full bg-background border border-border rounded-none px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      value={controls.tone}
                      onChange={e => setControls({...controls, tone: e.target.value})}
                    >
                      {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Pace</label>
                    <select 
                      className="w-full bg-background border border-border rounded-none px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      value={controls.pace}
                      onChange={e => setControls({...controls, pace: e.target.value})}
                    >
                      {PACES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Style</label>
                    <select 
                      className="w-full bg-background border border-border rounded-none px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      value={controls.style}
                      onChange={e => setControls({...controls, style: e.target.value})}
                    >
                      {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Dialogue</label>
                    <select 
                      className="w-full bg-background border border-border rounded-none px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      value={controls.dialogueMode}
                      onChange={e => setControls({...controls, dialogueMode: e.target.value})}
                    >
                      {DIALOGUE_MODES.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Action Mode</label>
                    <select 
                      className="w-full bg-background border border-border rounded-none px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      value={controls.actionMode}
                      onChange={e => setControls({...controls, actionMode: e.target.value})}
                    >
                      {ACTION_MODES.map(mode => <option key={mode} value={mode}>{mode}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-border">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Lightbulb className="w-3 h-3" /> Initial Idea / Context (Optional)
                </label>
                <Textarea 
                  placeholder="E.g., 'Make my character drive like a real movie: gear shift, pedal cutaway, passenger, street POV, overtaking traffic.'"
                  className="resize-none font-mono text-sm focus-visible:ring-red-500 border-border rounded-none bg-background"
                  value={userIdea}
                  onChange={(e) => setUserIdea(e.target.value)}
                  rows={3}
                />
              </div>

              {error && (
                <div className="p-3 border border-destructive/50 bg-destructive/10 text-destructive text-sm flex gap-2 items-start">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <Button 
                className="w-full uppercase font-bold tracking-widest h-12 bg-red-600 hover:bg-red-700 text-white border-none shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] transition-all rounded-none"
                onClick={handleSubmit}
                disabled={isAnalyzing || images.length === 0}
              >
                {isAnalyzing ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing Sequence...</>
                ) : (
                  <><Play className="w-5 h-5 mr-2 fill-current" /> Action</>
                )}
              </Button>

            </CardContent>
          </Card>
        </div>

        {/* Right Column: Output */}
        <div className="lg:col-span-7">
          {!result && !isAnalyzing && (
            <div className="h-full min-h-[400px] border border-border bg-card flex flex-col items-center justify-center p-8 text-center opacity-50">
              <Clapperboard className="w-16 h-16 text-muted-foreground mb-4 opacity-20" />
              <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
                Awaiting Frames
              </p>
            </div>
          )}

          {isAnalyzing && (
            <div className="h-full min-h-[400px] border border-red-500/30 bg-red-950/10 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
              <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-6" />
              <div className="space-y-2 relative z-10">
                <p className="text-sm font-bold uppercase tracking-widest text-red-400">
                  Director AI Processing
                </p>
                <div className="flex flex-col gap-1 text-xs text-muted-foreground font-mono">
                  <span className="animate-pulse">Analyzing continuity...</span>
                  <span className="animate-pulse" style={{animationDelay: '0.2s'}}>Plotting camera moves...</span>
                  <span className="animate-pulse" style={{animationDelay: '0.4s'}}>Generating sound design...</span>
                  {controls.actionMode === "Driving Scene" && (
                    <span className="animate-pulse" style={{animationDelay: '0.6s'}}>Blocking pedals, passenger, road POV, and overtakes...</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {result && (
            <div id="cinematic-result" className="space-y-6">
              
              {/* Movie Header */}
              <div className="border border-border bg-card overflow-hidden">
                <div className="bg-red-950/30 border-b border-border p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                  <div className="relative z-10">
                    <div className="flex gap-2 mb-3">
                      <Badge variant="outline" className="bg-background text-[10px] uppercase tracking-wider">{result.movieIdea.genre}</Badge>
                      <Badge variant="outline" className="bg-background text-[10px] uppercase tracking-wider border-red-500/30 text-red-400">Sequence Ready</Badge>
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tight mb-2">{result.movieIdea.title}</h2>
                    <p className="text-lg text-muted-foreground font-serif italic mb-4 border-l-2 border-red-500 pl-4 py-1">
                      "{result.movieIdea.logline}"
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                      <div>
                        <span className="text-muted-foreground uppercase text-[10px] block mb-1">Emotional Hook</span>
                        <span className="text-foreground/90">{result.movieIdea.emotionalHook}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground uppercase text-[10px] block mb-1">Core Conflict</span>
                        <span className="text-foreground/90">{result.movieIdea.coreConflict}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Continuity & Reading */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card border-border rounded-none">
                  <CardHeader className="border-b border-border bg-secondary/20 py-3 px-4">
                    <CardTitle className="uppercase text-xs tracking-widest text-foreground flex items-center justify-between">
                      <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-amber-500" /> Frame Reading</span>
                      <span className={cn("text-[9px] px-2 py-0.5 border", 
                        result.continuity.status.includes("Warning") ? "text-amber-500 border-amber-500/30" : "text-green-500 border-green-500/30"
                      )}>
                        {result.continuity.status}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4 text-sm">
                    <p className="font-mono text-muted-foreground leading-relaxed">
                      {result.continuity.reading}
                    </p>
                    {result.continuity.contradictions.length > 0 && (
                      <div className="border border-destructive/20 bg-destructive/5 p-3">
                        <p className="text-[10px] uppercase tracking-widest text-destructive font-bold mb-2 flex items-center gap-1.5">
                          <AlertTriangle className="w-3 h-3" /> Contradictions Detected
                        </p>
                        <ul className="space-y-1.5">
                          {result.continuity.contradictions.map((c, i) => (
                            <li key={i} className="text-xs text-foreground/80 flex items-start gap-2">
                              <span className="text-destructive mt-0.5">•</span> {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {result.continuity.creativeRescueOptions.length > 0 && (
                      <div className="border border-amber-500/20 bg-amber-500/5 p-3">
                        <p className="text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-2 flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3" /> Creative Rescue
                        </p>
                        <ul className="space-y-1.5">
                          {result.continuity.creativeRescueOptions.map((r, i) => (
                            <li key={i} className="text-xs text-foreground/80 flex items-start gap-2">
                              <span className="text-amber-500 mt-0.5">↳</span> {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-card border-border rounded-none flex flex-col">
                  <CardHeader className="border-b border-border bg-secondary/20 py-3 px-4">
                    <CardTitle className="uppercase text-xs tracking-widest text-foreground flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-500" /> Director's Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 text-sm font-mono text-foreground/80 leading-relaxed flex-1 whitespace-pre-wrap">
                    {result.directorNotes}
                  </CardContent>
                </Card>
              </div>

              {result.drivingSequence && (
                <DrivingSequencePanel drivingSequence={result.drivingSequence} copyText={copyText} />
              )}

              {/* The Sequence */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3 border-b border-border pb-3">
                  <Film className="w-5 h-5 text-red-500" />
                  <h3 className="text-lg font-bold uppercase tracking-widest">The Scene</h3>
                  <span className="ml-auto text-xs font-mono text-muted-foreground">
                    {result.scene.sceneTitle}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground font-mono italic mb-4">{result.scene.scenePurpose}</p>

                <div className="space-y-4">
                  {result.scene.shots.map((shot, idx) => (
                    <div key={idx} className="border border-border bg-card overflow-hidden">
                      <div className="flex flex-col md:flex-row md:items-stretch">
                        <div className="bg-secondary/30 p-4 border-b md:border-b-0 md:border-r border-border md:w-32 shrink-0 flex flex-row md:flex-col items-center md:justify-center justify-between gap-2 text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-[10px] uppercase text-muted-foreground tracking-widest mb-1">Shot</span>
                            <span className="text-2xl font-black text-foreground font-mono">{shot.shotNumber}</span>
                          </div>
                          <Badge variant="outline" className={cn(
                            "text-[9px] uppercase tracking-wider",
                            shot.source === "Provided" ? "border-primary text-primary" : "border-amber-500 text-amber-500"
                          )}>
                            {shot.source}
                          </Badge>
                        </div>
                        <div className="p-5 flex-1 space-y-4">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h4 className="font-bold text-base uppercase tracking-wide mb-1">{shot.title}</h4>
                              <p className="text-sm text-foreground/80 font-serif">{shot.description}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-border/50">
                            <div>
                              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground mb-1"><Camera className="w-3 h-3" /> Camera</span>
                              <p className="text-xs font-mono">{shot.cameraAngle}, {shot.cameraMovement}</p>
                            </div>
                            <div>
                              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground mb-1"><Volume2 className="w-3 h-3" /> Sound</span>
                              <p className="text-xs font-mono">{shot.sfx} • {shot.music}</p>
                            </div>
                            <div className="md:col-span-2">
                              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground mb-1"><Play className="w-3 h-3" /> Action & Dialogue</span>
                              <p className="text-xs font-mono">{shot.action}</p>
                              {shot.dialogue && shot.dialogue !== "None" && (
                                <p className="text-xs font-serif italic mt-1 pl-2 border-l border-border text-foreground/70">"{shot.dialogue}"</p>
                              )}
                            </div>
                          </div>

                          {shot.source !== "Provided" && (
                            <div className="mt-3 pt-3 border-t border-border/50 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-secondary/10 p-3">
                              <div className="flex-1">
                                <span className="text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-1 block">Image Prompt</span>
                                <p className="text-xs font-mono text-muted-foreground line-clamp-2">{shot.imagePrompt}</p>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="shrink-0 h-8 text-xs border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-500 rounded-none"
                                onClick={() => copyText(shot.imagePrompt, "Image Prompt")}
                              >
                                <Copy className="w-3 h-3 mr-1.5" /> Copy Prompt
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Episode Direction */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <Card className="bg-card border-border rounded-none h-full">
                  <CardHeader className="border-b border-border bg-secondary/20 py-3 px-4">
                    <CardTitle className="uppercase text-xs tracking-widest text-foreground flex items-center gap-2">
                      <MoveRight className="w-4 h-4 text-purple-500" /> Episode Direction
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <span className="text-[10px] uppercase text-muted-foreground tracking-widest block mb-1">Act Path</span>
                      <p className="text-sm font-mono text-foreground/90">{result.episodeDirection.actPath}</p>
                    </div>
                    <div className="pt-3 border-t border-border/50">
                      <span className="text-[10px] uppercase text-muted-foreground tracking-widest block mb-1">Cliffhanger</span>
                      <p className="text-sm font-mono text-foreground/90 italic">{result.episodeDirection.cliffhanger}</p>
                    </div>
                    <div className="pt-3 border-t border-border/50">
                      <span className="text-[10px] uppercase text-muted-foreground tracking-widest block mb-1">Seed for Ep 2</span>
                      <p className="text-sm font-mono text-purple-400">{result.episodeDirection.episodeTwoSeed}</p>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest border-b border-border pb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" /> Generate Next Shots
                  </h4>
                  {result.nextImages.map((nextImg, i) => (
                    <div key={i} className="border border-border bg-card p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider">{nextImg.title}</span>
                          <span className="text-[10px] text-muted-foreground ml-2 block sm:inline">{nextImg.purpose}</span>
                        </div>
                        <button 
                          onClick={() => copyText(nextImg.prompt, "Prompt")}
                          className="text-muted-foreground hover:text-primary"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs font-mono text-muted-foreground bg-secondary/30 p-2 line-clamp-2">
                        {nextImg.prompt}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
