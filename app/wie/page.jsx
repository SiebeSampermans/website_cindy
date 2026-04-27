import { PageShell } from "@/components/page-shell";
import { pages } from "@/lib/content";

export const metadata = {
  title: "Wie ben ik"
};

const highlightedWords = [
  "gehoorzaamheid",
  "Dog Dance",
  "Treibball",
  "Rally-O-Fun",
  "Snuitgolf",
  "Canicross",
  "Flyball",
  "DragonForce",
  "gediplomeerde hondentrimmer",
  "workshops",
  "hondenrassen"
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderHighlightedParagraph(paragraph) {
  const pattern = new RegExp(`(${highlightedWords.map(escapeRegExp).join("|")})`, "gi");
  const parts = paragraph.split(pattern);

  return parts.map((part, index) => {
    const isHighlighted = highlightedWords.some(
      (word) => word.toLowerCase() === part.toLowerCase()
    );

    return isHighlighted ? (
      <span key={`${part}-${index}`} className="hover-mark">
        {part}
      </span>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    );
  });
}

export default function WiePage() {
  const page = pages.wie;

  return (
    <PageShell currentPath="/wie" eyebrow="Over Cindy" title={page.title}>
      <div className="stack">
        <section className="section biography-card">
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
        <section className="section biography-card">
          {page.body.map((paragraph) => (
            <p key={paragraph}>{renderHighlightedParagraph(paragraph)}</p>
          ))}
        </section>
      </div>
    </PageShell>
  );
}
