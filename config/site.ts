/**
 * Configuración editable del sitio.
 * Cambiá los links del footer, la URL pública y el horario del partido acá.
 */
export const site = {
  name: "207",
  title: "207 — Gracias, Leo",
  description:
    "207 partidos, 125 goles. La carrera de Lionel Messi en la Selección Argentina contada como un contribution graph.",
  /** URL pública (sin barra final). Se usa para OG y links de compartir. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://207.vercel.app",

  author: "Tobias",
  links: {
    github: "https://github.com/tobiager",
    linkedin: "https://www.linkedin.com/in/tobias-orban",
    portfolio: "https://tobiager.vercel.app/",
    repo: "https://github.com/tobiager/207",
  },

  /** Partido 208: Argentina vs Benín, Monumental. Hora de Buenos Aires (UTC-3). */
  match208: {
    opponent: "Benín",
    venue: "Monumental",
    kickoff: "2026-10-06T20:00:00-03:00",
    /** Desde esta hora se muestra "partido finalizado" (horario fijo de Argentina). */
    end: "2026-10-06T23:00:00-03:00",
    /** Opcional. Completar al terminar, ej. "3-0" (goles de Argentina primero). */
    finalScore: undefined as string | undefined,
  },

  /**
   * Embeds oficiales opcionales (Instagram / X). Pegá la URL del post.
   * Se renderizan al final de la galería.
   */
  embeds: [] as { kind: "instagram" | "x"; url: string }[],
} as const;

export type Site = typeof site;
