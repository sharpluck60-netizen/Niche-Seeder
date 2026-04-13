import { Link, useLocation } from "wouter";
import { 
  Terminal, 
  Activity, 
  Database, 
  Zap,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { href: "/", label: "COMMAND CENTER", icon: Activity },
    { href: "/analyze", label: "NEW INJECTION", icon: Zap },
    { href: "/analyses", label: "DATABANKS", icon: Database },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* Mobile nav toggle */}
      <div className="md:hidden p-4 border-b border-border bg-background flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2 text-primary font-bold">
          <Terminal className="w-5 h-5" />
          <span>NICHE_SEEDER_</span>
        </div>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="text-primary p-2">
          {isMobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "w-64 border-r border-border bg-sidebar flex-shrink-0 flex flex-col fixed md:sticky top-0 h-screen z-30 transition-transform transform",
        isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-6 border-b border-border hidden md:flex items-center gap-3 text-primary font-bold text-xl tracking-tighter">
          <Terminal className="w-6 h-6 animate-pulse" />
          <span>SEEDER_OS</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-200 uppercase text-sm tracking-wider",
                  isActive 
                    ? "bg-primary text-primary-foreground font-bold shadow-[0_0_15px_rgba(0,255,255,0.3)]" 
                    : "text-sidebar-foreground hover:bg-secondary hover:text-primary"
                )}>
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border text-xs text-muted-foreground font-mono">
          <div className="flex justify-between items-center mb-1">
            <span>SYS.STATUS</span>
            <span className="text-primary">ONLINE</span>
          </div>
          <div className="w-full bg-secondary h-1 mt-2">
            <div className="bg-primary h-full w-full animate-[pulse_2s_ease-in-out_infinite]" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10 p-4 md:p-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
