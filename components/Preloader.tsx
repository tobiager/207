"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useStore } from "@/lib/store";
import { cells } from "@/lib/matches";

export const PRELOADER_DONE = "207:ready";

export function signalReady() {
  (window as unknown as { __207ready?: boolean }).__207ready = true;
  window.dispatchEvent(new Event(PRELOADER_DONE));
}

export function onReady(cb: () => void) {
  if ((window as unknown as { __207ready?: boolean }).__207ready) {
    cb();
    return () => {};
  }
  window.addEventListener(PRELOADER_DONE, cb, { once: true });
  return () => window.removeEventListener(PRELOADER_DONE, cb);
}

const COLS = 23; // 23 × 9 = 207

/** ¿Se reproduce la intro? Una vez por sesión; /p/n, ?intro=0 y reduced-motion la saltean. Se cachea. */
export function shouldPlayIntro() {
  const w = window as unknown as { __207intro?: boolean };
  if (w.__207intro !== undefined) return w.__207intro;
  let seen = false;
  try {
    seen = sessionStorage.getItem("207:intro") === "1";
    sessionStorage.setItem("207:intro", "1");
  } catch {}
  w.__207intro =
    !seen &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !window.location.pathname.startsWith("/p/") &&
    new URLSearchParams(window.location.search).get("intro") !== "0";
  return w.__207intro;
}

function drawCounter(cv: HTMLCanvasElement | null, v: number) {
  const ctx = cv?.getContext("2d");
  if (!cv || !ctx) return;
  const family = getComputedStyle(document.body).getPropertyValue("--font-jetbrains-mono") || "monospace";
  ctx.clearRect(0, 0, cv.width, cv.height);
  ctx.font = `500 128px ${family}, ui-monospace, monospace`;
  ctx.textAlign = "center";
  ctx.fillStyle = "#F4F1EA";
  ctx.fillText(String(v).padStart(3, "0"), cv.width / 2, 108);
}

/** Pantalla negra, contador mono 000 → 207 que acelera y se rompe en 207 cuadraditos. */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLCanvasElement>(null);
  const shards = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  const { lenis } = useStore();

  useEffect(() => {
    if (!shouldPlayIntro()) {
      setGone(true);
      signalReady();
      return;
    }
    const state = { v: 0 };
    drawCounter(counter.current, 0);
    document.fonts?.ready.then(() => drawCounter(counter.current, Math.round(state.v)));
    document.documentElement.style.overflow = "hidden";
    lenis.current?.stop();
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      const sq = gsap.utils.toArray<HTMLElement>(".shard", shards.current);
      gsap.set(sq, { opacity: 0, scale: 0.4 });

      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.style.overflow = "";
          lenis.current?.start();
          setGone(true);
        },
      });
      tl.to(state, {
        v: 207,
        duration: 2.1,
        ease: "expo.in",
        onUpdate: () => {
          drawCounter(counter.current, Math.round(state.v));
        },
      })
        .to(".pl-bar", { scaleX: 1, duration: 2.1, ease: "expo.in" }, 0)
        .to(counter.current, { scale: 1.08, duration: 0.18, ease: "power2.out" })
        .to(counter.current, { opacity: 0, scale: 0.9, duration: 0.25, ease: "power2.in" })
        .to(sq, { opacity: 1, scale: 1, duration: 0.3, stagger: { amount: 0.25, from: "center", grid: [9, COLS] } }, "<")
        .add(() => signalReady(), "+=0.05")
        .to(sq, {
          x: () => gsap.utils.random(-window.innerWidth * 0.75, window.innerWidth * 0.75),
          y: () => gsap.utils.random(-window.innerHeight * 0.8, window.innerHeight * 0.8),
          rotation: () => gsap.utils.random(-220, 220),
          scale: () => gsap.utils.random(0.6, 2.4),
          opacity: 0,
          duration: 1.5,
          ease: "expo.out",
          stagger: { amount: 0.35, from: "center", grid: [9, COLS] },
        })
        .to(root.current, { backgroundColor: "rgba(0,0,0,0)", duration: 1.1, ease: "power2.inOut" }, "<");
      // Mobile: mismo efecto comprimido a < 1 s (la intro completa dura ~4.4 s) para no demorar el LCP.
      if (window.matchMedia("(max-width: 767px)").matches) tl.timeScale(5);
    }, root);

    return () => {
      ctx.revert();
      document.documentElement.style.overflow = "";
    };
  }, [lenis]);

  if (gone) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[95] flex items-center justify-center bg-black" aria-hidden="true">
      <div className="relative flex flex-col items-center gap-6">
        {/* Canvas (no es candidato a LCP): así el LCP lo toma el hero. El número se dibuja en JS. */}
        <canvas ref={counter} width={380} height={128} className="h-auto w-[65vw] md:w-[360px]" aria-hidden="true" />
        <div
          ref={shards}
          className="pointer-events-none absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 gap-[3px]"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
        >
          {cells.map((c) => (
            <span
              key={c.n}
              className="shard block h-[9px] w-[9px] rounded-[2px] md:h-[12px] md:w-[12px]"
              style={{
                background: c.isFinal && c.won ? "#C9A44C" : `var(--lvl-${c.level})`,
                opacity: 0,
                transform: "scale(0.4)",
              }}
            />
          ))}
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 w-40 -translate-x-1/2 md:w-56">
        <div className="h-px w-full bg-bone/10">
          <div className="pl-bar h-px w-full origin-left scale-x-0 bg-celeste" />
        </div>
        <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-bone/40">
          cargando 207 partidos
        </p>
      </div>
    </div>
  );
}
