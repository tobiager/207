# 207 — Gracias, Leo

<!-- Reemplazá esta línea por el GIF de demo: ![demo](docs/demo.gif) -->
![demo](docs/demo.gif)

Homenaje one-page a Lionel Messi por su carrera en la Selección Argentina: **207 partidos, 125 goles**, contados como un *contribution graph* de GitHub (un cuadradito por partido, 2005 → 2026). El partido 208 (Argentina vs Benín, 06/10/2026, Monumental) cambia de estado según la hora: cuenta regresiva → en vivo → finalizado.

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

Variable opcional: `NEXT_PUBLIC_SITE_URL=https://207.vercel.app` (metadataBase, OG y links de compartir).

## Dónde editar

| Qué | Archivo |
| --- | --- |
| Links del footer, URL pública, horario del partido 208, `finalScore` | `config/site.ts` |
| Los 207 partidos | `data/matches.json` |
| Fotos (autor, licencia, origen), galería, hero y capítulos | `data/gallery.ts` |
| Textos de los capítulos | `lib/matches.ts` |

Al terminar el partido 208 completá `finalScore` en `config/site.ts` (ej. `"3-0"`) para mostrar el resultado en el hero, el countdown y el cuadradito 208.

Rutas: `/` · `/p/[n]` (deep link a un partido) · `/story?m=176` (story vertical) · `/creditos` · `/?estado=live` y `/?estado=after` para previsualizar estados · `/?intro=0` saltea el preloader.

## Fuentes de datos

Los 207 partidos (fecha, rival, resultado, goles, competencia) se armaron cruzando:

- [worldfootball.net](https://www.worldfootball.net/person/pe1757/lionel-messi/international-matches/): apariciones de Messi con la Selección, partido por partido.
- Wikipedia: [List of international goals scored by Lionel Messi](https://en.wikipedia.org/wiki/List_of_international_goals_scored_by_Lionel_Messi) (número de cap, fecha local, goles) y *Argentina national football team results* (resultados, penales, fechas locales).

Validación: 207 partidos y 125 goles; el número de cap y los goles de cada uno de los 86 partidos con gol coinciden entre ambas fuentes. Cada partido tiene `"verified"` en el JSON (`false` = no se pudo cruzar con dos fuentes). Las fechas son locales del estadio.

## Créditos de fotos

Todas las fotos son de Wikimedia Commons con licencias CC BY o CC BY-SA, con crédito visible en el sitio. Autores, licencias y links de origen: [`/creditos`](https://207.vercel.app/creditos) y `data/gallery.ts`.

## Licencia

Código bajo [licencia MIT](LICENSE). Las fotos conservan sus propias licencias Creative Commons.
