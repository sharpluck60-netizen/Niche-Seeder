import { Link, useLocation } from "wouter";
import {
  Terminal,
  Activity,
  Database,
  Zap,
  Menu,
  X,
  Palette,
  Type,
  Instagram,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { themes, scales, useTheme } from "@/lib/theme";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme, setTheme, scale, setScale } = useTheme();

  const navItems = [
    { href: "/", label: "COMMAND CENTER", icon: Activity },
    { href: "/analyze", label: "NEW INJECTION", icon: Zap },
    { href: "/analyses", label: "DATABANKS", icon: Database },
    { href: "/image-lab", label: "IMAGE LAB", icon: Instagram },
  ];

  const currentTheme = themes.find((t) => t.id === theme) ?? themes[0];
  const currentThemeIndex = themes.findIndex((t) => t.id === theme);

  const cycleTheme = () => {
    setTheme(themes[(currentThemeIndex + 1) % themes.length].id);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* Mobile top bar */}
      <div className="md:hidden p-3 border-b border-border bg-sidebar flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-tighter">
          <Terminal className="w-4 h-4" />
          <span>SEEDER_OS</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={cycleTheme}
            className="border border-border bg-card text-primary px-3 py-1.5 text-[10px] uppercase tracking-wider flex items-center gap-1.5"
            aria-label="Switch display mode"
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
          "w-64 border-r border-border bg-sidebar flex-shrink-0 flex flex-col fixed md:sticky top-0 h-screen z-30 transition-transform transform",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border hidden md:flex items-center gap-3 text-primary font-bold text-xl tracking-tighter">
          <Terminal className="w-6 h-6 animate-pulse" />
          <span>SEEDER_OS</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              location === item.href ||
              (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <div
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-150 uppercase text-sm tracking-wider",
                    isActive
                      ? "bg-primary text-primary-foreground font-bold theme-glow-box"
                      : "text-sidebar-foreground hover:bg-secondary hover:text-primary"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Theme switcher */}
        <div className="px-4 pb-3">
          <div className="border border-border bg-card p-3 space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground font-bold">
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
                    "flex flex-col items-center gap-1.5 px-1 py-2.5 text-[10px] uppercase tracking-wider border transition-colors",
                    theme === item.id
                      ? "bg-primary text-primary-foreground border-primary theme-glow-box"
                      : "border-border text-muted-foreground hover:text-primary hover:border-primary/60"
                  )}
                >
                  <span
                    className="w-3 h-3 rounded-full block flex-shrink-0 ring-1 ring-current"
                    style={{ backgroundColor: item.swatch }}
                  />
                  {item.label}
                </button>
              ))}
            </div>

            {/* Font scale */}
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground font-bold pt-1">
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
                    "py-1.5 text-[10px] uppercase tracking-wider border transition-colors",
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

        {/* Status bar */}
        <div className="p-4 border-t border-border text-xs text-muted-foreground font-mono">
          <div className="flex justify-between items-center mb-1">
            <span>SYS.STATUS</span>
            <span className="text-primary">ONLINE</span>
          </div>
          <div className="w-full bg-secondary h-1 mt-2">
            <div
              data-no-transition
              className="bg-primary h-full w-full animate-[pulse_2s_ease-in-out_infinite]"
            />
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/60 z-20 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10 p-4 md:p-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
