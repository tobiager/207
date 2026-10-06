"use client";

import { useEffect, useRef, useState } from "react";

type Item = { url: string; scene: string; name: string };
type Status = { kind: "idle" | "subiendo" | "analizando" | "aprobada" | "rechazada"; msg?: string };

const MAX_SIDE = 1280;

/** Redimensiona a máx 1280px y re-codifica: descarta el EXIF (GPS incluido) y baja el peso. */
async function compress(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * k);
  canvas.height = Math.round(bmp.height * k);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  bmp.close();
  const encode = (type: string) => new Promise<Blob | null>((res) => canvas.toBlob(res, type, 0.8));
  let out = await encode("image/webp");
  // Safari no codifica WebP desde canvas (devuelve PNG): cae a JPEG
  if (out?.type !== "image/webp") out = await encode("image/jpeg");
  if (!out) throw new Error("encode");
  return out;
}

function Card({ it }: { it: Item }) {
  const [color, setColor] = useState(false);
  return (
    <figure
      className="relative m-0 mb-3 break-inside-avoid overflow-hidden rounded md:mb-7"
      data-cursor="grow"
      onPointerEnter={(e) => e.pointerType === "mouse" && setColor(true)}
      onPointerLeave={() => setColor(false)}
      onClick={() => setColor((v) => !v)}
    >
      <div className={`duotone photo-grain ${color ? "is-color" : ""}`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ya viene redimensionada a 1280px WebP desde el cliente */}
        <img src={it.url} alt={it.name ? `Foto de ${it.name}` : "Foto de la hinchada"} loading="lazy" className="block min-h-24 w-full" />
      </div>
      <figcaption className="absolute inset-x-2 bottom-2 z-[3] flex flex-wrap items-center gap-1.5 font-mono text-[10px] md:text-[11px]">
        <span className="rounded-full bg-night/80 px-2.5 py-1 text-bone backdrop-blur-sm">{it.scene === "estadio" ? "🏟️ En la cancha" : "📺 Mirando"}</span>
        {it.name && <span className="max-w-full truncate rounded-full bg-night/80 px-2.5 py-1 text-bone/75 backdrop-blur-sm">{it.name}</span>}
      </figcaption>
    </figure>
  );
}

