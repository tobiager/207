/**
 * "Lo que generó": lo que Messi provocó en la gente.
 *
 * Fotos: solo archivos de Wikimedia Commons (licencias libres). Autor y licencia NO se escriben a mano:
 * se leen de la API de Commons al hacer el build (lib/commons.ts), así el crédito siempre coincide con el
 * archivo. Para sacar una foto, borrala de la lista; para sumar una, agregá el nombre exacto del archivo.
 *
 * Videos: posts públicos de YouTube que subió la gente y los medios, mostrados con el reproductor oficial
 * (youtube-nocookie) y el canal visible. No se descargan ni se re-suben: el iframe se carga recién al tocar.
 */

export type CommonsRef = {
  /** Nombre exacto del archivo en Commons, sin el prefijo "File:". */
  file: string;
  alt: string;
  /** object-position del recorte. */
  position?: string;
};

export type VideoRef = {
  /** ID de YouTube (verificado con oEmbed: existe y permite embeber). */
  id: string;
  title: string;
  channel: string;
  /** Short (9:16) o video horizontal (16:9). */
  vertical?: boolean;
};

export type Wall = {
  city: string;
  place: string;
  /** Artistas, si se conocen con fuente. */
  artists?: string;
  line: string;
  video?: VideoRef;
  photos?: CommonsRef[];
  source?: { label: string; href: string };
};

/* ---------- 18D · Los livings ---------- */
export const livings = {
  date: "18.12.2022",
  title: "Cada uno lo vio en un lugar distinto.",
  titleAccent: "Todos gritamos lo mismo.",
  lead: "El penal de Montiel, visto desde livings, bares, plazas y calles. No el partido: la gente.",
  /** El primero va grande. */
  videos: [
    { id: "4SeLb9yMv_E", title: "Un hincha graba el momento exacto en que Argentina sale campeona", channel: "La Vanguardia" },
    { id: "qYpPqkE94a0", title: "Minutos después del penal, así estaba la 9 de Julio", channel: "TyC Sports", vertical: true },
    { id: "BlXRlwOI-rA", title: "“Somos todos Montiel”", channel: "TyC Sports", vertical: true },
    { id: "05EzR0zQ1U4", title: "Reacciones al penal de Gonzalo Montiel", channel: "Radio Boing" },
    { id: "nGf4ehgmgiE", title: "Hinchas en el instante del gol de Montiel", channel: "Pasiones de argentinos" },
  ] satisfies VideoRef[],
  photos: [
    { file: "Partido Argentina-México en Plaza Seeber.jpg", alt: "Gente mirando en una pantalla gigante el partido Argentina-México en la Plaza Seeber, Buenos Aires" },
    { file: "Celebración del partido Argentina-Croacia.jpg", alt: "Hinchas festejando en la calle el pase a la final tras el partido Argentina-Croacia" },
  ] satisfies CommonsRef[],
};

