"use client";

import { useEffect, useRef, useState } from "react";
import { isLite } from "@/lib/lite";
import { PlayIcon, SoundIcon } from "./icons";

/** Al activar el sonido de un video, los demás se mutean. */
const SOUND_EVENT = "208:sound";

type Props = { src: string; poster: string; label: string; className?: string };

/**
 * Video mudo y en loop que solo reproduce mientras está en pantalla (y con la pestaña visible).
 * El botón del parlante activa el sonido de a uno por vez. Con prefers-reduced-motion o en modo
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
    const onSound = (e: Event) => (e as CustomEvent).detail !== v && mute();
    window.addEventListener(SOUND_EVENT, onSound);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      window.removeEventListener(SOUND_EVENT, onSound);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const toggleSound = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) {
      window.dispatchEvent(new CustomEvent(SOUND_EVENT, { detail: v }));
      v.play().catch(() => {});
    }
  };

  const round =
    "absolute flex items-center justify-center rounded-full border border-bone/25 bg-night/70 text-bone transition-colors duration-300 hover:border-celeste hover:text-celeste";

  return (
    <div className={`relative overflow-hidden rounded bg-night-2 ${className}`}>
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night/80 to-transparent" />
      {manual && (
        <button
          type="button"
          onClick={() => (playing ? ref.current?.pause() : ref.current?.play().catch(() => {}))}
          className="absolute inset-0 flex items-center justify-center"
          aria-label={playing ? `Pausar: ${label}` : `Reproducir: ${label}`}
        >
          {!playing && (
            <span className={`${round} relative h-14 w-14`}>
              <PlayIcon />
            </span>
          )}
        </button>
      )}
      <button
        type="button"
        onClick={toggleSound}
        aria-pressed={!muted}
        aria-label={muted ? `Activar sonido: ${label}` : `Silenciar: ${label}`}
        className={`${round} bottom-3 left-3 h-11 w-11 ${muted ? "" : "border-celeste text-celeste"}`}
      >
        <SoundIcon on={!muted} />
      </button>
    </div>
  );
}
