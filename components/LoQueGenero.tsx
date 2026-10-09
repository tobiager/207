"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLazyGSAP } from "@/lib/useLazyGSAP";
import { isLite } from "@/lib/lite";
import type { CommonsImage, CommonsMap } from "@/lib/commons";
import { livings, calle, paredes, la10, puente, type CommonsRef, type Wall } from "@/data/lo-que-genero";
import { CommonsPhoto, YouTubeCard } from "./MediaCards";
import { GraphBreak } from "./GraphBreak";
import { TenMosaic, type Tile } from "./TenMosaic";
import { LifeWithHim } from "./LifeWithHim";

type Resolved = CommonsRef & { img: CommonsImage };

/** Solo las fotos que existen en Commons (un archivo borrado o renombrado no se muestra). */
const pick = (refs: readonly CommonsRef[], media: CommonsMap): Resolved[] =>
  refs.flatMap((r) => (media[r.file] ? [{ ...r, img: media[r.file] }] : []));

/** Encabezado de cada momento: fecha o rótulo + título en dos tiempos. */
function Beat({ eyebrow, date, title, accent, lead }: { eyebrow: string; date?: string; title: string; accent: string; lead?: string }) {
  return (
    <header className="lqg-head flex flex-col gap-5 md:gap-7">
      <span className="eyebrow">{eyebrow}</span>
      {date && (
        <span className="lqg-date font-display font-black leading-[0.8] tracking-[-0.02em] text-bone" style={{ fontSize: "clamp(84px, 15vw, 230px)" }}>
          {date}
        </span>
      )}
      <p className="max-w-[1000px] text-balance font-serif text-[36px] italic leading-[1.02] tracking-[-0.01em] md:text-[68px]">
        {title} <span className="text-celeste">{accent}</span>
      </p>
      {lead && <p className="max-w-[520px] text-xs leading-relaxed text-bone/55 md:text-[13px]">{lead}</p>}
    </header>
  );
}

