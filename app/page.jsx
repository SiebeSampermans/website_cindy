import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { carouselImages, homepageCards } from "@/lib/content";
import { getHomepageNotice } from "@/lib/db";

export default async function HomePage() {
  let notice = null;

  try {
    notice = await getHomepageNotice();
  } catch {
    notice = null;
  }

  return (
    <PageShell currentPath="/" eyebrow="Welkom" title="Meer dan trimmen: welzijn voor je hond.">
      <div className="stack">
        {notice ? (
          <section className="notice">
            <p className="eyebrow">Melding</p>
            <h2>{notice.title}</h2>
            <p>{notice.text}</p>
          </section>
        ) : null}

        <section className="section">
          <h2>Hondenpraktijk in Boortmeerbeek</h2>
          <p>
            Bij t Snuffeltje kan je terecht voor trimsalon, puppygewenning, workshops,
            fitness, loopbandtraining en massages. Deze eerste React-migratie behoudt alle
            bestaande kernfuncties, zodat we hierna veilig kunnen starten aan de volledige make-over.
          </p>
        </section>

        <section className="card-grid">
          {homepageCards.map((card) => (
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

        <section className="card-grid">
          {carouselImages.map((image) => (
            <div key={image} className="card">
              <img src={image} alt="Sfeerbeeld t Snuffeltje" />
            </div>
          ))}
        </section>
      </div>
    </PageShell>
  );
}
