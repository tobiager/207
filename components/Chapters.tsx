"use client";

import { Fragment, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useLazyGSAP } from "@/lib/useLazyGSAP";
import { chapters, matches } from "@/lib/matches";
import { chapterImages, chapterVideos } from "@/data/gallery";
import { Photo } from "./Photo";
import { LoopVideo } from "./LoopVideo";

const MINI_COLS = 27;
const CELL = 8;
const STEP = 11;

/** Mini-grid de todos los partidos en un solo SVG (3 paths en vez de un nodo por partido). */
function MiniGrid({ picked }: { picked: Set<number> }) {
  const off: string[] = [];
  const on: string[] = [];
  const gold: string[] = [];
  matches.forEach((m, i) => {
    const x = (i % MINI_COLS) * STEP;
    const y = Math.floor(i / MINI_COLS) * STEP;
    const d = `M${x} ${y}h${CELL}v${CELL}h-${CELL}z`;
    if (!picked.has(m.n)) off.push(d);
    else if (m.isFinal && m.won) gold.push(d);
    else on.push(d);
  });
  const rows = Math.ceil(matches.length / MINI_COLS);
  return (
    <svg className="ch-mini block w-full max-w-[300px]" viewBox={`0 0 ${MINI_COLS * STEP - 3} ${rows * STEP - 3}`} aria-hidden="true">
      <path d={off.join("")} fill="rgb(244 241 234 / .1)" />
      <path className="on" d={on.join("")} fill="#75AADB" />
      <path className="on" d={gold.join("")} fill="#C9A44C" />
    </svg>
  );
}

export function Chapters() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useLazyGSAP(() => {
        const t = track.current!;
        const distance = () => t.scrollWidth - window.innerWidth;
        const tween = gsap.to(t, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        gsap.to(".ch-progress", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true },
        });

        gsap.utils.toArray<HTMLElement>(".ch-panel").forEach((panel) => {
          gsap.fromTo(
            panel.querySelector(".ch-photo"),
            { xPercent: -12 },
            { xPercent: 12, ease: "none", scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left right", end: "right left", scrub: true } },
          );
          gsap.from(panel.querySelectorAll(".ch-reveal"), {
            yPercent: 40,
            opacity: 0,
            stagger: 0.08,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left 70%" },
          });
          gsap.from(panel.querySelectorAll(".ch-mini .on"), {
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left 55%" },
          });
        });
  }, root);

  return (
    <section ref={root} id="capitulos" className="relative overflow-hidden border-t border-bone/[0.06]" aria-labelledby="capitulos-title">
      <div className="flex min-h-[100svh] flex-col justify-center py-16 md:py-20">
        <div className="px-gutter mb-6 flex flex-wrap items-center justify-between gap-4 md:mb-10">
          <span id="capitulos-title" className="eyebrow">
            // 04 — Capítulos
          </span>
          <ol className="hidden gap-6 text-xs text-bone/45 md:flex">
            {chapters.map((c) => (
              <li key={c.title}>{c.big ?? c.year}</li>
            ))}
          </ol>
        </div>

        <div ref={track} className="no-scrollbar flex gap-3 overflow-x-auto pl-[var(--gutter)] pr-[var(--gutter)] motion-safe:overflow-visible md:gap-8">
          {chapters.map((c, i) => {
            const picked = new Set(matches.filter(c.pick).map((m) => m.n));
            const img = chapterImages[c.photo ?? c.year];
            const videos = chapterVideos[c.title];
            const num = `${String(i + 1).padStart(2, "0")} / ${String(chapters.length).padStart(2, "0")}`;
            return (
              <Fragment key={c.title}>
              <article
                className="ch-panel relative h-[68svh] min-h-[460px] w-[86vw] flex-none overflow-hidden rounded-md md:h-[72vh] md:w-[78vw]"
                aria-label={`${c.year}: ${c.title}`}
              >
                <div className="ch-photo absolute -inset-x-[14%] inset-y-0">
                  <Photo image={img} alt={`${c.title}, ${c.year}`} credit="none" sizes="(min-width: 768px) 100vw, 110vw" className="h-full" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-night/10" />
                <span className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.16em] text-bone/70 md:left-9 md:top-7 md:text-[11px]">
                  Capítulo {num} · {c.title}
                </span>
                <span className="absolute right-4 top-4 hidden font-mono text-[10px] text-bone/55 md:right-9 md:top-7 md:block">
                  {img?.credit ? `${img.credit} · ${img.license}` : ""}
                </span>
                <div className="absolute inset-x-4 bottom-5 flex flex-wrap items-end justify-between gap-6 md:inset-x-9 md:bottom-9 md:gap-8">
                  <div className="flex flex-col gap-3 overflow-hidden">
                    <span
                      className={`ch-reveal block font-display font-black leading-[0.76] tracking-[-0.02em] ${c.gold ? "text-gold" : "text-bone"}`}
                      style={{ fontSize: "clamp(130px, 21vw, 320px)", paddingTop: "0.1em" }}
                    >
                      {c.big ?? c.year}
                    </span>
                    <p className="ch-reveal max-w-[640px] font-serif text-[26px] italic leading-[1.05] md:text-[44px]">{c.line}</p>
                  </div>
                  <div className="flex w-full flex-col gap-2.5 md:w-[300px]">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-bone/60">
                      {c.tag} · {picked.size} partido{picked.size === 1 ? "" : "s"}
                    </span>
                    <MiniGrid picked={picked} />
                  </div>
                </div>
              </article>
              {videos && (
                <aside
                  className="flex h-[68svh] min-h-[460px] flex-none flex-col gap-4 rounded-md border border-bone/10 bg-night-2/50 p-4 md:h-[72vh] md:gap-6 md:p-7"
                  aria-label={`${c.title}, en video`}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-bone/70 md:text-[11px]">
                    Capítulo {num} · Lo que quedó
                  </span>
                  <div className="flex min-h-0 flex-1 gap-3 md:gap-6">
                    {videos.map((v) => (
                      <figure key={v.src} className="m-0 flex h-full flex-col gap-2.5">
                        <LoopVideo src={v.src} poster={v.poster} label={v.label} className="aspect-[9/16] min-h-0 flex-1" />
                        <figcaption className="max-w-[26ch] font-serif text-base italic leading-tight text-bone/80 md:text-xl">{v.label}</figcaption>
                      </figure>
                    ))}
                  </div>
                </aside>
              )}
              </Fragment>
            );
          })}
        </div>
        <div className="mx-[var(--gutter)] mt-6 h-0.5 bg-bone/10 md:mt-9">
          <div className="ch-progress h-0.5 origin-left scale-x-0 bg-celeste" />
        </div>
      </div>
    </section>
  );
}
