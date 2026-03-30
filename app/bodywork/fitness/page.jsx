import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { pages } from "@/lib/content";

export const metadata = {
  title: "Bodywork - Fitness"
};

export default function FitnessPage() {
  const page = pages.fitness;

  return (
    <PageShell currentPath="/bodywork" eyebrow="Bodywork" title={page.title}>
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
            {section.image ? <img src={section.image} alt={section.heading} /> : null}
          </section>
        ))}
        <Link href="/contact" className="button-link">
          Vraag info of plan een afspraak
        </Link>
      </div>
    </PageShell>
  );
}
