"use client";

import { useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { useLazyGSAP } from "@/lib/useLazyGSAP";
import { TOTAL_GOALS, TOTAL_MATCHES } from "@/lib/matches";

const LINES = [
  "Durante veintiún años jugó con el peso de un país en la espalda.",
  "Perdió finales, se fue, volvió.",
  "Y un día, el mundo entero fue celeste y blanco.",
];

const MARQUEE = `GRACIAS LEO · ${TOTAL_MATCHES} · ${TOTAL_GOALS} · 10 · `;

export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useLazyGSAP(() => {
        const split = SplitText.create(".manifesto-text", { type: "words", wordsClass: "mword", aria: "none" });
        gsap.fromTo(
          split.words,
          { opacity: 0.12, filter: "blur(6px)", y: 8 },
          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            ease: "none",
            stagger: 0.12,
            scrollTrigger: { trigger: ".manifesto-text", start: "top 78%", end: "bottom 42%", scrub: true },
          },
        );
        gsap.fromTo(
          ".manifesto-marquee",
          { xPercent: 0 },
          { xPercent: -18, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
        return () => split.revert();
  }, root);

  return (
    <section ref={root} className="px-gutter relative overflow-hidden py-28 md:py-52" aria-labelledby="manifiesto">
      <div className="manifesto-marquee pointer-events-none absolute left-0 top-1/2 -translate-y-1/2" aria-hidden="true">
        <div className="marquee outline-text flex whitespace-nowrap font-display text-[150px] font-black leading-none md:text-[280px]">
          <span>{MARQUEE.repeat(4)}</span>
          <span>{MARQUEE.repeat(4)}</span>
        </div>
      </div>
      <div className="relative mx-auto flex max-w-[1180px] flex-col gap-8 md:gap-10">
        <span id="manifiesto" className="eyebrow">
          // 01 — Manifiesto
        </span>
        <p className="manifesto-text font-serif text-[40px] leading-[1.04] tracking-[-0.01em] md:text-[clamp(44px,5.4vw,88px)]">
          {LINES.map((l, i) => (
            <span key={i} className={i === 2 ? "italic text-celeste" : undefined}>
              {l}{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
