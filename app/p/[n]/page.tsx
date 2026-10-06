import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Experience } from "@/components/Experience";
import { matches, formatDate } from "@/lib/matches";
import { site } from "@/config/site";

type Props = { params: Promise<{ n: string }> };

export function generateStaticParams() {
  return matches.map((m) => ({ n: String(m.n) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { n } = await params;
  const m = matches.find((x) => x.n === Number(n));
  if (!m) return {};
  const title = `#${m.n} · Argentina ${m.result} ${m.opponent} — 207`;
  const description = `Mi partido favorito de Leo: ${m.competition}, ${formatDate(m.date)}. ${m.goals} gol${m.goals === 1 ? "" : "es"}. 207 partidos, un solo gráfico.`;
  return {
    title,
    description,
    alternates: { canonical: `/p/${m.n}` },
    robots: { index: false, follow: true },
    openGraph: { title, description, url: `${site.url}/p/${m.n}`, siteName: "207", locale: "es_AR", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function MatchPage({ params }: Props) {
  const { n } = await params;
  const m = matches.find((x) => x.n === Number(n));
  if (!m) notFound();
  return <Experience initialMatch={m.n} />;
}