/* ---------- 20D · La calle ---------- */
export const calle = {
  date: "20.12.2022",
  /** Estimación de asistencia citada por World Press Photo (cobertura de AFP). */
  people: 5_000_000,
  title: "Un país entero en la calle.",
  titleAccent: "Ese martes fue feriado.",
  hero: { file: "Festejos en el Obelisco de Buenos Aires por la obtención de la Copa del Mundo de Fútbol 2022.jpg", alt: "Multitud festejando alrededor del Obelisco de Buenos Aires tras la obtención de la Copa del Mundo 2022" } satisfies CommonsRef,
  photos: [
    { file: "Argentina Campeón 2022, Obelisco.jpg", alt: "Hinchas en el Obelisco festejando a Argentina campeón del mundo" },
    { file: "Festejos Argentina - Campeón 2022 - 02.jpg", alt: "Festejos en Buenos Aires por Argentina campeón del mundo 2022" },
    { file: "Hinchas argentinos en Buenos Aires.jpg", alt: "Hinchas argentinos con banderas en una calle de Buenos Aires" },
    { file: "Festejos Argentina - Campeón 2022 - 04.jpg", alt: "Gente en la calle festejando el título del mundo" },
    { file: "Cartel luminoso celebrando la victoria argentina en la Copa Mundial de Fútbol 2022, Buenos Aires.jpg", alt: "Cartel luminoso en Buenos Aires celebrando la victoria argentina en el Mundial 2022" },
    { file: "Festejos Argentina - Campeón 2022 - 11.jpg", alt: "Festejos populares en Buenos Aires tras la final del Mundial 2022" },
  ] satisfies CommonsRef[],
  videos: [
    { id: "ii4mmOWDqJE", title: "Los festejos en el Obelisco desde un drone", channel: "Clarín" },
    { id: "B2p8tu3848I", title: "Así salió de Ezeiza el micro con los campeones del mundo", channel: "ESPN Fans" },
    { id: "kXukDnmSi08", title: "La caravana termina con una vuelta en helicóptero sobre el Obelisco", channel: "DSports" },
  ] satisfies VideoRef[],
  sources: [
    { label: "World Press Photo", href: "https://www.worldpressphoto.org/collection/photo-contest/2023/Tomas-Francisco-Cuesta/2" },
    { label: "Goal", href: "https://www.goal.com/en-qa/news/argentina-declare-tuesday-as-national-holiday-for-world-cup-celebrations/bltf9c1441d43018260" },
  ],
};

/* ---------- Las paredes ---------- */
export const paredes = {
  title: "Cuando no alcanzaron las palabras,",
  titleAccent: "lo pintamos.",
  walls: [
    {
      city: "Rosario",
      place: "“De otra galaxia, de mi ciudad” · 69 metros",
      artists: "Marlene Zuriaga y Lisandro Urteaga",
      line: "El capitán con la 10, la mano en el pecho y un sol detrás. Se inauguró en 2021 con chicos de una escuela primaria.",
      video: { id: "zaJatIbqAHY", title: "Rosario inaugura el mural de Messi", channel: "FRANCE 24 English" },
      source: { label: "The Bridge", href: "https://thebridge.in/football/69-meter-messi-mural-rosario-27447" },
    },
    {
      city: "Rosario",
      place: "El mismo mural, con la tercera estrella",
      line: "Después de Qatar, el mural de su ciudad sumó la estrella que faltaba.",
      video: { id: "GwLeSr2y35A", title: "El mural de Messi en Rosario recibe la tercera estrella", channel: "El Economista" },
    },
    {
      city: "Rosario",
      place: "El barrio donde creció",
      line: "Frente a su escuela, en la casa de su infancia y en el potrero donde pateó las primeras pelotas.",
      photos: [
        { file: "Casa y barrio de la infancia de Lionel Messi - Rosario (Santa Fe) 01.jpg", alt: "Casa y barrio de la infancia de Lionel Messi en Rosario" },
        { file: "Casa y barrio de la infancia de Lionel Messi - Rosario (Santa Fe) 03.jpg", alt: "Calle del barrio de la infancia de Lionel Messi en Rosario" },
      ],
      source: { label: "Orato", href: "https://orato.world/2022/12/15/lisandro-mural-messi-rosario-argentina/" },
    },
    {
      city: "Buenos Aires",
      place: "Avenida 9 de Julio",
      line: "En la avenida donde millones lo esperaron, una pared entera para él.",
      video: { id: "pBihBVphNqE", title: "El mural de Lionel Messi que se inauguró en la Avenida 9 de Julio", channel: "Televisión Pública Noticias" },
    },
    {
      city: "Berazategui",
      place: "El mural que emocionó a Leo",
      line: "Un mural de barrio que le llegó al propio Leo y lo emocionó.",
      video: { id: "6wd_G9TIxCU", title: "El mural de Messi en Berazategui que emocionó al propio Leo", channel: "A24" },
    },
    {
      city: "Buenos Aires",
      place: "Palermo · “Messi Corner”",
      artists: "Maxi Bagnasco",
      line: "Messi con el bisht, levantando la copa. La gente va a esa esquina a sacarse fotos.",
      source: { label: "BA Street Art", href: "https://buenosairesstreetart.com/2022/12/messi-mural-in-palermo-buenos-aires-painted-by-maxi-bagnasco/" },
    },
    {
      city: "San Fernando",
      place: "Retrato hiperrealista",
      artists: "Cobre",
      line: "Lo terminó en aerosol mientras se jugaba el Mundial de Qatar.",
      source: { label: "BA Street Art", href: "https://buenosairesstreetart.com/2022/12/messi-world-cup-mural-painted-by-cobre-in-buenos-aires/" },
    },
    {
      city: "Tandil",
      place: "Messi como un dios griego",
      artists: "Oliver Sink",
      line: "Con los nombres de todo el plantel y de Scaloni escritos en la pared.",
      source: { label: "BA Street Art", href: "https://buenosairesstreetart.com/?p=66291" },
    },
  ] satisfies Wall[],
  outro: "Y cientos más.",
  outroSource: { label: "BA Street Art", href: "https://buenosairesstreetart.com/?p=66291" },
};

