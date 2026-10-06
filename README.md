# 207 — Gracias, Leo

Homenaje one-page a Lionel Messi por su despedida de la Selección Argentina.
La carrera entera contada como un *contribution graph* de GitHub: 207 cuadraditos, uno por partido.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind v4 · GSAP (ScrollTrigger, SplitText) · Lenis · next/og

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Dónde editar

| Qué | Archivo |
| --- | --- |
| Links del footer (GitHub, LinkedIn, Portfolio, repo), URL pública, horario del partido 208, resultado final | `config/site.ts` |
| Los 207 partidos | `data/matches.json` |
| Fotos de la galería, hero y capítulos | `data/gallery.ts` |
| Textos de los capítulos | `lib/matches.ts` → `chapters` |
| Embeds oficiales de Instagram / X | `config/site.ts` → `embeds` |

Variable de entorno opcional: `NEXT_PUBLIC_SITE_URL=https://tu-dominio.com` (OG y links de compartir).

### ⚠️ Datos

`data/matches.json` tiene **datos placeholder realistas**: los hitos (debut, finales, Copa América 2021 y 2024, Qatar 2022, final 2026 vs España) usan resultados reales, pero el resto de fechas, rivales y goles por partido se generaron con `scripts/gen_matches.py` respetando los totales (207 partidos, 125 goles). **Reemplazalos con datos verificados antes de publicar.** Esquema:

```json
{ "n": 1, "date": "2005-08-17", "opponent": "Hungría", "result": "2-1", "goals": 0,
  "competition": "Amistoso", "isFinal": false, "won": true, "note": "Debut…",
  "image": { "src": "/img/ejemplo.jpg", "credit": "Autor", "license": "CC BY 4.0", "href": "https://commons.wikimedia.org/…" } }
```

`image` y `note` son opcionales (`null`). `competition`: `Mundial` · `Copa América` · `Eliminatorias` · `Amistoso` · `Finalissima`.

### Fotos

Sólo licencia libre (Wikimedia Commons, CC BY / CC BY-SA) con crédito visible. Guardalas en `public/img/` o usá URLs de `upload.wikimedia.org` (ya habilitado en `next.config.ts`). Todas reciben automáticamente el duotono `#07111F → #75AADB` + grano; en la galería recuperan el color al hover/tap. Mientras no haya foto se ve un placeholder con el mismo tratamiento.

## Rutas

- `/` — el sitio
- `/p/[n]` — deep link a un partido (abre su fila en el explorador). OG propio en `/p/[n]/opengraph-image`
- `/opengraph-image` — OG 1200×630
- `/story?m=176` — story vertical 1080×1920 (sin `m` es la versión general)
- `/?estado=live` · `/?estado=after` — previsualizar los estados del countdown y del partido 208
- `/?intro=0` — saltear el preloader (también se saltea en visitas repetidas de la sesión y en `/p/n`)

## Arquitectura

```
app/            layout (fuentes self-hosted), page, /p/[n], OG images, /story
components/     Preloader, Hero, Countdown, Manifesto, MatchGrid, MatchExplorer, Chapters,
                Gallery, Finals, Match208, Outro, Footer + Cursor, Magnetic, Photo, SmoothScroll, Atmosphere
lib/            matches (tipos + derivados), gsap, store (filtro → resaltado del grid), useLazyGSAP, share, og
config/site.ts  todo lo editable
```

- **Lenis + ScrollTrigger** sincronizados (`lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker`).
- **Grid**: CSS grid con variables por celda; desktop columnas por año, mobile filas por año. El pintado se hace con una sola variable CSS `--p` (no 207 tweens).
- **useLazyGSAP**: cada sección arma sus animaciones en su propia tarea, en orden de documento, y se hace un único `ScrollTrigger.refresh()`. Bajó el Total Blocking Time de ~3 s a ~0.5 s (mobile throttled).
- **prefers-reduced-motion**: sin preloader, sin pins, todo visible; los capítulos se scrollean horizontalmente a mano.

## Lighthouse (local, `next start`)

| | Perf | A11y | Best Practices | SEO |
| --- | --- | --- | --- | --- |
| Desktop | 99 | 96 | 100 | 100 |
| Mobile (con preloader) | ~68 | 96 | 96 | 100 |
| Mobile (`?intro=0` / visita repetida) | ~78 | 96 | 96 | 100 |

En mobile el preloader obligatorio de ~3 s retrasa LCP y Speed Index. Si querés 90+ en mobile: saltear el preloader en mobile o acortarlo, e hidratar de forma diferida las secciones de abajo del fold.

## Deploy

Vercel, sin configuración extra. Las fuentes (OFL) están en `app/fonts` y `assets/og-fonts`.

---

Homenaje no oficial hecho por un hincha. Sin escudos ni logos de marcas.
