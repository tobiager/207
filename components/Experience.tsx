"use client";

import { StoreProvider } from "@/lib/store";
import { SmoothScroll } from "./SmoothScroll";
import { Atmosphere } from "./Atmosphere";
import { Cursor } from "./Cursor";
import { Preloader } from "./Preloader";
import { Hero } from "./Hero";
import { Manifesto } from "./Manifesto";
import { MatchGrid } from "./MatchGrid";
import { MatchExplorer } from "./MatchExplorer";
import { Chapters } from "./Chapters";
import { Gallery } from "./Gallery";
import { Finals } from "./Finals";
import { Match208 } from "./Match208";
import { Hinchada } from "./Hinchada";
import { Outro } from "./Outro";
import { Footer } from "./Footer";

export function Experience({ initialMatch = null }: { initialMatch?: number | null }) {
  return (
    <StoreProvider initialMatch={initialMatch}>
      <SmoothScroll />
      <Atmosphere />
      <Cursor />
      <Preloader />
      <main className="relative z-[1]">
        <Hero />
        <Manifesto />
        <MatchGrid />
        <MatchExplorer />
        <Chapters />
        <Gallery />
        <Finals />
        <Match208 />
        <Hinchada />
        <Outro />
      </main>
      <Footer />
    </StoreProvider>
  );
}
