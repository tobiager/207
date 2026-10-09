"use client";

import { useId, useMemo, useState } from "react";
import { MILESTONES } from "@/data/lo-que-genero";
import { site } from "@/config/site";
import { nativeShare } from "@/lib/share";

const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const DEBUT = MILESTONES[0].date;
const LAST = MILESTONES[MILESTONES.length - 1].date;
const ymd = (d: string) => d.split("-").map(Number) as [number, number, number];

/** Edad a una fecha, con el día de nacimiento desconocido (se toma el 1° del mes; sin mes, julio). */
function ageAt(date: string, year: number, month: number | null) {
  const [y, m] = ymd(date);
  const bm = month ?? 7;
  return y - year - (m < bm ? 1 : 0);
}

function monthsBetween(a: [number, number], b: [number, number]) {
  return (b[0] - a[0]) * 12 + (b[1] - a[1]);
}

/**
 * "Tu vida con él": con tu año (y mes) de nacimiento, qué edad tenías en cada momento de su
 * carrera y qué parte de tu vida pasaste viéndolo con la celeste. Todo se calcula en el navegador;
 * no se guarda ni se envía nada.
 */
export function LifeWithHim() {
  const id = useId();
  const [year, setYear] = useState("");
  const [month, setMonth] = useState<string>("");
  const [shared, setShared] = useState<string | null>(null);

  const y = Number(year);
  const valid = /^\d{4}$/.test(year) && y >= 1920 && y <= 2026;
  const mo = month ? Number(month) : null;

  const out = useMemo(() => {
    if (!valid) return null;
    const birth: [number, number] = [y, mo ?? 7];
    const [ly, lm] = ymd(LAST);
    const [dy, dm] = ymd(DEBUT);
    if (monthsBetween(birth, [ly, lm]) < 0) return { kind: "future" as const };
    const ages = MILESTONES.map((ms) => ({ ...ms, age: ageAt(ms.date, y, mo) }));
    const life = Math.max(1, monthsBetween(birth, [ly, lm]));
    const withHim = monthsBetween(monthsBetween(birth, [dy, dm]) > 0 ? [dy, dm] : birth, [ly, lm]);
    const years = Math.round((withHim / 12) * 10) / 10;
    const pct = Math.min(100, Math.round((withHim / life) * 100));
    const bornAfter = monthsBetween(birth, [dy, dm]) <= 0;
    return { kind: "ok" as const, ages, years, pct, bornAfter };
  }, [valid, y, mo]);

  const shareText =
    out?.kind === "ok"
      ? out.bornAfter
        ? `Nunca conocí una Selección sin Messi. Hasta el 6 de octubre. Gracias, Leo.`
        : `Pasé ${String(out.years).replace(".", ",")} años de mi vida (el ${out.pct}%) viendo a Messi con la celeste. Gracias, Leo.`
      : "";

  return (
    <section className="px-gutter relative border-t border-bone/[0.06] py-24 md:py-40" aria-labelledby={`${id}-t`}>
      <div className="mx-auto grid max-w-[1344px] gap-12 md:grid-cols-[minmax(0,420px)_minmax(0,1fr)] md:gap-24">
        <div className="flex flex-col gap-6">
          <span className="eyebrow">Tu vida con él</span>
          <h3 id={`${id}-t`} className="h-display text-[54px] !leading-[0.95] md:text-[88px]">
            ¿Cuánto
            <br />
            de tu vida?
          </h3>
          <p className="max-w-[360px] text-xs leading-relaxed text-bone/55">
            Poné tu año de nacimiento (y el mes, si querés). Se calcula en tu navegador: no se guarda ni se envía nada.
          </p>
          <form className="flex flex-wrap gap-3" onSubmit={(e) => e.preventDefault()}>
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-bone/55">Año</span>
              <input
                inputMode="numeric"
                pattern="\d{4}"
                maxLength={4}
                placeholder="1998"
                value={year}
                onChange={(e) => {
                  setYear(e.target.value.replace(/\D/g, "").slice(0, 4));
                  setShared(null);
                }}
                className="h-14 w-36 rounded-xl border border-bone/20 bg-night-2/70 px-4 font-display text-3xl font-black tabular-nums text-bone outline-none transition-colors placeholder:text-bone/20 focus:border-celeste"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-bone/55">Mes (opcional)</span>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="h-14 w-44 rounded-xl border border-bone/20 bg-night-2/70 px-3 font-mono text-sm text-bone outline-none transition-colors focus:border-celeste"
              >
                <option value="">—</option>
                {MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
          </form>
        </div>

        <div className="flex min-h-[340px] flex-col justify-center gap-8" aria-live="polite">
          {!out && <p className="font-serif text-[30px] italic leading-tight text-bone/35 md:text-[44px]">Veintiún años de Selección. ¿Cuántos fueron también tuyos?</p>}
          {out?.kind === "future" && <p className="font-serif text-[30px] italic leading-tight text-bone/75 md:text-[44px]">Llegaste después del último cuadradito. Te lo vamos a contar.</p>}
          {out?.kind === "ok" && (
            <>
              <ul className="flex flex-col divide-y divide-bone/10 border-y border-bone/10">
                {out.ages.map((a) => (
                  <li key={a.key} className="flex items-baseline justify-between gap-6 py-3.5 md:py-4">
                    <span className="font-serif text-xl italic text-bone/75 md:text-[28px]">{a.label[0].toUpperCase() + a.label.slice(1)}</span>
                    <span className="font-display text-[34px] font-black tabular-nums leading-none md:text-[48px]">
                      {a.age < 0 ? <span className="text-bone/35">—</span> : a.age === 0 ? <span className="text-celeste">bebé</span> : `${a.age} años`}
                    </span>
                  </li>
                ))}
              </ul>
              {out.bornAfter ? (
                <p className="font-serif text-[34px] italic leading-[1.02] md:text-[56px]">
                  Nunca conociste una Selección sin él.
                  <br />
                  <span className="text-celeste">Hasta el 6 de octubre.</span>
                </p>
              ) : (
                <p className="font-serif text-[34px] italic leading-[1.02] md:text-[56px]">
                  Pasaste <span className="font-display not-italic font-black text-celeste">{String(out.years).replace(".", ",")}</span> años de tu vida viéndolo con la celeste.
                  <br />
                  <span className="text-bone/60">El {out.pct}% de tu vida.</span>
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={async () => setShared(await nativeShare(site.url, shareText))}
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-celeste px-6 font-mono text-[13px] font-bold text-night transition-colors duration-300 hover:bg-bone"
                >
                  Compartir →
                </button>
                {shared === "copied" && <span className="font-mono text-[11px] text-bone/55">Link copiado.</span>}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
