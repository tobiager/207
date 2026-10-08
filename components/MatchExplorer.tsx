"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { matches, formatDate, TOTAL_MATCHES, YEARS, yearOf, type Competition, type Match } from "@/lib/matches";
import { useStore } from "@/lib/store";
import { matchUrl, nativeShare, shareText } from "@/lib/share";
import { Photo } from "./Photo";
import { onReady } from "./Preloader";
import { spotMatch } from "./MatchGrid";

const COMP_CHIPS: Competition[] = ["Mundial", "Copa América", "Eliminatorias", "Amistoso"];
/** "El archivo": arranca con los últimos 10 y "Ver más" suma de a 25. */
const FIRST = 10;
const STEP = 25;

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`min-h-11 flex-none rounded-full border px-4 font-mono text-[11px] tracking-[0.04em] transition-colors duration-300 md:text-xs ${
        on ? "border-bone bg-bone text-night" : "border-bone/20 text-bone hover:border-celeste/70"
      }`}
    >
      {children}
    </button>
  );
}

function outcome(m: Match) {
  const [a, b] = m.result.split(" ")[0].split("-").map(Number);
  if (m.won) return `Victoria ante ${m.opponent}.`;
  if (a === b) return `Empate ante ${m.opponent}.`;
  return `Derrota ante ${m.opponent}. También son parte.`;
}

/** Tarjeta tipográfica para los partidos sin foto. */
function ScoreCard({ m, gold }: { m: Match; gold: boolean }) {
  const [score, ...rest] = m.result.split(" ");
  return (
    <div
      className={`flex h-full flex-col justify-between rounded border p-5 md:p-6 ${
        gold ? "border-gold/40 bg-[radial-gradient(circle_at_20%_30%,rgb(201_164_76/0.18),transparent_65%)]" : "border-bone/10 bg-[radial-gradient(circle_at_20%_30%,rgb(117_170_219/0.12),transparent_65%)]"
      }`}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-bone/55 md:text-[11px]">
        {m.competition} · {formatDate(m.date)}
      </span>
      <div className="flex flex-col gap-1">
        <span className={`font-display font-black leading-[0.85] tabular-nums ${gold ? "text-gold" : "text-bone"}`} style={{ fontSize: "clamp(64px, 9vw, 112px)" }}>
          {score}
          {rest.length > 0 && <span className="ml-3 align-middle font-mono text-sm font-normal text-bone/55">{rest.join(" ")}</span>}
        </span>
        <span className="font-display text-xl font-bold uppercase tracking-[0.01em] text-bone/80 md:text-2xl">ARG vs {m.opponent}</span>
      </div>
      <span className={`self-end font-mono text-[11px] ${gold ? "text-gold/80" : "text-celeste/80"}`}>
        #{m.n}/{TOTAL_MATCHES}
      </span>
    </div>
  );
}

