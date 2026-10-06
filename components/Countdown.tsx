"use client";

import { useMatchState } from "@/lib/useMatchState";

/** Cuenta regresiva a las 20:00 con 3 estados: antes / en vivo / final. */
export function Countdown({ variant = "pill" }: { variant?: "pill" | "big" }) {
  const { phase, remaining } = useMatchState();

  if (variant === "pill") {
    return (
      <div
        className="flex items-center gap-2.5 rounded-full border border-celeste/35 px-3.5 py-2 text-[10px] uppercase tracking-[0.14em] md:text-[11px]"
        aria-live="polite"
      >
        {phase === "live" ? (
          <>
            <span className="live-dot h-2 w-2 rounded-full bg-live" />
            <span>en vivo</span>
          </>
        ) : phase === "after" ? (
          <span className="font-serif text-[15px] normal-case italic tracking-normal">Gracias, Leo</span>
        ) : (
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-celeste" />
            <span>
              faltan <b className="font-medium tabular-nums text-celeste">{remaining ?? "--:--:--"}</b>
            </span>
            <span className="hidden text-bone/45 md:inline">· ARG — BEN · 20:00</span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2" aria-live="polite">
      {phase === "live" ? (
        <>
          <span className="text-[11px] uppercase tracking-[0.14em] text-bone/60">Monumental · en vivo</span>
          <span className="flex items-center gap-3 font-serif text-3xl italic md:text-4xl">
            <span className="live-dot h-3 w-3 rounded-full bg-live" /> jugando su último partido
          </span>
        </>
      ) : phase === "after" ? (
        <>
          <span className="text-[11px] uppercase tracking-[0.14em] text-bone/60">Monumental · final</span>
          <span className="font-serif text-4xl italic md:text-5xl">Gracias, Leo</span>
        </>
      ) : (
        <>
          <span className="text-[11px] uppercase tracking-[0.14em] text-bone/60">Último partido · Monumental · 20:00</span>
          <span className="text-3xl font-medium tabular-nums md:text-[34px]">
            <span className="text-bone/60 text-base mr-2 font-normal">faltan</span>
            {remaining ?? "--:--:--"}
          </span>
        </>
      )}
    </div>
  );
}
