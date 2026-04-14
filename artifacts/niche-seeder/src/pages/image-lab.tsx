import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ImageIcon,
  Upload,
  Loader2,
  Zap,
  Star,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Sparkles,
  TrendingUp,
  X,
  Instagram,
  GitMerge,
  FlameKindling,
  Building2,
  DoorOpen,
  MousePointerClick,
  Clapperboard,
  Route,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type ImageAnalysis = {
  detectedStyle: string;
  technique: string;
  currentConcept: string;
  conceptStrength: number;
  viralityFactors: string[];
  weaknesses: string[];
};

type KillerIdea = {
  title: string;
  concept: string;
  visualPrompt: string;
  caption: string;
  hashtags: string[];
  upgradeReason: string;
  viralityScore: number;
  postingTip: string;
};

type InteriorZone = {
  name: string;
  description: string;
  connectedTo: string;
  interactiveProps: string[];
  storyTriggers: string[];
  imagePrompt: string;
};

type LocationSceneShot = {
  title: string;
  shotDescription: string;
  camera: string;
  sound: string;
  purpose: string;
};

type LocationScout = {
  detectedLocation: string;
  exteriorClues: string[];
  storyFunction: string;
  continuityBridge: string;
  directorTip: string;
  interiorZones: InteriorZone[];
  characterActions: string[];
  sceneShots: LocationSceneShot[];
};

type FusionResult = {
  fusionTitle: string;
  fusionTagline: string;
  fusionConcept: string;
  fusionReason: string;
  visualPrompt: string;
  caption: string;
  hashtags: string[];
  viralityScore: number;
  postingTip: string;
};

type AnalysisResult = {
  imageAnalysis: ImageAnalysis;
  locationScout?: LocationScout | null;
  killerIdeas: KillerIdea[];
};

