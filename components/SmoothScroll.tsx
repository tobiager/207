"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useStore } from "@/lib/store";

/** Lenis sincronizado con GSAP ScrollTrigger. */
export function SmoothScroll() {
  const { lenis } = useStore();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const l = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, touchMultiplier: 1.4 });
    lenis.current = l;
    l.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => l.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      l.destroy();
      lenis.current = null;
    };
  }, [lenis]);

  // Si cambia el alto del contenido ("Ver más", filas abiertas, imágenes), recalcular los
  // triggers: si no, los pins y reveals de abajo quedan con posiciones viejas y disparan tarde.
  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    let t: number | undefined;
    let last = main.offsetHeight;
    const ro = new ResizeObserver(() => {
      const h = main.offsetHeight;
      if (h === last) return;
      last = h;
      window.clearTimeout(t);
      t = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    ro.observe(main);
    return () => {
      ro.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  return null;
}
