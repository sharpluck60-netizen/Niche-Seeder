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

type AnalysisResult = {
  imageAnalysis: ImageAnalysis;
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

  const clearImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    setResult(null);
    setError(null);
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
              Drop any AI image concept — get 6 killer Instagram ideas that surpass it
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

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {result.killerIdeas.map((idea, index) => (
              <IdeaCard
                key={index}
                idea={idea}
                index={index}
                isExpanded={expandedIdea === index}
                onToggle={() => setExpandedIdea(expandedIdea === index ? null : index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function IdeaCard({
  idea,
  index,
  isExpanded,
  onToggle,
}: {
  idea: KillerIdea;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
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
      "bg-card border-border flex flex-col transition-all duration-200",
      isExpanded && "theme-glow-box"
    )}>
      <CardHeader className="border-b border-border bg-secondary/50 pb-3">
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
