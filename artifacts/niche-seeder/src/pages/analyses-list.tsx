import { useListAnalyses, useDeleteAnalysis, getListAnalysesQueryKey, getGetDashboardStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Database, Trash2, ExternalLink, Youtube, Facebook, Instagram, Search, X } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const platformIcons: Record<string, any> = {
  youtube: Youtube,
  tiktok: FaTiktok,
  facebook: Facebook,
  instagram: Instagram,
};

export function AnalysesList() {
  const { data: analyses, isLoading } = useListAnalyses();
  const deleteAnalysis = useDeleteAnalysis();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteAnalysis.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListAnalysesQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
          toast({ title: "Analysis Deleted", description: "Record purged from databank." });
        },
      }
    );
  };

  const filtered = (analyses ?? []).filter((a) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      a.title?.toLowerCase().includes(q) ||
      a.microNiche?.toLowerCase().includes(q) ||
      a.platform?.toLowerCase().includes(q)
    );
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-primary uppercase tracking-widest border-b border-border pb-4">Databanks</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 bg-secondary" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex items-center justify-between border-b border-border pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary uppercase tracking-widest theme-glow-text">
            Databanks
          </h1>
          <p className="text-muted-foreground mt-2 font-mono text-sm">
            {analyses?.length ?? 0} analyses indexed
          </p>
        </div>
        <Link href="/analyze">
          <Button data-testid="button-new-analysis" className="uppercase tracking-wider text-xs">
            New Injection
          </Button>
        </Link>
      </header>

      {analyses && analyses.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, niche, or platform..."
            className="w-full bg-background border border-border pl-9 pr-9 py-2.5 text-xs font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {!analyses || analyses.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-mono">NO_RECORDS_FOUND</p>
            <p className="text-muted-foreground font-mono text-xs mt-2">Initialize your first analysis to begin</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.length === 0 && search ? (
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <Search className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground font-mono text-sm">No results for "{search}"</p>
                <button onClick={() => setSearch("")} className="mt-2 text-xs text-primary hover:underline font-mono">Clear search</button>
              </CardContent>
            </Card>
          ) : (
            filtered.map((analysis) => {
              const PlatformIcon = platformIcons[analysis.platform] || Database;
              return (
                <Link key={analysis.id} href={`/analyses/${analysis.id}`}>
                  <Card data-testid={`card-analysis-${analysis.id}`} className="bg-card border-border cursor-pointer hover:border-primary/50 transition-colors group">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="p-2 bg-secondary text-primary">
                        <PlatformIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-foreground truncate">{analysis.title}</h3>
                          <Badge variant={analysis.status === "complete" ? "default" : analysis.status === "error" ? "destructive" : "secondary"} className="text-[10px] uppercase">
                            {analysis.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground font-mono truncate mt-1">{analysis.microNiche}</p>
                      </div>
                      <div className="text-xs text-muted-foreground font-mono hidden sm:block">
                        {new Date(analysis.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary p-1 h-auto">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          data-testid={`button-delete-${analysis.id}`}
                          className="text-muted-foreground hover:text-destructive p-1 h-auto"
                          onClick={(e) => handleDelete(analysis.id, e)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          )}
          {search && filtered.length > 0 && (
            <p className="text-[10px] text-muted-foreground font-mono text-center pt-1">
              {filtered.length} of {analyses?.length ?? 0} results
            </p>
          )}
        </div>
      )}
    </div>
  );
}
