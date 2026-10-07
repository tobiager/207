
<div align="center">

<img src="public/208.png" width="100" alt="208">

<h1 align="center"> 208 — Gracias, Leo</h1>
</div>

Homenaje one-page a Lionel Messi por su carrera en la Selección Argentina: **208 partidos, 126 goles**, contados como un *contribution graph* de GitHub (un cuadradito por partido, 2005 → 2026). El último, el 208: Argentina 3-0 Benín en el Monumental (06/10/2026), con gol de penal de Leo y dos asistencias.

🔗 **[208messi.vercel.app](https://208messi.vercel.app)**

> Homenaje no oficial hecho por un hincha. No está afiliado ni respaldado por Lionel Messi, la AFA ni la FIFA.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · GSAP (ScrollTrigger, SplitText) · Lenis · `next/og`

## Cómo correrlo

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
npm run lint
```

Variable opcional: `NEXT_PUBLIC_SITE_URL=https://208messi.vercel.app` (metadataBase, OG y links de compartir).

## Dónde editar

| Qué | Archivo |
| --- | --- |
| Links del footer, URL pública, datos del partido 208 (goles, embeds de X) | `config/site.ts` |
| Los 208 partidos | `data/matches.json` |
| Fotos (autor, licencia, origen), galería, hero y capítulos | `data/gallery.ts` |
| Textos de los capítulos | `lib/matches.ts` |

Rutas: `/` · `/p/[n]` (deep link a un partido) · `/story?m=176` (story vertical) · `/creditos` · `/?intro=0` saltea el preloader.

## Fuentes de datos

Los partidos 1 a 207 (fecha, rival, resultado, goles, competencia) se armaron cruzando:

- [worldfootball.net](https://www.worldfootball.net/person/pe1757/lionel-messi/international-matches/): apariciones de Messi con la Selección, partido por partido.
- Wikipedia: [List of international goals scored by Lionel Messi](https://en.wikipedia.org/wiki/List_of_international_goals_scored_by_Lionel_Messi) (número de cap, fecha local, goles) y *Argentina national football team results* (resultados, penales, fechas locales).

Validación: 207 partidos y 125 goles hasta la final del Mundial 2026; el número de cap y los goles de cada uno de los 86 partidos con gol coinciden entre ambas fuentes. Cada partido tiene `"verified"` en el JSON (`false` = no se pudo cruzar con dos fuentes). Las fechas son locales del estadio.

El partido 208 (3-0 a Benín, goles de Otamendi, Nico Paz y Messi de penal) se cargó con las crónicas del 6 y 7 de octubre de 2026. Los medios no coinciden del todo en los minutos; se usó el que repite la mayoría (48', 62' y 71').

## Créditos de fotos

Todas las fotos alojadas en el sitio son de Wikimedia Commons con licencias CC BY o CC BY-SA, con crédito visible. Autores, licencias y links de origen: [`/creditos`](https://208messi.vercel.app/creditos) y `data/gallery.ts`. El video del partido 208 se muestra con el embed oficial de X, con el crédito de su autor. Las dos fotos de la frase del 208 (`public/img/x-poder-*.webp`) y el video de la tribuna (`public/video/monumental-canta.mp4`) no tienen licencia libre ni autor identificado.

## Licencia

Código bajo [licencia MIT](LICENSE). Las fotos conservan sus propias licencias Creative Commons.