export function Hinchada() {
  const [items, setItems] = useState<Item[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const load = () => {
      if (document.hidden) return;
      fetch("/api/hinchada")
        .then((r) => r.json())
        .then((d: { enabled: boolean; items: Item[] }) => {
          setEnabled(d.enabled);
          // Conserva las recién aprobadas que el listado cacheado todavía no trae
          setItems((prev) => [...prev.filter((p) => !d.items.some((i) => i.url === p.url)).slice(0, 3), ...d.items]);
        })
        .catch(() => {});
    };
    load();
    const id = window.setInterval(load, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const busy = status.kind === "subiendo" || status.kind === "analizando";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const file = data.get("photo");
    if (!(file instanceof File) || !file.size) return;
    setStatus({ kind: "subiendo" });
    try {
      data.set("photo", await compress(file), "foto");
    } catch {
      return setStatus({ kind: "rechazada", msg: "No pudimos leer esa imagen. Probá con un JPG o PNG." });
    }
    // XHR en vez de fetch: avisa cuando terminó de subir, así "analizando" es real
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/hinchada");
    xhr.responseType = "json";
    xhr.upload.onload = () => setStatus({ kind: "analizando" });
    xhr.onerror = () => setStatus({ kind: "rechazada", msg: "Se cortó la conexión. Probá de nuevo." });
    xhr.onload = () => {
      const r = xhr.response as { approved?: boolean; reason?: string; item?: Item } | null;
      if (r?.approved && r.item) {
        setItems((prev) => [r.item!, ...prev]);
        setStatus({ kind: "aprobada" });
        form.current?.reset();
        setOpen(false);
      } else setStatus({ kind: "rechazada", msg: r?.reason ?? "No pudimos revisar tu foto, probá de nuevo" });
    };
    xhr.send(data);
  }

  const field = "w-full rounded border border-bone/20 bg-transparent px-3.5 py-3 font-mono text-[13px] text-bone placeholder:text-bone/35 focus:border-celeste focus:outline-none";

  return (
    <section id="hinchada" className="px-gutter border-t border-bone/[0.06] py-24 md:py-40" aria-labelledby="hinchada-title">
      <div className="mx-auto max-w-[1344px]">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-20">
          <div className="flex flex-col gap-5">
            <span className="eyebrow">// 08 — La hinchada</span>
            <h2 id="hinchada-title" className="h-display text-[58px] md:text-[96px]">
              La despedida,
              <br />
              desde adentro
            </h2>
          </div>
          <div className="flex w-full max-w-[360px] flex-col items-start gap-5">
            <p className="text-xs leading-relaxed text-bone/55">En la cancha o frente a la tele: subí tu foto de hoy y sumate al muro. Cada foto se revisa antes de publicarse.</p>
            {enabled && !open && (
              <button
                type="button"
                onClick={() => {
                  setOpen(true);
                  setStatus({ kind: "idle" });
                }}
                className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-celeste px-7 font-mono text-[13px] font-bold text-night transition-colors duration-300 hover:bg-bone md:w-auto"
              >
                Subí tu foto →
              </button>
            )}
            {status.kind === "aprobada" && (
              <p className="text-[13px] text-celeste" role="status">
                ¡Ya está en el muro!
              </p>
            )}
          </div>
        </div>

        {enabled && open && (
          <form ref={form} onSubmit={submit} className="mb-12 flex max-w-[520px] flex-col gap-4 rounded border border-bone/[0.12] bg-night-2/60 p-5 md:mb-20 md:p-7">
            <label className="flex flex-col gap-2 text-[11px] uppercase tracking-[0.14em] text-bone/55">
              Tu foto
              <input name="photo" type="file" required disabled={busy} accept="image/jpeg,image/png,image/webp,image/heic,image/heif" className={`${field} normal-case tracking-normal file:mr-3 file:rounded-full file:border-0 file:bg-bone/10 file:px-3 file:py-1.5 file:font-mono file:text-[11px] file:text-bone`} />
            </label>
            <label className="flex flex-col gap-2 text-[11px] uppercase tracking-[0.14em] text-bone/55">
              Nombre o @usuario (opcional)
              <input name="name" type="text" maxLength={30} disabled={busy} autoComplete="nickname" placeholder="@tu_usuario" className={`${field} normal-case tracking-normal`} />
            </label>
            <label className="flex items-start gap-3 text-xs leading-relaxed text-bone/75">
              <input name="consent" type="checkbox" required disabled={busy} className="mt-0.5 h-4 w-4 shrink-0 accent-celeste" />
              Soy quien aparece en la foto o tengo permiso para publicarla
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <button type="submit" disabled={busy} className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-celeste px-6 font-mono text-[13px] font-bold text-night transition-colors duration-300 hover:bg-bone disabled:opacity-60">
                {status.kind === "subiendo" ? "Subiendo…" : status.kind === "analizando" ? "Analizando…" : "Enviar"}
              </button>
              <button type="button" disabled={busy} onClick={() => setOpen(false)} className="inline-flex min-h-12 items-center justify-center rounded-full border border-bone/25 px-6 font-mono text-[13px] text-bone transition-colors duration-300 hover:border-celeste hover:text-celeste disabled:opacity-60">
                Cancelar
              </button>
            </div>
            <p className="min-h-[1.25rem] text-xs leading-relaxed text-bone/75" role="status" aria-live="polite">
              {status.kind === "subiendo" && "Subiendo tu foto…"}
              {status.kind === "analizando" && "Analizando la foto, son unos segundos…"}
              {status.kind === "rechazada" && <span className="text-live">{status.msg}</span>}
            </p>
          </form>
        )}

        {items.length ? (
          <div className="columns-2 gap-3 md:gap-7 lg:columns-3">
            {items.map((it) => (
              <Card key={it.url} it={it} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 rounded border border-dashed border-celeste/40 bg-celeste/[0.04] px-6 py-20 text-center md:py-28">
            <div className="heartbeat h-14 w-14 rounded-xl border-2 border-dashed border-celeste/80 bg-celeste/[0.06]" aria-hidden="true" />
            <p className="font-serif text-2xl italic text-bone/75 md:text-[32px]">Sé el primero en sumarte a la despedida</p>
          </div>
        )}
      </div>
    </section>
  );
}
