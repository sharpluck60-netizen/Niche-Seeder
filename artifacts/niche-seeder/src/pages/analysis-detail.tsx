import { useRoute } from "wouter";
import {
  useGetAnalysis,
  getGetAnalysisQueryKey,
  useGetCommunities,
  getGetCommunitiesQueryKey,
  useGetSparkPosts,
  getGetSparkPostsQueryKey,
  useDiscoverCommunities,
  useGenerateSparkPosts,
  useGetStrategy,
  getGetStrategyQueryKey,
  useGetBlueprint,
  getGetBlueprintQueryKey,
  useGenerateBlueprint,
  useGetScript,
  getGetScriptQueryKey,
  useGenerateScript,
  useGetMetadata,
  getGetMetadataQueryKey,
  useGenerateMetadata,
  useGetSeries,
  getGetSeriesQueryKey,
  useGenerateSeries,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Database,
  Zap,
  Globe,
  MessageSquare,
  Target,
  Loader2,
  Copy,
  Check,
  ArrowLeft,
  ExternalLink,
  Shield,
  Volume2,
  Film,
  Users,
  TrendingUp,
  AlertTriangle,
  FileText,
  Tags,
  CalendarDays,
  Clapperboard,
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function AnalysisDetail() {
  const [, params] = useRoute("/analyses/:id");
  const id = params?.id ? parseInt(params.id, 10) : 0;
  const [activeTab, setActiveTab] = useState("communities");

  const { data: analysis, isLoading } = useGetAnalysis(id, {
    query: { enabled: !!id, queryKey: getGetAnalysisQueryKey(id) },
  });
  const { data: communities } = useGetCommunities(id, {
    query: { enabled: !!id && (activeTab === "communities" || activeTab === "spark-posts"), queryKey: getGetCommunitiesQueryKey(id) },
  });
  const { data: sparkPosts } = useGetSparkPosts(id, {
    query: { enabled: !!id && activeTab === "spark-posts", queryKey: getGetSparkPostsQueryKey(id) },
  });
  const { data: strategy } = useGetStrategy(id, {
    query: { enabled: !!id && activeTab === "strategy", queryKey: getGetStrategyQueryKey(id) },
  });
  const { data: blueprint, isError: blueprintNotFound } = useGetBlueprint(id, {
    query: { enabled: !!id && activeTab === "blueprint", queryKey: getGetBlueprintQueryKey(id), retry: false },
  });
  const { data: script, isError: scriptNotFound } = useGetScript(id, {
    query: { enabled: !!id && activeTab === "script", queryKey: getGetScriptQueryKey(id), retry: false },
  });
  const { data: metadata, isError: metadataNotFound } = useGetMetadata(id, {
    query: { enabled: !!id && activeTab === "metadata", queryKey: getGetMetadataQueryKey(id), retry: false },
  });
  const { data: series, isError: seriesNotFound } = useGetSeries(id, {
    query: { enabled: !!id && activeTab === "series", queryKey: getGetSeriesQueryKey(id), retry: false },
  });

  const discoverCommunities = useDiscoverCommunities();
  const generateSparkPosts = useGenerateSparkPosts();
  const generateBlueprint = useGenerateBlueprint();
  const generateScript = useGenerateScript();
  const generateMetadata = useGenerateMetadata();
  const generateSeries = useGenerateSeries();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [toolCopied, setToolCopied] = useState<string | null>(null);

  const handleGenerateBlueprint = () => {
    generateBlueprint.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetBlueprintQueryKey(id) });
          toast({ title: "Blueprint Generated", description: "Your content blueprint is ready." });
        },
        onError: () => {
          toast({ title: "Blueprint Failed", description: "Could not generate blueprint.", variant: "destructive" });
        },
      }
    );
  };

  const [blueprintCopied, setBlueprintCopied] = useState(false);

  const markCopied = (key: string) => {
    setToolCopied(key);
    setTimeout(() => setToolCopied(null), 2000);
  };

  const handleGenerateScript = () => {
    generateScript.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetScriptQueryKey(id) });
          toast({ title: "Script Generated", description: "Your cinematic script is ready." });
        },
        onError: () => {
          toast({ title: "Script Failed", description: "Could not generate script.", variant: "destructive" });
        },
      }
    );
  };

  const handleGenerateMetadata = () => {
    generateMetadata.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetMetadataQueryKey(id) });
          toast({ title: "Metadata Generated", description: "Platform titles, tags, schedule, and thumbnail concept are ready." });
        },
        onError: () => {
          toast({ title: "Metadata Failed", description: "Could not generate metadata.", variant: "destructive" });
        },
      }
    );
  };

  const handleGenerateSeries = () => {
    generateSeries.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetSeriesQueryKey(id) });
          toast({ title: "Series Plan Generated", description: "Your multi-episode cinematic universe plan is ready." });
        },
        onError: () => {
          toast({ title: "Series Failed", description: "Could not generate series plan.", variant: "destructive" });
        },
      }
    );
  };

  const handleCopyScript = () => {
    if (!script) return;
    const text = [
      `LOGLINE: ${script.logline}`,
      ``,
      `OPENING HOOK: ${script.openingHook}`,
      ``,
      `ACTS:`,
      ...script.acts.map((act) => [
        `  ACT ${act.actNumber}: ${act.title}`,
        `  ${act.description}`,
        `  Visuals: ${act.visualNotes}`,
        `  Dialogue/Text: ${act.dialogueLine}`,
        `  Sound: ${act.soundDesignNote}`,
      ].join("\n")),
      ``,
      `CLOSING CLIFFHANGER: ${script.closingCliffhanger}`,
      `RUNTIME: ${script.estimatedRuntime}`,
      ``,
      `CHARACTER: ${script.characterDescription}`,
      `WORLD-BUILDING: ${script.worldBuildingNote}`,
    ].join("\n");
    navigator.clipboard.writeText(text);
    markCopied("script");
  };

  const handleCopyMetadata = () => {
    if (!metadata) return;
    const text = [
      `YOUTUBE`,
      `Title: ${metadata.youtube.title}`,
      `Description: ${metadata.youtube.description}`,
      `Best Time: ${metadata.youtube.bestPostingTime}`,
      ``,
      `TIKTOK`,
      `Title: ${metadata.tiktok.title}`,
      `Description: ${metadata.tiktok.description}`,
      `Best Time: ${metadata.tiktok.bestPostingTime}`,
      ``,
      `FACEBOOK`,
      `Title: ${metadata.facebook.title}`,
      `Description: ${metadata.facebook.description}`,
      `Best Time: ${metadata.facebook.bestPostingTime}`,
      ``,
      `TAGS: ${metadata.tags.join(", ")}`,
      `HASHTAGS: ${metadata.hashtags.map((tag) => tag.startsWith("#") ? tag : `#${tag}`).join(" ")}`,
      ``,
      `THUMBNAIL CONCEPT: ${metadata.thumbnailConcept}`,
      ``,
      `HOOK VARIANTS:`,
      ...metadata.hookVariants.map((hook, i) => `  ${i + 1}. ${hook}`),
    ].join("\n");
    navigator.clipboard.writeText(text);
    markCopied("metadata");
  };

  const handleCopySeries = () => {
    if (!series) return;
    const text = [
      `SERIES: ${series.seriesTitle}`,
      ``,
      `PREMISE: ${series.premise}`,
      ``,
      `EPISODES:`,
      ...series.episodes.map((episode) => [
        `  EP ${episode.number}: ${episode.title}`,
        `  Logline: ${episode.logline}`,
        `  Opening Hook: ${episode.openingHook}`,
        `  World-Building: ${episode.worldBuildingElement}`,
        `  Cliffhanger: ${episode.cliffhanger}`,
      ].join("\n")),
      ``,
      `LORE ELEMENTS:`,
      ...series.loreElements.map((item) => `  ▸ ${item}`),
      ``,
      `CHARACTER ARCS:`,
      ...series.characterArcs.map((item) => `  ▸ ${item}`),
      ``,
      `IDENTITY LOYALTY HOOK: ${series.identityLoyaltyHook}`,
    ].join("\n");
    navigator.clipboard.writeText(text);
    markCopied("series");
  };

  const handleCopyBlueprint = () => {
    if (!blueprint) return;
    const text = [
      `ALGORITHM READINESS SCORE: ${blueprint.algorithmReadinessScore}/100`,
      ``,
      `SCORE BREAKDOWN:`,
      `  Hook Strength: ${blueprint.algorithmReadinessBreakdown.hookStrength}`,
      `  Audience Clarity: ${blueprint.algorithmReadinessBreakdown.audienceClarity}`,
      `  Niche Specificity: ${blueprint.algorithmReadinessBreakdown.nicheSpecificity}`,
      `  Sound Design Potential: ${blueprint.algorithmReadinessBreakdown.soundDesignPotential}`,
      `  Face Drift Risk: ${blueprint.algorithmReadinessBreakdown.characterConsistencyRisk}`,
      ``,
      `CHARACTER CONSISTENCY PROTOCOL:`,
      ...blueprint.characterConsistencyTips.map((t, i) => `  ${i + 1}. ${t}`),
      ``,
      `SOUND DESIGN PLAN:`,
      ...blueprint.soundDesignPlan.map((t, i) => `  ${i + 1}. ${t}`),
      ``,
      `POV LORE / DIGITAL ARTIFACT CONCEPT:`,
      `  ${blueprint.povLoreIdea}`,
      ``,
      `IDENTITY LOYALTY FACTORS:`,
      ...blueprint.identityLoyaltyFactors.map((t) => `  ▸ ${t}`),
      ``,
      `HIGH-INTENT GAINS TACTICS:`,
      ...blueprint.highIntentGainsTactics.map((t) => `  ▸ ${t}`),
    ].join("\n");
    navigator.clipboard.writeText(text);
    setBlueprintCopied(true);
    setTimeout(() => setBlueprintCopied(false), 2000);
  };

  const handleDiscoverCommunities = () => {
    discoverCommunities.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCommunitiesQueryKey(id) });
          toast({ title: "Communities Discovered", description: "Target communities have been mapped." });
        },
        onError: () => {
          toast({ title: "Discovery Failed", description: "Could not discover communities.", variant: "destructive" });
        },
      }
    );
  };

  const handleGenerateSparkPosts = () => {
    generateSparkPosts.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetSparkPostsQueryKey(id) });
          toast({ title: "Spark Posts Generated", description: "Human-sounding promotional posts are ready." });
        },
        onError: () => {
          toast({ title: "Generation Failed", description: "Could not generate spark posts.", variant: "destructive" });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64 bg-secondary" />
        <Skeleton className="h-[400px] bg-secondary" />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center py-12">
        <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground font-mono">RECORD_NOT_FOUND</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="border-b border-border pb-6 mb-4">
        <Link href="/analyses">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary mb-4 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Databanks
          </Button>
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary uppercase tracking-widest drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
              {analysis.title}
            </h1>
            <p className="text-muted-foreground mt-1 font-mono text-xs truncate max-w-md">{analysis.url}</p>
          </div>
          <Badge variant={analysis.status === "complete" ? "default" : "destructive"} className="text-xs uppercase">
            {analysis.status}
          </Badge>
        </div>
      </header>

      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border bg-secondary/50">
          <CardTitle className="uppercase text-sm tracking-wider text-primary flex items-center gap-2">
            <Target className="w-4 h-4" /> Niche Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Micro-Niche</span>
            <p className="text-foreground font-bold text-lg mt-1">{analysis.microNiche}</p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Mood Keywords</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {analysis.moodKeywords.map((kw, i) => (
                <Badge key={i} variant="secondary" className="text-xs uppercase">
                  {kw}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Audience Profile</span>
            <p className="text-muted-foreground text-sm mt-1">{analysis.audienceProfile}</p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Hook Suggestion</span>
            <p className="text-foreground text-sm mt-1 italic">{analysis.hookSuggestion}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full bg-secondary border border-border">
          <TabsTrigger value="communities" className="flex-1 uppercase text-xs tracking-wider" data-testid="tab-communities">
            Communities
          </TabsTrigger>
          <TabsTrigger value="spark-posts" className="flex-1 uppercase text-xs tracking-wider" data-testid="tab-spark-posts">
            Spark Posts
          </TabsTrigger>
          <TabsTrigger value="strategy" className="flex-1 uppercase text-xs tracking-wider" data-testid="tab-strategy">
            Strategy
          </TabsTrigger>
          <TabsTrigger value="blueprint" className="flex-1 uppercase text-xs tracking-wider" data-testid="tab-blueprint">
            Blueprint
          </TabsTrigger>
          <TabsTrigger value="script" className="flex-1 uppercase text-xs tracking-wider" data-testid="tab-script">
            Script
          </TabsTrigger>
          <TabsTrigger value="metadata" className="flex-1 uppercase text-xs tracking-wider" data-testid="tab-metadata">
            Metadata
          </TabsTrigger>
          <TabsTrigger value="series" className="flex-1 uppercase text-xs tracking-wider" data-testid="tab-series">
            Series
          </TabsTrigger>
        </TabsList>

        <TabsContent value="communities" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground font-mono">
              {communities?.length ?? 0} communities mapped
            </p>
            <Button
              data-testid="button-discover-communities"
              onClick={handleDiscoverCommunities}
              disabled={discoverCommunities.isPending}
              size="sm"
              className="uppercase tracking-wider text-xs"
            >
              {discoverCommunities.isPending ? (
                <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Discovering...</>
              ) : (
                <><Globe className="w-3 h-3 mr-1" /> Discover Communities</>
              )}
            </Button>
          </div>

          {!communities || communities.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <Globe className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground font-mono text-sm">NO_COMMUNITIES_MAPPED</p>
                <p className="text-muted-foreground font-mono text-xs mt-1">Click "Discover Communities" to map target groups</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {communities.map((c) => (
                <Card key={c.id} data-testid={`card-community-${c.id}`} className="bg-card border-border hover:border-primary/30 transition-colors">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="text-center min-w-[40px]">
                      <div className="text-lg font-bold text-primary">{c.relevanceScore}</div>
                      <div className="text-[10px] text-muted-foreground uppercase">Score</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{c.name}</span>
                        <Badge variant="outline" className="text-[10px] uppercase">{c.platform}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{c.reason}</p>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">{c.memberCount}</div>
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="spark-posts" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground font-mono">
              {sparkPosts?.length ?? 0} posts generated
            </p>
            <Button
              data-testid="button-generate-spark-posts"
              onClick={handleGenerateSparkPosts}
              disabled={generateSparkPosts.isPending || !communities || communities.length === 0}
              size="sm"
              className="uppercase tracking-wider text-xs"
            >
              {generateSparkPosts.isPending ? (
                <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Generating...</>
              ) : (
                <><Zap className="w-3 h-3 mr-1" /> Generate Spark Posts</>
              )}
            </Button>
          </div>

          {!sparkPosts || sparkPosts.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground font-mono text-sm">NO_POSTS_GENERATED</p>
                <p className="text-muted-foreground font-mono text-xs mt-1">
                  {!communities || communities.length === 0
                    ? "Discover communities first, then generate posts"
                    : "Click 'Generate Spark Posts' to create promotional content"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {sparkPosts.map((post) => (
                <SparkPostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="strategy" className="mt-4 space-y-4">
          {!strategy ? (
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <Target className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground font-mono text-sm">LOADING_STRATEGY...</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <Card className="bg-card border-border">
                <CardHeader className="border-b border-border bg-secondary/50">
                  <CardTitle className="uppercase text-sm tracking-wider text-primary">
                    Waterfall Trigger ({strategy.platform})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm text-foreground">{strategy.waterfallTrigger}</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="border-b border-border bg-secondary/50">
                  <CardTitle className="uppercase text-sm tracking-wider text-primary">
                    1.5-Second Micro-Hook
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm text-foreground">{strategy.microHook}</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="border-b border-border bg-secondary/50">
                  <CardTitle className="uppercase text-sm tracking-wider text-primary">
                    Content Pillars
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {strategy.contentPillars.map((pillar, i) => (
                      <div key={i} className="flex gap-3 text-sm">
                        <span className="text-primary font-bold">{String(i + 1).padStart(2, "0")}</span>
                        <span className="text-foreground">{pillar}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-primary/30 border-2">
                <CardHeader className="border-b border-primary/30 bg-primary/5">
                  <CardTitle className="uppercase text-sm tracking-wider text-primary flex items-center gap-2">
                    <Zap className="w-4 h-4" /> Wildcard Play
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm text-foreground">{strategy.wildcardIdea}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="blueprint" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground font-mono">
              Content Blueprint & Algorithm Readiness
            </p>
            <div className="flex items-center gap-2">
              {blueprint && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyBlueprint}
                  className="uppercase tracking-wider text-xs border-border text-muted-foreground hover:text-primary"
                >
                  {blueprintCopied ? <><Check className="w-3 h-3 mr-1" /> Copied</> : <><Copy className="w-3 h-3 mr-1" /> Copy Blueprint</>}
                </Button>
              )}
              <Button
                data-testid="button-generate-blueprint"
                onClick={handleGenerateBlueprint}
                disabled={generateBlueprint.isPending}
                size="sm"
                className="uppercase tracking-wider text-xs"
              >
                {generateBlueprint.isPending ? (
                  <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Generating...</>
                ) : (
                  <><Shield className="w-3 h-3 mr-1" /> {blueprint ? "Regenerate" : "Generate Blueprint"}</>
                )}
              </Button>
            </div>
          </div>

          {!blueprint && blueprintNotFound && (
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <Shield className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground font-mono text-sm">NO_BLUEPRINT_GENERATED</p>
                <p className="text-muted-foreground font-mono text-xs mt-1">Generate a blueprint to get your Algorithm Readiness Score, POV Lore idea, and more</p>
              </CardContent>
            </Card>
          )}

          {blueprint && (
            <div className="space-y-4">
              <Card className="bg-card border-border overflow-hidden">
                <CardHeader className="border-b border-border bg-secondary/50">
                  <CardTitle className="uppercase text-sm tracking-wider text-primary flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Algorithm Readiness Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="relative flex items-center justify-center w-24 h-24 flex-shrink-0">
                      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--secondary))" strokeWidth="8" />
                        <circle
                          cx="50" cy="50" r="42" fill="none"
                          stroke={blueprint.algorithmReadinessScore >= 75 ? "#00ffff" : blueprint.algorithmReadinessScore >= 50 ? "#f59e0b" : "#ef4444"}
                          strokeWidth="8"
                          strokeDasharray={`${(blueprint.algorithmReadinessScore / 100) * 264} 264`}
                          strokeLinecap="round"
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <span className="absolute text-xl font-bold text-foreground">{blueprint.algorithmReadinessScore}</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      {Object.entries(blueprint.algorithmReadinessBreakdown).map(([key, val]) => {
                        const labels: Record<string, string> = {
                          hookStrength: "Hook Strength",
                          audienceClarity: "Audience Clarity",
                          nicheSpecificity: "Niche Specificity",
                          soundDesignPotential: "Sound Design Potential",
                          characterConsistencyRisk: "Face Drift Risk",
                        };
                        const isRisk = key === "characterConsistencyRisk";
                        const color = isRisk
                          ? (val as number) >= 60 ? "bg-destructive" : "bg-yellow-500"
                          : (val as number) >= 75 ? "bg-primary" : (val as number) >= 50 ? "bg-yellow-500" : "bg-destructive";
                        return (
                          <div key={key}>
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span className="flex items-center gap-1">
                                {isRisk && <AlertTriangle className="w-3 h-3 text-yellow-500" />}
                                {labels[key] || key}
                              </span>
                              <span className="font-bold text-foreground">{val as number}</span>
                            </div>
                            <div className="w-full bg-secondary h-1.5">
                              <div className={`h-full ${color} transition-all duration-700`} style={{ width: `${val}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="border-b border-border bg-secondary/50">
                  <CardTitle className="uppercase text-sm tracking-wider text-primary flex items-center gap-2">
                    <Users className="w-4 h-4" /> Character Consistency Protocol
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {blueprint.characterConsistencyTips.map((tip, i) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <span className="text-primary font-bold flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-foreground">{tip}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="border-b border-border bg-secondary/50">
                  <CardTitle className="uppercase text-sm tracking-wider text-primary flex items-center gap-2">
                    <Volume2 className="w-4 h-4" /> Sound Design Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {blueprint.soundDesignPlan.map((item, i) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <span className="text-primary font-bold flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-card border-primary/40 border-2">
                <CardHeader className="border-b border-primary/30 bg-primary/5">
                  <CardTitle className="uppercase text-sm tracking-wider text-primary flex items-center gap-2">
                    <Film className="w-4 h-4" /> POV Lore / Digital Artifact Concept
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm text-foreground leading-relaxed">{blueprint.povLoreIdea}</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-card border-border">
                  <CardHeader className="border-b border-border bg-secondary/50">
                    <CardTitle className="uppercase text-xs tracking-wider text-primary flex items-center gap-2">
                      <Zap className="w-3 h-3" /> Identity Loyalty Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2">
                    {blueprint.identityLoyaltyFactors.map((factor, i) => (
                      <div key={i} className="flex gap-2 text-sm">
                        <span className="text-primary">▸</span>
                        <span className="text-foreground">{factor}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader className="border-b border-border bg-secondary/50">
                    <CardTitle className="uppercase text-xs tracking-wider text-primary flex items-center gap-2">
                      <TrendingUp className="w-3 h-3" /> High-Intent Gains Tactics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2">
                    {blueprint.highIntentGainsTactics.map((tactic, i) => (
                      <div key={i} className="flex gap-2 text-sm">
                        <span className="text-primary">▸</span>
                        <span className="text-foreground">{tactic}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="script" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground font-mono">Full cinematic script with acts, hooks, visuals, and sound cues</p>
            <div className="flex items-center gap-2">
              {script && (
                <Button variant="outline" size="sm" onClick={handleCopyScript} className="uppercase tracking-wider text-xs border-border text-muted-foreground hover:text-primary">
                  {toolCopied === "script" ? <><Check className="w-3 h-3 mr-1" /> Copied</> : <><Copy className="w-3 h-3 mr-1" /> Copy Script</>}
                </Button>
              )}
              <Button data-testid="button-generate-script" onClick={handleGenerateScript} disabled={generateScript.isPending} size="sm" className="uppercase tracking-wider text-xs">
                {generateScript.isPending ? <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Writing...</> : <><FileText className="w-3 h-3 mr-1" /> {script ? "Regenerate" : "Generate Script"}</>}
              </Button>
            </div>
          </div>

          {!script && scriptNotFound && (
            <EmptyToolState icon={FileText} code="NO_SCRIPT_GENERATED" description="Generate a 60-90 second cinematic script with a 1.5-second hook, three acts, visual notes, dialogue, and cliffhanger." />
          )}

          {script && (
            <div className="space-y-4">
              <Card className="bg-card border-primary/40 border-2">
                <CardHeader className="border-b border-primary/30 bg-primary/5">
                  <CardTitle className="uppercase text-sm tracking-wider text-primary flex items-center gap-2">
                    <Clapperboard className="w-4 h-4" /> Logline & Opening Hook
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Logline</span>
                    <p className="text-sm text-foreground mt-1">{script.logline}</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">1.5-Second Opening Hook</span>
                    <p className="text-sm text-primary mt-1 italic">{script.openingHook}</p>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                {script.acts.map((act) => (
                  <Card key={act.actNumber} className="bg-card border-border">
                    <CardHeader className="border-b border-border bg-secondary/50">
                      <CardTitle className="uppercase text-sm tracking-wider text-primary">
                        Act {act.actNumber}: {act.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <p className="text-sm text-foreground">{act.description}</p>
                      <ToolDetail label="Visual Notes" value={act.visualNotes} />
                      <ToolDetail label="Dialogue / Text On Screen" value={act.dialogueLine} />
                      <ToolDetail label="Sound Design" value={act.soundDesignNote} />
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-card border-border">
                  <CardHeader className="border-b border-border bg-secondary/50">
                    <CardTitle className="uppercase text-xs tracking-wider text-primary">Closing Cliffhanger</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-sm text-foreground">{script.closingCliffhanger}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-3">Runtime: {script.estimatedRuntime}</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardHeader className="border-b border-border bg-secondary/50">
                    <CardTitle className="uppercase text-xs tracking-wider text-primary">Character & World Consistency</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <ToolDetail label="Character" value={script.characterDescription} />
                    <ToolDetail label="Hidden Lore" value={script.worldBuildingNote} />
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="metadata" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground font-mono">Platform titles, descriptions, tags, schedule, hooks, and thumbnail concept</p>
            <div className="flex items-center gap-2">
              {metadata && (
                <Button variant="outline" size="sm" onClick={handleCopyMetadata} className="uppercase tracking-wider text-xs border-border text-muted-foreground hover:text-primary">
                  {toolCopied === "metadata" ? <><Check className="w-3 h-3 mr-1" /> Copied</> : <><Copy className="w-3 h-3 mr-1" /> Copy Metadata</>}
                </Button>
              )}
              <Button data-testid="button-generate-metadata" onClick={handleGenerateMetadata} disabled={generateMetadata.isPending} size="sm" className="uppercase tracking-wider text-xs">
                {generateMetadata.isPending ? <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Optimizing...</> : <><Tags className="w-3 h-3 mr-1" /> {metadata ? "Regenerate" : "Generate Metadata"}</>}
              </Button>
            </div>
          </div>

          {!metadata && metadataNotFound && (
            <EmptyToolState icon={Tags} code="NO_METADATA_GENERATED" description="Generate optimized titles, descriptions, tags, posting times, thumbnail concept, and hook variants for every platform." />
          )}

          {metadata && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {[
                  { platform: "YouTube", data: metadata.youtube },
                  { platform: "TikTok", data: metadata.tiktok },
                  { platform: "Facebook", data: metadata.facebook },
                ].map((item) => (
                  <Card key={item.platform} className="bg-card border-border">
                    <CardHeader className="border-b border-border bg-secondary/50">
                      <CardTitle className="uppercase text-sm tracking-wider text-primary flex items-center gap-2">
                        <CalendarDays className="w-4 h-4" /> {item.platform}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <ToolDetail label="Title" value={item.data.title} />
                      <ToolDetail label="Description" value={item.data.description} />
                      <ToolDetail label="Best Posting Time" value={item.data.bestPostingTime} />
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-card border-primary/40 border-2">
                <CardHeader className="border-b border-primary/30 bg-primary/5">
                  <CardTitle className="uppercase text-sm tracking-wider text-primary">Thumbnail Concept</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm text-foreground leading-relaxed">{metadata.thumbnailConcept}</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-card border-border">
                  <CardHeader className="border-b border-border bg-secondary/50">
                    <CardTitle className="uppercase text-xs tracking-wider text-primary">Search Tags</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 flex flex-wrap gap-2">
                    {metadata.tags.map((tag, i) => <Badge key={i} variant="secondary" className="text-[10px] uppercase">{tag}</Badge>)}
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardHeader className="border-b border-border bg-secondary/50">
                    <CardTitle className="uppercase text-xs tracking-wider text-primary">Hashtags</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 flex flex-wrap gap-2">
                    {metadata.hashtags.map((tag, i) => <Badge key={i} variant="outline" className="text-[10px] uppercase">{tag.startsWith("#") ? tag : `#${tag}`}</Badge>)}
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-card border-border">
                <CardHeader className="border-b border-border bg-secondary/50">
                  <CardTitle className="uppercase text-xs tracking-wider text-primary">1.5-Second Hook Variants</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  {metadata.hookVariants.map((hook, i) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <span className="text-primary font-bold flex-shrink-0">{String.fromCharCode(65 + i)}</span>
                      <span className="text-foreground">{hook}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="series" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground font-mono">Multi-episode world-building plan built for repeat viewing and fan identity</p>
            <div className="flex items-center gap-2">
              {series && (
                <Button variant="outline" size="sm" onClick={handleCopySeries} className="uppercase tracking-wider text-xs border-border text-muted-foreground hover:text-primary">
                  {toolCopied === "series" ? <><Check className="w-3 h-3 mr-1" /> Copied</> : <><Copy className="w-3 h-3 mr-1" /> Copy Series</>}
                </Button>
              )}
              <Button data-testid="button-generate-series" onClick={handleGenerateSeries} disabled={generateSeries.isPending} size="sm" className="uppercase tracking-wider text-xs">
                {generateSeries.isPending ? <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Planning...</> : <><Clapperboard className="w-3 h-3 mr-1" /> {series ? "Regenerate" : "Generate Series"}</>}
              </Button>
            </div>
          </div>

          {!series && seriesNotFound && (
            <EmptyToolState icon={Clapperboard} code="NO_SERIES_GENERATED" description="Generate a 7-episode cinematic universe with recurring lore, character arcs, hidden symbols, and cliffhangers." />
          )}

          {series && (
            <div className="space-y-4">
              <Card className="bg-card border-primary/40 border-2">
                <CardHeader className="border-b border-primary/30 bg-primary/5">
                  <CardTitle className="uppercase text-sm tracking-wider text-primary">{series.seriesTitle}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <p className="text-sm text-foreground leading-relaxed">{series.premise}</p>
                  <ToolDetail label="Identity Loyalty Hook" value={series.identityLoyaltyHook} />
                </CardContent>
              </Card>

              <div className="space-y-3">
                {series.episodes.map((episode) => (
                  <Card key={episode.number} className="bg-card border-border">
                    <CardHeader className="border-b border-border bg-secondary/50">
                      <CardTitle className="uppercase text-sm tracking-wider text-primary">
                        Episode {episode.number}: {episode.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <p className="text-sm text-foreground">{episode.logline}</p>
                      <ToolDetail label="Opening Hook" value={episode.openingHook} />
                      <ToolDetail label="World-Building Element" value={episode.worldBuildingElement} />
                      <ToolDetail label="Cliffhanger" value={episode.cliffhanger} />
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ListCard title="Lore Elements" icon={Film} items={series.loreElements} />
                <ListCard title="Character Arcs" icon={Users} items={series.characterArcs} />
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyToolState({ icon: Icon, code, description }: { icon: any; code: string; description: string }) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-8 text-center">
        <Icon className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground font-mono text-sm">{code}</p>
        <p className="text-muted-foreground font-mono text-xs mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

function ToolDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{label}</span>
      <p className="text-sm text-foreground mt-1">{value}</p>
    </div>
  );
}

function ListCard({ title, icon: Icon, items }: { title: string; icon: any; items: string[] }) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="border-b border-border bg-secondary/50">
        <CardTitle className="uppercase text-xs tracking-wider text-primary flex items-center gap-2">
          <Icon className="w-3 h-3" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 text-sm">
            <span className="text-primary">▸</span>
            <span className="text-foreground">{item}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function SparkPostCard({ post }: { post: { id: number; targetPlatform: string; content: string; tone: string; callToAction: string } }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${post.content}\n\n${post.callToAction}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card data-testid={`card-spark-post-${post.id}`} className="bg-card border-border">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] uppercase">{post.targetPlatform}</Badge>
            <Badge variant="secondary" className="text-[10px] uppercase">{post.tone}</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            data-testid={`button-copy-${post.id}`}
            onClick={handleCopy}
            className="text-muted-foreground hover:text-primary p-1 h-auto"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
        <p className="text-sm text-foreground mb-2">{post.content}</p>
        <p className="text-xs text-primary font-mono italic">{post.callToAction}</p>
      </CardContent>
    </Card>
  );
}
