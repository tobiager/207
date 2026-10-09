/**
 * Autor, licencia y URL de cada foto de Wikimedia Commons, leídos de la API de Commons en el build
 * (y revalidados una vez por día). Así el crédito que se muestra siempre es el del archivo.
 *
 * Si la API no responde (por ejemplo, un build sin red), la foto se sirve igual desde
 * Special:FilePath y el crédito queda como "Wikimedia Commons" con link al archivo.
 */

export type CommonsImage = {
  file: string;
  /** URL de la imagen (miniatura de 1280 px de ancho, o el original si es más chico). */
  src: string;
  width: number;
  height: number;
  author: string;
  license: string;
  licenseUrl: string;
  /** Página del archivo en Commons. */
  source: string;
  /** false = no se pudo leer la ficha del archivo (crédito genérico). */
  resolved: boolean;
};

export type CommonsMap = Record<string, CommonsImage>;

const API = "https://commons.wikimedia.org/w/api.php";
const WIDTH = 1280;
const UA = "208messi (https://208messi.vercel.app; https://github.com/tobiager/207)";

const pageUrl = (file: string) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, "_"))}`;
const filePath = (file: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file.replace(/ /g, "_"))}?width=${WIDTH}`;

/** "Juan <a href=…>Pérez</a>" → "Juan Pérez". */
function plain(html?: string) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function fallback(file: string): CommonsImage {
  return {
    file,
    src: filePath(file),
    width: 4,
    height: 3,
    author: "Wikimedia Commons",
    license: "Licencia libre (ver archivo)",
    licenseUrl: "",
    source: pageUrl(file),
    resolved: false,
  };
}

type ApiPage = {
  title: string;
  missing?: string;
  imageinfo?: {
    url: string;
    width: number;
    height: number;
    thumburl?: string;
    thumbwidth?: number;
    thumbheight?: number;
    descriptionurl: string;
    extmetadata?: Record<string, { value?: string }>;
  }[];
};

export async function getCommonsImages(files: string[]): Promise<CommonsMap> {
  const out: CommonsMap = {};
  if (!files.length) return out;

  // La API acepta hasta 50 títulos por request.
  for (let i = 0; i < files.length; i += 50) {
    const chunk = files.slice(i, i + 50);
    const params = new URLSearchParams({
      action: "query",
      format: "json",
      formatversion: "1",
      prop: "imageinfo",
      iiprop: "url|size|extmetadata",
      iiurlwidth: String(WIDTH),
      iiextmetadatafilter: "Artist|Credit|LicenseShortName|LicenseUrl|UsageTerms",
      titles: chunk.map((f) => `File:${f}`).join("|"),
      origin: "*",
    });
    try {
      const res = await fetch(`${API}?${params}`, {
        headers: { "User-Agent": UA, "Api-User-Agent": UA },
        next: { revalidate: 86400 },
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as {
        query?: { pages?: Record<string, ApiPage>; normalized?: { from: string; to: string }[] };
      };
      const pages = Object.values(data.query?.pages ?? {});
      // La API normaliza los títulos (espacios, mayúsculas): mapeamos de vuelta al nombre pedido.
      const norm = new Map((data.query?.normalized ?? []).map((n) => [n.to, n.from]));
      for (const p of pages) {
        const asked = (norm.get(p.title) ?? p.title).replace(/^File:/, "");
        const info = p.imageinfo?.[0];
        if (p.missing !== undefined || !info) continue; // archivo borrado o renombrado: no se muestra
        const meta = info.extmetadata ?? {};
        out[asked] = {
          file: asked,
          src: info.thumburl ?? info.url,
          width: info.thumbwidth ?? info.width,
          height: info.thumbheight ?? info.height,
          author: plain(meta.Artist?.value) || plain(meta.Credit?.value) || "Autor en Commons",
          license: plain(meta.LicenseShortName?.value) || plain(meta.UsageTerms?.value) || "Licencia libre",
          licenseUrl: plain(meta.LicenseUrl?.value),
          source: info.descriptionurl || pageUrl(asked),
          resolved: true,
        };
      }
      // Lo que la API no devolvió (ni como "missing") queda con crédito genérico.
      const returned = new Set(pages.map((p) => (norm.get(p.title) ?? p.title).replace(/^File:/, "")));
      chunk.forEach((f) => {
        if (!returned.has(f)) out[f] = fallback(f);
      });
    } catch {
      chunk.forEach((f) => (out[f] = fallback(f)));
    }
  }
  return out;
}
