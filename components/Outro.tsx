"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { useLazyGSAP } from "@/lib/useLazyGSAP";
import { TITLES, TOTAL_GOALS, TOTAL_MATCHES } from "@/lib/matches";
import { site } from "@/config/site";
import { useStore } from "@/lib/store";
import { shareLinks, shareText } from "@/lib/share";
import { LinkIcon, WhatsAppIcon, XIcon } from "./icons";
import { Magnetic } from "./Magnetic";

const CLOTHS = [
  { l: "6%", t: "14%", w: 150, r: -12, o: 0.12 },
  { l: "80%", t: "8%", w: 120, r: 10, o: 0.09 },
  { l: "68%", t: "70%", w: 110, r: -6, o: 0.08 },
  { l: "16%", t: "72%", w: 96, r: 14, o: 0.07 },
  { l: "46%", t: "4%", w: 80, r: 4, o: 0.06 },
  { l: "90%", t: "44%", w: 70, r: -18, o: 0.06 },
  { l: "2%", t: "46%", w: 64, r: 8, o: 0.05 },
];

const STATS = [
  { v: TOTAL_MATCHES, label: "Partidos", cls: "" },
  { v: TOTAL_GOALS, label: "Goles", cls: "text-celeste" },
  { v: TITLES, label: "Títulos", cls: "text-gold" },
  { v: 21, label: "Años", cls: "" },
];

export function Outro() {
  const root = useRef<HTMLElement>(null);
  const { scrollTo } = useStore();
  const [copied, setCopied] = useState(false);
  const links = shareLinks(site.url, shareText());

  useLazyGSAP(() => {
        const split = SplitText.create(".outro-title", { type: "words,chars", wordsClass: "oword", charsClass: "ochar" });
        gsap.from(split.chars, {
          yPercent: 120,
          rotateX: -80,
          opacity: 0,
          duration: 1.8,
          ease: "expo.out",
          stagger: 0.07,
          scrollTrigger: { trigger: ".outro-title", start: "top 80%" },
        });
        gsap.utils.toArray<HTMLElement>(".ostat").forEach((el) => {
          const to = Number(el.dataset.v);
          const o = { v: 0 };
          gsap.to(o, {
            v: to,
            duration: 2.4,
            ease: "power4.out",
            scrollTrigger: { trigger: el, start: "top 90%" },
            onUpdate: () => (el.textContent = String(Math.round(o.v))),
          });
        });

        // Pañuelos: flotan y se agitan. Los loops arrancan pausados y solo corren con la sección en pantalla
        // (antes eran 21 tweens infinitos desde la carga, aunque estuvieran a 20.000 px).
        const cloths = gsap.utils.toArray<HTMLElement>(".cloth");
        const loops = cloths.flatMap((c, i) => [
          gsap.to(c, { y: gsap.utils.random(-40, -16), duration: gsap.utils.random(5, 8), ease: "sine.inOut", yoyo: true, repeat: -1, delay: i * 0.3, paused: true }),
          gsap.to(c, { rotation: `+=${gsap.utils.random(6, 14)}`, duration: gsap.utils.random(6, 10), ease: "sine.inOut", yoyo: true, repeat: -1, paused: true }),
          gsap.to(c.querySelector("path"), { skewX: gsap.utils.random(-8, 8), scaleX: gsap.utils.random(0.86, 0.94), transformOrigin: "0% 50%", duration: gsap.utils.random(1.4, 2.2), ease: "sine.inOut", yoyo: true, repeat: -1, paused: true }),
        ]);
        ScrollTrigger.create({ trigger: root.current, onToggle: (self) => loops.forEach((t) => t.paused(!self.isActive)) });
        // Viento: un quickTo por pañuelo en vez de 7 tweens nuevos por cada pointermove
        const blow = cloths.map((c) => [gsap.quickTo(c, "x", { duration: 2.2, ease: "power3.out" }), gsap.quickTo(c, "skewY", { duration: 2.2, ease: "power3.out" })]);
        const wind = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          blow.forEach(([x, skew], i) => {
            x(nx * (40 + i * 8));
            skew(nx * 6);
          });
        };
        const el = root.current;
        el?.addEventListener("pointermove", wind, { passive: true });
        return () => {
          split.revert();
          el?.removeEventListener("pointermove", wind);
        };
  }, root);

  const btn =
    "inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full border border-bone/25 px-6 font-mono text-[13px] text-bone transition-colors duration-300 hover:border-celeste hover:text-celeste md:w-auto";

  return (
    <section ref={root} id="gracias" className="px-gutter relative flex flex-col items-center gap-12 overflow-hidden border-t border-bone/[0.06] py-32 md:gap-20 md:py-56" aria-labelledby="gracias-title">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {CLOTHS.map((c, i) => (
          <svg key={i} className="cloth absolute" viewBox="0 0 120 100" width={c.w} style={{ left: c.l, top: c.t, rotate: `${c.r}deg` }}>
            <path
              d="M8 18 C 30 4, 58 22, 84 8 C 98 2, 108 10, 114 6 C 110 34, 118 58, 112 86 C 86 96, 60 80, 34 94 C 22 98, 12 92, 4 96 C 10 70, 2 44, 8 18 Z"
              fill={`rgb(244 241 234 / ${c.o})`}
            />
          </svg>
        ))}
      </div>

      <h2 id="gracias-title" className="outro-title relative text-center font-serif font-normal italic leading-[0.9] tracking-[-0.02em] [perspective:600px]" style={{ fontSize: "clamp(92px, 16vw, 250px)" }}>
        Gracias, Leo.
      </h2>

      <div className="relative grid w-full max-w-[980px] grid-cols-2 gap-6 text-center md:grid-cols-4 md:gap-12">
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col gap-1.5">
            <span className={`ostat font-display text-[56px] font-black leading-[0.9] tabular-nums md:text-[80px] ${s.cls}`} data-v={s.v}>
              {s.v}
            </span>
            <span className="text-[10px] uppercase tracking-[0.14em] text-bone/55 md:text-[11px]">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="relative grid w-full grid-cols-2 gap-2.5 md:flex md:w-auto md:flex-wrap md:justify-center md:gap-3">
        <Magnetic className="w-full md:w-auto">
          <a className={btn} href={links.whatsapp} target="_blank" rel="noreferrer">
            <WhatsAppIcon /> WhatsApp
          </a>
        </Magnetic>
        <Magnetic className="w-full md:w-auto">
          <a className={btn} href={links.x} target="_blank" rel="noreferrer">
            <XIcon /> X
          </a>
        </Magnetic>
        <Magnetic className="w-full md:w-auto">
          <button
            type="button"
            className={btn}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(site.url);
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              } catch {}
            }}
          >
            <LinkIcon /> {copied ? "¡Copiado!" : "Copiar link"}
          </button>
        </Magnetic>
        <div className="col-span-2 md:col-span-1">
          <Magnetic className="w-full md:w-auto">
            <button
              type="button"
              onClick={() => {
                scrollTo("#partidos", -20);
                window.dispatchEvent(new Event("207:pick"));
              }}
              className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-celeste px-7 font-mono text-[13px] font-bold text-night transition-colors duration-300 hover:bg-bone md:w-auto"
            >
              Elegí tu partido favorito →
            </button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