/* ---------- La 10 ---------- */
export const la10 = {
  lines: ["Una camiseta.", "Millones de espaldas.", "Todos llevamos el 10."],
  /** Fotos que arman el mosaico (además de las del 18D y el 20D). */
  photos: [
    { file: "Hinchas de Messi.jpg", alt: "Hinchas con camisetas de Messi" },
    { file: "Argentina vs mexico hinchada argentina.jpg", alt: "Hinchada argentina en el estadio durante Argentina-México, Mundial 2022" },
    { file: "Hinchada argentina durante el partido Argentina-México.jpg", alt: "Tribuna argentina durante el partido Argentina-México" },
    { file: "Argentina vs mexico festejo gol.jpg", alt: "Hinchas argentinos festejando un gol ante México" },
  ] satisfies CommonsRef[],
  /** Fotos que ya estaban en el sitio (frase del partido 208). */
  local: [
    { src: "/img/x-poder-2.webp", alt: "Una multitud de hinchas caminando con la camiseta 10 de Messi" },
    { src: "/img/x-poder-1.webp", alt: "Messi de espaldas frente a la tribuna argentina, que le muestra camisetas con su nombre" },
  ],
  videos: [
    { id: "5QlCcQHuLm0", title: "Tatuajes de Messi, el regalo de moda en Argentina", channel: "TJ Sports" },
    { id: "Cqt9i3Kr-DU", title: "Se tatúa el dorsal de Messi en la espalda", channel: "Antena 3 Noticias" },
  ] satisfies VideoRef[],
};

/* ---------- Tu vida con él ---------- */
export const MILESTONES = [
  { key: "debut", date: "2005-08-17", label: "cuando debutó" },
  { key: "maracana", date: "2021-07-10", label: "en el Maracaná" },
  { key: "lusail", date: "2022-12-18", label: "en Lusail" },
  { key: "despedida", date: "2026-10-06", label: "en su despedida" },
] as const;

/* ---------- Puente al 208 ---------- */
export const puente = {
  line: "Y el 6 de octubre,",
  lineAccent: "le tocó a él escucharnos.",
  video: { id: "JX_Sbd3F1R0", title: "La llegada de los hinchas al Monumental para la despedida", channel: "Diario AS" } satisfies VideoRef,
};

/** Todos los archivos de Commons de la sección (para pedir autor y licencia en un solo request). */
export const ALL_COMMONS_FILES: string[] = Array.from(
  new Set([
    ...livings.photos.map((p) => p.file),
    calle.hero.file,
    ...calle.photos.map((p) => p.file),
    ...paredes.walls.flatMap((w) => (w.photos ?? []).map((p) => p.file)),
    ...la10.photos.map((p) => p.file),
  ]),
);

/** Todos los videos embebidos (para /creditos). */
export const ALL_VIDEOS: VideoRef[] = [
  ...livings.videos,
  ...calle.videos,
  ...paredes.walls.flatMap((w) => (w.video ? [w.video] : [])),
  ...la10.videos,
  puente.video,
];
