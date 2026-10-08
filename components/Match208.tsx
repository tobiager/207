"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { useLazyGSAP } from "@/lib/useLazyGSAP";
import { site } from "@/config/site";
import { TOTAL_GOALS, TOTAL_MATCHES } from "@/lib/matches";

const m = site.lastMatch;
const isLeo = (scorer: string) => scorer === "Messi";

/** Carga widgets.js de X recién cuando la sección se acerca al viewport (no pesa en el LCP). */
function XEmbeds() {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el || !m.embeds.length) return;
    type Twttr = { widgets?: { load: (el?: HTMLElement) => void } };
    const load = () => {
      const w = window as unknown as { twttr?: Twttr };
      if (w.twttr?.widgets) return w.twttr.widgets.load(el);
      const src = "https://platform.twitter.com/widgets.js";
      if (document.querySelector(`script[src="${src}"]`)) return;
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.charset = "utf-8";
      document.body.appendChild(s);
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          load();
        }
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!m.embeds.length) return null;

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3 border-t border-bone/10 pt-8 text-left">
        <span className="eyebrow">La despedida, en video</span>
        <span className="max-w-[360px] font-mono text-[10px] leading-relaxed text-bone/45 md:text-[11px]">
          Video de su autor, con el embed oficial de X.
        </span>
      </div>
      <div ref={box} className="x-embeds mx-auto w-full max-w-[550px]">
        {m.embeds.map((url) => (
          <blockquote key={url} className="twitter-tweet" data-theme="dark" data-dnt="true" data-align="center" data-conversation="none">
            <a href={url} target="_blank" rel="noreferrer" className="font-mono text-xs text-celeste underline-offset-2 hover:underline">
              Ver en X → {url.replace(/^https:\/\/x\.com\//, "@").replace(/\/status\/.*/, "")}
            </a>
          </blockquote>
        ))}
      </div>
    </div>
  );
}

/** Video vertical de la tribuna: arranca mudo y en loop cuando entra en pantalla; el botón activa el sonido. */
function CrowdVideo() {
  const c = m.crowd;
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          v.preload = "auto";
          v.play().catch(() => {});
        } else v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  };

  return (
    <div className="lm-crowd grid w-full max-w-[1080px] items-center gap-10 border-t border-bone/10 pt-16 text-left md:grid-cols-[minmax(0,1fr)_minmax(0,380px)] md:gap-16 md:pt-24">
      <div className="flex flex-col gap-5 md:gap-7">
        <span className="eyebrow">El Monumental</span>
        <p className="font-serif text-[40px] italic leading-[1] tracking-[-0.01em] md:text-[64px]">{c.title}</p>
        <p className="max-w-[420px] font-mono text-[11px] leading-relaxed text-bone/55 md:text-xs">Tocá el video para escucharlo.</p>
      </div>
      <button
        type="button"
        onClick={toggle}
        className="group relative mx-auto block aspect-[9/16] w-full max-w-[340px] overflow-hidden rounded-2xl border border-celeste/25 shadow-[0_30px_100px_rgb(117_170_219/0.18)]"
        aria-label={muted ? "Activar sonido del video" : "Silenciar video"}
      >
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover"
          src={c.src}
          poster={c.poster}
          muted
          loop
          playsInline
          preload="none"
          aria-label="Video de la tribuna del Monumental coreando a Messi en su despedida"
        />
        <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night/80 to-transparent" />
        <span className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-bone/25 bg-night/60 px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-bone backdrop-blur transition-colors duration-300 group-hover:border-celeste md:text-[11px]">
          <span className={`h-1.5 w-1.5 rounded-full ${muted ? "bg-bone/50" : "live-dot bg-celeste"}`} />
          {muted ? "Activar sonido" : "Sonando"}
        </span>
      </button>
    </div>
  );
}

