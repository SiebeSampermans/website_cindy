import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { getSiteContent } from "@/lib/cms";
import { getHomepageNotice } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let notice = null;

  try {
    notice = await getHomepageNotice();
  } catch {
    notice = null;
  }

  const c = await getSiteContent();
  const services = [1, 2, 3].map((number) => ({
    title: c[`home.service${number}.title`],
    text: c[`home.service${number}.text`]
  }));
  const gallery = [c["home.band.image1"], c["home.band.image2"], c["home.band.image3"]];

  return (
    <PageShell currentPath="/" eyebrow="Welkom" title={c["home.title"]} content={c}>
      <div className="stack">
        {notice ? (
          <section className="notice">
            <p className="eyebrow">Melding</p>
            <h2>{notice.title}</h2>
            <p>{notice.text}</p>
          </section>
        ) : null}

        <section className="section home-intro">
          <div className="home-intro-copy">
            <p className="eyebrow">{c["home.intro.eyebrow"]}</p>
            <h2>{c["home.intro.title"]}</h2>
            <p>{c["home.intro.text"]}</p>
            <div className="home-highlight-list">
              {c["home.highlights"].map((item, index) => (
                <p key={index} className="home-highlight-item">
                  {item}
                </p>
              ))}
            </div>
            <div className="home-actions">
              <Link href="/trimsalon" className="button-link">
                Ontdek het trimsalon
              </Link>
              <Link href="/contact" className="button-inline">
                Maak een afspraak
              </Link>
            </div>
          </div>

          <div className="home-photo-stack" aria-label="Sfeerbeelden trimsalon">
            <figure className="home-photo home-photo-main">
              <img src={c["home.photo.main"]} alt="Hond in het trimsalon" />
            </figure>
            <figure className="home-photo home-photo-top">
              <img src={c["home.photo.top"]} alt="Puppy op de trimtafel" />
            </figure>
            <figure className="home-photo home-photo-bottom">
              <img src={c["home.photo.bottom"]} alt="Cindy van t Snuffeltje" />
            </figure>
          </div>
        </section>

        <section className="home-service-grid">
          {services.map((service, index) => (
            <article key={index} className="section home-service-card">
              <p className="eyebrow">Verzorging</p>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </article>
          ))}
        </section>

        <section className="section home-story">
          <div className="home-story-media">
            <img src={c["home.story.image"]} alt="Verzorging in trimsalon t Snuffeltje" />
          </div>
          <div className="home-story-copy">
            <p className="eyebrow">{c["home.story.eyebrow"]}</p>
            <h2>{c["home.story.title"]}</h2>
            {c["home.story.paragraphs"].map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            <Link href="/wie" className="button-secondary">
              Leer Cindy kennen
            </Link>
          </div>
        </section>

        <section className="home-gallery-band">
          {gallery.map((image, index) => (
            <article key={index} className="card home-gallery-card">
              <img
                src={image}
                alt={`Sfeerbeeld trimsalon ${index + 1}`}
                className={image.includes("puppygewenning") ? "focus-face" : undefined}
              />
            </article>
          ))}
        </section>

        <section className="section home-cta">
          <p className="eyebrow">{c["home.cta.eyebrow"]}</p>
          <h2>{c["home.cta.title"]}</h2>
          <p>{c["home.cta.text"]}</p>
          <div className="home-actions">
            <Link href="/contact" className="button-link">
              Neem contact op
            </Link>
            <Link href="/huisregels" className="button-inline">
              Bekijk huisregels
            </Link>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
