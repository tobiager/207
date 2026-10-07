import { site } from "@/config/site";
import { TOTAL_GOALS, TOTAL_MATCHES, type Match } from "@/lib/matches";

export const matchUrl = (n: number) => `${site.url}/p/${n}`;

export function shareText(m?: Match) {
  return m
    ? `Mi partido favorito de Leo con la Selección: #${m.n} vs ${m.opponent} (${m.result}). ${TOTAL_MATCHES} partidos, un solo gráfico.`
    : `${TOTAL_MATCHES} partidos. ${TOTAL_GOALS} goles. Una carrera entera, un solo gráfico. Gracias, Leo.`;
}

export function shareLinks(url: string, text: string) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(text);
  return {
    whatsapp: `https://wa.me/?text=${t}%20${u}`,
    x: `https://x.com/intent/post?text=${t}&url=${u}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
  };
}

/** Web Share API si existe (mobile), si no copia el link. Devuelve "shared" | "copied" | "failed". */
export async function nativeShare(url: string, text: string) {
  try {
    if (navigator.share) {
      await navigator.share({ title: site.title, text, url });
      return "shared" as const;
    }
    await navigator.clipboard.writeText(url);
    return "copied" as const;
  } catch {
    return "failed" as const;
  }
}