/* ---------- 18D · Los livings ---------- */
function Livings({ media }: { media: CommonsMap }) {
  const [main, shortA, shortB, ...rest] = livings.videos;
  const photos = pick(livings.photos, media);
  return (
    <div className="lqg-beat px-gutter mx-auto flex max-w-[1344px] flex-col gap-12 py-24 md:gap-20 md:py-36">
      <Beat eyebrow="18D · Los livings" date={livings.date} title={livings.title} accent={livings.titleAccent} lead={livings.lead} />
      <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,0.6fr)_minmax(0,0.6fr)] md:gap-6">
        <div className="lqg-rise">
          <YouTubeCard v={main} />
        </div>
        <div className="grid grid-cols-2 gap-3 md:contents">
          <div className="lqg-rise md:mt-24">
            <YouTubeCard v={shortA} />
          </div>
          <div className="lqg-rise md:-mt-16">
            <YouTubeCard v={shortB} />
          </div>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 md:gap-8">
        {rest.map((v, i) => (
          <div key={v.id} className={`lqg-rise ${i === 1 ? "md:mt-20" : ""}`}>
            <YouTubeCard v={v} />
          </div>
        ))}
        {photos.map((p, i) => (
          <div key={p.file} className={`lqg-rise ${i === 1 ? "md:mt-20" : ""}`}>
            <CommonsPhoto img={p.img} alt={p.alt} position={p.position} className="aspect-[4/3]" sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- 20D · La calle ---------- */
function Calle({ media }: { media: CommonsMap }) {
  const hero = media[calle.hero.file];
  const photos = pick(calle.photos, media);
  const fmt = (n: number) => n.toLocaleString("es-AR");
  return (
    <div className="lqg-calle relative">
      <div className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden">
        {hero && (
          <div className="lqg-calle-bg absolute -inset-y-[8%] inset-x-0">
            <CommonsPhoto img={hero} alt={calle.hero.alt} credit="none" frame="h-full" className="h-full" sizes="100vw" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(7_17_31/0.55),rgb(7_17_31/0.25)_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-night via-transparent to-night" />
        <div className="px-gutter relative flex flex-col items-center gap-4 text-center">
          <span className="eyebrow">20D · La calle · {calle.date}</span>
          <span
            className="lqg-count font-display font-black tabular-nums leading-[0.82] tracking-[-0.02em] text-bone"
            style={{ fontSize: "clamp(76px, 17vw, 290px)" }}
            data-to={calle.people}
          >
            {fmt(calle.people)}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-bone/70 md:text-xs">personas en la calle</span>
        </div>
        {hero && (
          <a
            href={hero.source}
            target="_blank"
            rel="noreferrer"
            className="px-gutter absolute bottom-5 right-0 max-w-[70%] truncate font-mono text-[9px] text-bone/55 hover:text-bone/80 md:text-[10px]"
          >
            Foto: {hero.author} · {hero.license}
          </a>
        )}
      </div>

      <div className="px-gutter mx-auto flex max-w-[1344px] flex-col gap-12 py-20 md:gap-20 md:py-32">
        <div className="flex flex-col gap-5">
          <p className="max-w-[1000px] text-balance font-serif text-[36px] italic leading-[1.02] tracking-[-0.01em] md:text-[68px]">
            {calle.title} <span className="text-celeste">{calle.titleAccent}</span>
          </p>
          <p className="font-mono text-[10px] leading-relaxed text-bone/45 md:text-[11px]">
            La cifra es la estimación que cita{" "}
            <a href={calle.sources[0].href} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-bone/80">
              {calle.sources[0].label}
            </a>{" "}
            · El feriado:{" "}
            <a href={calle.sources[1].href} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-bone/80">
              {calle.sources[1].label}
            </a>
          </p>
        </div>

        <div className="grid grid-cols-2 items-start gap-3 md:grid-cols-3 md:gap-6">
          {photos.map((p, i) => (
            <div key={p.file} className={`lqg-rise ${i % 3 === 1 ? "mt-10 md:mt-24" : i % 3 === 2 ? "md:mt-10" : ""}`}>
              <CommonsPhoto img={p.img} alt={p.alt} position={p.position} className={i % 2 ? "aspect-[4/5]" : "aspect-[4/3]"} />
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-3 md:gap-6">
          {calle.videos.map((v) => (
            <div key={v.id} className="lqg-rise">
              <YouTubeCard v={v} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Las paredes ---------- */
function WallRow({ w, i, media }: { w: Wall; i: number; media: CommonsMap }) {
  const [open, setOpen] = useState(false);
  const photos = pick(w.photos ?? [], media);
  const hasMedia = !!w.video || photos.length > 0;
  const panel = `wall-${i}`;
  return (
    <li className="lqg-wall border-b border-bone/10">
      <div className="grid grid-cols-[36px_minmax(0,1fr)] items-baseline gap-x-4 gap-y-2 py-6 md:grid-cols-[64px_minmax(0,0.9fr)_minmax(0,1.1fr)_auto] md:gap-x-8 md:py-8">
        <span className="font-mono text-[11px] text-bone/40 md:text-xs">{String(i + 1).padStart(2, "0")}</span>
        <span className="font-display text-[44px] font-black uppercase leading-[0.85] md:text-[72px]">{w.city}</span>
        <div className="col-start-2 flex flex-col gap-1.5 md:col-start-3">
          <span className="font-serif text-xl italic leading-tight text-bone md:text-[26px]">{w.place}</span>
          {w.artists && <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-celeste md:text-[11px]">{w.artists}</span>}
          <span className="max-w-[520px] text-[12px] leading-relaxed text-bone/60 md:text-[13px]">{w.line}</span>
          {w.source && (
            <a href={w.source.href} target="_blank" rel="noreferrer" className="font-mono text-[10px] text-bone/40 underline-offset-2 hover:text-bone/75 hover:underline">
              Fuente: {w.source.label}
            </a>
          )}
        </div>
        {hasMedia && (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panel}
            onClick={() => setOpen((v) => !v)}
            className="col-start-2 mt-2 inline-flex min-h-11 w-fit items-center gap-2 justify-self-start rounded-full border border-bone/25 px-4 font-mono text-[11px] uppercase tracking-[0.12em] text-bone transition-colors duration-300 hover:border-celeste hover:text-celeste md:col-start-4 md:mt-0 md:justify-self-end"
          >
            {open ? "Cerrar" : w.video ? "Ver video" : "Ver fotos"}
            <span aria-hidden="true" className={`transition-transform duration-500 ${open ? "rotate-45" : ""}`}>
              +
            </span>
          </button>
        )}
      </div>
      {hasMedia && (
        <div id={panel} className="wall-panel grid" data-open={open || undefined}>
          <div className="overflow-hidden">
            {open && (
              <div className="grid gap-4 pb-10 md:grid-cols-[64px_minmax(0,1fr)] md:gap-x-8">
                <span className="hidden md:block" />
                <div className="grid max-w-[980px] gap-4 md:grid-cols-2">
                  {w.video && (
                    <div className="md:col-span-2">
                      <YouTubeCard v={w.video} />
                    </div>
                  )}
                  {photos.map((p) => (
                    <CommonsPhoto key={p.file} img={p.img} alt={p.alt} position={p.position} className="aspect-[4/3]" sizes="(min-width: 768px) 480px, 100vw" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </li>
  );
}

function Paredes({ media }: { media: CommonsMap }) {
  return (
    <div className="lqg-beat px-gutter mx-auto flex max-w-[1344px] flex-col gap-12 border-t border-bone/[0.06] py-24 md:gap-16 md:py-36">
      <Beat eyebrow="Las paredes" title={paredes.title} accent={paredes.titleAccent} />
      <ol className="border-t border-bone/10">
        {paredes.walls.map((w, i) => (
          <WallRow key={`${w.city}-${w.place}`} w={w} i={i} media={media} />
        ))}
      </ol>
      <p className="lqg-more flex flex-wrap items-baseline justify-between gap-4">
        <span className="font-serif text-[40px] italic text-celeste md:text-[72px]">{paredes.outro}</span>
        <a href={paredes.outroSource.href} target="_blank" rel="noreferrer" className="font-mono text-[10px] text-bone/40 hover:text-bone/75 hover:underline">
          Solo en Buenos Aires se pintaron cientos desde Qatar · {paredes.outroSource.label}
        </a>
      </p>
    </div>
  );
}

/* ---------- Puente al 208 ---------- */
function Puente() {
  return (
    <div className="lqg-puente px-gutter relative flex min-h-[100svh] flex-col items-center justify-center gap-14 bg-night py-24 text-center">
      <p className="lqg-puente-text max-w-[1100px] text-balance font-serif italic leading-[0.98] tracking-[-0.02em]" style={{ fontSize: "clamp(44px, 7.4vw, 120px)" }}>
        {puente.line}
        <br />
        <span className="text-celeste">{puente.lineAccent}</span>
      </p>
      <div className="lqg-rise w-full max-w-[520px] text-left">
        <YouTubeCard v={puente.video} />
      </div>
    </div>
  );
}

/**
 * // 07 — Lo que generó. Va entre Las finales y el Partido 208: primero lo que hizo, después lo que
 * provocó en la gente, y recién ahí la despedida.
 */
export function LoQueGenero({ media }: { media: CommonsMap }) {
  const root = useRef<HTMLDivElement>(null);

  const tiles: Tile[] = [
    ...la10.local,
    ...pick([...la10.photos, ...calle.photos, ...livings.photos, calle.hero], media).map((p) => ({ src: p.img.src, alt: p.alt })),
  ];

  useLazyGSAP(() => {
    // Entrada de cada pieza: transform/opacity y un solo batch para toda la sección.
    const rise = gsap.utils.toArray<HTMLElement>(".lqg-rise");
    gsap.set(rise, { opacity: 0, y: 60 });
    ScrollTrigger.batch(rise, {
      start: "top 90%",
      once: true,
      onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1.4, ease: "expo.out", stagger: 0.1 }),
    });
    gsap.utils.toArray<HTMLElement>(".lqg-head").forEach((h) => {
      gsap.from(h.children, { yPercent: 30, opacity: 0, duration: 1.4, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: h, start: "top 80%" } });
    });

    // 5.000.000: cuenta desde cero al entrar.
    const count = root.current!.querySelector<HTMLElement>(".lqg-count");
    if (count) {
      const to = Number(count.dataset.to);
      const o = { v: 0 };
      count.textContent = "0";
      gsap.to(o, {
        v: to,
        duration: 3,
        ease: "power3.out",
        scrollTrigger: { trigger: count, start: "top 75%" },
        onUpdate: () => (count.textContent = (Math.round(o.v / 1000) * 1000).toLocaleString("es-AR")),
      });
    }
    if (!isLite())
      gsap.fromTo(".lqg-calle-bg", { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: ".lqg-calle", start: "top bottom", end: "50% top", scrub: true } });

    // Las paredes: cada fila se "pinta" de izquierda a derecha.
    gsap.utils.toArray<HTMLElement>(".lqg-wall").forEach((row) => {
      gsap.from(row, { clipPath: "inset(0 100% 0 0)", duration: 1.6, ease: "power3.inOut", scrollTrigger: { trigger: row, start: "top 88%" }, clearProps: "clipPath" });
    });
    gsap.from(".lqg-more", { opacity: 0, y: 30, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".lqg-more", start: "top 90%" } });

    gsap.from(".lqg-puente-text", { opacity: 0, y: 40, duration: 2, ease: "expo.out", scrollTrigger: { trigger: ".lqg-puente", start: "top 60%" } });
  }, root);

  return (
    <div ref={root} className="relative border-t border-bone/[0.06]">
      <GraphBreak />
      <Livings media={media} />
      <Calle media={media} />
      <Paredes media={media} />
      <TenMosaic tiles={tiles} lines={la10.lines} />
      <div className="px-gutter mx-auto -mt-4 grid max-w-[1344px] gap-6 pb-24 md:grid-cols-2 md:gap-8 md:pb-36">
        {la10.videos.map((v) => (
          <div key={v.id} className="lqg-rise">
            <YouTubeCard v={v} />
          </div>
        ))}
      </div>
      <LifeWithHim />
      <Puente />
    </div>
  );
}
