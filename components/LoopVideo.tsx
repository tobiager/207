"use client";

import { useEffect, useRef, useState } from "react";
import { isLite } from "@/lib/lite";

/** Al activar el sonido de un video, los demás se mutean. */
const SOUND_EVENT = "208:sound";

type Props = { src: string; poster: string; label: string; className?: string };

/**
 * Video mudo y en loop que solo reproduce mientras está en pantalla (y con la pestaña visible).
 * Tocar el video activa el sonido, de a uno por vez. Con prefers-reduced-motion o en modo
 * liviano no hay autoplay: queda el póster con un botón de play.
 */
export function LoopVideo({ src, poster, label, className = "" }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [manual, setManual] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const auto = !isLite() && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setManual(!auto);
    let inView = false;
    const mute = () => {
      v.muted = true;
      setMuted(true);
    };
    const sync = () => {
      if (inView && !document.hidden) {
        if (auto) v.play().catch(() => {});
      } else {
        v.pause();
        if (!inView) mute();
      }
    };
    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        sync();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    const onSound = (e: Event) => {
      if ((e as CustomEvent).detail === v) return;
      mute();
      if (!auto) v.pause();
    };
    window.addEventListener(SOUND_EVENT, onSound);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      window.removeEventListener(SOUND_EVENT, onSound);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  // Tocar el video activa/silencia el sonido (y lo reinicia). Sin autoplay, el toque reproduce/pausa.
  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (manual && !v.paused) return v.pause();
    v.muted = manual ? false : !v.muted;
    setMuted(v.muted);
    if (!v.muted) {
      window.dispatchEvent(new CustomEvent(SOUND_EVENT, { detail: v }));
      if (!manual) v.currentTime = 0;
    }
    v.play().catch(() => {});
  };

  const on = manual ? playing : !muted;
  const text = manual ? (playing ? "Pausar" : "Reproducir") : muted ? "Activar sonido" : "Sonando";

  return (
    <button type="button" onClick={toggle} aria-label={`${text}: ${label}`} className={`group relative block overflow-hidden rounded bg-night-2 ${className}`}>
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night/80 to-transparent" />
      <span className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-bone/25 bg-night/70 px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-bone transition-colors duration-300 group-hover:border-celeste md:text-[11px]">
        <span className={`h-1.5 w-1.5 rounded-full ${on ? "live-dot bg-celeste" : "bg-bone/50"}`} />
        {text}
      </span>
    </button>
  );
}
