import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { photos } from "@/data/gallery";
import { site } from "@/config/site";
import { matches, formatDate } from "@/lib/matches";
import { getCommonsImages } from "@/lib/commons";
import { ALL_COMMONS_FILES, ALL_VIDEOS } from "@/data/lo-que-genero";

export const metadata: Metadata = {
  title: `Créditos — ${site.name}`,
  description: `Autores, licencias y fuentes de las fotos usadas en ${site.name}, el homenaje a Lionel Messi.`,
  alternates: { canonical: "/creditos" },
};

export default async function Creditos() {
  const lqg = Object.values(await getCommonsImages(ALL_COMMONS_FILES));
  return (
    <main className="px-gutter mx-auto flex w-full min-h-screen max-w-[1100px] flex-col gap-10 py-16 md:py-24">
      <header className="flex min-w-0 flex-col gap-4">
        <Link href="/" className="font-mono text-xs text-celeste hover:underline">
          ← {site.name}
        </Link>
        <h1 className="h-display text-[56px] md:text-[96px]">Créditos</h1>
        <p className="max-w-[640px] font-serif text-xl italic text-bone/75">
          Fotos de Wikimedia Commons con licencias libres (CC BY y CC BY-SA), salvo una captura de TV sin licencia libre (se indica abajo) y las dos fotos y el video de la tribuna del partido 208, que circulan en redes sin licencia libre ni autor identificado. Gracias a quienes las sacaron y las compartieron.
          Los datos de los partidos vienen de Wikipedia y worldfootball.net.
        </p>
      </header>

      <ul className="flex flex-col divide-y divide-bone/10 border-y border-bone/10">
        {photos.map((p) => {
          const m = p.n == null ? null : matches.find((x) => x.n === p.n)!;
          return (
            <li key={p.n} className="grid grid-cols-[96px_minmax(0,1fr)] items-start gap-4 py-5 md:grid-cols-[160px_minmax(0,1fr)]">
              <Image src={p.file} alt={m ? `Messi vs ${m.opponent}, ${formatDate(m.date)}` : p.label ?? p.title} width={320} height={Math.round(320 * p.ratio)} className="h-auto w-full rounded" />
              <div className="flex flex-col gap-1.5 font-mono text-[12px] leading-relaxed text-bone/70 md:text-sm">
                <span className="text-bone">
                  {m ? `#${m.n} · vs ${m.opponent} · ${formatDate(m.date)}` : p.label}
                </span>
                <span>
                  Autor: <span className="text-bone">{p.author}</span>
                </span>
                <span>
                  Licencia:{" "}
                  {p.licenseUrl ? (
                    <a href={p.licenseUrl} target="_blank" rel="noreferrer license" className="text-celeste hover:underline">
                      {p.license}
                    </a>
                  ) : (
                    p.license
                  )}
                </span>
                {p.source && (
                  <a href={p.source} target="_blank" rel="noreferrer" className="break-all text-celeste hover:underline">
                    Origen: {p.source}
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <section className="flex flex-col gap-6" aria-labelledby="lqg-creditos">
        <h2 id="lqg-creditos" className="h-display text-[40px] md:text-[64px]">
          Lo que generó
        </h2>
        <p className="max-w-[640px] font-serif text-xl italic text-bone/75">
          Fotos de la gente, de Wikimedia Commons. El autor y la licencia de cada una se leen de la ficha del archivo en Commons. Los videos son de sus autores y se muestran con el reproductor oficial de YouTube.
        </p>
        <ul className="flex flex-col divide-y divide-bone/10 border-y border-bone/10">
          {lqg.map((p) => (
            <li key={p.file} className="grid grid-cols-[96px_minmax(0,1fr)] items-start gap-4 py-5 md:grid-cols-[160px_minmax(0,1fr)]">
              <Image src={p.src} alt={p.file} width={320} height={Math.round((320 * p.height) / p.width)} className="h-auto w-full rounded" />
              <div className="flex flex-col gap-1.5 font-mono text-[12px] leading-relaxed text-bone/70 md:text-sm">
                <span className="text-bone">{p.file.replace(/\.[a-z]+$/i, "")}</span>
                <span>
                  Autor: <span className="text-bone">{p.author}</span>
                </span>
                <span>
                  Licencia:{" "}
                  {p.licenseUrl ? (
                    <a href={p.licenseUrl} target="_blank" rel="noreferrer license" className="text-celeste hover:underline">
                      {p.license}
                    </a>
                  ) : (
                    p.license
                  )}
                </span>
                <a href={p.source} target="_blank" rel="noreferrer" className="break-all text-celeste hover:underline">
                  Origen: {p.source}
                </a>
              </div>
            </li>
          ))}
        </ul>
        <ul className="flex flex-col divide-y divide-bone/10 border-y border-bone/10">
          {ALL_VIDEOS.map((v) => (
            <li key={v.id} className="flex flex-col gap-1 py-4 font-mono text-[12px] text-bone/70 md:text-sm">
              <span className="text-bone">{v.title}</span>
              <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer" className="text-celeste hover:underline">
                {v.channel} · YouTube
              </a>
            </li>
          ))}
        </ul>
      </section>
      <p className="font-mono text-[11px] text-bone/45">Las fotos fueron redimensionadas y convertidas a WebP; en el sitio se muestran con un tratamiento duotono.</p>
    </main>
  );
}