/** Foto con el tratamiento duotono de la web; recupera el color con hover o tap. */
function QuotePhoto({ src, alt }: { src: string; alt: string }) {
  const [color, setColor] = useState(false);
  return (
    <figure
      className="lm-photo m-0"
      data-cursor="grow"
      onPointerEnter={(e) => e.pointerType === "mouse" && setColor(true)}
      onPointerLeave={() => setColor(false)}
      onClick={() => setColor((v) => !v)}
    >
      <div className={`duotone photo-grain relative aspect-[4/5] overflow-hidden rounded ${color ? "is-color" : ""}`}>
        <Image src={src} alt={alt} fill sizes="(min-width: 768px) 520px, 50vw" className="object-cover" />
      </div>
    </figure>
  );
}

/** "Poder es que la gente te quiera." y las dos fotos, cerrando la sección. */
function Quote() {
  const q = m.quote;
  return (
    <div className="lm-quote flex w-full flex-col items-center gap-10 border-t border-bone/10 pt-16 md:gap-16 md:pt-24">
      <p className="lm-quote-text max-w-[1100px] text-balance font-serif italic leading-[0.95] tracking-[-0.02em]" style={{ fontSize: "clamp(52px, 8.4vw, 136px)" }}>
        {q.text}
      </p>
      <div className="grid w-full max-w-[1080px] grid-cols-2 gap-2.5 md:gap-6">
        {q.photos.map((ph, i) => (
          <div key={ph.src} className={i === 1 ? "mt-10 md:mt-24" : ""}>
            <QuotePhoto src={ph.src} alt={ph.alt} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** El último cuadradito, pintado: resultado, goles minuto a minuto y lo que dejó Leo. */
export function Match208() {
  const root = useRef<HTMLElement>(null);
  const goalsByLeo = m.goals.filter((g) => isLeo(g.scorer)).length;
  const assists = m.goals.filter((g) => g.messi.startsWith("asistencia")).length;

  useLazyGSAP(() => {
    const st = { trigger: root.current, start: "top 70%" };
    gsap.fromTo(
      ".lm-square",
      { scale: 0.6, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.6, ease: "expo.out", scrollTrigger: st },
    );
    gsap.fromTo(".lm-bar", { scaleX: 0 }, { scaleX: 1, duration: 1.8, ease: "power3.inOut", scrollTrigger: { trigger: ".lm-timeline", start: "top 80%" } });
    gsap.from(".lm-dot", {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      ease: "back.out(3)",
      stagger: 0.35,
      delay: 0.6,
      scrollTrigger: { trigger: ".lm-timeline", start: "top 80%" },
    });
    gsap.from(".lm-quote-text", { y: 40, opacity: 0, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: ".lm-quote", start: "top 75%" } });
    gsap.utils.toArray<HTMLElement>(".lm-photo").forEach((el) => {
      gsap.from(el, { y: 60, opacity: 0, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } });
    });
    gsap.from(".lm-goal", { y: 18, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: ".lm-goals", start: "top 85%" } });
  }, root);

  return (
    <section
      ref={root}
      id="partido-208"
      className="px-gutter relative flex flex-col items-center gap-12 overflow-hidden border-t border-bone/[0.06] py-28 text-center md:gap-16 md:py-44"
      aria-labelledby="p208-title"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgb(117_170_219/0.16),transparent_55%)]" />
      <span className="eyebrow relative">// 07 — Partido {m.n} · La despedida</span>

      <div className="lm-square relative flex h-36 w-36 items-center justify-center rounded-2xl bg-celeste font-display text-6xl font-black text-night shadow-[0_0_100px_rgb(117_170_219/0.6)] md:h-[220px] md:w-[220px] md:text-[84px]">
        <span className="flex flex-col items-center leading-none">
          {m.n}
          <span className="mt-2 text-[22px] tracking-wide md:text-[34px]">{m.score}</span>
        </span>
      </div>

      <div className="relative flex flex-col items-center gap-4 md:gap-5">
        <h2 id="p208-title" className="h-display text-[54px] md:text-[96px]">
          ARG {m.score} {m.short}
        </h2>
        <span className="text-[11px] tracking-[0.16em] text-bone/65 md:text-sm">
          {m.competition.toUpperCase()} · {m.venue.toUpperCase()} · {m.date}
        </span>
      </div>

      {/* Lo que hizo Leo */}
      <dl className="relative grid w-full max-w-[760px] grid-cols-3 gap-4 border-y border-bone/10 py-6 md:gap-10 md:py-8">
        {[
          { v: goalsByLeo, l: goalsByLeo === 1 ? "Gol" : "Goles", cls: "text-celeste" },
          { v: assists, l: assists === 1 ? "Asistencia" : "Asistencias", cls: "" },
          { v: `${goalsByLeo + assists}/${m.goals.length}`, l: "Goles con su firma", cls: "text-celeste" },
        ].map((s) => (
          <div key={s.l} className="flex flex-col-reverse items-center gap-3">
            <dt className="text-[10px] uppercase tracking-[0.14em] text-bone/55 md:text-[11px]">{s.l}</dt>
            <dd className={`m-0 font-display text-[48px] font-black leading-[0.9] tabular-nums md:text-[80px] ${s.cls}`}>{s.v}</dd>
          </div>
        ))}
      </dl>

      {/* Minuto a minuto */}
      <div className="lm-timeline relative w-full max-w-[760px]" aria-hidden="true">
        <div className="relative h-px w-full bg-bone/15">
          <div className="lm-bar absolute inset-0 origin-left bg-celeste/60" />
          {m.goals.map((g) => (
            <span
              key={g.min}
              className={`lm-dot absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                isLeo(g.scorer) ? "h-4 w-4 bg-celeste shadow-[0_0_24px_#75AADB]" : "h-2.5 w-2.5 bg-bone"
              }`}
              style={{ left: `${(g.min / 90) * 100}%` }}
            />
          ))}
        </div>
        <div className="mt-3 flex justify-between font-mono text-[10px] text-bone/40">
          <span>0&apos;</span>
          <span>45&apos;</span>
          <span>90&apos;</span>
        </div>
      </div>

      <ol className="lm-goals relative flex w-full max-w-[760px] flex-col divide-y divide-bone/10 text-left">
        {m.goals.map((g) => {
          const leo = isLeo(g.scorer);
          return (
            <li key={g.min} className="lm-goal grid grid-cols-[56px_minmax(0,1fr)] items-baseline gap-4 py-4 md:grid-cols-[88px_minmax(0,1fr)_auto] md:py-5">
              <span className={`font-display text-3xl font-black tabular-nums md:text-[44px] ${leo ? "text-celeste" : "text-bone/80"}`}>{g.min}&apos;</span>
              <span className={`font-serif text-2xl italic leading-tight md:text-[32px] ${leo ? "text-bone" : "text-bone/80"}`}>
                {g.scorer}, {g.how}
              </span>
              <span
                className={`col-start-2 font-mono text-[11px] uppercase tracking-[0.12em] md:col-start-3 md:text-xs ${leo ? "text-celeste" : "text-bone/55"}`}
              >
                {leo ? `★ ${g.messi}` : `${g.messi} de Messi`}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="relative flex w-full justify-center">
        <CrowdVideo />
      </div>

      <p className="relative max-w-[760px] font-serif text-[28px] italic leading-tight text-bone/80 md:text-[40px]">
        {TOTAL_MATCHES} partidos. {TOTAL_GOALS} goles.
        <br />
        <span className="text-celeste">El último cuadradito, pintado.</span>
      </p>

      <div className="relative w-full max-w-[1344px]">
        <XEmbeds />
      </div>

      <div className="relative w-full max-w-[1344px]">
        <Quote />
      </div>
    </section>
  );
}
