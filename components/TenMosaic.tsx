"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { useLazyGSAP } from "@/lib/useLazyGSAP";

/** El "10" dibujado sobre la grilla del contribution graph (16 × 11). X = una foto de la gente. */
const GLYPH = [
  "..XXX.....XXXXX.",
  ".XXXX....XXXXXXX",
  "XX.XX....XX...XX",
  "...XX....XX...XX",
  "...XX....XX...XX",
  "...XX....XX...XX",
  "...XX....XX...XX",
  "...XX....XX...XX",
  "...XX....XX...XX",
  "...XX....XXXXXXX",
  "XXXXXXX...XXXXX.",
];
const W = GLYPH[0].length;
const POS = ["50% 50%", "30% 40%", "70% 35%", "50% 20%", "20% 60%", "80% 60%", "45% 75%"];

export type Tile = { src: string; alt: string };

/**
 * Mosaico de la 10: arranca pegado a una sola foto y, al scrollear, se aleja hasta que todas las
 * fotos de la gente forman el número. Las casillas vacías son las del gráfico.
 */
export function TenMosaic({ tiles, lines }: { tiles: Tile[]; lines: readonly string[] }) {
  const root = useRef<HTMLElement>(null);
  const [hot, setHot] = useState<number | null>(null);

  const cells = GLYPH.flatMap((row, r) => row.split("").map((ch, c) => ({ r, c, on: ch === "X" })));
  let k = 0;
  const placed = cells.map((cell) => (cell.on && tiles.length ? { ...cell, tile: tiles[k % tiles.length], pos: POS[k++ % POS.length] } : { ...cell, tile: null, pos: "" }));
  // La foto donde arranca el zoom: el primer cuadradito del "0".
  const focus = placed.findIndex((p) => p.on && p.c >= 9);

  useLazyGSAP(() => {
    const grid = root.current!.querySelector<HTMLElement>(".ten-grid")!;
    const target = grid.children[focus] as HTMLElement | undefined;
    const origin = target ? `${target.offsetLeft + target.offsetWidth / 2}px ${target.offsetTop + target.offsetHeight / 2}px` : "50% 50%";
    gsap.set(grid, { transformOrigin: origin });
    gsap.set([".ten-line-1", ".ten-line-2"], { opacity: 0, y: 30 });
    gsap.set(".ten-line-0", { opacity: 1 });
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: root.current, start: "top top", end: "+=220%", pin: true, scrub: 0.6, anticipatePin: 1 },
    });
    tl.fromTo(grid, { scale: 7 }, { scale: 1, duration: 1, ease: "power2.inOut" }, 0)
      .fromTo(".ten-empty", { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.45)
      .to(".ten-line-0", { opacity: 0.3, duration: 0.1 }, 0.3)
      .to(".ten-line-1", { opacity: 1, y: 0, duration: 0.12 }, 0.32)
      .to(".ten-line-1", { opacity: 0.3, duration: 0.1 }, 0.72)
      .to(".ten-line-2", { opacity: 1, y: 0, duration: 0.14 }, 0.78)
      .fromTo(".ten-grid", { "--glow": 0 }, { "--glow": 1, duration: 0.2 }, 0.8);
  }, root);

  return (
    <section ref={root} className="ten px-gutter relative flex min-h-[100svh] flex-col items-center justify-center gap-10 overflow-hidden py-16 md:flex-row md:gap-20" aria-labelledby="ten-title">
      <h3 id="ten-title" className="sr-only">
        La 10
      </h3>
      <div className="relative z-[2] flex w-full max-w-[460px] flex-col gap-2 md:gap-3">
        <span className="eyebrow mb-3">La 10</span>
        {lines.map((l, i) => (
          <p
            key={l}
            className={`ten-line-${i} font-serif italic leading-[1] tracking-[-0.01em] ${i === 2 ? "text-[44px] text-celeste md:text-[64px]" : "text-[34px] md:text-[54px]"}`}
          >
            {l}
          </p>
        ))}
      </div>
      <div className="relative">
        <div
          className="ten-grid relative grid"
          style={{ gridTemplateColumns: `repeat(${W}, var(--t))`, gap: "var(--tg)" }}
          aria-label="Fotos de hinchas que forman el número 10"
          role="img"
        >
          {placed.map((p, i) =>
            p.tile ? (
              <span
                key={i}
                className={`ten-tile duotone photo-grain relative block overflow-hidden rounded-[3px] ${hot === i ? "is-color" : ""}`}
                style={{ width: "var(--t)", height: "var(--t)" }}
                onPointerEnter={(e) => e.pointerType === "mouse" && setHot(i)}
                onPointerLeave={() => setHot(null)}
              >
                <Image src={p.tile.src} alt="" fill sizes="(min-width: 768px) 80px, 48px" className="object-cover" style={{ objectPosition: p.pos }} />
              </span>
            ) : (
              <span key={i} className={`block rounded-[3px] ${p.on ? "bg-celeste" : "ten-empty bg-celeste/[0.07]"}`} style={{ width: "var(--t)", height: "var(--t)" }} />
            ),
          )}
        </div>
      </div>
    </section>
  );
}
