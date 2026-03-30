import { PageShell } from "@/components/page-shell";
import { pages } from "@/lib/content";

export const metadata = {
  title: "Wie ben ik"
};

export default function WiePage() {
  const page = pages.wie;

  return (
    <PageShell currentPath="/wie" eyebrow="Over Cindy" title={page.title}>
      <div className="stack">
        <section className="section">
          {page.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
        <section className="image-strip">
          {page.images.map((image) => (
            <div key={image.src} className="card">
              <img src={image.src} alt={image.alt} />
            </div>
          ))}
        </section>
        <section className="section">
          {page.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      </div>
    </PageShell>
  );
}
