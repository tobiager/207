import { ImageResponse } from "next/og";
import { C, OgGrid, ogFonts } from "@/lib/og";
import { TOTAL_GOALS, TOTAL_MATCHES } from "@/lib/matches";
import { site } from "@/config/site";

export const alt = "207 — Gracias, Leo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "space-between",
          padding: "56px 64px",
          background: `radial-gradient(90% 90% at 85% 10%, #1d3a57 0%, ${C.night} 60%)`,
          color: C.bone,
          fontFamily: "Mono",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 16, letterSpacing: 2.5, color: "rgba(244,241,234,0.6)" }}>LIONEL MESSI · SELECCIÓN 2005—2026</div>
          <div style={{ display: "flex", fontFamily: "Display", fontSize: 340, lineHeight: 0.76, letterSpacing: -6 }}>207</div>
          <div style={{ display: "flex", fontFamily: "Serif", fontStyle: "italic", fontSize: 72 }}>Gracias, Leo.</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", fontSize: 16, color: C.celeste }}>{`${TOTAL_MATCHES} partidos · ${TOTAL_GOALS} goles`}</div>
          <OgGrid size={17} gap={4} />
          <div style={{ display: "flex", fontSize: 14, color: "rgba(244,241,234,0.5)" }}>{site.url.replace(/^https?:\/\//, "")}</div>
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
