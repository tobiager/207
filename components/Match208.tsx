"use client";

import { site } from "@/config/site";
import { useMatchState } from "@/lib/useMatchState";

/** Un único cuadradito vacío, latiendo. Estados: antes / en vivo / completado. */
export function Match208() {
  const { phase, remaining } = useMatchState();
  const m = site.match208;
  const result = m.result;

  return (
    <section id="partido-208" className="px-gutter relative flex flex-col items-center gap-10 border-t border-bone/[0.06] py-28 text-center md:gap-14 md:py-44" aria-labelledby="p208-title">
      {phase === "after" && <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgb(117_170_219/0.16),transparent_60%)]" />}
      <span className="eyebrow">// 07 — Partido 208</span>

      {phase === "after" ? (
        <div className="flex h-36 w-36 items-center justify-center rounded-2xl bg-celeste font-display text-6xl font-black text-night shadow-[0_0_100px_rgb(117_170_219/0.7)] md:h-[220px] md:w-[220px] md:text-[84px]">
          208
        </div>
      ) : phase === "live" ? (
        <div className="heartbeat heartbeat-fast h-36 w-36 rounded-2xl border-2 border-celeste bg-celeste/30 shadow-[0_0_80px_rgb(117_170_219/0.45)] md:h-[220px] md:w-[220px]" aria-hidden="true" />
      ) : (
        <div className="heartbeat h-36 w-36 rounded-2xl border-2 border-dashed border-celeste/80 bg-celeste/[0.06] md:h-[220px] md:w-[220px]" aria-hidden="true" />
      )}

      <div className="relative flex flex-col items-center gap-4 md:gap-5" aria-live="polite">
        {phase === "live" && (
          <span className="flex items-center gap-2.5 text-[11px] tracking-[0.14em] md:text-xs">
            <span className="live-dot h-2.5 w-2.5 rounded-full bg-live" /> EN VIVO · jugando su último partido
          </span>
        )}
        <h2 id="p208-title" className="h-display text-[46px] md:text-[84px]">
          {phase === "after" && result ? `ARG ${result.score} BEN` : <>Argentina vs {m.opponent}</>}
        </h2>
        <span className="text-[11px] tracking-[0.16em] text-bone/65 md:text-sm">
          {phase === "after"
            ? `${result ? `${result.goals} gol${result.goals === 1 ? "" : "es"} de Leo · ` : ""}06.10.2026 · ${m.venue.toUpperCase()}`
            : `${m.venue.toUpperCase()} · HOY 20:00${phase === "before" && remaining ? ` · faltan ${remaining}` : ""}`}
        </span>
        <p className="mt-2 font-serif text-2xl italic text-bone/75 md:text-[32px]">
          {phase === "after" ? "208 partidos. Gracias, Leo." : phase === "live" ? "El último cuadradito se está pintando." : "El último cuadradito todavía está vacío."}
        </p>
      </div>
    </section>
  );
}
