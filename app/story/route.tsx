import { ImageResponse } from "next/og";
import { C, OgGrid, ogFonts } from "@/lib/og";
import { matches, TOTAL_GOALS } from "@/lib/matches";
import { site } from "@/config/site";

/** Story vertical 1080×1920 para IG / estados de WhatsApp. ?m=176 destaca un partido. */
export async function GET(req: Request) {
  const m = matches.find((x) => x.n === Number(new URL(req.url).searchParams.get("m")));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "120px 88px 110px",
          background: `radial-gradient(100% 50% at 50% 0%, #1d3a57 0%, ${C.night} 65%)`,
          color: C.bone,
          fontFamily: "Mono",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", fontFamily: "Display", fontSize: 300, lineHeight: 0.76, letterSpacing: -6 }}>207</div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, fontSize: 26 }}>
            <span style={{ color: C.celeste }}>{`${TOTAL_GOALS} goles`}</span>
            <span style={{ color: "rgba(244,241,234,0.6)" }}>2005—2026</span>
          </div>
        </div>
        <OgGrid size={44} gap={8} orientation="rows" labels highlight={m?.n} />
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {m ? (
            <div style={{ display: "flex", fontSize: 30, color: m.isFinal && m.won ? C.gold : C.celeste }}>
              {`Mi partido favorito: #${m.n} vs ${m.opponent} · ${m.result}`}
            </div>
          ) : null}
          <div style={{ display: "flex", fontFamily: "Serif", fontStyle: "italic", fontSize: 150, lineHeight: 0.9 }}>Gracias, Leo.</div>
          <div style={{ display: "flex", fontSize: 24, color: "rgba(244,241,234,0.55)" }}>
            {`Una carrera entera. Un solo gráfico. · ${site.url.replace(/^https?:\/\//, "")}`}
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1920, fonts: await ogFonts() },
  );
}
