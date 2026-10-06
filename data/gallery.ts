import { matches, type MatchImage } from "@/lib/matches";

/**
 * Fotos de Wikimedia Commons (solo CC0, dominio público, CC BY y CC BY-SA).
 * Cada una está asignada al partido `n` de data/matches.json (campo "image").
 * La página /creditos lista todas las atribuciones desde acá.
 */
export type Photo = {
  /** Número de partido (n) en data/matches.json. */
  n: number;
  file: string;
  title: string;
  author: string;
  license: string;
  licenseUrl: string;
  /** Página de origen en Wikimedia Commons. */
  source: string;
  /** Alto / ancho. */
  ratio: number;
};

export const photos: Photo[] = [
  { n: 18, file: "/img/m018.webp", title: "Messi Copa America 2007.jpg", author: "Nica*", license: "CC BY 2.5", licenseUrl: "https://creativecommons.org/licenses/by/2.5/", source: "https://commons.wikimedia.org/wiki/File:Messi_Copa_America_2007.jpg", ratio: 0.67 },
  { n: 50, file: "/img/m050.webp", title: "Lionel Messi 2010.jpg", author: "Saadick Dhansay", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/", source: "https://commons.wikimedia.org/wiki/File:Lionel_Messi_2010.jpg", ratio: 0.67 },
  { n: 55, file: "/img/m055.webp", title: "Lionel Messi (R) – Portugal vs. Argentina, 9th February 2011 (1).jpg", author: "Fanny Schertzer", license: "CC BY 3.0", licenseUrl: "https://creativecommons.org/licenses/by/3.0/", source: "https://commons.wikimedia.org/wiki/File:Lionel_Messi_(R)_%E2%80%93_Portugal_vs._Argentina,_9th_February_2011_(1).jpg", ratio: 0.67 },
  { n: 58, file: "/img/m058.webp", title: "Argentina vs Bolivia - 2011-07-01.jpg", author: "LGEPR", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/", source: "https://commons.wikimedia.org/wiki/File:Argentina_vs_Bolivia_-_2011-07-01.jpg", ratio: 0.66 },
  { n: 68, file: "/img/m068.webp", title: "Lionel Messi - Switzerland vs. Argentina, 29th February 2012.jpg", author: "Fanny Schertzer", license: "CC BY 3.0", licenseUrl: "https://creativecommons.org/licenses/by/3.0/", source: "https://commons.wikimedia.org/wiki/File:Lionel_Messi_-_Switzerland_vs._Argentina,_29th_February_2012.jpg", ratio: 0.67 },
  { n: 93, file: "/img/m093.webp", title: "Lionel Messi World Cup final - 140713-9163-jikatu .jpg", author: "Jimmy Baikovicius", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/", source: "https://commons.wikimedia.org/wiki/File:Lionel_Messi_World_Cup_final_-_140713-9163-jikatu_.jpg", ratio: 0.67 },
  { n: 102, file: "/img/m102.webp", title: "Tiro Libre Messi (19153749690).jpg", author: "Francisco Javier Gutierrez Zuñiga", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/", source: "https://commons.wikimedia.org/wiki/File:Tiro_Libre_Messi_(19153749690).jpg", ratio: 0.67 },
  { n: 123, file: "/img/m123.webp", title: "2017 FRIENDLY MATCH RUSSIA v ARGENTINA - Messi free kick.jpg", author: "Voltmetro", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", source: "https://commons.wikimedia.org/wiki/File:2017_FRIENDLY_MATCH_RUSSIA_v_ARGENTINA_-_Messi_free_kick.jpg", ratio: 1.04 },
  { n: 127, file: "/img/m127.webp", title: "Messi after scoring against Nigeria.jpg", author: "Кирилл Венедиктов", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/", source: "https://commons.wikimedia.org/wiki/File:Messi_after_scoring_against_Nigeria.jpg", ratio: 0.67 },
  { n: 167, file: "/img/m167.webp", title: "Lionel-Messi-Argentina-2022-FIFA-World-Cup sharpness.jpg", author: "Hossein Zohrevand", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0/", source: "https://commons.wikimedia.org/wiki/File:Lionel-Messi-Argentina-2022-FIFA-World-Cup_sharpness.jpg", ratio: 1.33 },
  { n: 204, file: "/img/m204.webp", title: "Lionel Messi Argentina v Egypt 7 July 2026-112.jpg", author: "Bryan Berlin", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", source: "https://commons.wikimedia.org/wiki/File:Lionel_Messi_Argentina_v_Egypt_7_July_2026-112.jpg", ratio: 0.67 },
  { n: 207, file: "/img/m207.webp", title: "Lionel Messi Argentina v Spain 19 July 2026-070.jpg", author: "Bryan Berlin", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", source: "https://commons.wikimedia.org/wiki/File:Lionel_Messi_Argentina_v_Spain_19_July_2026-070.jpg", ratio: 0.67 },
];

export const toImage = (p: Photo): MatchImage => ({
  src: p.file,
  credit: `${p.author} · Wikimedia Commons`,
  license: p.license,
  href: p.source,
});

const byN = new Map(photos.map((p) => [p.n, p]));
const imageOf = (n: number): MatchImage | null => {
  const p = byN.get(n);
  return p ? toImage(p) : null;
};

export type GalleryItem = {
  year: number;
  opponent: string;
  /** Alto relativo para el masonry (alto / ancho). */
  ratio: number;
  image: MatchImage | null;
};

export const gallery: GalleryItem[] = photos.map((p) => {
  const m = matches.find((x) => x.n === p.n)!;
  return { year: Number(m.date.slice(0, 4)), opponent: m.opponent, ratio: p.ratio, image: toImage(p) };
});

/** Fotos de fondo del hero y de los capítulos (mismo formato). */
export const heroImage: MatchImage | null = imageOf(204);
export const chapterImages: Record<number, MatchImage | null> = {
  2005: null,
  2016: null,
  2021: null,
  2022: imageOf(167),
  2024: null,
  2026: imageOf(207),
};
