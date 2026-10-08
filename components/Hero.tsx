"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { heroImage } from "@/data/gallery";
import { Photo } from "./Photo";
import { Countdown } from "./Countdown";
import { TOTAL_MATCHES } from "@/lib/matches";
import { onReady, shouldPlayIntro } from "./Preloader";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const intro = shouldPlayIntro();
        if (intro) gsap.set(".hero-digit", { yPercent: 110 });
        gsap.set(".hero-fade", { opacity: 0, y: 24 });
        gsap.set(".hero-photo", { scale: 1.25, opacity: intro ? 0 : 1 });

        // Resolver los elementos acá: el callback corre dentro del contexto GSAP del preloader.
        const q = gsap.utils.selector(root);
        const photo = q(".hero-photo"), digits = q(".hero-digit"), fades = q(".hero-fade");
        const off = onReady(() => {
          const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
          tl.to(photo, { scale: 1.08, opacity: 1, duration: 2.4 }, 0)
            .to(digits, { yPercent: 0, duration: intro ? 1.6 : 0, stagger: intro ? 0.09 : 0 }, 0.1)
            .to(fades, { opacity: 1, y: 0, duration: 1.2, stagger: 0.08 }, 0.7);
        });

        // Parallax lento de la foto y del número
        gsap.to(".hero-photo-wrap", {
          yPercent: 22,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".hero-207", {
          yPercent: -12,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        return off;
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* Foto duotono de fondo */}
      <div className="hero-photo-wrap absolute inset-0 -z-0">
        <div className="hero-photo absolute inset-0 md:left-[44%] md:[mask-image:linear-gradient(to_right,transparent,#000_24%)]">
          <Photo image={heroImage} alt="Messi con la camiseta de la Selección" credit="none" priority sizes="100vw" className="h-full" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-night/70" />
        <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_40%,rgb(7_17_31/0.9)_100%)]" />
      </div>

      {/* Nav */}
      <header className="hero-fade px-gutter relative z-10 flex items-center justify-between gap-4 pt-5 text-[11px] uppercase tracking-[0.14em] md:pt-7">
        <div className="flex items-center gap-5">
          <span className="font-display text-2xl font-black tracking-normal">{TOTAL_MATCHES}</span>
          <span className="hidden text-bone/55 md:inline">Lionel Andrés Messi · Selección 2005—2026</span>
        </div>
        <Countdown />
      </header>

      <div className="px-gutter relative z-10 mt-auto pb-8 md:pb-14">
        <span className="hero-fade mb-8 block font-mono text-[10px] text-bone/30 md:mb-12 md:text-[11px]">
          {heroImage ? `Foto: ${heroImage.credit} · ${heroImage.license}` : ""}
        </span>
        <h1
          className="hero-207 relative isolate font-display font-black leading-[0.78] tracking-[-0.02em] text-bone"
          style={{ fontSize: "clamp(220px, 46vw, 680px)" }}
          aria-label={`${TOTAL_MATCHES} partidos de Lionel Messi con la Selección Argentina`}
        >
          <span aria-hidden="true" className="pointer-events-none absolute -inset-x-[10%] -inset-y-[20%] -z-10 bg-[radial-gradient(ellipse_at_40%_55%,rgb(117_170_219/0.28),transparent_65%)]" />
          {String(TOTAL_MATCHES).split("").map((d, i) => (
            <span key={i} className="inline-block align-bottom [clip-path:inset(-5%_-10%_0_-10%)]">
              <span className="hero-digit inline-block">{d}</span>
            </span>
          ))}
          <span className="sr-only"> partidos de Lionel Messi con la Selección Argentina</span>
        </h1>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-8 md:mt-9">
          {/* Sin hero-fade: es el candidato a LCP en mobile, no debe arrancar en opacity 0. */}
          <p className="font-serif text-[34px] italic leading-[1.05] md:text-[clamp(32px,3.4vw,52px)]">
            Una carrera entera.
            <br />
            Un solo gráfico.
          </p>
          <div className="hero-fade flex items-end gap-10">
            <div className="hidden md:block">
              <Countdown variant="big" />
            </div>
            <div className="flex flex-col items-center gap-2.5 text-[10px] tracking-[0.2em] text-bone/50" aria-hidden="true">
              <span>SCROLL</span>
              <span className="scroll-cue block h-14 w-px bg-celeste" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
