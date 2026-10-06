"use client";

import { useEffect, useState } from "react";
import { site } from "@/config/site";

export type MatchPhase = "before" | "live" | "after";

const KICKOFF = new Date(site.match208.kickoff).getTime();
const END = new Date(site.match208.end).getTime();

function phaseAt(t: number): MatchPhase {
  if (t < KICKOFF) return "before";
  if (t < END) return "live";
  return "after";
}

/** Estado del partido 208 + tiempo restante. `null` hasta montar (evita hydration mismatch). */
export function useMatchState() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // ?estado=live | after para previsualizar los estados
    const forced = params.get("estado");
    const offset = forced === "live" ? KICKOFF + 60_000 - Date.now() : forced === "after" ? END + 60_000 - Date.now() : forced === "before" ? KICKOFF - 6 * 3600_000 - Date.now() : 0;
    const tick = () => setNow(Date.now() + offset);
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (now === null) return { phase: null as MatchPhase | null, remaining: null as string | null };
  const phase = phaseAt(now);
  let remaining: string | null = null;
  if (phase === "before") {
    const s = Math.max(0, Math.floor((KICKOFF - now) / 1000));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    remaining = [h, m, sec].map((v) => String(v).padStart(2, "0")).join(":");
  }
  return { phase, remaining };
}
