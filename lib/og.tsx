import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cells, MAX_ROWS, YEARS, type Cell } from "@/lib/matches";

export const C = {
  night: "#07111F",
  celeste: "#75AADB",
  bone: "#F4F1EA",
  gold: "#C9A44C",
  slate: "#2A3442",
};

export async function ogFonts() {
  const dir = join(process.cwd(), "assets/og-fonts");
  const [display, serif, mono] = await Promise.all([
    readFile(join(dir, "big-shoulders-display-latin-900-normal.woff")),
    readFile(join(dir, "instrument-serif-latin-400-italic.woff")),
    readFile(join(dir, "jetbrains-mono-latin-400-normal.woff")),
  ]);
  return [
    { name: "Display", data: display, weight: 900 as const, style: "normal" as const },
    { name: "Serif", data: serif, weight: 400 as const, style: "italic" as const },
    { name: "Mono", data: mono, weight: 400 as const, style: "normal" as const },
  ];
}

const LVL = ["rgba(117,170,219,0.16)", "rgba(117,170,219,0.42)", "rgba(117,170,219,0.72)", "#75AADB"];
const DIM = ["rgba(117,170,219,0.07)", "rgba(117,170,219,0.13)", "rgba(117,170,219,0.2)", "rgba(117,170,219,0.28)"];

function color(c: Cell | undefined, dim: boolean) {
  if (!c) return "rgba(244,241,234,0.035)";
  if (c.isFinal) return c.won ? (dim ? "rgba(201,164,76,0.28)" : C.gold) : dim ? "#151d28" : C.slate;
  return (dim ? DIM : LVL)[c.level];
}

/** Mini-grid para next/og (sólo flexbox). orientation "cols" = columnas por año, "rows" = filas por año. */
export function OgGrid({ size, gap, highlight, orientation = "cols", labels = false }: { size: number; gap: number; highlight?: number; orientation?: "cols" | "rows"; labels?: boolean }) {
  const byYear = YEARS.map((y) => cells.filter((c) => c.col === y - YEARS[0]));
  return (
    <div style={{ display: "flex", flexDirection: orientation === "cols" ? "row" : "column", gap }}>
      {byYear.map((list, yi) => (
        <div key={yi} style={{ display: "flex", flexDirection: orientation === "cols" ? "column" : "row", alignItems: "center", gap }}>
          {labels && (
            <div style={{ display: "flex", width: size * 1.4, fontFamily: "Mono", fontSize: size * 0.45, color: "rgba(244,241,234,0.45)" }}>
              {`'${String(YEARS[yi]).slice(2)}`}
            </div>
          )}
          {Array.from({ length: MAX_ROWS }, (_, r) => {
            const c = list[r];
            const hit = highlight != null && c?.n === highlight;
            return (
              <div
                key={r}
                style={{
                  display: "flex",
                  width: size,
                  height: size,
                  borderRadius: Math.max(2, size / 6),
                  background: hit ? (c!.isFinal && c!.won ? C.gold : C.celeste) : color(c, highlight != null),
                  ...(hit ? { boxShadow: `0 0 0 ${Math.round(size * 0.2)}px ${C.night}, 0 0 0 ${Math.round(size * 0.3)}px ${C.bone}, 0 0 ${size * 2}px ${C.celeste}` } : {}),
                  ...(hit ? { transform: "scale(1.8)" } : {}),
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
