import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { pages } from "@/lib/content";

export const metadata = {
  title: "Bodywork"
};

export default function BodyworkPage() {
  const page = pages.bodywork;

  return (
    <PageShell currentPath="/bodywork" eyebrow="Beweging en ontspanning" title={page.title}>
      <div className="stack">
        <section className="section">
          <p>{page.intro}</p>
        </section>
        <section className="card-grid">
          {page.cards.map((card) => (
            <article key={card.href} className="card">
              <img src={card.image} alt={card.title} />
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              <Link href={card.href} className="button-link">
                Bekijk {card.title.toLowerCase()}
              </Link>
            </article>
          ))}
        </section>
      </div>
    </PageShell>
  );
}
