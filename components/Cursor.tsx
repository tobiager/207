"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Cursor custom: punto celeste → cuadradito sobre el grid → círculo grande sobre links y fotos.
 * Usa data-cursor="grid" | "grow" en los elementos, y a/button crecen por defecto.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    document.documentElement.classList.add("has-cursor");
    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });

    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const t = e.target as HTMLElement | null;
      const target = t?.closest<HTMLElement>("[data-cursor], a, button, input, label");
      let mode = "dot";
      if (target) mode = target.dataset.cursor ?? (target.tagName === "INPUT" ? "dot" : "grow");
      if (el.dataset.mode !== mode) el.dataset.mode = mode;
    };
    const leave = () => gsap.to(el, { opacity: 0, duration: 0.3 });
    const enter = () => gsap.to(el, { opacity: 1, duration: 0.3 });

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    document.addEventListener("pointerenter", enter);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerenter", enter);
    };
  }, []);

  return <div ref={ref} className="cursor" data-mode="dot" aria-hidden="true" />;
}
