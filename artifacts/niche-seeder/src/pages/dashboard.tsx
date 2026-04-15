import { useGetDashboardStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  Database,
  Zap,
  Share2,
  Youtube,
  Facebook,
  TrendingUp,
  Bookmark,
  Search,
  MessageCircle,
  Film,
  Radio,
  ShieldAlert,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { FaTiktok } from "react-icons/fa";
import { TerminalLog } from "@/components/terminal-log";

function stableId(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return String(((h >>> 0) % 900) + 100);
}

export function Dashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="border-b border-border pb-6">
          <Skeleton className="h-8 w-64 bg-secondary mb-2" />
          <Skeleton className="h-4 w-48 bg-secondary" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 bg-secondary" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full bg-secondary" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <header className="border-b border-border pb-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1
              className="text-2xl md:text-3xl font-bold text-primary uppercase tracking-widest theme-glow-text glitch-text"
              data-text="OPSEC DASHBOARD"
            >
              OPSEC DASHBOARD
            </h1>
            <p className="text-muted-foreground mt-1 text-xs font-mono tracking-wider">
              COVERT OPERATIONS OVERVIEW · SECURE CHANNEL ACTIVE
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="dw-encrypted text-[10px]">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" data-no-transition />
              LIVE FEED
            </div>
            <div className="dw-classified">CLASSIFIED</div>
          </div>
        </div>
      </header>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Operations" value={stats.totalAnalyses} icon={Activity} />
        <StatCard title="Communities Mapped" value={stats.totalCommunities} icon={Database} />
        <StatCard title="Spark Posts Deployed" value={stats.totalSparkPosts} icon={Zap} />

        <Card className="bg-card border-border relative overflow-hidden group dw-bracket">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Network Reach
            </CardTitle>
            <Share2 className="h-3.5 w-3.5 text-primary theme-glow-icon" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end mt-3">
              <PlatformStat icon={<Youtube className="h-4 w-4" />} count={stats.platformBreakdown.youtube} />
              <PlatformStat icon={<FaTiktok className="h-4 w-4" />} count={stats.platformBreakdown.tiktok} />
              <PlatformStat icon={<Facebook className="h-4 w-4" />} count={stats.platformBreakdown.facebook} />
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
        </Card>
      </div>

      {/* Main grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Micro Niches */}
        <Card className="col-span-full lg:col-span-2 bg-card border-border dw-bracket">
          <CardHeader className="border-b border-border bg-secondary/40 py-3">
            <CardTitle className="uppercase text-xs tracking-wider text-primary flex items-center gap-2">
              <span className="text-primary">{">"}_</span>
              DISCOVERED MICRO-NICHES
              <span className="ml-auto text-[10px] text-muted-foreground font-normal">
                {stats.recentNiches.length} RECORDS
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {stats.recentNiches.length > 0 ? (
                stats.recentNiches.map((niche, i) => (
                  <div
                    key={i}
                    className="p-3 hover:bg-secondary/40 transition-colors flex items-center gap-3 group"
                  >
                    <span className="text-muted-foreground text-[10px] font-mono w-5 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="w-1 h-1 bg-primary rounded-full shrink-0 group-hover:shadow-[0_0_6px_hsl(var(--primary))]" />
                    <span className="font-bold text-foreground tracking-tight text-sm">
                      {niche}
                    </span>
                    <span className="ml-auto text-[10px] text-muted-foreground/50 font-mono shrink-0">
                      [{stableId(niche)}]
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground font-mono text-xs">
                  <span className="cursor-blink">AWAITING_DATA</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Platform signal keys */}
        <Card className="col-span-full lg:col-span-1 bg-card border-border dw-bracket">
          <CardHeader className="border-b border-border bg-secondary/40 py-3">
            <CardTitle className="uppercase text-xs tracking-wider text-primary flex items-center gap-2">
              <TrendingUp className="w-3 h-3" /> SIGNAL KEYS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-3">
            {[
              {
                icon: <FaTiktok className="w-3 h-3" />,
                label: "TikTok",
                key: <Bookmark className="w-3 h-3 text-primary flex-shrink-0" />,
                text: "Save = 10x Like. Target AI Art Collection curators.",
              },
              {
                icon: <Youtube className="w-3 h-3" />,
                label: "YouTube",
                key: <Search className="w-3 h-3 text-primary flex-shrink-0" />,
                text: "Pixel-indexed. Use Mood Keywords, not generic labels.",
              },
              {
                icon: <Facebook className="w-3 h-3" />,
                label: "Facebook",
                key: <MessageCircle className="w-3 h-3 text-primary flex-shrink-0" />,
                text: "Debate Engine. End with moral choices to drive threads.",
              },
            ].map(({ icon, label, key, text }) => (
              <div key={label} className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-muted-foreground">
                  {icon} {label}
                </div>
                <div className="flex items-start gap-2 text-[11px] text-foreground/80 bg-secondary/40 p-2">
                  {key}
                  <span>{text}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Distribution Waterfall + Live Log */}
      <div className="grid gap-4 lg:grid-cols-5">
        {/* Waterfall */}
        <Card className="col-span-full lg:col-span-3 bg-card border-border dw-bracket">
          <CardHeader className="border-b border-border bg-secondary/40 py-3">
            <CardTitle className="uppercase text-xs tracking-wider text-primary flex items-center gap-2">
              <Film className="w-3 h-3" /> 2026 DISTRIBUTION WATERFALL
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  step: "01",
                  label: "MICRO-NICHE INJECTION",
                  desc: "Seed communities via Spark Posts targeting high-intent curators",
                  intensity: "border-primary/40",
                },
                {
                  step: "02",
                  label: "HIGH-RETENTION SIGNAL",
                  desc: "First 60 min: 500+ niche viewers drive 90%+ completion",
                  intensity: "border-primary/70",
                },
                {
                  step: "03",
                  label: "ALGORITHM CASCADE",
                  desc: "Platform Identity Loyalty signal triggers 1M+ reach push",
                  intensity: "border-primary",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className={`border ${item.intensity} p-3 relative dw-bracket group hover:bg-secondary/30 transition-colors`}
                >
                  <div className="text-4xl font-black text-primary/10 absolute top-1 right-2 select-none">
                    {item.step}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-primary mb-2">
                    {item.label}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Signal Feed */}
        <Card className="col-span-full lg:col-span-2 bg-card border-border dw-bracket overflow-hidden">
          <CardHeader className="border-b border-border bg-secondary/40 py-3 shrink-0">
            <CardTitle className="uppercase text-xs tracking-wider text-primary flex items-center gap-2">
              <Radio className="w-3 h-3 theme-glow-icon animate-pulse" data-no-transition />
              LIVE SIGNAL FEED
              <span className="ml-auto flex items-center gap-1 text-[10px] text-muted-foreground font-normal">
                <ShieldAlert className="w-3 h-3 text-destructive" />
                ENCRYPTED
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 h-[280px] overflow-hidden">
            <TerminalLog maxLines={20} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <Card className="bg-card border-border relative overflow-hidden group dw-bracket">
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
        <Icon className="h-3.5 w-3.5 text-primary theme-glow-icon" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-foreground mt-2 theme-glow-text">
          {value}
        </div>
      </CardContent>
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
    </Card>
  );
}

function PlatformStat({
  icon,
  count,
}: {
  icon: React.ReactNode;
  count: number;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-muted-foreground">{icon}</div>
      <span className="text-xs font-bold text-foreground">{count}</span>
    </div>
  );
}
