import { Experience } from "@/components/Experience";
import { site } from "@/config/site";
import { TOTAL_GOALS, TOTAL_MATCHES } from "@/lib/matches";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "207",
  alternateName: site.title,
  url: site.url,
  inLanguage: "es-AR",
  description: site.description,
  author: { "@type": "Person", name: site.author, url: site.links.github },
  about: {
    "@type": "Person",
    name: "Lionel Messi",
    alternateName: "Lionel Andrés Messi",
    sameAs: ["https://es.wikipedia.org/wiki/Lionel_Messi", "https://www.wikidata.org/wiki/Q615"],
    memberOf: { "@type": "SportsTeam", name: "Selección Argentina de fútbol" },
    description: `${TOTAL_MATCHES} partidos y ${TOTAL_GOALS} goles con la Selección Argentina.`,
  },
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Experience />
    </>
  );
}