export function ImageLab() {
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("image/jpeg");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedIdea, setExpandedIdea] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Combiner state
  const [selectedForFusion, setSelectedForFusion] = useState<number[]>([]);
  const [isFusing, setIsFusing] = useState(false);
  const [fusion, setFusion] = useState<FusionResult | null>(null);
  const [fusionError, setFusionError] = useState<string | null>(null);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError("Image must be under 15MB.");
      return;
    }
    setError(null);
    setResult(null);
    setFusion(null);
    setSelectedForFusion([]);
    setMimeType(file.type);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);
      const base64 = dataUrl.split(",")[1];
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleAnalyze = async () => {
    if (!imageBase64) return;
    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setFusion(null);
    setSelectedForFusion([]);
    setExpandedIdea(null);

    try {
      const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");
      const response = await fetch(`${baseUrl}/api/image-lab/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64, mimeType }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error ?? "Analysis failed");
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      toast({ title: "Analysis Failed", description: msg, variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleFusionSelect = (index: number) => {
    setSelectedForFusion((prev) => {
      if (prev.includes(index)) return prev.filter((i) => i !== index);
      if (prev.length >= 2) {
        toast({ title: "Select only 2 ideas", description: "Deselect one first, then pick another." });
        return prev;
      }
      return [...prev, index];
    });
  };

  const handleFuse = async () => {
    if (!result || selectedForFusion.length !== 2) return;
    const [a, b] = selectedForFusion;
    const ideaA = result.killerIdeas[a];
    const ideaB = result.killerIdeas[b];

    setIsFusing(true);
    setFusionError(null);
    setFusion(null);

    try {
      const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");
      const response = await fetch(`${baseUrl}/api/image-lab/combine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideaA, ideaB }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error ?? "Fusion failed");
      }

      const data: FusionResult = await response.json();
      setFusion(data);
      setSelectedForFusion([]);
      // Scroll into view after render
      setTimeout(() => {
        document.getElementById("fusion-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setFusionError(msg);
      toast({ title: "Fusion Failed", description: msg, variant: "destructive" });
    } finally {
      setIsFusing(false);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    setResult(null);
    setError(null);
    setFusion(null);
    setSelectedForFusion([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="border-b border-border pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary uppercase tracking-widest theme-glow-text flex items-center gap-3">
              <Instagram className="w-8 h-8" />
              Image Lab
            </h1>
            <p className="text-muted-foreground mt-2 font-mono text-sm">
              Drop any AI image concept — get 6 killer ideas, then fuse any 2 into a WOW mega-idea
            </p>
          </div>
          <div className="px-3 py-1 border border-primary text-primary text-xs uppercase hidden md:block">
            Instagram Only
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Panel */}
        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border bg-secondary/50">
              <CardTitle className="uppercase text-sm tracking-wider text-primary flex items-center gap-2">
                <Upload className="w-4 h-4" /> Reference Image
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {!imagePreview ? (
                <div
                  onDragEnter={() => setDragActive(true)}
                  onDragLeave={() => setDragActive(false)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "border-2 border-dashed rounded-none cursor-pointer transition-all duration-200 flex flex-col items-center justify-center p-10 gap-4 min-h-[300px]",
                    dragActive
                      ? "border-primary bg-primary/10 theme-glow-border"
                      : "border-border hover:border-primary/60 hover:bg-secondary/30"
                  )}
                >
                  <div className={cn(
                    "w-16 h-16 border border-dashed flex items-center justify-center transition-colors",
                    dragActive ? "border-primary text-primary" : "border-muted-foreground text-muted-foreground"
                  )}>
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold uppercase tracking-wider text-foreground mb-1">
                      Drop your reference image here
                    </p>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG, WebP — max 15MB
                    </p>
                  </div>
                  <div className="text-xs text-primary border border-primary/40 px-3 py-1">
                    or click to browse
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Reference"
                    className="w-full max-h-[500px] object-contain border border-border"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 right-2 bg-card border border-border p-1.5 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </CardContent>
          </Card>

          {error && (
            <div className="flex items-start gap-3 p-4 border border-destructive bg-destructive/10 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          {imageBase64 && (
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full uppercase tracking-widest font-bold"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing & Generating Ideas...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Killer Ideas
                </>
              )}
            </Button>
          )}
        </div>

        {/* Analysis Panel */}
        <div className="space-y-4">
          {!result && !isAnalyzing && (
            <Card className="bg-card border-border h-full min-h-[300px] flex flex-col">
              <CardContent className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <Sparkles className="w-12 h-12 text-muted-foreground/40 mb-4" />
                <p className="text-muted-foreground text-sm font-mono">
                  Upload a reference image to unlock<br />
                  6 Instagram concepts that surpass it
                </p>
              </CardContent>
            </Card>
          )}

          {isAnalyzing && (
            <Card className="bg-card border-border h-full min-h-[300px] flex flex-col">
              <CardContent className="flex-1 flex flex-col items-center justify-center p-8 gap-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <div className="text-center">
                  <p className="text-sm font-bold uppercase tracking-wider text-primary">
                    Analyzing concept...
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">
                    AI is reverse-engineering the virality formula
                  </p>
                </div>
                <div className="w-full max-w-xs space-y-2 mt-2">
                  {["Detecting visual style", "Scoring viral factors", "Generating 6 killer ideas"].map(
                    (step, i) => (
                      <div key={step} className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          i === 0 ? "bg-primary animate-pulse" : "bg-muted-foreground/30"
                        )} />
                        {step}
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {result && (
            <Card className="bg-card border-border">
              <CardHeader className="border-b border-border bg-secondary/50">
                <CardTitle className="uppercase text-sm tracking-wider text-primary flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Image Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <Badge className="bg-primary text-primary-foreground text-xs uppercase shrink-0">
                    {result.imageAnalysis.detectedStyle}
                  </Badge>
                  <div className="flex items-center gap-1 shrink-0">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-2 h-3 rounded-none",
                          i < result.imageAnalysis.conceptStrength
                            ? "bg-primary"
                            : "bg-secondary"
                        )}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">
                      {result.imageAnalysis.conceptStrength}/10
                    </span>
                  </div>
                </div>

                <p className="text-sm text-foreground/80 font-mono leading-relaxed">
                  {result.imageAnalysis.currentConcept}
                </p>

                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-2">Viral Factors</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.imageAnalysis.viralityFactors.map((f, i) => (
                      <span key={i} className="text-[10px] px-2 py-1 border border-primary/40 text-primary uppercase tracking-wider">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {result.imageAnalysis.weaknesses.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-2">What Holds It Back</p>
                    <ul className="space-y-1">
                      {result.imageAnalysis.weaknesses.map((w, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="text-destructive mt-0.5">▸</span>
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {result?.locationScout && <LocationScoutCard scout={result.locationScout} />}

      {/* Killer Ideas Grid */}
      {result && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <Zap className="w-5 h-5 text-primary theme-glow-icon" />
            <h2 className="text-lg font-bold text-primary uppercase tracking-wider">
              6 Killer Ideas That Surpass This
            </h2>
            <span className="text-xs text-muted-foreground border border-border px-2 py-0.5">
              Instagram Only
            </span>
          </div>

          {/* Fusion selector banner */}
          <div className={cn(
            "border p-4 transition-all duration-300",
            selectedForFusion.length === 2
              ? "border-amber-400/60 bg-amber-400/8 theme-glow-box"
              : "border-border bg-card"
          )}>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <GitMerge className={cn(
                  "w-5 h-5 transition-colors",
                  selectedForFusion.length === 2 ? "text-amber-400" : "text-muted-foreground"
                )} />
                <div>
                  <p className={cn(
                    "text-sm font-bold uppercase tracking-wider transition-colors",
                    selectedForFusion.length === 2 ? "text-amber-400" : "text-foreground"
                  )}>
                    Idea Fusion Lab
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedForFusion.length === 0 && "Select any 2 ideas to fuse them into one WOW mega-concept"}
                    {selectedForFusion.length === 1 && "1 idea selected — pick one more to enable fusion"}
                    {selectedForFusion.length === 2 && `Ideas #${selectedForFusion[0] + 1} + #${selectedForFusion[1] + 1} selected — ready to fuse!`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedForFusion.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedForFusion([])}
                    className="text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground border border-border px-3 py-1.5 transition-colors"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleFuse}
                  disabled={selectedForFusion.length !== 2 || isFusing}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-all",
                    selectedForFusion.length === 2 && !isFusing
                      ? "border-amber-400 bg-amber-400/10 text-amber-400 hover:bg-amber-400/20 theme-glow-box"
                      : "border-border text-muted-foreground opacity-50 cursor-not-allowed"
                  )}
                >
                  {isFusing ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Fusing...
                    </>
                  ) : (
                    <>
                      <FlameKindling className="w-3 h-3" />
                      Fuse into WOW
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {fusionError && (
            <div className="flex items-start gap-3 p-4 border border-destructive bg-destructive/10 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {fusionError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {result.killerIdeas.map((idea, index) => (
              <IdeaCard
                key={index}
                idea={idea}
                index={index}
                isExpanded={expandedIdea === index}
                onToggle={() => setExpandedIdea(expandedIdea === index ? null : index)}
                isSelectedForFusion={selectedForFusion.includes(index)}
                onFusionSelect={() => toggleFusionSelect(index)}
                fusionSelectionCount={selectedForFusion.length}
              />
            ))}
          </div>
        </div>
      )}

      {/* Fusion Result */}
      {isFusing && (
        <div className="border border-amber-400/40 bg-amber-400/5 p-8 flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-amber-400">Fusing concepts...</p>
            <p className="text-xs text-muted-foreground mt-1">AI is finding the creative alchemy between your two ideas</p>
          </div>
        </div>
      )}

      {fusion && (
        <div id="fusion-result" className="space-y-4">
          <div className="flex items-center gap-3 border-b border-amber-400/40 pb-4">
            <FlameKindling className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-amber-400 uppercase tracking-wider">
              WOW Fusion Result
            </h2>
            <span className="text-xs text-amber-400/60 border border-amber-400/30 px-2 py-0.5">
              Mega-Concept
            </span>
          </div>

          <FusionCard fusion={fusion} />
        </div>
      )}
    </div>
  );
}

function LocationScoutCard({ scout }: { scout: LocationScout }) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <Card className="bg-card border-cyan-400/50 theme-glow-box overflow-hidden">
      <CardHeader className="border-b border-cyan-400/30 bg-cyan-400/5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-cyan-300/80 font-bold mb-2">
              <Building2 className="w-3 h-3" />
              Location Scout
            </div>
            <CardTitle className="text-xl text-cyan-300 font-bold tracking-tight">
              {scout.detectedLocation}
            </CardTitle>
            <p className="text-sm text-foreground/70 mt-2 max-w-3xl leading-relaxed">
              {scout.storyFunction}
            </p>
          </div>
          <Badge className="bg-cyan-400/10 text-cyan-300 border border-cyan-400/40 uppercase">
            Explorable Set
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="border border-border bg-secondary/40 p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-3 flex items-center gap-2">
              <Route className="w-3 h-3 text-cyan-300" />
              Exterior Clues
            </p>
            <ul className="space-y-2">
              {scout.exteriorClues.map((clue, index) => (
                <li key={index} className="text-xs text-foreground/80 flex gap-2 leading-relaxed">
                  <span className="text-cyan-300 mt-0.5">▸</span>
                  {clue}
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-border bg-secondary/40 p-4 lg:col-span-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2">
              Continuity Bridge
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed mb-4">
              {scout.continuityBridge}
            </p>
            <div className="border border-cyan-400/30 bg-cyan-400/5 p-3">
              <p className="text-[10px] uppercase tracking-wider text-cyan-300 font-bold mb-1">
                Director Tip
              </p>
              <p className="text-xs text-foreground/80 leading-relaxed">{scout.directorTip}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 border-b border-cyan-400/30 pb-3 mb-4">
            <DoorOpen className="w-4 h-4 text-cyan-300" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300">
              Interior Zones to Generate
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {scout.interiorZones.map((zone, index) => (
              <div key={index} className="border border-border bg-secondary/30 p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-foreground">{zone.name}</h4>
                  <span className="text-[10px] text-cyan-300 border border-cyan-400/30 px-1.5 py-0.5">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{zone.description}</p>
                <p className="text-xs text-foreground/70 leading-relaxed">
                  <span className="text-cyan-300 uppercase tracking-wider text-[10px] font-bold">Connects: </span>
                  {zone.connectedTo}
                </p>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2">
                    Interactive Props
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {zone.interactiveProps.map((prop, propIndex) => (
                      <span key={propIndex} className="text-[10px] border border-cyan-400/30 text-cyan-300 px-1.5 py-0.5">
                        {prop}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2">
                    Story Triggers
                  </p>
                  <ul className="space-y-1">
                    {zone.storyTriggers.map((trigger, triggerIndex) => (
                      <li key={triggerIndex} className="text-xs text-foreground/75 flex gap-2 leading-relaxed">
                        <span className="text-cyan-300">•</span>
                        {trigger}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(zone.imagePrompt, `zone-${index}`)}
                    className="flex items-center gap-1 text-[10px] text-cyan-300 hover:text-cyan-200 uppercase tracking-wider mb-2"
                  >
                    {copiedField === `zone-${index}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedField === `zone-${index}` ? "Copied" : "Copy Interior Prompt"}
                  </button>
                  <div className="bg-background/50 border border-border p-2 text-xs text-foreground/75 leading-relaxed font-mono max-h-28 overflow-y-auto">
                    {zone.imagePrompt}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="border border-border bg-secondary/30 p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-3 flex items-center gap-2">
              <MousePointerClick className="w-3 h-3 text-cyan-300" />
              Character Actions
            </p>
            <div className="flex flex-wrap gap-2">
              {scout.characterActions.map((action, index) => (
                <span key={index} className="text-xs border border-cyan-400/30 bg-cyan-400/5 text-cyan-100 px-2 py-1">
                  {action}
                </span>
              ))}
            </div>
          </div>

          <div className="border border-border bg-secondary/30 p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-3 flex items-center gap-2">
              <Clapperboard className="w-3 h-3 text-cyan-300" />
              Scene Shots Inside the Location
            </p>
            <div className="space-y-3">
              {scout.sceneShots.map((shot, index) => (
                <div key={index} className="border-l border-cyan-400/40 pl-3">
                  <p className="text-sm text-foreground font-bold">{shot.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">{shot.shotDescription}</p>
                  <p className="text-xs text-cyan-100/80 mt-2">
                    {shot.camera} — {shot.sound}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-cyan-300 mt-2">{shot.purpose}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function IdeaCard({
  idea,
  index,
  isExpanded,
  onToggle,
  isSelectedForFusion,
  onFusionSelect,
  fusionSelectionCount,
}: {
  idea: KillerIdea;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  isSelectedForFusion: boolean;
  onFusionSelect: () => void;
  fusionSelectionCount: number;
}) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const scoreColor = idea.viralityScore >= 9 ? "text-primary" : idea.viralityScore >= 7 ? "text-accent" : "text-muted-foreground";

  return (
    <Card className={cn(
      "bg-card border-border flex flex-col transition-all duration-200 relative",
      isSelectedForFusion && "border-amber-400/60 theme-glow-box",
      isExpanded && !isSelectedForFusion && "theme-glow-box"
    )}>
      {/* Fusion select button */}
      <button
        type="button"
        onClick={onFusionSelect}
        title={isSelectedForFusion ? "Deselect from fusion" : "Select for fusion"}
        className={cn(
          "absolute top-2 right-2 z-10 w-5 h-5 border flex items-center justify-center transition-all text-[8px] font-bold",
          isSelectedForFusion
            ? "border-amber-400 bg-amber-400/20 text-amber-400"
            : fusionSelectionCount >= 2
            ? "border-border text-muted-foreground/30 cursor-not-allowed"
            : "border-border text-muted-foreground/50 hover:border-amber-400/60 hover:text-amber-400/60"
        )}
      >
        {isSelectedForFusion ? "✓" : "+"}
      </button>

      <CardHeader className="border-b border-border bg-secondary/50 pb-3 pr-10">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-primary text-xs font-bold shrink-0">
              {String(index + 1).padStart(2, "0")}
            </span>
            <CardTitle className="text-sm tracking-tight text-foreground font-bold truncate">
              {idea.title}
            </CardTitle>
          </div>
          <div className={cn("flex items-center gap-1 shrink-0 text-xs font-bold", scoreColor)}>
            <Star className="w-3 h-3" />
            {idea.viralityScore}/10
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-1 space-y-3">
        <p className="text-xs text-muted-foreground leading-relaxed">
          {idea.concept}
        </p>

        <div className="p-2 border border-primary/30 bg-primary/5 text-xs text-primary font-bold uppercase tracking-wider">
          ↑ Why it surpasses the ref
        </div>
        <p className="text-xs text-foreground/80 leading-relaxed">
          {idea.upgradeReason}
        </p>

        {/* Expandable section */}
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-2 text-xs text-primary uppercase tracking-wider hover:text-primary/80 w-full"
        >
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {isExpanded ? "Collapse" : "View Full Strategy"}
        </button>

        {isExpanded && (
          <div className="space-y-3 border-t border-border pt-3">
            {/* Visual Prompt */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">AI Generation Prompt</p>
                <button
                  type="button"
                  onClick={() => copyToClipboard(idea.visualPrompt, "prompt")}
                  className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80"
                >
                  {copiedField === "prompt" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedField === "prompt" ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="bg-secondary/50 p-2 text-xs text-foreground/80 leading-relaxed font-mono">
                {idea.visualPrompt}
              </div>
            </div>

            {/* Caption */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Instagram Caption</p>
                <button
                  type="button"
                  onClick={() => copyToClipboard(idea.caption, "caption")}
                  className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80"
                >
                  {copiedField === "caption" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedField === "caption" ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="bg-secondary/50 p-2 text-xs text-foreground/80 leading-relaxed">
                {idea.caption}
              </div>
            </div>

            {/* Hashtags */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Hashtags</p>
                <button
                  type="button"
                  onClick={() => copyToClipboard(idea.hashtags.join(" "), "hashtags")}
                  className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80"
                >
                  {copiedField === "hashtags" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedField === "hashtags" ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {idea.hashtags.map((tag, i) => (
                  <span key={i} className="text-[10px] text-primary border border-primary/30 px-1.5 py-0.5">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Posting Tip */}
            <div className="flex items-start gap-2 bg-accent/10 border border-accent/30 p-2">
              <TrendingUp className="w-3 h-3 text-accent mt-0.5 flex-shrink-0" />
              <p className="text-xs text-foreground/80 leading-relaxed">{idea.postingTip}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function FusionCard({ fusion }: { fusion: FusionResult }) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <Card className="bg-card border-amber-400/50 theme-glow-box overflow-hidden">
      <CardHeader className="border-b border-amber-400/30 bg-amber-400/5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-amber-400/70 font-bold">
              <FlameKindling className="w-3 h-3" />
              Fusion Mega-Concept
            </div>
            <CardTitle className="text-xl text-amber-400 font-bold tracking-tight">
              {fusion.fusionTitle}
            </CardTitle>
            <p className="text-sm text-foreground/70 italic">{fusion.fusionTagline}</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 text-amber-400 font-bold">
            <Star className="w-4 h-4 fill-amber-400" />
            <span className="text-lg">{fusion.viralityScore}</span>
            <span className="text-xs opacity-60">/10</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        {/* Fusion concept */}
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2">The Fused Concept</p>
          <p className="text-sm text-foreground/90 leading-relaxed">{fusion.fusionConcept}</p>
        </div>

        {/* Why it works */}
        <div className="border border-amber-400/30 bg-amber-400/5 p-4">
          <p className="text-[10px] uppercase tracking-wider text-amber-400 font-bold mb-2">⚡ The Creative Alchemy</p>
          <p className="text-sm text-foreground/80 leading-relaxed">{fusion.fusionReason}</p>
        </div>

        {/* Visual Prompt */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">AI Generation Prompt</p>
            <button
              type="button"
              onClick={() => copyToClipboard(fusion.visualPrompt, "prompt")}
              className="flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300"
            >
              {copiedField === "prompt" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copiedField === "prompt" ? "Copied!" : "Copy Prompt"}
            </button>
          </div>
          <div className="bg-secondary/60 border border-border p-3 text-xs text-foreground/80 leading-relaxed font-mono">
            {fusion.visualPrompt}
          </div>
        </div>

        {/* Caption */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Instagram Caption</p>
            <button
              type="button"
              onClick={() => copyToClipboard(fusion.caption, "caption")}
              className="flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300"
            >
              {copiedField === "caption" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copiedField === "caption" ? "Copied!" : "Copy Caption"}
            </button>
          </div>
          <div className="bg-secondary/60 border border-border p-3 text-sm text-foreground/80 leading-relaxed">
            {fusion.caption}
          </div>
        </div>

        {/* Hashtags */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Hashtags</p>
            <button
              type="button"
              onClick={() => copyToClipboard(fusion.hashtags.join(" "), "hashtags")}
              className="flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300"
            >
              {copiedField === "hashtags" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copiedField === "hashtags" ? "Copied!" : "Copy All"}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {fusion.hashtags.map((tag, i) => (
              <span key={i} className="text-[10px] text-amber-400 border border-amber-400/30 bg-amber-400/5 px-2 py-0.5">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Posting Tip */}
        <div className="flex items-start gap-3 bg-accent/10 border border-accent/30 p-3">
          <TrendingUp className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-accent font-bold mb-1">Viral Strategy</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{fusion.postingTip}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
