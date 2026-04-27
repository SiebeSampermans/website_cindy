import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { getHomepageNotice } from "@/lib/db";

const homeHighlights = [
  "Op afspraak en in alle rust",
  "Puppygewenning met zachte aanpak",
  "Verzorging op maat van vacht en karakter"
];

const homeServices = [
  {
    title: "Wassen en drogen",
    text: "Een frisse, zachte vacht met producten die mild zijn voor huid en haar."
  },
  {
    title: "Knippen en modelleren",
    text: "Van praktische coupe tot rasgebonden afwerking, altijd in overleg."
  },
  {
    title: "Puppygewenning",
    text: "Een rustige eerste kennismaking met tafel, bad en geluiden van het salon."
  }
];

const homeGallery = [
  "/images/Gallerij/trimsalon_01.jpg",
  "/images/Gallerij/puppygewenning_01.jpg",
  "/images/Gallerij/trimsalon_03.jpg"
];

export default async function HomePage() {
  let notice = null;

  try {
    notice = await getHomepageNotice();
  } catch {
    notice = null;
  }

  return (
    <PageShell currentPath="/" eyebrow="Welkom" title="Rustige, liefdevolle trimverzorging voor je hond.">
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
            <p className="eyebrow">Trimsalon in Boortmeerbeek</p>
            <h2>Een salongevoel dat zacht, warm en persoonlijk aanvoelt.</h2>
            <p>
              Bij t Snuffeltje draait het niet om snel werken, maar om een rustige verzorging
              waarin jouw hond zich veilig mag voelen. Van puppy tot volwassen hond: elke afspraak
              krijgt tijd, aandacht en een aanpak op maat.
            </p>
            <div className="home-highlight-list">
              {homeHighlights.map((item) => (
                <p key={item} className="home-highlight-item">
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
              <img src="/images/Gallerij/trimsalon_02.jpg" alt="Hond in het trimsalon" />
            </figure>
            <figure className="home-photo home-photo-top">
              <img src="/images/puppygewenning/puppy1_optafel.jpg" alt="Puppy op de trimtafel" />
            </figure>
            <figure className="home-photo home-photo-bottom">
              <img src="/images/wie/cindy.jpeg" alt="Cindy van t Snuffeltje" />
            </figure>
          </div>
        </section>

        <section className="home-service-grid">
          {homeServices.map((service) => (
            <article key={service.title} className="section home-service-card">
              <p className="eyebrow">Verzorging</p>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </article>
          ))}
        </section>

        <section className="section home-story">
          <div className="home-story-media">
            <img src="/images/Home/trimsalon.jpg" alt="Verzorging in trimsalon t Snuffeltje" />
          </div>
          <div className="home-story-copy">
            <p className="eyebrow">Waarom t Snuffeltje</p>
            <h2>Geen bandwerk, wel aandacht voor hond en eigenaar.</h2>
            <p>
              Voor een eerste afspraak bekijken we samen welke verzorging het best past bij de vacht,
              het karakter en het gewenste model. Zo ontstaat een resultaat dat mooi oogt, maar ook
              praktisch en comfortabel blijft voor je hond.
            </p>
            <p>
              Ook voor puppygewenning en advies rond thuis onderhoud ben je hier welkom.
            </p>
            <Link href="/wie" className="button-secondary">
              Leer Cindy kennen
            </Link>
          </div>
        </section>

        <section className="home-gallery-band">
          {homeGallery.map((image, index) => (
            <article key={image} className="card home-gallery-card">
              <img
                src={image}
                alt={`Sfeerbeeld trimsalon ${index + 1}`}
                className={image.includes("puppygewenning") ? "focus-face" : undefined}
              />
            </article>
          ))}
        </section>

        <section className="section home-cta">
          <p className="eyebrow">Klaar voor een frisse vacht?</p>
          <h2>Plan een rustig trimmoment voor jouw hond.</h2>
          <p>
            Afspraken verlopen op maat en met tijd voor een zachte aanpak, zodat je hond met een
            goed gevoel buiten stapt.
          </p>
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
