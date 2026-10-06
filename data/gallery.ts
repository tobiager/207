import type { MatchImage } from "@/lib/matches";

/**
 * Galería. Reemplazá `image` por fotos con licencia libre (Wikimedia Commons, CC BY / CC BY-SA)
 * guardadas en /public/img o servidas desde upload.wikimedia.org, con su crédito y licencia.
 * Mientras `image` sea null se muestra un placeholder con el tratamiento duotono.
 */
export type GalleryItem = {
  year: number;
  opponent: string;
  /** Alto relativo para el masonry (1 = cuadrada). */
  ratio: number;
  image: MatchImage | null;
};

export const gallery: GalleryItem[] = [
  { year: 2005, opponent: "Hungría", ratio: 1.35, image: null },
  { year: 2007, opponent: "Brasil", ratio: 0.9, image: null },
  { year: 2014, opponent: "Alemania", ratio: 1.2, image: null },
  { year: 2016, opponent: "Chile", ratio: 1.0, image: null },
  { year: 2021, opponent: "Brasil", ratio: 1.4, image: null },
  { year: 2022, opponent: "Francia", ratio: 1.25, image: null },
  { year: 2022, opponent: "Países Bajos", ratio: 0.85, image: null },
  { year: 2024, opponent: "Colombia", ratio: 1.3, image: null },
  { year: 2026, opponent: "España", ratio: 1.1, image: null },
];

/** Fotos de fondo del hero y de los capítulos (mismo formato). */
export const heroImage: MatchImage | null = null;
export const chapterImages: Record<number, MatchImage | null> = {
  2005: null,
  2016: null,
  2021: null,
  2022: null,
  2024: null,
  2026: null,
};
