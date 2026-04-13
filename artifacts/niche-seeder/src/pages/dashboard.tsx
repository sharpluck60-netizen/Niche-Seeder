import { useGetDashboardStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Database, Zap, Share2, Youtube, Facebook, TrendingUp, Bookmark, Search, MessageCircle, Film } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { FaTiktok } from "react-icons/fa";

export function Dashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-primary mb-8 uppercase tracking-widest border-b border-border pb-4">Command Center</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 bg-secondary" />)}
        </div>
        <Skeleton className="h-[400px] w-full bg-secondary" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex items-center justify-between border-b border-border pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary uppercase tracking-widest theme-glow-text">
            Command Center
          </h1>
          <p className="text-muted-foreground mt-2 font-mono text-sm">System Overview & Analytics</p>
        </div>
        <div className="px-3 py-1 border border-primary text-primary text-xs uppercase animate-pulse">
          Live Feed Active
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Analyses" 
          value={stats.totalAnalyses} 
          icon={Activity} 
        />
        <StatCard 
          title="Communities Found" 
          value={stats.totalCommunities} 
          icon={Database} 
        />
        <StatCard 
          title="Spark Posts Generated" 
          value={stats.totalSparkPosts} 
          icon={Zap} 
        />
        <Card className="bg-card border-border relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Network Distribution
            </CardTitle>
            <Share2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end mt-4">
              <div className="flex flex-col items-center">
                <Youtube className="h-5 w-5 mb-1 text-muted-foreground" />
                <span className="text-xs font-bold">{stats.platformBreakdown.youtube}</span>
              </div>
              <div className="flex flex-col items-center">
                <FaTiktok className="h-5 w-5 mb-1 text-muted-foreground" />
                <span className="text-xs font-bold">{stats.platformBreakdown.tiktok}</span>
              </div>
              <div className="flex flex-col items-center">
                <Facebook className="h-5 w-5 mb-1 text-muted-foreground" />
                <span className="text-xs font-bold">{stats.platformBreakdown.facebook}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
        <Card className="col-span-full lg:col-span-2 bg-card border-border">
          <CardHeader className="border-b border-border bg-secondary/50">
            <CardTitle className="uppercase text-sm tracking-wider text-primary flex items-center gap-2">
              <TerminalIcon /> Discovered Micro-Niches
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {stats.recentNiches.length > 0 ? (
                stats.recentNiches.map((niche, i) => (
                  <div key={i} className="p-4 hover:bg-secondary/50 transition-colors flex items-center gap-3">
                    <span className="text-muted-foreground text-xs">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-bold text-foreground tracking-tight">{niche}</span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground font-mono text-sm">
                  NO_DATA_AVAILABLE
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-1 bg-card border-border">
          <CardHeader className="border-b border-border bg-secondary/50">
            <CardTitle className="uppercase text-sm tracking-wider text-primary flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Platform Signal Keys
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
                <FaTiktok className="w-3 h-3" /> TikTok
              </div>
              <div className="flex items-center gap-2 text-xs text-foreground bg-secondary/50 p-2">
                <Bookmark className="w-3 h-3 text-primary flex-shrink-0" />
                <span>Save = 10x Like. Target AI Art Collection curators.</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
                <Youtube className="w-3 h-3" /> YouTube
              </div>
              <div className="flex items-center gap-2 text-xs text-foreground bg-secondary/50 p-2">
                <Search className="w-3 h-3 text-primary flex-shrink-0" />
                <span>Pixel-indexed. Use Mood Keywords, not generic "AI movie."</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
                <Facebook className="w-3 h-3" /> Facebook
              </div>
              <div className="flex items-center gap-2 text-xs text-foreground bg-secondary/50 p-2">
                <MessageCircle className="w-3 h-3 text-primary flex-shrink-0" />
                <span>Debate Engine. End with moral choices to drive comment threads.</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card className="bg-card border-border">
          <CardHeader className="border-b border-border bg-secondary/50">
            <CardTitle className="uppercase text-sm tracking-wider text-primary flex items-center gap-2">
              <Film className="w-4 h-4" /> 2026 Distribution Waterfall
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  step: "01",
                  label: "Micro-Niche Injection",
                  desc: "Seed the right communities with Spark Posts targeting High-Intent curators",
                  color: "border-primary/50",
                },
                {
                  step: "02",
                  label: "High-Retention Signal",
                  desc: "First 60 mins: 500+ niche viewers drive 90% completion rate",
                  color: "border-primary/70",
                },
                {
                  step: "03",
                  label: "Algorithm Cascade",
                  desc: "Platform detects Identity Loyalty signal and pushes to 1M+ general audience",
                  color: "border-primary",
                },
              ].map((item) => (
                <div key={item.step} className={`border ${item.color} p-4 relative`}>
                  <div className="text-3xl font-black text-primary/20 absolute top-2 right-3">{item.step}</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-primary mb-2">{item.label}</div>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }: { title: string, value: number, icon: any }) {
  return (
    <Card className="bg-card border-border relative overflow-hidden group">
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-primary theme-glow-icon" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-foreground mt-2">{value}</div>
      </CardContent>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
    </Card>
  );
}

function TerminalIcon() {
  return <span className="text-primary">{'>_'}</span>;
}
