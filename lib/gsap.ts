"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  gsap.defaults({ ease: "power4.out", duration: 1.1 });
  // Todo lo que corre por tiempo (reveals, contadores, transiciones) va ~35% más corto sin tocar
  // cada duración. Los scrubs dependen del scroll y no cambian.
  gsap.globalTimeline.timeScale(1.5);
}

/** Sólo anima si el usuario no pidió movimiento reducido. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export { gsap, ScrollTrigger, SplitText, useGSAP };
