
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
| "Lo que generó": textos, fotos de Commons, videos y murales | `data/lo-que-genero.ts` |

Rutas: `/` · `/p/[n]` (deep link a un partido) · `/story?m=176` (story vertical) · `/creditos` · `/?intro=0` saltea el preloader.

## Fuentes de datos

Los partidos 1 a 207 (fecha, rival, resultado, goles, competencia) se armaron cruzando:

- [worldfootball.net](https://www.worldfootball.net/person/pe1757/lionel-messi/international-matches/): apariciones de Messi con la Selección, partido por partido.
- Wikipedia: [List of international goals scored by Lionel Messi](https://en.wikipedia.org/wiki/List_of_international_goals_scored_by_Lionel_Messi) (número de cap, fecha local, goles) y *Argentina national football team results* (resultados, penales, fechas locales).

Validación: 207 partidos y 125 goles hasta la final del Mundial 2026; el número de cap y los goles de cada uno de los 86 partidos con gol coinciden entre ambas fuentes. Cada partido tiene `"verified"` en el JSON (`false` = no se pudo cruzar con dos fuentes). Las fechas son locales del estadio.

El partido 208 (3-0 a Benín, goles de Otamendi, Nico Paz y Messi de penal) se cargó con las crónicas del 6 y 7 de octubre de 2026. Los medios no coinciden del todo en los minutos; se usó el que repite la mayoría (48', 62' y 71').

## Lo que generó

Sección `// 07`, entre Las finales y el Partido 208: lo que Messi provocó en la gente. Va de lo masivo a lo personal:

1. **El gráfico se rompe**: los 208 cuadraditos se desarman en miles hasta llenar la pantalla (canvas + ScrollTrigger).
2. **18D · Los livings**: reacciones al penal de Montiel en casas, bares y plazas.
3. **20D · La calle**: contador hasta 5.000.000, fotos de los festejos y la caravana.
4. **Las paredes**: índice de murales con su ciudad, artista y fuente; cada uno se despliega con su video o sus fotos.
5. **La 10**: un mosaico de fotos de hinchas que, al alejarse, forma el número 10 sobre la grilla del gráfico.
6. **Tu vida con él**: con tu año (y mes) de nacimiento, qué edad tenías en cada momento y qué parte de tu vida lo viste con la celeste. Se calcula en el navegador.
7. **Puente al 208**: “Y el 6 de octubre, le tocó a él escucharnos.”

Fotos: solo archivos de Wikimedia Commons. El autor y la licencia se leen de la API de Commons en el build (`lib/commons.ts`, revalidado cada 24 h), así el crédito siempre coincide con el archivo; si un archivo se borra de Commons, deja de mostrarse. Videos: posts públicos de YouTube con el reproductor oficial (`youtube-nocookie`), que se carga recién al tocar; el canal queda visible en cada video y en `/creditos`.

## Créditos de fotos

Todas las fotos alojadas en el sitio son de Wikimedia Commons con licencias CC BY o CC BY-SA, con crédito visible. Autores, licencias y links de origen: [`/creditos`](https://208messi.vercel.app/creditos) y `data/gallery.ts`. El video del partido 208 se muestra con el embed oficial de X, con el crédito de su autor. Las dos fotos de la frase del 208 (`public/img/x-poder-*.webp`) y el video de la tribuna (`public/video/monumental-canta.mp4`) no tienen licencia libre ni autor identificado.

## Licencia

Código bajo [licencia MIT](LICENSE). Las fotos conservan sus propias licencias Creative Commons.