function Detail({ m }: { m: Match }) {
  const [msg, setMsg] = useState<string | null>(null);
  const tone = m.isFinal && m.won ? "gold" : "celeste";
  return (
    <div className={`grid gap-6 pb-8 pt-2 md:grid-cols-[minmax(0,420px)_1fr] md:gap-10 md:pl-[86px] ${tone === "gold" ? "bg-gold/[0.04]" : ""}`}>
      <div className="aspect-[16/10]">
        {m.image ? (
          <Photo image={m.image} alt={`Argentina vs ${m.opponent}, ${formatDate(m.date)}`} sizes="(min-width: 768px) 420px, 100vw" className="rounded" />
        ) : (
          <ScoreCard m={m} gold={tone === "gold"} />
        )}
      </div>
      <div className="flex flex-col gap-4">
        <p className="font-serif text-[28px] italic leading-tight md:text-[34px]">
          {m.note ?? outcome(m)}
        </p>
        <span className="text-xs leading-relaxed text-bone/60">
          #{m.n} · {formatDate(m.date)} · {m.competition}
          {m.isFinal ? " · Final" : ""} · {m.goals} gol{m.goals === 1 ? "" : "es"} de Leo
        </span>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={async () => {
              const r = await nativeShare(matchUrl(m.n), shareText(m));
              setMsg(r === "copied" ? "Link copiado" : r === "failed" ? "No se pudo compartir" : null);
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-celeste px-5 text-[13px] font-bold text-night transition-colors hover:bg-bone"
          >
            Compartir este partido ↗
          </button>
          <button
            type="button"
            onClick={() => spotMatch(m.n)}
            className="min-h-11 rounded-full border border-bone/25 px-5 text-[13px] transition-colors hover:border-celeste"
          >
            Ver en el gráfico
          </button>
          <a
            href={`/p/${m.n}/opengraph-image`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center rounded-full border border-bone/25 px-5 text-[13px] text-bone transition-colors hover:border-celeste"
          >
            Tarjeta
          </a>
        </div>
        {msg && <span className="text-xs text-celeste" role="status">{msg}</span>}
      </div>
    </div>
  );
}

export function MatchExplorer() {
  const { setHighlight, active, setActive, scrollTo } = useStore();
  const [q, setQ] = useState("");
  const [year, setYear] = useState<number | "all">("all");
  const [comps, setComps] = useState<Set<Competition>>(new Set());
  const [withGoal, setWithGoal] = useState(false);
  const [finalsOnly, setFinalsOnly] = useState(false);
  const [limit, setLimit] = useState(FIRST);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtering = q.trim() !== "" || year !== "all" || comps.size > 0 || withGoal || finalsOnly;

  const filtered = useMemo(() => {
    const nq = norm(q.trim());
    // Del más reciente al más antiguo: se ordena acá, al renderizar, sin tocar los datos.
    return matches
      .filter(
        (m) =>
          (!nq || norm(m.opponent).includes(nq)) &&
          (year === "all" || yearOf(m) === year) &&
          (comps.size === 0 || comps.has(m.competition) || (comps.has("Copa América") && m.competition === "Finalissima")) &&
          (!withGoal || m.goals > 0) &&
          (!finalsOnly || m.isFinal),
      )
      .sort((a, b) => b.n - a.n);
  }, [q, year, comps, withGoal, finalsOnly]);

  // El grid de arriba resalta los cuadraditos que coinciden
  useEffect(() => {
    setHighlight(filtering ? new Set(filtered.map((m) => m.n)) : null);
  }, [filtered, filtering, setHighlight]);

  // Partido abierto desde afuera (deep link /p/[n], click en el gráfico): expandir hasta incluirlo.
  // El cambio de alto dispara el ScrollTrigger.refresh() del ResizeObserver de SmoothScroll.
  useEffect(() => {
    if (active == null) return;
    const idx = filtered.findIndex((m) => m.n === active);
    if (idx >= limit) setLimit(FIRST + Math.ceil((idx + 1 - FIRST) / STEP) * STEP);
  }, [active, filtered, limit]);

  useEffect(() => {
    const path = window.location.pathname.match(/^\/p\/(\d+)/);
    if (!path) return;
    return onReady(() => window.setTimeout(() => scrollTo(`#partido-${path[1]}`, -120), 700));
  }, [scrollTo]);

  // "Elegí tu partido favorito" enfoca el buscador
  useEffect(() => {
    const f = () => window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 1200);
    window.addEventListener("207:pick", f);
    return () => window.removeEventListener("207:pick", f);
  }, []);

  const toggleComp = (c: Competition) =>
    setComps((s) => {
      const n = new Set(s);
      if (n.has(c)) n.delete(c);
      else n.add(c);
      return n;
    });

  const reset = () => {
    setQ("");
    setYear("all");
    setComps(new Set());
    setWithGoal(false);
    setFinalsOnly(false);
  };

  const visible = filtered.slice(0, limit);
  const cols = "md:grid-cols-[70px_130px_minmax(0,1fr)_150px_80px_170px_32px]";

  return (
    <section id="partidos" className="px-gutter border-t border-bone/[0.06] py-24 md:py-36" aria-labelledby="partidos-title">
      <div className="mx-auto flex max-w-[1344px] flex-col gap-6 md:gap-9">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-5">
            <span className="eyebrow">// 03 — Todos los partidos</span>
            <h2 id="partidos-title" className="h-display text-[58px] md:text-[96px]">
              El archivo
            </h2>
          </div>
          <label className="flex min-h-12 w-full items-center gap-3 rounded-full border border-bone/20 px-4 md:w-[380px] md:rounded-none md:border-0 md:border-b md:border-bone/30 md:px-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#75AADB" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <span className="sr-only">Buscar rival</span>
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar rival… (ej: Brasil)"
              className="min-w-0 flex-1 bg-transparent font-mono text-sm text-bone outline-none placeholder:text-bone/40"
            />
          </label>
        </div>

        <div className="no-scrollbar -mx-[var(--gutter)] flex gap-2.5 overflow-x-auto px-[var(--gutter)] md:mx-0 md:flex-wrap md:px-0">
          <Chip on={!filtering} onClick={reset}>
            Todos
          </Chip>
          {COMP_CHIPS.map((c) => (
            <Chip key={c} on={comps.has(c)} onClick={() => toggleComp(c)}>
              {c}
            </Chip>
          ))}
          <Chip on={withGoal} onClick={() => setWithGoal((v) => !v)}>
            Con gol
          </Chip>
          <Chip on={finalsOnly} onClick={() => setFinalsOnly((v) => !v)}>
            Finales
          </Chip>
          <label className={`relative flex min-h-11 flex-none items-center rounded-full border px-4 text-[11px] md:text-xs ${year !== "all" ? "border-bone bg-bone text-night" : "border-bone/20"}`}>
            <span className="sr-only">Año</span>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="appearance-none bg-transparent pr-4 font-mono outline-none"
            >
              <option value="all" className="bg-night text-bone">Año: todos</option>
              {YEARS.map((y) => (
                <option key={y} value={y} className="bg-night text-bone">
                  {y}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3" aria-hidden="true">▾</span>
          </label>
        </div>

        <p className="text-[11px] text-bone/50" role="status">
          {filtered.length} de {matches.length}
          {filtering ? " · el gráfico resalta los que coinciden" : ""}
        </p>

        <div className="flex flex-col">
          <div aria-hidden="true" className={`hidden gap-4 border-b border-bone/15 py-3.5 text-[11px] tracking-[0.14em] text-bone/45 md:grid ${cols}`}>
            <span>N°</span>
            <span>FECHA</span>
            <span>RIVAL</span>
            <span>RESULTADO</span>
            <span>GOLES</span>
            <span>COMPETICIÓN</span>
            <span />
          </div>
          <ul aria-label="Partidos de Messi con la Selección" className="m-0 flex list-none flex-col p-0">
          {visible.map((m) => {
            const open = active === m.n;
            const gold = m.isFinal && m.won;
            return (
              <li key={m.n} id={`partido-${m.n}`} className={`border-b ${open ? "border-celeste/40" : "border-bone/[0.07]"}`}>
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setActive(open ? null : m.n)}
                  className={`group grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-4 text-left md:gap-4 md:py-[18px] ${cols} ${open && gold ? "bg-gold/[0.04]" : ""}`}
                >
                  <span className={`order-2 text-[10px] md:order-none md:text-sm ${gold ? "text-gold" : "text-bone/45"}`}>
                    <span className="md:hidden">#{m.n} · {m.date} · {m.competition}</span>
                    <span className="hidden md:inline">{m.n}</span>
                  </span>
                  <span className="hidden text-sm text-bone/70 md:block">{m.date}</span>
                  <span className={`order-1 font-display text-2xl font-bold uppercase leading-none tracking-[0.01em] transition-colors group-hover:text-celeste md:order-none md:text-[26px] ${gold ? "text-gold" : ""}`}>
                    {m.opponent}
                    {m.isFinal ? <span className="ml-2 align-middle font-mono text-[10px] tracking-[0.14em] text-bone/50">FINAL</span> : null}
                  </span>
                  <span className="order-1 justify-self-end text-[13px] md:order-none md:justify-self-start md:text-sm">{m.result}</span>
                  <span className="order-2 flex items-center justify-self-end gap-2 md:order-none md:justify-self-start">
                    <span className="h-3.5 w-3.5 rounded-[3px] md:hidden" style={{ background: m.isFinal ? (m.won ? "#C9A44C" : "#2A3442") : `var(--lvl-${Math.min(m.goals, 3)})` }} />
                    <span className={`text-[12px] md:text-sm ${m.goals ? "text-celeste" : "text-bone/35"}`}>
                      {m.goals}
                      <span className="md:hidden"> gol{m.goals === 1 ? "" : "es"}</span>
                    </span>
                  </span>
                  <span className="hidden text-sm text-bone/60 md:block">{m.competition}</span>
                  <span className="hidden text-bone/40 md:block" aria-hidden="true">{open ? "−" : "+"}</span>
                </button>
                {open && <Detail m={m} />}
              </li>
            );
          })}
          </ul>
        </div>
        {filtered.length > FIRST && (
          <button
            type="button"
            onClick={() => {
              if (filtered.length > limit) return setLimit((l) => l + STEP);
              setActive(null); // si no, el partido abierto vuelve a expandir la lista
              setLimit(FIRST);
              scrollTo("#partidos", -20);
            }}
            className="min-h-12 self-center rounded-full border border-bone/25 px-6 font-mono text-[13px] transition-colors hover:border-celeste"
          >
            {filtered.length > limit ? `Ver más (${filtered.length - limit})` : "Ver menos"}
          </button>
        )}
        {filtered.length === 0 && <p className="py-10 text-center font-serif text-2xl italic text-bone/60">Ningún partido con ese filtro. Probá otro rival.</p>}
      </div>
    </section>
  );
}
