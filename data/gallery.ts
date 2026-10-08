import { matches, type MatchImage } from "@/lib/matches";

/**
 * Fotos de Wikimedia Commons (solo CC0, dominio público, CC BY y CC BY-SA).
 * Cada una está asignada al partido `n` de data/matches.json (campo "image").
 * La página /creditos lista todas las atribuciones desde acá.
 */
export type Photo = {
  /** Número de partido (n) en data/matches.json al que se asigna la foto (null = sólo capítulo). */
  n: number | null;
  /** false = no aparece en la galería (sólo en un capítulo). */
  gallery?: boolean;
  /** Descripción para /creditos cuando no hay partido asociado. */
  label?: string;
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
  { n: 172, file: "/img/x-champ.webp", title: "Argentina 3-3 Francia - Copa Mundial 2022 - Argentina campeón.jpg", author: "Sebas", license: "CC BY 3.0", licenseUrl: "https://creativecommons.org/licenses/by/3.0/", source: "https://commons.wikimedia.org/wiki/File:Argentina_3-3_Francia_-_Copa_Mundial_2022_-_Argentina_campe%C3%B3n.jpg", ratio: 0.56 },
  { n: 185, file: "/img/x-sorteo.webp", title: "Argentina 1-1 Ecuador - Copa América 2024 - Sorteo de capitanes.jpg", author: "Sebas", license: "CC BY 3.0", licenseUrl: "https://creativecommons.org/licenses/by/3.0/", source: "https://commons.wikimedia.org/wiki/File:Argentina_1-1_Ecuador_-_Copa_Am%C3%A9rica_2024_-_Sorteo_de_capitanes.jpg", ratio: 0.56 },
  { n: null, file: "/img/x-tears.webp", title: "Lionel Messi in tears after the final.jpg", author: "Agência Brasil", license: "CC BY 3.0 br", licenseUrl: "https://creativecommons.org/licenses/by/3.0/br/deed.en/", source: "https://commons.wikimedia.org/wiki/File:Lionel_Messi_in_tears_after_the_final.jpg", ratio: 0.63, gallery: false, label: "Mundial 2014, final" },
  { n: null, file: "/img/x-tv.webp", title: "Captura de TV (Sportia / Univisión)", author: "Captura de TV (Sportia / Univisión)", license: "Sin licencia libre", licenseUrl: "", source: "", ratio: 0.56, gallery: false, label: "Copa América Centenario 2016, tras la final" },
  { n: null, file: "/img/x-2005.webp", title: "Leo messi barce 2005.jpg", author: "Josep Tomàs", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", source: "https://commons.wikimedia.org/wiki/File:Leo_messi_barce_2005.jpg", ratio: 0.67, gallery: false, label: "Messi en 2005, el año de su debut (con el Barcelona)" },
  { n: null, file: "/img/x-maracana.webp", title: "Maracanã 2014 e.jpg", author: "Daniel Basil", license: "CC BY 3.0 br", licenseUrl: "https://creativecommons.org/licenses/by/3.0/br/deed.en/", source: "https://commons.wikimedia.org/wiki/File:Maracan%C3%A3_2014_e.jpg", ratio: 0.67, gallery: false, label: "Estadio Maracaná (capítulo 2021)" },
];

export const toImage = (p: Photo): MatchImage => ({
  src: p.file,
  credit: p.licenseUrl ? `${p.author} · Wikimedia Commons` : p.author,
  license: p.license,
  href: p.source || undefined,
});

const byFile = (name: string): MatchImage | null => {
  const p = photos.find((x) => x.file === `/img/${name}.webp`);
  return p ? toImage(p) : null;
};

export type GalleryItem = {
  year: number;
  opponent: string;
  /** Alto relativo para el masonry (alto / ancho). */
  ratio: number;
  image: MatchImage | null;
};

export const gallery: GalleryItem[] = photos
  .filter((p) => p.n != null && p.gallery !== false)
  .map((p) => {
    const m = matches.find((x) => x.n === p.n)!;
    return { year: Number(m.date.slice(0, 4)), opponent: m.opponent, ratio: p.ratio, image: toImage(p) };
  })
  .sort((a, b) => a.year - b.year);

/** Fotos de fondo del hero y de los capítulos (mismo formato). */
export const heroImage: MatchImage | null = byFile("m204");
export const chapterImages: Record<string | number, MatchImage | null> = {
  2005: byFile("x-2005"),
  2014: byFile("x-tears"),
  2016: byFile("x-tv"),
  2021: byFile("x-maracana"),
  2022: byFile("x-champ"),
  2024: byFile("x-sorteo"),
  2026: byFile("m207"),
  // Messi hablándole al Monumental en la despedida. Sin línea de crédito; la cara queda en el tercio superior.
  despedida: { src: "/img/x-despedida.webp", credit: "", license: "", position: "50% 14%" },
};
