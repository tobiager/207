"use client";

import { createContext, useContext, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import type Lenis from "lenis";

type Store = {
  /** Partidos que coinciden con el filtro del explorador (null = sin filtro). */
  highlight: Set<number> | null;
  setHighlight: (s: Set<number> | null) => void;
  /** Partido activo (tooltip abierto / fila expandida). */
  active: number | null;
  setActive: (n: number | null) => void;
  lenis: RefObject<Lenis | null>;
  scrollTo: (target: string | HTMLElement, offset?: number) => void;
};

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children, initialMatch }: { children: ReactNode; initialMatch?: number | null }) {
  const [highlight, setHighlight] = useState<Set<number> | null>(null);
  const [active, setActive] = useState<number | null>(initialMatch ?? null);
  const lenis = useRef<Lenis | null>(null);

  const value = useMemo<Store>(
    () => ({
      highlight,
      setHighlight,
      active,
      setActive,
      lenis,
      scrollTo: (target, offset = 0) => {
        const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
        if (!el) return;
        if (lenis.current) lenis.current.scrollTo(el, { offset, duration: 1.6, force: true });
        else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: "smooth" });
      },
    }),
    [highlight, active],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore fuera de StoreProvider");
  return s;
}
