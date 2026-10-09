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
import { LoQueGenero } from "./LoQueGenero";
import type { CommonsMap } from "@/lib/commons";
import { Outro } from "./Outro";
import { Footer } from "./Footer";

export function Experience({ initialMatch = null, media = {} }: { initialMatch?: number | null; media?: CommonsMap }) {
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
        <LoQueGenero media={media} />
        <Match208 />
        <Outro />
      </main>
      <Footer />
    </StoreProvider>
  );
}
