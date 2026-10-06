import Image from "next/image";
import type { MatchImage } from "@/lib/matches";

type Props = {
  image?: MatchImage | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Muestra crédito/licencia debajo (o superpuesto si overlayCredit). */
  credit?: "below" | "overlay" | "none";
  label?: string;
};

/**
 * Foto con tratamiento duotono (#07111F → #75AADB) + grano.
 * Sin imagen: placeholder con el mismo tratamiento y un campo de crédito.
 */
export function Photo({ image, alt, className = "", sizes = "100vw", priority, credit = "below", label }: Props) {
  const creditText = image ? `${image.credit} · ${image.license}` : "";
  return (
    <figure className="m-0 flex h-full flex-col gap-2">
      <div className={`duotone photo-grain relative flex-1 ${className}`}>
        {image ? (
          <Image src={image.src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
        ) : (
          <div className="duotone-placeholder" role="img" aria-label={`${alt} (foto pendiente)`} />
        )}
        {label && (
          <span className="absolute left-3 top-2.5 z-[3] font-mono text-[10px] uppercase tracking-[0.14em] text-night/80">
            {label}
          </span>
        )}
        {credit === "overlay" && (
          <span className="absolute bottom-2 right-3 z-[3] font-mono text-[9px] text-bone/70">{creditText}</span>
        )}
      </div>
      {credit === "below" && creditText && (
        <figcaption className="font-mono text-[10px] leading-relaxed text-bone/55">
          {image?.href ? (
            <a href={image.href} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
              {creditText}
            </a>
          ) : (
            creditText
          )}
        </figcaption>
      )}
    </figure>
  );
}
