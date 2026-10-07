"use client";

import { site } from "@/config/site";
import { useStore } from "@/lib/store";

/** Resultado del último partido (antes era la cuenta regresiva al partido 208). Lleva a la sección del partido. */
export function Countdown({ variant = "pill" }: { variant?: "pill" | "big" }) {
  const { scrollTo } = useStore();
  const m = site.lastMatch;
  const go = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo("#partido-208", -20);
  };

  if (variant === "pill") {
    return (
      <a
        href="#partido-208"
        onClick={go}
        className="flex items-center gap-2.5 rounded-full border border-celeste/35 px-3.5 py-2 text-[10px] uppercase tracking-[0.14em] transition-colors duration-300 hover:border-celeste md:text-[11px]"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-celeste" />
        <span className="hidden sm:inline">último partido</span>
        <b className="font-medium tabular-nums text-celeste">
          ARG {m.score} {m.short}
        </b>
        <span className="hidden font-serif text-[15px] normal-case italic tracking-normal md:inline">· Gracias, Leo</span>
      </a>
    );
  }

  return (
    <a href="#partido-208" onClick={go} className="group flex flex-col gap-2">
      <span className="text-[11px] uppercase tracking-[0.14em] text-bone/60">
        Último partido · {m.venue} · {m.date}
      </span>
      <span className="font-display text-4xl font-black tabular-nums md:text-5xl">
        ARG {m.score} {m.short}
        <span className="ml-3 align-middle font-serif text-2xl font-normal italic text-celeste transition-transform duration-300 group-hover:translate-x-1 md:text-3xl">
          gol de Leo →
        </span>
      </span>
    </a>
  );
}
