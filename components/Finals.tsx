"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useLazyGSAP } from "@/lib/useLazyGSAP";
import { finals, formatDate } from "@/lib/matches";

const LABEL: Record<string, string> = {
  Mundial: "Mundial",
  "Copa América": "Copa América",
  Finalissima: "Finalissima",
};

export function Finals() {
  const root = useRef<HTMLElement>(null);
  const titles = finals.filter((f) => f.won).length;

  useLazyGSAP(() => {
        const cards = gsap.utils.toArray<HTMLElement>(".fin-card");
        const won = cards.filter((c) => c.dataset.won === "true");
        won.forEach((c) => {
          gsap.set(c.querySelector(".fin-sq"), { backgroundColor: "#2A3442", boxShadow: "0 0 0 rgba(201,164,76,0)" });
          gsap.set(c.querySelectorAll(".fin-gold-text"), { color: "rgba(244,241,234,.45)" });
        });
        gsap.set(cards, { opacity: 0, y: 40 });
        gsap.set(".fin-part", { opacity: 0 });

        const tl = gsap.timeline({ scrollTrigger: { trigger: ".fin-row", start: "top 70%" } });
        cards.forEach((c, i) => {
          tl.to(c, { opacity: 1, y: 0, duration: 0.9, ease: "power4.out" }, i === 0 ? 0 : "-=0.6");
        });
        tl.addLabel("glory", "+=0.4");
        won.forEach((c, i) => {
          const at = `glory+=${i * 0.75}`;
          const sq = c.querySelector(".fin-sq");
          tl.to(sq, { backgroundColor: "#C9A44C", boxShadow: "0 0 70px rgba(201,164,76,.5)", duration: 0.5, ease: "power2.out" }, at)
            .fromTo(sq, { scale: 1.12 }, { scale: 1, duration: 1.2, ease: "expo.out" }, at)
            .to(c.querySelectorAll(".fin-gold-text"), { color: (_i: number, el: HTMLElement) => el.dataset.to ?? "#C9A44C", duration: 0.4 }, at)
            .fromTo(".fin-flash", { opacity: 0.55 }, { opacity: 0, duration: 1.1, ease: "power2.out" }, at)
            .fromTo(
              c.querySelectorAll(".fin-part"),
              { x: 0, y: 0, opacity: 1, scale: 1 },
              {
                x: () => gsap.utils.random(-160, 160),
                y: () => gsap.utils.random(-200, 60),
                opacity: 0,
                scale: () => gsap.utils.random(0.2, 1.2),
                duration: () => gsap.utils.random(1.2, 2.2),
                ease: "expo.out",
              },
              at,
            );
        });
  }, root);

  return (
    <section ref={root} id="finales" className="px-gutter relative overflow-hidden border-t border-bone/[0.06] py-24 md:py-40" aria-labelledby="finales-title">
      <div className="fin-flash pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgb(255_236_180/0.35),transparent_65%)] opacity-0" />
      <div className="pointer-events-none absolute -right-48 top-24 h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle,rgb(201_164_76/0.14),transparent_60%)]" />
      <div className="relative mx-auto flex max-w-[1344px] flex-col gap-12 md:gap-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-5">
            <span className="eyebrow">// 06 — Las finales</span>
            <h2 id="finales-title" className="h-display text-[58px] md:text-[96px]">
              {finals.length} finales.
              <br />
              <span className="text-gold">{titles === 4 ? "Cuatro" : titles} títulos.</span>
            </h2>
          </div>
          <p className="max-w-[420px] font-serif text-2xl italic leading-tight text-bone/75 md:text-[30px]">Primero el sufrimiento. Después, la gloria.</p>
        </div>

        <ol className="fin-row grid grid-cols-3 gap-2.5 md:gap-3.5 lg:grid-cols-9">
          {finals.map((f) => (
            <li key={f.n} className="fin-card flex flex-col gap-2 md:gap-3.5" data-won={f.won}>
              <div
                className={`fin-sq relative flex aspect-square items-end rounded-md p-2 md:rounded-lg md:p-3 ${
                  f.won ? "bg-gold shadow-[0_0_60px_rgb(201_164_76/0.45)]" : "bg-slate"
                }`}
              >
                <span
                  className={`fin-gold-text relative z-[1] font-display text-3xl font-black leading-none md:text-[44px] ${f.won ? "text-night" : "text-bone/45"}`}
                  data-to="#07111F"
                >
                  &apos;{f.date.slice(2, 4)}
                </span>
                {f.won && (
                  <span className="pointer-events-none absolute left-1/2 top-1/2" aria-hidden="true">
                    {Array.from({ length: 22 }, (_, i) => (
                      <span key={i} className="fin-part absolute block h-1.5 w-1.5 rounded-full bg-gold opacity-0 shadow-[0_0_8px_#C9A44C]" />
                    ))}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-0.5 text-[10px] leading-snug md:text-[11px]">
                <span className={`fin-gold-text tracking-[0.08em] uppercase ${f.won ? "text-gold" : "text-bone/45"}`}>{LABEL[f.competition] ?? f.competition}</span>
                <span className="text-xs text-bone md:text-[13px]">vs {f.opponent}</span>
                <span className="text-bone/50">{f.result}</span>
                <span className="hidden text-bone/35 md:block">{formatDate(f.date)}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
