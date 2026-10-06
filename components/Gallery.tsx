"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useLazyGSAP } from "@/lib/useLazyGSAP";
import { gallery, type GalleryItem } from "@/data/gallery";
import { site } from "@/config/site";
import Image from "next/image";

function Item({ it }: { it: GalleryItem }) {
  const [color, setColor] = useState(false);
  return (
    <figure
      className="g-item m-0 flex flex-col gap-2.5"
      data-cursor="grow"
      onPointerEnter={(e) => e.pointerType === "mouse" && setColor(true)}
      onPointerLeave={() => setColor(false)}
      onClick={() => setColor((v) => !v)}
    >
      <div className="g-clip relative overflow-hidden rounded" style={{ aspectRatio: `1 / ${it.ratio}` }}>
        <div className={`duotone photo-grain absolute inset-0 ${color ? "is-color" : ""}`}>
          {it.image ? (
            <PhotoInner it={it} />
          ) : (
            <div className="duotone-placeholder" role="img" aria-label={`${it.year} vs ${it.opponent} (foto pendiente)`} />
          )}
        </div>
      </div>
      <figcaption className="font-mono text-[10px] text-bone/55 md:text-[11px]">
        {it.year} · {it.opponent} · {it.image ? `${it.image.credit} · ${it.image.license}` : "[Autor] · CC BY-SA 4.0"}
      </figcaption>
    </figure>
  );
}

function PhotoInner({ it }: { it: GalleryItem }) {
  return <Image src={it.image!.src} alt={`${it.year} vs ${it.opponent}`} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover" />;
}

function Embeds() {
  useEffect(() => {
    if (!site.embeds.length) return;
    const add = (src: string) => {
      if (document.querySelector(`script[src="${src}"]`)) return;
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      document.body.appendChild(s);
    };
    if (site.embeds.some((e) => e.kind === "instagram")) add("https://www.instagram.com/embed.js");
    if (site.embeds.some((e) => e.kind === "x")) add("https://platform.twitter.com/widgets.js");
  }, []);
  if (!site.embeds.length) return null;
  return (
    <div className="mt-16 grid gap-8 md:grid-cols-2">
      {site.embeds.map((e) =>
        e.kind === "instagram" ? (
          <blockquote key={e.url} className="instagram-media" data-instgrm-permalink={e.url} data-instgrm-version="14" />
        ) : (
          <blockquote key={e.url} className="twitter-tweet" data-theme="dark">
            <a href={e.url}>{e.url}</a>
          </blockquote>
        ),
      )}
    </div>
  );
}

export function Gallery() {
  const root = useRef<HTMLElement>(null);

  useLazyGSAP(() => {
        // Parallax a distintas velocidades por columna
        gsap.utils.toArray<HTMLElement>(".g-col").forEach((col, i) => {
          const speed = [-6, 10, -14][i % 3];
          gsap.fromTo(col, { yPercent: -speed }, { yPercent: speed, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
        });
        // Reveal con clip-path
        gsap.utils.toArray<HTMLElement>(".g-clip").forEach((el) => {
          gsap.fromTo(
            el,
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } },
          );
          gsap.fromTo(el.firstElementChild, { scale: 1.3 }, { scale: 1, duration: 2, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } });
        });
  }, root);

  const cols: GalleryItem[][] = [[], [], []];
  gallery.forEach((it, i) => cols[i % 3].push(it));

  return (
    <section ref={root} id="galeria" className="px-gutter border-t border-bone/[0.06] py-24 md:py-40" aria-labelledby="galeria-title">
      <div className="mx-auto max-w-[1344px]">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-20">
          <div className="flex flex-col gap-5">
            <span className="eyebrow">// 05 — Galería</span>
            <h2 id="galeria-title" className="h-display text-[58px] md:text-[96px]">
              Veintiún años
              <br />
              en celeste
            </h2>
          </div>
          <p className="max-w-[360px] text-xs leading-relaxed text-bone/55">
            Fotos con licencia libre de Wikimedia Commons. Pasá el cursor (o tocá) y la foto recupera su color.
          </p>
        </div>
        <div className="grid grid-cols-2 items-start gap-3 md:gap-7 lg:grid-cols-3">
          {cols.map((col, i) => (
            <div key={i} className={`g-col flex flex-col gap-3 md:gap-7 ${i === 1 ? "mt-12 md:mt-36" : i === 2 ? "hidden lg:flex lg:mt-16" : ""}`}>
              {col.map((it) => (
                <Item key={`${it.year}-${it.opponent}`} it={it} />
              ))}
              {/* En mobile (2 columnas) la tercera columna se reparte */}
              {i < 2 &&
                cols[2]
                  .filter((_, j) => j % 2 === i)
                  .map((it) => (
                    <div key={`m-${it.year}-${it.opponent}`} className="lg:hidden">
                      <Item it={it} />
                    </div>
                  ))}
            </div>
          ))}
        </div>
        <Embeds />
      </div>
    </section>
  );
}
