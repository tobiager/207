"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, ScrollTrigger, MOTION_OK } from "@/lib/gsap";

/**
 * Como useGSAP, pero cada sección arma sus animaciones en su propia tarea (fuera del
 * commit de hidratación) y en orden de documento, para no bloquear el main thread
 * (Total Blocking Time). Al terminar la cola se hace un único ScrollTrigger.refresh().
 * Sólo corre si el usuario no pidió movimiento reducido.
 */
type Job = () => void;
const queue: Job[] = [];
let running = false;
let refreshTimer: number | undefined;

const nextTask = (cb: () => void) => {
  const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
  if (ric) ric(cb, { timeout: 120 });
  else window.setTimeout(cb, 16);
};

function pump() {
  if (running) return;
  running = true;
  const step = () => {
    const job = queue.shift();
    if (!job) {
      running = false;
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => {
        const t0 = performance.now();
        ScrollTrigger.refresh();
        if (process.env.NEXT_PUBLIC_PERF) console.log("[207] refresh", Math.round(performance.now() - t0));
      }, 60);
      return;
    }
    const t0 = performance.now();
    job();
    if (process.env.NEXT_PUBLIC_PERF) console.log("[207] job", (job as Job & { label?: string }).label, Math.round(performance.now() - t0));
    nextTask(step);
  };
  nextTask(step);
}

export function useLazyGSAP(setup: () => void | (() => void), scope: RefObject<HTMLElement | null>) {
  const setupRef = useRef(setup);
  setupRef.current = setup;

  useEffect(() => {
    let ctx: gsap.Context | null = null;
    let cancelled = false;
    const job = () => {
      if (cancelled || !scope.current) return;
      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        mm.add(MOTION_OK, () => setupRef.current());
      }, scope.current);
    };
    (job as Job & { label?: string }).label = scope.current?.id || scope.current?.className.slice(0, 30);
    queue.push(job);
    pump();
    return () => {
      cancelled = true;
      const i = queue.indexOf(job);
      if (i >= 0) queue.splice(i, 1);
      ctx?.revert();
    };
  }, [scope]);
}
