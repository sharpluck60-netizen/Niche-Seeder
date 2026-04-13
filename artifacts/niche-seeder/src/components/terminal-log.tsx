import { useEffect, useRef, useState } from "react";

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randHex = (len: number) =>
  Array.from({ length: len }, () =>
    Math.floor(Math.random() * 16).toString(16)
  )
    .join("")
    .toUpperCase();

const randItem = <T,>(arr: T[]): T => arr[randInt(0, arr.length - 1)];

const PLATFORMS = ["r/AIFilm", "r/DigitalDark", "discord#8821", "t.me/AICinema", "discord#3392", "r/NeuroDark"];
const NICHES = ['"Solarpunk Noir"', '"Dark Fantasy"', '"Mech Surrealism"', '"Bio Horror"', '"Retro Void"', '"Phantom Realism"'];
const OPERATIONS = [
  () => `SEED_INJECT   → ${randItem(PLATFORMS).padEnd(18)} [${randInt(200, 2100)} nodes]  ✓`,
  () => `NICHE_MAP     → ${randItem(NICHES).padEnd(18)} [ENC:${randHex(4)}]  ██`,
  () => `COMM_SCAN     → node:${randHex(4)}           [ACK]          ✓`,
  () => `SPARK_GEN     → batch:${String(randInt(1, 40)).padEnd(2)}             [STATUS:OK]    ✓`,
  () => `ALGO_SIGNAL   → retention:${randInt(82, 99)}%        [STRONG]       ↑`,
  () => `WATERFALL     → CASCADE_${randInt(1, 5)}           [TRIGGERED]    ✓`,
  () => `ANON_RELAY    → TOR_NODE:${randInt(1, 9)}           [CONNECTED]    ✓`,
  () => `PACKET_SIGN   → key:${randHex(8)}      [OK]           ✓`,
  () => `PROXY_BOUNCE  → hop:${randInt(1, 6)}/${randInt(7, 12)}              [SECURE]       ✓`,
  () => `NICHE_LOCK    → ${randItem(NICHES).padEnd(18)} [VERIFIED]     ✓`,
  () => `IDENTITY_MASK → uid:${randHex(6)}          [ACTIVE]       ✓`,
  () => `IMG_ANALYSIS  → ref:${randHex(4)}             [COMPLETE]     ✓`,
  () => `COMMUNITY_HIT → match:${String(randInt(85, 99)).padEnd(3)}%           [HIGH_INTENT]  ↑`,
  () => `██████████████ [CLASSIFIED] ████████████████████████████`,
];

type LogEntry = { id: number; timestamp: string; text: string; type: "ok" | "warn" | "classified" };

function getTimestamp() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
}

function makeEntry(id: number): LogEntry {
  const opFn = randItem(OPERATIONS);
  const text = opFn();
  const type = text.includes("CLASSIFIED")
    ? "classified"
    : text.includes("↑") || text.includes("TRIGGERED")
    ? "warn"
    : "ok";
  return { id, timestamp: getTimestamp(), text, type };
}

export function TerminalLog({ maxLines = 18 }: { maxLines?: number }) {
  const [entries, setEntries] = useState<LogEntry[]>(() =>
    Array.from({ length: 8 }, (_, i) => makeEntry(i))
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef(100);

  useEffect(() => {
    const interval = setInterval(() => {
      counterRef.current += 1;
      setEntries((prev) => {
        const next = [makeEntry(counterRef.current), ...prev];
        return next.slice(0, maxLines);
      });
    }, randInt(1200, 3200));
    return () => clearInterval(interval);
  }, [maxLines]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [entries]);

  return (
    <div
      ref={scrollRef}
      className="overflow-hidden h-full"
      style={{ mask: "linear-gradient(to bottom, black 70%, transparent 100%)" }}
    >
      {entries.map((entry, i) => (
        <div
          key={entry.id}
          className={`flex gap-2 text-[10px] font-mono leading-relaxed py-0.5 px-1 transition-all duration-300 ${
            i === 0 ? "opacity-100" : i < 4 ? "opacity-80" : "opacity-40"
          }`}
        >
          <span className="text-muted-foreground shrink-0 select-none">
            {entry.timestamp}
          </span>
          <span
            className={
              entry.type === "classified"
                ? "text-destructive"
                : entry.type === "warn"
                ? "text-accent"
                : "text-foreground/70"
            }
            style={{ wordBreak: "break-all" }}
          >
            {entry.text}
          </span>
        </div>
      ))}
    </div>
  );
}
