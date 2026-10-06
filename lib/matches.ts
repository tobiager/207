import raw from "@/data/matches.json";

export type Competition =
  | "Amistoso"
  | "Eliminatorias"
  | "Copa América"
  | "Mundial"
  | "Finalissima";

export type MatchImage = { src: string; credit: string; license: string; href?: string };

export type Match = {
  n: number;
  date: string;
  opponent: string;
  result: string;
  goals: number;
  competition: Competition;
  isFinal: boolean;
  won: boolean;
  note?: string | null;
  /** false = no se pudo cruzar con al menos dos fuentes. */
  verified?: boolean;
  image?: MatchImage | null;
};

export const matches = raw as Match[];

export const FIRST_YEAR = 2005;
export const LAST_YEAR = 2026;
export const YEARS = Array.from({ length: LAST_YEAR - FIRST_YEAR + 1 }, (_, i) => FIRST_YEAR + i);

export const TOTAL_MATCHES = matches.length;
export const TOTAL_GOALS = matches.reduce((a, m) => a + m.goals, 0);
export const TITLES = matches.filter((m) => m.isFinal && m.won).length;

export const yearOf = (m: Match) => Number(m.date.slice(0, 4));

/** Nivel de intensidad estilo GitHub: 0 / 1 / 2 / 3+ goles. */
export const levelOf = (m: Match) => Math.min(m.goals, 3) as 0 | 1 | 2 | 3;

/** Posición en el grid: columna = año, fila = orden dentro del año. */
export type Cell = Match & { col: number; row: number; level: 0 | 1 | 2 | 3 };

export const cells: Cell[] = (() => {
  const perYear = new Map<number, number>();
  return matches.map((m) => {
    const y = yearOf(m);
    const row = perYear.get(y) ?? 0;
    perYear.set(y, row + 1);
    return { ...m, col: y - FIRST_YEAR, row, level: levelOf(m) };
  });
})();

export const MAX_ROWS = Math.max(...YEARS.map((y) => cells.filter((c) => yearOf(c) === y).length));

/** Goles acumulados después de cada partido (para los contadores en vivo). */
export const cumulativeGoals = matches.reduce<number[]>((acc, m, i) => {
  acc.push((acc[i - 1] ?? 0) + m.goals);
  return acc;
}, []);

export const finals = matches.filter((m) => m.isFinal);

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`;
}

/** Capítulos: rango de partidos que ilumina el mini-grid de cada uno. */
export type Chapter = {
  year: number;
  title: string;
  line: string;
  tag: string;
  gold?: boolean;
  pick: (m: Match) => boolean;
  image?: MatchImage | null;
};

export const chapters: Chapter[] = [
  {
    year: 2005,
    title: "El debut",
    line: "Entró, y a los 47 segundos lo echaron. Así empezó todo.",
    tag: "Debut · Amistoso vs Hungría",
    pick: (m) => m.n === 1,
  },
  {
    year: 2016,
    title: "La renuncia",
    line: "«Se terminó para mí la Selección.» Un país entero le pidió que no.",
    tag: "Copa América Centenario",
    pick: (m) => yearOf(m) === 2016 && m.competition === "Copa América",
  },
  {
    year: 2021,
    title: "El Maracaná",
    line: "De rodillas, en el Maracaná. Por fin.",
    tag: "Copa América 2021",
    gold: true,
    pick: (m) => yearOf(m) === 2021 && m.competition === "Copa América",
  },
  {
    year: 2022,
    title: "Qatar",
    line: "Lusail. La tercera estrella. El mundo, celeste y blanco.",
    tag: "Mundial Qatar 2022",
    gold: true,
    pick: (m) => yearOf(m) === 2022 && m.competition === "Mundial",
  },
  {
    year: 2024,
    title: "Bicampeón",
    line: "Lloró en el banco. Y volvió a levantar la copa.",
    tag: "Copa América 2024",
    gold: true,
    pick: (m) => yearOf(m) === 2024 && m.competition === "Copa América",
  },
  {
    year: 2026,
    title: "La última final",
    line: "No hizo falta ganarla para ser eterno.",
    tag: "Mundial 2026",
    pick: (m) => yearOf(m) === 2026 && m.competition === "Mundial",
  },
];

export const COMPETITIONS: Competition[] = ["Mundial", "Copa América", "Eliminatorias", "Amistoso", "Finalissima"];
