import { useState } from "react";
import { useCreateAnalysis, getGetDashboardStatsQueryKey, getListAnalysesQueryKey, getGetRecentAnalysesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Youtube, Facebook, Loader2, LinkIcon, Instagram } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

export function Analyze() {
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState<string>("");
  const createAnalysis = useCreateAnalysis();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !platform) return;

    createAnalysis.mutate(
      { data: { url, platform } },
      {
        onSuccess: (analysis) => {
          queryClient.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getListAnalysesQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetRecentAnalysesQueryKey() });
          toast({ title: "Analysis Complete", description: `Micro-niche identified: ${analysis.microNiche}` });
          setLocation(`/analyses/${analysis.id}`);
        },
        onError: () => {
          toast({ title: "Analysis Failed", description: "Something went wrong. Please try again.", variant: "destructive" });
        },
      }
    );
  };

  const detectPlatform = (inputUrl: string) => {
    if (inputUrl.includes("youtube.com") || inputUrl.includes("youtu.be")) setPlatform("youtube");
    else if (inputUrl.includes("tiktok.com")) setPlatform("tiktok");
    else if (inputUrl.includes("facebook.com") || inputUrl.includes("fb.watch")) setPlatform("facebook");
    else if (inputUrl.includes("instagram.com")) setPlatform("instagram");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-3xl mx-auto">
      <header className="border-b border-border pb-6 mb-8">
        <h1 className="text-3xl font-bold text-primary uppercase tracking-widest theme-glow-text">
          New Injection
        </h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm">
          Paste your video link. AI will map the micro-niche and build your distribution strategy.
        </p>
      </header>

      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border bg-secondary/50">
          <CardTitle className="uppercase text-sm tracking-wider text-primary flex items-center gap-2">
            <LinkIcon className="w-4 h-4" /> Link Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-bold" htmlFor="video-url">
                Video URL
              </label>
              <Input
                id="video-url"
                data-testid="input-video-url"
                placeholder="https://youtube.com/watch?v=..."
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  detectPlatform(e.target.value);
                }}
                className="bg-background border-border text-foreground font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                Platform
              </label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger data-testid="select-platform" className="bg-background border-border">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">
                    <div className="flex items-center gap-2">
                      <Youtube className="w-4 h-4" /> YouTube
                    </div>
                  </SelectItem>
                  <SelectItem value="tiktok">
                    <div className="flex items-center gap-2">
                      <FaTiktok className="w-4 h-4" /> TikTok
                    </div>
                  </SelectItem>
                  <SelectItem value="facebook">
                    <div className="flex items-center gap-2">
                      <Facebook className="w-4 h-4" /> Facebook
                    </div>
                  </SelectItem>
                  <SelectItem value="instagram">
                    <div className="flex items-center gap-2">
                      <Instagram className="w-4 h-4" /> Instagram
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              data-testid="button-analyze"
              disabled={!url || !platform || createAnalysis.isPending}
              className="w-full uppercase tracking-widest font-bold"
            >
              {createAnalysis.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Initialize Analysis
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border bg-secondary/50">
          <CardTitle className="uppercase text-sm tracking-wider text-primary">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4 text-sm text-muted-foreground font-mono">
            <div className="flex gap-3">
              <span className="text-primary font-bold">01</span>
              <span>AI analyzes your video URL to identify the exact micro-niche and mood keywords</span>
            </div>
            <div className="flex gap-3">
              <span className="text-primary font-bold">02</span>
              <span>On the results page, trigger community mapping to surface top Discord, Telegram, and Reddit groups for your sub-genre</span>
            </div>
            <div className="flex gap-3">
              <span className="text-primary font-bold">03</span>
              <span>Generate spark posts — human-sounding community messages that seed your content with high-retention viewers</span>
            </div>
            <div className="flex gap-3">
              <span className="text-primary font-bold">04</span>
              <span>Access platform-specific strategy, content blueprint, cinematic script, and episode series from the analysis detail tabs</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
