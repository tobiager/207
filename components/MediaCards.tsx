"use client";

import { useState } from "react";
import Image from "next/image";
import type { CommonsImage } from "@/lib/commons";
import type { VideoRef } from "@/data/lo-que-genero";

/**
 * Foto de Commons con el tratamiento duotono de la web. Recupera el color con hover o tap.
 * El crédito (autor · licencia) va siempre visible y linkea a la ficha del archivo.
 */
export function CommonsPhoto({
  img,
  alt,
  position,
  className = "",
  sizes = "(min-width: 1024px) 33vw, 50vw",
  credit = "below",
  frame = "",
}: {
  img: CommonsImage;
  alt: string;
  position?: string;
  className?: string;
  sizes?: string;
  credit?: "below" | "overlay" | "none";
  /** Clases extra para el <figure> (por ejemplo h-full cuando la foto es un fondo). */
  frame?: string;
}) {
  const [color, setColor] = useState(false);
  const text = `${img.author} · ${img.license}`;
  return (
    <figure
      className={`m-0 flex flex-col gap-2 ${frame}`}
      data-cursor="grow"
      onPointerEnter={(e) => e.pointerType === "mouse" && setColor(true)}
      onPointerLeave={() => setColor(false)}
      onClick={() => setColor((v) => !v)}
    >
      <div className={`duotone photo-grain relative overflow-hidden rounded ${color ? "is-color" : ""} ${className}`}>
        <Image src={img.src} alt={alt} fill sizes={sizes} className="object-cover" style={{ objectPosition: position }} />
        {credit === "overlay" && (
          <span className="absolute bottom-2 right-3 z-[3] max-w-[80%] truncate font-mono text-[9px] text-bone/70">{text}</span>
        )}
      </div>
      {credit === "below" && (
        <figcaption className="font-mono text-[10px] leading-relaxed text-bone/50">
          <a href={img.source} target="_blank" rel="noreferrer" className="underline-offset-2 hover:text-bone/80 hover:underline" onClick={(e) => e.stopPropagation()}>
            {text}
          </a>
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Video de YouTube con "fachada": hasta que la persona toca, solo se muestra la miniatura (sin iframe,
 * sin cookies, sin peso en la carga). Al tocar se carga el reproductor oficial de youtube-nocookie.
 */
export function YouTubeCard({ v, className = "", caption = true }: { v: VideoRef; className?: string; caption?: boolean }) {
  const [on, setOn] = useState(false);
  const [color, setColor] = useState(false);
  const ratio = v.vertical ? "aspect-[9/16]" : "aspect-video";

  return (
    <figure className={`yt-card m-0 flex flex-col gap-3 ${className}`}>
      <div className={`relative overflow-hidden rounded-xl border border-celeste/20 bg-night-2 shadow-[0_30px_80px_rgb(117_170_219/0.12)] ${ratio}`}>
        {on ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&playsinline=1&rel=0`}
            title={`${v.title} — ${v.channel}`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setOn(true)}
            onPointerEnter={(e) => e.pointerType === "mouse" && setColor(true)}
            onPointerLeave={() => setColor(false)}
            aria-label={`Reproducir: ${v.title} (${v.channel}, YouTube)`}
            data-cursor="grow"
            className="group absolute inset-0 block"
          >
            <span className={`duotone photo-grain absolute inset-0 ${color ? "is-color" : ""}`}>
              <Image
                src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                alt=""
                fill
                unoptimized
                sizes="(min-width: 768px) 40vw, 90vw"
                className="object-cover"
              />
            </span>
            <span className="absolute inset-x-0 bottom-0 z-[3] h-1/2 bg-gradient-to-t from-night/85 to-transparent" />
            <span className="absolute bottom-4 left-4 z-[3] flex items-center gap-2 rounded-full border border-bone/25 bg-night/75 px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-bone transition-colors duration-300 group-hover:border-celeste md:text-[11px]">
              <span aria-hidden="true" className="text-celeste">▶</span>
              Reproducir
            </span>
          </button>
        )}
      </div>
      {caption && (
        <figcaption className="flex flex-col gap-1">
          <span className="font-serif text-lg italic leading-tight text-bone/85 md:text-xl">{v.title}</span>
          <a
            href={`https://www.youtube.com/watch?v=${v.id}`}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[10px] uppercase tracking-[0.12em] text-bone/50 underline-offset-2 hover:text-celeste hover:underline"
          >
            {v.channel} · YouTube
          </a>
        </figcaption>
      )}
    </figure>
  );
}
