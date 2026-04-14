import { Link, useLocation } from "wouter";
import {
  Activity,
  Database,
  Zap,
  Menu,
  X,
  Palette,
  Type,
  Instagram,
  Camera,
  Film,
  Shield,
  Wifi,
  EyeOff,
  Lock,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { themes, scales, useTheme } from "@/lib/theme";

function getNodeId(): string {
  const stored = localStorage.getItem("seeder-node-id");
  if (stored) return stored;
  const id = Array.from({ length: 8 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  )
    .join("")
    .toUpperCase();
  localStorage.setItem("seeder-node-id", id);
  return id;
}

function getSessionKey(): string {
  return Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  )
    .join("")
    .toUpperCase();
}

const MARQUEE_CONTENT =
  "ENCRYPTED CHANNEL · AES-256-GCM · IDENTITY MASKED · TRACE: NONE · PROXY: ACTIVE · WATERFALL READY · SIGNAL STRONG · ";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme, setTheme, scale, setScale } = useTheme();
  const nodeId = useMemo(() => getNodeId(), []);
  const sessionKey = useMemo(() => getSessionKey(), []);
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setUptime((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const uptimeStr = useMemo(() => {
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = uptime % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [uptime]);

  const navItems = [
    { href: "/", label: "OPSEC DASHBOARD", icon: Activity },
    { href: "/analyze", label: "INJECT CONTENT", icon: Zap },
    { href: "/analyses", label: "INTEL ARCHIVE", icon: Database },
    { href: "/image-lab", label: "IMAGE LAB", icon: Instagram },
    { href: "/photo-studio", label: "PHOTO STUDIO", icon: Camera },
    { href: "/creative-studio", label: "CREATIVE STUDIO", icon: Film },
  ];

  const currentTheme = themes.find((t) => t.id === theme) ?? themes[0];
  const currentThemeIndex = themes.findIndex((t) => t.id === theme);

  const cycleTheme = () =>
    setTheme(themes[(currentThemeIndex + 1) % themes.length].id);

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* Mobile top bar */}
      <div className="md:hidden p-3 border-b border-border bg-sidebar flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2 font-bold text-sm tracking-tighter">
          <Lock className="w-3 h-3 text-primary" />
          <span className="text-primary glitch-text cursor-blink" data-text="SEEDER_OS">SEEDER_OS</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={cycleTheme}
            className="border border-border bg-card text-primary px-3 py-1.5 text-[10px] uppercase tracking-wider flex items-center gap-1.5"
          >
            <span
              className="w-2 h-2 rounded-full inline-block flex-shrink-0"
              style={{ backgroundColor: currentTheme.swatch }}
            />
            {currentTheme.label}
          </button>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="text-primary p-1.5 border border-border"
          >
            {isMobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "w-64 border-r border-border bg-sidebar flex-shrink-0 flex flex-col fixed md:sticky top-0 h-screen z-30 transition-transform transform overflow-hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo / Identity */}
        <div className="p-4 border-b border-border hidden md:block">
          <div className="flex items-center gap-2 text-primary font-bold text-lg tracking-tighter mb-3">
            <Lock className="w-4 h-4 theme-glow-icon shrink-0" />
            <span className="glitch-text cursor-blink" data-text="SEEDER_OS">SEEDER_OS</span>
          </div>
          <div className="space-y-1 text-[10px] font-mono">
            <div className="flex justify-between">
              <span className="text-muted-foreground">NODE_ID</span>
              <span className="text-primary tracking-widest">{nodeId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">SESSION</span>
              <span className="text-foreground/60">██:{sessionKey}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">UPTIME</span>
              <span className="text-foreground/60" data-no-transition>{uptimeStr}</span>
            </div>
          </div>

          {/* Status indicators */}
          <div className="mt-3 pt-3 border-t border-border/50 space-y-1">
            <StatusRow icon={Shield} label="ENCRYPTION" value="AES-256-GCM" ok />
            <StatusRow icon={Wifi} label="PROXY" value="ACTIVE" ok />
            <StatusRow icon={EyeOff} label="TRACE" value="BLOCKED" ok />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item, idx) => {
            const isActive =
              location === item.href ||
              (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <div
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors duration-150 uppercase text-xs tracking-wider group dw-bracket",
                    isActive
                      ? "bg-primary text-primary-foreground font-bold theme-glow-box"
                      : "text-sidebar-foreground hover:bg-secondary hover:text-primary"
                  )}
                >
                  <span className="text-[10px] text-muted-foreground shrink-0 group-hover:text-primary">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <item.icon className="w-3 h-3 shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {isActive && (
                    <span className="ml-auto text-[8px] opacity-70 shrink-0">●</span>
                  )}
                </div>
              </Link>
            );
          })}

          {/* CLEARANCE badge */}
          <div className="mt-4 px-3">
            <div className="border border-primary/20 bg-primary/5 p-2 text-center">
              <div className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">Access Level</div>
              <div className="text-[11px] text-primary font-bold tracking-[0.3em] uppercase">
                ◈ CREATOR ◈
              </div>
            </div>
          </div>

          <Link href="/photo-studio">
            <div
              onClick={() => setIsMobileOpen(false)}
              className="mt-3 mx-3 border border-accent/40 bg-accent/10 p-3 cursor-pointer hover:border-primary hover:bg-primary/10 transition-colors dw-bracket"
            >
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-accent font-bold">
                <Camera className="w-3 h-3" />
                Photo Studio
              </div>
              <div className="mt-2 text-[9px] text-muted-foreground leading-relaxed">
                38 photo prompt filters + 120 art styles with Style Fusion.
              </div>
            </div>
          </Link>

          <Link href="/creative-studio">
            <div
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "mt-2 mx-3 border p-3 cursor-pointer transition-colors dw-bracket",
                location === "/creative-studio"
                  ? "border-primary bg-primary/10 theme-glow-box"
                  : "border-purple-500/40 bg-purple-500/10 hover:border-primary hover:bg-primary/10"
              )}
            >
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-purple-300 font-bold">
                <Film className="w-3 h-3" />
                Creative Studio
              </div>
              <div className="mt-2 text-[9px] text-muted-foreground leading-relaxed">
                60+ AI video effect prompts for Runway, Kling &amp; Pika.
              </div>
            </div>
          </Link>
        </nav>

        {/* Display / Scale controls */}
        <div className="px-3 pb-3">
          <div className="border border-border bg-card p-3 space-y-3">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
              <Palette className="w-3 h-3 text-primary" />
              Display
            </div>
            <div className="grid grid-cols-3 gap-1">
              {themes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTheme(item.id)}
                  title={item.description}
                  className={cn(
                    "flex flex-col items-center gap-1.5 px-1 py-2 text-[9px] uppercase tracking-wider border transition-colors",
                    theme === item.id
                      ? "bg-primary text-primary-foreground border-primary theme-glow-box"
                      : "border-border text-muted-foreground hover:text-primary hover:border-primary/60"
                  )}
                >
                  <span
                    className="w-3 h-3 rounded-full block ring-1 ring-current"
                    style={{ backgroundColor: item.swatch }}
                  />
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
              <Type className="w-3 h-3 text-primary" />
              Scale
            </div>
            <div className="grid grid-cols-3 gap-1">
              {scales.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setScale(s.id)}
                  className={cn(
                    "py-1 text-[9px] uppercase tracking-wider border transition-colors",
                    scale === s.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:text-primary hover:border-primary/60"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom status + marquee */}
        <div className="border-t border-border overflow-hidden">
          <div className="overflow-hidden py-1 bg-primary/5">
            <div className="marquee-track text-[9px] text-primary/60 uppercase tracking-widest">
              {MARQUEE_CONTENT}{MARQUEE_CONTENT}
            </div>
          </div>
          <div className="px-3 py-2 flex justify-between items-center text-[10px] text-muted-foreground font-mono">
            <span>SYS.STATUS</span>
            <span className="text-primary flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse inline-block" data-no-transition />
              ONLINE
            </span>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/70 z-20 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10 p-4 md:p-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

function StatusRow({
  icon: Icon,
  label,
  value,
  ok,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  ok?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-[10px]">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="w-2.5 h-2.5" />
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-1">
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            ok ? "bg-primary" : "bg-destructive"
          )}
        />
        <span className={ok ? "text-primary" : "text-destructive"}>{value}</span>
      </div>
    </div>
  );
}
