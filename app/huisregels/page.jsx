import { PageShell } from "@/components/page-shell";
import { getSiteContent } from "@/lib/cms";

export const metadata = {
  title: "Huisregels"
};

export const dynamic = "force-dynamic";

export default async function HuisregelsPage() {
  const c = await getSiteContent();
  const sections = [1, 2].map((number) => ({
    heading: c[`huisregels.s${number}.heading`],
    list: c[`huisregels.s${number}.list`]
  }));

  return (
    <PageShell currentPath="/huisregels" eyebrow="Praktisch" title={c["huisregels.title"]} content={c}>
      <div className="stack">
        {sections.map((section, sectionIndex) => (
          <section key={sectionIndex} className="section">
            <h2>{section.heading}</h2>
            <ul className="list">
              {section.list.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
