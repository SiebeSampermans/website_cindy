import { PageShell } from "@/components/page-shell";
import { pages } from "@/lib/content";

export const metadata = {
  title: "Huisregels"
};

export default function HuisregelsPage() {
  const page = pages.huisregels;

  return (
    <PageShell currentPath="/huisregels" eyebrow="Praktisch" title={page.title}>
      <div className="stack">
        {page.sections.map((section) => (
          <section key={section.heading} className="section">
            <h2>{section.heading}</h2>
            <ul className="list">
              {section.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
