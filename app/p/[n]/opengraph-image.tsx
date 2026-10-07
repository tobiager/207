import { ImageResponse } from "next/og";
import { C, OgGrid, ogFonts } from "@/lib/og";
import { matches, formatDate } from "@/lib/matches";
import { site } from "@/config/site";

export const alt = "Mi partido favorito de Leo — " + site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return matches.map((m) => ({ n: String(m.n) }));
}

export default async function MatchOG({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const m = matches.find((x) => x.n === Number(n)) ?? matches[matches.length - 1];
  const gold = m.isFinal && m.won;
  const [score, pens] = m.result.split(" ");
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "space-between", padding: "56px 64px", background: C.night, color: C.bone, fontFamily: "Mono" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", maxWidth: 560 }}>
          <div style={{ display: "flex", fontFamily: "Serif", fontStyle: "italic", fontSize: 40, color: C.celeste }}>Mi partido favorito</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", fontSize: 18, letterSpacing: 2.5, color: gold ? C.gold : C.celeste }}>
              {`#${m.n} · ${m.isFinal ? "FINAL · " : ""}${m.competition.toUpperCase()}`}
            </div>
            <div style={{ display: "flex", fontFamily: "Display", fontSize: m.opponent.length > 12 ? 104 : 150, lineHeight: 0.8, textTransform: "uppercase" }}>{m.opponent}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, fontFamily: "Display", fontSize: 64 }}>
              {score}
              {pens ? <span style={{ fontSize: 34, color: "rgba(244,241,234,0.6)" }}>{pens.replace(/[()]/g, "")} pen.</span> : null}
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 18, color: "rgba(244,241,234,0.65)" }}>
            {`${formatDate(m.date)} · ${m.goals} gol${m.goals === 1 ? "" : "es"} de Leo`}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", fontFamily: "Display", fontSize: 44 }}>{site.name}</div>
          <OgGrid size={17} gap={4} highlight={m.n} />
          <div style={{ display: "flex", fontSize: 14, color: "rgba(244,241,234,0.5)" }}>{`Elegí el tuyo en ${site.url.replace(/^https?:\/\//, "")}`}</div>
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
