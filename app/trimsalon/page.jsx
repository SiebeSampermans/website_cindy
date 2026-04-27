import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { pages } from "@/lib/content";

export const metadata = {
  title: "Trimsalon"
};

export default function TrimsalonPage() {
  const page = pages.trimsalon;

  return (
    <PageShell currentPath="/trimsalon" eyebrow="Verzorging" title={page.title}>
      <div className="stack">
        {page.sections.map((section) => (
          <section className="section" key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.list ? (
              <ul className="list">
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            {section.images ? (
              <div className="image-strip">
                {section.images.map((image) => (
                  <div key={image} className="card">
                    <img src={image} alt={section.heading} className={image.includes("puppy2") ? "focus-face" : undefined} />
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        ))}

        <section className="section product-feature">
          <div className="product-feature-media">
            <img src="/images/product/Hownd.jpg" alt="Hownd producten" />
          </div>
          <div className="product-feature-body">
            <p className="eyebrow">Producten</p>
            <h2>Producten van Hownd</h2>
            <p>
              Er wordt gewerkt met natuurlijke en dierproefvrije producten van Hownd, mild voor
              huid en vacht en geschikt voor een zachte, bewuste verzorging.
            </p>
            <Link
              href="https://groomerplanet.com/app/book/?salon=799286532"
              className="button-link"
              target="_blank"
            >
              Boek een afspraak
            </Link>
          </div>
        </section>
      </div>
    </PageShell>
  );
}


