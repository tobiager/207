"use client";

import { useCallback, useRef, useState, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { useLazyGSAP } from "@/lib/useLazyGSAP";
import { useStore } from "@/lib/store";
import { cells, cumulativeGoals, formatDate, MAX_ROWS, TOTAL_GOALS, TOTAL_MATCHES, YEARS, yearOf, type Cell } from "@/lib/matches";

const finalAttr = (c: Cell) => (c.isFinal ? (c.won ? "won" : "lost") : undefined);

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-2 text-[10px] text-bone/55 md:text-[11px]">
      <span>Menos</span>
      {[0, 1, 2, 3].map((l) => (
        <span key={l} className="h-3 w-3 rounded-[3px] md:h-3.5 md:w-3.5" style={{ background: `var(--lvl-${l})` }} />
      ))}
      <span>Más</span>
      <span className="ml-3 h-3 w-3 rounded-[3px] bg-gold md:h-3.5 md:w-3.5" />
      <span>Título</span>
      <span className="ml-2 h-3 w-3 rounded-[3px] bg-slate shadow-[inset_0_0_0_1px_#46546a] md:h-3.5 md:w-3.5" />
      <span>Final perdida</span>
    </div>
  );
}

export function MatchGrid() {
  const root = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cMatches = useRef<HTMLSpanElement>(null);
  const cGoals = useRef<HTMLSpanElement>(null);
  const cYears = useRef<HTMLSpanElement>(null);
  const { highlight, active, setActive } = useStore();
  const [tip, setTip] = useState<{ c: Cell; x: number; y: number } | null>(null);

  useLazyGSAP(() => {
        const grid = gridRef.current!;
        const golds = gsap.utils.toArray<HTMLElement>('.cell[data-final="won"]', grid);
        let climaxed = false;

        const setCounters = (i: number) => {
          if (cMatches.current) cMatches.current.textContent = String(i);
          if (cGoals.current) cGoals.current.textContent = String(i ? cumulativeGoals[i - 1] : 0);
          if (cYears.current) cYears.current.textContent = String(i ? yearOf(cells[i - 1]) - 2005 : 0);
        };
        setCounters(0);

        // Pintado por CSS: una sola variable --p (partidos pintados) en vez de un tween por partido.
        grid.dataset.anim = "true";
        const state = { p: 0 };
        const paint = () => {
          grid.style.setProperty("--p", state.p.toFixed(2));
          setCounters(Math.min(TOTAL_MATCHES, Math.max(0, Math.floor(state.p))));
        };
        paint();

        gsap.to(state, {
          p: TOTAL_MATCHES + 2,
          ease: "none",
          onUpdate: paint,
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${window.innerHeight * 2.4}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (self.progress > 0.93 && !climaxed) {
                climaxed = true;
                gsap.fromTo(
                  golds,
                  { scale: 2.2, boxShadow: "0 0 60px rgba(201,164,76,1)" },
                  { scale: 1, boxShadow: "0 0 18px rgba(201,164,76,.6)", duration: 1.4, ease: "expo.out", stagger: 0.12, clearProps: "transform,boxShadow" },
                );
                gsap.fromTo(".grid-flash", { opacity: 0.5 }, { opacity: 0, duration: 1.6, ease: "power2.out" });
              }
              if (self.progress < 0.85) climaxed = false;
            },
          },
        });
        return () => {
          delete grid.dataset.anim;
          grid.style.removeProperty("--p");
        };
  }, root);

  const show = useCallback((el: HTMLElement, c: Cell) => {
    const g = gridRef.current;
    if (!g) return;
    const gr = g.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setTip({ c, x: r.left - gr.left + r.width / 2, y: r.top - gr.top });
  }, []);

  const gridStyle = { "--cols": YEARS.length, "--rows": MAX_ROWS } as CSSProperties;

  return (
    <section ref={root} id="grafico" className="px-gutter relative flex min-h-[100svh] items-center border-t border-bone/[0.06] py-20 md:py-24" aria-labelledby="grafico-title">
      <div className="grid-flash pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_60%_50%,rgb(201_164_76/0.35),transparent_60%)] opacity-0" />
      <div className="mx-auto flex w-full max-w-[1344px] flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
        <div className="flex flex-col gap-6 lg:w-[36%] lg:gap-9">
          <span className="eyebrow">// 02 — El gráfico</span>
          <h2 id="grafico-title" className="h-display text-[54px] md:text-[clamp(54px,5vw,92px)]">
            {TOTAL_MATCHES} contribuciones <span className="text-celeste">a la historia</span>
          </h2>
          <div className="grid grid-cols-3 gap-4 border-y border-bone/10 py-4 lg:border-b-0 lg:pt-7" aria-live="off">
            <div className="flex flex-col gap-1">
              <span ref={cMatches} className="font-display text-[42px] font-black leading-[0.9] tabular-nums md:text-[64px]">{TOTAL_MATCHES}</span>
              <span className="text-[10px] tracking-[0.12em] text-bone/55">PARTIDOS</span>
            </div>
            <div className="flex flex-col gap-1">
              <span ref={cGoals} className="font-display text-[42px] font-black leading-[0.9] tabular-nums text-celeste md:text-[64px]">{TOTAL_GOALS}</span>
              <span className="text-[10px] tracking-[0.12em] text-bone/55">GOLES</span>
            </div>
            <div className="flex flex-col gap-1">
              <span ref={cYears} className="font-display text-[42px] font-black leading-[0.9] tabular-nums md:text-[64px]">21</span>
              <span className="text-[10px] tracking-[0.12em] text-bone/55">AÑOS</span>
            </div>
          </div>
          <p className="hidden font-serif text-[26px] italic leading-tight text-bone/75 lg:block">
            Cada cuadradito es un partido. Cuanto más celeste, más goles. Los dorados, los que nos hicieron llorar de felicidad.
          </p>
          <div className="hidden lg:block">
            <Legend />
          </div>
        </div>

        <div className="relative min-w-0 lg:flex-1">
          <div className="mb-4 flex justify-between gap-4 text-[10px] text-bone/45 md:text-[11px]">
            <span className="truncate">$ git log --author=&quot;Leo&quot; --since=2005-08-17</span>
            <span className="hidden sm:inline">{TOTAL_MATCHES} commits</span>
          </div>
          <div
            ref={gridRef}
            className="match-grid relative"
            style={gridStyle}
            data-cursor="grid"
            data-filtering={highlight ? "true" : "false"}
            onPointerLeave={() => setTip(null)}
          >
            {YEARS.map((y, i) => (
              <span key={y} className="ylabel font-mono text-[9px] text-bone/45 md:text-[10px]" style={{ "--c": i } as CSSProperties}>
                &apos;{String(y).slice(2)}
              </span>
            ))}
            {cells.map((c) => (
              <button
                key={c.n}
                type="button"
                tabIndex={-1}
                className="cell"
                data-l={c.level}
                data-final={finalAttr(c)}
                data-hit={highlight?.has(c.n) ? "true" : undefined}
                data-active={active === c.n ? "true" : undefined}
                style={{ "--c": c.col, "--r": c.row, "--i": c.n - 1 } as CSSProperties}
                aria-label={`#${c.n} · ${c.date} · vs ${c.opponent} · ${c.result} · ${c.goals} goles · ${c.competition}`}
                onPointerEnter={(e) => e.pointerType === "mouse" && show(e.currentTarget, c)}
                onClick={(e) => {
                  show(e.currentTarget, c);
                  setActive(c.n);
                }}
              />
            ))}

            {tip && (
              <div
                role="tooltip"
                className="pointer-events-none absolute z-20 w-[230px] -translate-x-1/2 -translate-y-[calc(100%+12px)] rounded-md border bg-night-2/95 px-4 py-3 text-[11px] leading-relaxed shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur"
                style={{
                  left: Math.min(Math.max(tip.x, 115), (gridRef.current?.clientWidth ?? 400) - 115),
                  top: tip.y,
                  borderColor: tip.c.isFinal && tip.c.won ? "rgb(201 164 76 / .6)" : "rgb(117 170 219 / .35)",
                }}
              >
                <div className="tracking-[0.12em]" style={{ color: tip.c.isFinal && tip.c.won ? "#C9A44C" : "#75AADB" }}>
                  #{tip.c.n} · {tip.c.isFinal ? "FINAL · " : ""}
                  {tip.c.competition.toUpperCase()}
                </div>
                <div className="text-[15px] text-bone">
                  ARG {tip.c.result} {tip.c.opponent.toUpperCase()}
                </div>
                <div className="text-bone/60">{formatDate(tip.c.date)}</div>
                <div className={tip.c.goals ? "text-celeste" : "text-bone/45"}>
                  {tip.c.goals ? `${"●".repeat(Math.min(tip.c.goals, 5))} ${tip.c.goals} gol${tip.c.goals > 1 ? "es" : ""}` : "sin goles"}
                </div>
              </div>
            )}
          </div>
          <div className="mt-6 lg:hidden">
            <Legend />
          </div>
        </div>
      </div>
    </section>
  );
}
