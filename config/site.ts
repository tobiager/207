/**
 * Configuración editable del sitio.
 * Cambiá los links del footer, la URL pública y los datos del último partido acá.
 */
export const site = {
  name: "208",
  title: "208 — Gracias, Leo",
  description:
    "208 partidos, 126 goles. La carrera de Lionel Messi en la Selección Argentina contada como un contribution graph.",
  /** URL pública (sin barra final). Se usa para OG y links de compartir. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://208messi.vercel.app",

  author: "Tobias",
  links: {
    github: "https://github.com/tobiager",
    linkedin: "https://www.linkedin.com/in/tobias-orban",
    portfolio: "https://tobiager.vercel.app/",
    repo: "https://github.com/tobiager/207",
  },

  /** Partido 208: la despedida. Argentina 3-0 Benín, Monumental, 06/10/2026. */
  lastMatch: {
    n: 208,
    opponent: "Benín",
    short: "BEN",
    venue: "Monumental",
    date: "06.10.2026",
    competition: "Amistoso",
    score: "3-0",
    /** Goles del partido. `messi` = qué hizo Leo en esa jugada. */
    goals: [
      { min: 48, scorer: "Otamendi", how: "de cabeza", messi: "asistencia de córner" },
      { min: 62, scorer: "Nico Paz", how: "zurdazo", messi: "asistencia" },
      { min: 71, scorer: "Messi", how: "de penal", messi: "gol 126" },
    ],
    /** Posts de X con video del partido. Se muestran con el embed oficial de X (con el autor visible). */
    embeds: ["https://x.com/messismo10/status/2107672622162960554"],
    /** Frase + fotos que cierran la sección del partido 208. */
    quote: {
      text: "Poder es que la gente te quiera.",
      photos: [
        { src: "/img/x-poder-1.webp", alt: "Messi de espaldas frente a la tribuna argentina, que le muestra camisetas con su nombre" },
        { src: "/img/x-poder-2.webp", alt: "Una multitud de hinchas caminando con la camiseta 10 de Messi" },
      ],
    },
  },
} as const;

export type Site = typeof site;
