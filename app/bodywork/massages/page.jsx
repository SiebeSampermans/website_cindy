import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { pages } from "@/lib/content";

export const metadata = {
  title: "Bodywork - Massages"
};

export default function MassagesPage() {
  const page = pages.massages;

  return (
    <PageShell currentPath="/bodywork" eyebrow="Bodywork" title={page.title}>
      <div className="stack">
        {page.sections.map((section) => (
          <section className="section" key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.images ? (
              <div className="image-strip">
                {section.images.map((image) => (
                  <div key={image} className="card">
                    <img src={image} alt={section.heading} />
                  </div>
                ))}
              </div>
            ) : null}
            {section.image ? <img src={section.image} alt={section.heading} /> : null}
          </section>
        ))}
        <Link href="/contact" className="button-link">
          Contacteer ons
        </Link>
      </div>
    </PageShell>
  );
}
