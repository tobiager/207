"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useLazyGSAP } from "@/lib/useLazyGSAP";
import { site } from "@/config/site";
import { TOTAL_MATCHES } from "@/lib/matches";
import { GitHubIcon, GlobeIcon, Heart, LinkedInIcon } from "./icons";
import { Magnetic } from "./Magnetic";

const SOCIAL = [
  { href: site.links.github, label: "GitHub", Icon: GitHubIcon },
  { href: site.links.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
  { href: site.links.portfolio, label: "Portfolio", Icon: GlobeIcon },
];

const CMD = 'git log --author="Leo" --oneline | wc -l';

export function Footer() {
  const root = useRef<HTMLElement>(null);

  useLazyGSAP(() => {
        const cmd = root.current!.querySelector<HTMLElement>(".term-cmd")!;
        const out = root.current!.querySelector<HTMLElement>(".term-out")!;
        const o = { i: 0 };
        cmd.textContent = "";
        gsap.set(out, { opacity: 0 });
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top 85%" } })
          .to(o, { i: CMD.length, duration: 1.6, ease: "none", onUpdate: () => (cmd.textContent = CMD.slice(0, Math.round(o.i))) })
          .to(out, { opacity: 1, duration: 0.01 }, "+=0.35")
          .from(".foot-big", { yPercent: 40, opacity: 0, duration: 1.4, ease: "expo.out", stagger: 0.1 }, "-=0.2");
  }, root);

  return (
    <footer ref={root} className="px-gutter relative flex flex-col gap-14 border-t border-bone/10 pb-10 pt-20 md:gap-20 md:pb-12 md:pt-28">
      <div className="flex flex-col gap-2 break-all font-mono text-xs md:text-lg" aria-label={`$ ${CMD} → ${TOTAL_MATCHES}`}>
        <span>
          <span className="text-celeste">$</span> <span className="term-cmd">{CMD}</span>
        </span>
        <span className="term-out text-celeste">
          {TOTAL_MATCHES}
          <span className="caret ml-1.5 inline-block h-[1.1em] w-2.5 translate-y-[3px] bg-bone align-baseline" />
        </span>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-10 md:gap-12">
        <p className="foot-big font-display font-black uppercase leading-[0.88]" style={{ fontSize: "clamp(64px, 8.5vw, 136px)" }}>
          Hecho con <Heart className="inline-block h-[0.62em] w-[0.7em] align-[0.02em]" />
          <br />
          por <span className="font-serif font-normal normal-case italic text-celeste">{site.author}</span>
        </p>
        <div className="foot-big flex flex-col items-start gap-6 md:items-end">
          <nav aria-label="Redes de Tobias" className="flex gap-3.5">
            {SOCIAL.map(({ href, label, Icon }) => (
              <Magnetic key={label} strength={0.45}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-bone/25 text-bone transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:border-celeste hover:bg-celeste hover:text-night hover:shadow-[0_0_40px_rgb(117_170_219/0.6)] md:h-16 md:w-16"
                >
                  <Icon />
                </a>
              </Magnetic>
            ))}
          </nav>
          <a href={site.links.repo} target="_blank" rel="noreferrer" className="border-b border-current pb-1 text-sm text-celeste transition-colors hover:text-bone">
            ★ Dale una estrella al repo
          </a>
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-4 border-t border-bone/[0.08] pt-6 text-[10px] leading-relaxed text-bone/45 md:text-[11px]">
        <span>
          Homenaje no oficial hecho por un hincha. Fotos con licencia libre, créditos en cada imagen y en{" "}
          <a href="/creditos" className="underline underline-offset-2 hover:text-bone">
            /creditos
          </a>
          .
        </span>
        <span>06.10.2026 · Buenos Aires</span>
      </div>
    </footer>
  );
}
