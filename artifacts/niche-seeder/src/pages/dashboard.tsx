import { useGetDashboardStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Database, Zap, Share2, Youtube, Facebook } from "lucide-react";
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
          <h1 className="text-3xl font-bold text-primary uppercase tracking-widest drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
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
        <Icon className="h-4 w-4 text-primary drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]" />
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
