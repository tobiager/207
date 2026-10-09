"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useLazyGSAP } from "@/lib/useLazyGSAP";
import { isLite } from "@/lib/lite";
import { matches, levelOf } from "@/lib/matches";

const COLS = 27;
const LEVEL = ["rgba(117,170,219,0.16)", "rgba(117,170,219,0.42)", "rgba(117,170,219,0.72)", "#75AADB"];
/** La multitud: el mismo código de colores del gráfico, con mayoría de cuadraditos tenues. */
const CROWD: [string, number][] = [
  ["rgba(117,170,219,0.14)", 46],
  ["rgba(117,170,219,0.34)", 24],
  ["rgba(117,170,219,0.6)", 15],
  ["#75AADB", 9],
  ["rgba(244,241,234,0.7)", 4],
  ["#C9A44C", 2],
];
const CROWD_SUM = CROWD.reduce((a, [, w]) => a + w, 0);

type Part = { sx: number; sy: number; ss: number; tx: number; ty: number; ts: number; c0: string; c1: string; d: number; own: boolean };

/** PRNG determinístico: el "estallido" es siempre el mismo (y no cambia entre renders). */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp = (v: number) => Math.min(1, Math.max(0, v));

function build(w: number, h: number, lite: boolean): Part[] {
  const mobile = w < 768;
  const step = mobile ? Math.min(12, (w - 32) / COLS) : 18;
  const size = step * 0.74;
  const rows = Math.ceil(matches.length / COLS);
  const ox = (w - (COLS * step - (step - size))) / 2;
  const oy = h * 0.4 - (rows * step) / 2;
  const rand = rng(208);

  const cells = matches.map((m, i) => {
    const color = m.isFinal ? (m.won ? "#C9A44C" : "#2A3442") : LEVEL[levelOf(m)];
    return { x: ox + (i % COLS) * step, y: oy + Math.floor(i / COLS) * step, c: color };
  });

  // Destino: un gráfico del tamaño de la pantalla (y que se sale de los bordes), una casilla por persona.
  const gstep = lite ? 26 : mobile ? 15 : 19;
  const gsize = gstep * 0.72;
  const gcols = Math.ceil(w / gstep) + 1;
  const grows = Math.ceil(h / gstep) + 1;
  const gx = (w - gcols * gstep) / 2;
  const gy = (h - grows * gstep) / 2;
  const slots: { x: number; y: number }[] = [];
  for (let r = 0; r < grows; r++) for (let c = 0; c < gcols; c++) slots.push({ x: gx + c * gstep, y: gy + r * gstep });
  // Mezcla determinística: los 208 originales caen en casillas al azar.
  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }
  const cx = w / 2;
  const cy = h * 0.4;
  const far = Math.hypot(w, h) / 2;

  return slots.map((t, i) => {
    const own = i < cells.length;
    const src = cells[i % cells.length];
    let roll = rand() * CROWD_SUM;
    const crowd = CROWD.find(([, wt]) => (roll -= wt) < 0)?.[0] ?? CROWD[0][0];
    return {
      sx: src.x,
      sy: src.y,
      ss: own ? size : size * 0.4,
      tx: t.x,
      ty: t.y,
      ts: gsize,
      c0: src.c,
      c1: own ? src.c : crowd,
      // Sale como una onda desde el gráfico hacia los bordes.
      d: own ? rand() * 0.15 : Math.min(1, Math.hypot(t.x - cx, t.y - cy) / far) * 0.75 + rand() * 0.25,
      own,
    };
  });
}

/**
 * Apertura de "Lo que generó": vuelve el contribution graph de los 208 partidos y, al scrollear,
 * se desarma en miles de cuadraditos que llenan la pantalla. Cada uno, una persona.
 */
export function GraphBreak() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const state = useRef<{ parts: Part[]; w: number; h: number; p: number }>({ parts: [], w: 0, h: 0, p: 1 });

  const draw = (p: number) => {
    const cv = canvas.current;
    const st = state.current;
    st.p = p;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, st.w, st.h);
    for (const q of st.parts) {
      // Antes de 0.18 el gráfico está quieto; después cada cuadradito sale con su propio retraso.
      const t = ease(clamp((p - 0.18 - q.d * 0.4) / 0.42));
      const own = q.own;
      if (t <= 0 && !own) continue;
      const x = q.sx + (q.tx - q.sx) * t;
      const y = q.sy + (q.ty - q.sy) * t;
      const s = q.ss + (q.ts - q.ss) * t;
      ctx.globalAlpha = own ? 1 : Math.min(1, t * 2.5) * 0.9;
      ctx.fillStyle = t > 0.5 ? q.c1 : q.c0;
      ctx.fillRect(x, y, s, s);
    }
    ctx.globalAlpha = 1;
  };

  // Medidas y primer dibujo (estado final: sin movimiento, se ve directamente la multitud).
  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const lite = isLite();
    const fit = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(r.width * dpr);
      cv.height = Math.round(r.height * dpr);
      state.current = { ...state.current, parts: build(r.width, r.height, lite), w: r.width, h: r.height };
      draw(state.current.p);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(cv);
    return () => ro.disconnect();
  }, []);

  useLazyGSAP(() => {
    const proxy = { p: 0 };
    draw(0);
    gsap.set(".gb-line-2", { opacity: 0, y: 24 });
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: root.current, start: "top top", end: "+=170%", pin: true, scrub: 0.6, anticipatePin: 1 },
    });
    tl.to(proxy, { p: 1, duration: 1, onUpdate: () => draw(proxy.p) }, 0)
      .to(".gb-line-1", { opacity: 0.35, duration: 0.2 }, 0.42)
      .to(".gb-line-2", { opacity: 1, y: 0, duration: 0.22 }, 0.55)
      .to(".gb-veil", { opacity: 1, duration: 0.3 }, 0.45);
    return () => draw(1);
  }, root);

  return (
    <section ref={root} id="lo-que-genero" className="relative h-[100svh] overflow-hidden" aria-labelledby="lqg-title">
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      <div className="gb-veil pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_72%,rgb(7_17_31/0.92),rgb(7_17_31/0.55)_45%,transparent_75%)] opacity-60" />
      <span className="eyebrow px-gutter absolute left-0 top-8 md:top-12">// 07 — Lo que generó</span>
      <div className="px-gutter absolute inset-x-0 bottom-[12svh] flex flex-col items-center gap-3 text-center md:bottom-[14svh] md:gap-4">
        <h2 id="lqg-title" className="sr-only">
          Lo que generó
        </h2>
        <p className="gb-line-1 max-w-[900px] text-balance font-serif text-[30px] italic leading-[1.05] md:text-[56px]">
          Lo que hizo en la cancha entra en un gráfico.
        </p>
        <p className="gb-line-2 max-w-[900px] text-balance font-serif text-[38px] italic leading-[1.02] text-celeste md:text-[76px]">
          Lo que hizo en nosotros, no.
        </p>
      </div>
    </section>
  );
}
