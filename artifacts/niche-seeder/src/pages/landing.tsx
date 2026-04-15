import { useLocation } from "wouter";
import { Lock, Zap, Activity, Film, Globe, Sparkles, ArrowRight, Shield } from "lucide-react";

export function Landing() {
  const [, setLocation] = useLocation();

  const modules = [
    { icon: Zap, label: "INJECT CONTENT", desc: "AI micro-niche analysis for YouTube, TikTok, Facebook & Instagram" },
    { icon: Activity, label: "OPSEC DASHBOARD", desc: "Live stats, platform signal keys, distribution waterfalls" },
    { icon: Film, label: "DRAMA ENGINE", desc: "Shot-by-shot AI scene generator with dialogue & image prompts" },
    { icon: Sparkles, label: "DIRECTOR LAB", desc: "Upload photos — get a full cinematic shot breakdown" },
    { icon: Globe, label: "MAP STUDIO", desc: "28 world landmarks for fake travel content prompts" },
    { icon: Shield, label: "STORY BIBLE", desc: "Series, character & episode management with AI continuity" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top bar */}
      <header className="border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary font-bold tracking-tighter text-lg">
          <Lock className="w-4 h-4" />
          <span className="glitch-text cursor-blink" data-text="SEEDER_OS">SEEDER_OS</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation("/sign-in")}
            className="text-[11px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors px-3 py-1.5"
          >
            Sign In
          </button>
          <button
            onClick={() => setLocation("/sign-up")}
            className="text-[11px] uppercase tracking-widest bg-primary text-primary-foreground px-4 py-1.5 hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            Get Access <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-6 font-mono border border-primary/20 px-4 py-2">
          ◈ AI CONTENT DISTRIBUTION PLATFORM · 2026 ◈
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-primary glitch-text mb-4" data-text="SEEDER_OS">
          SEEDER_OS
        </h1>

        <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto mb-4 font-mono leading-relaxed">
          The complete AI toolkit for viral social media creators.
          Analyze niches, generate cinematic scripts, build drama series,
          and seed your content across every platform — all in one terminal.
        </p>

        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/50 mb-12">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          ENCRYPTION: AES-256-GCM · PROXY: ACTIVE · TRACE: BLOCKED
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setLocation("/sign-up")}
            className="bg-primary text-primary-foreground px-8 py-3 text-sm uppercase tracking-widest font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Initialize Access
          </button>
          <button
            onClick={() => setLocation("/sign-in")}
            className="border border-primary/40 text-primary px-8 py-3 text-sm uppercase tracking-widest font-bold hover:bg-primary/10 transition-colors"
          >
            Sign In
          </button>
        </div>
      </section>

      {/* Modules grid */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground text-center mb-8 font-mono">
            &gt;_ 13 MODULES LOADED · FULLY OPERATIONAL
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {modules.map((mod) => (
              <div
                key={mod.label}
                className="border border-border bg-card/30 p-4 hover:border-primary/40 hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <mod.icon className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-primary">{mod.label}</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-4 flex items-center justify-between text-[10px] font-mono text-muted-foreground/40">
        <span>SEEDER_OS · SECURE CHANNEL ACTIVE</span>
        <span>SYS.STATUS · <span className="text-primary">ONLINE</span></span>
      </footer>
    </div>
  );
}
