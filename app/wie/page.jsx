import { PageShell } from "@/components/page-shell";
import { getSiteContent } from "@/lib/cms";

export const metadata = {
  title: "Wie ben ik"
};

export const dynamic = "force-dynamic";

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

export default async function WiePage() {
  const c = await getSiteContent();
  const images = [
    { src: c["wie.image1"], alt: "cindy haar honden" },
    { src: c["wie.image2"], alt: "cindy" }
  ];

  return (
    <PageShell currentPath="/wie" eyebrow="Over Cindy" title={c["wie.title"]} content={c}>
      <div className="stack">
        <section className="section biography-card">
          {c["wie.intro"].map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </section>
        <section className="image-strip">
          {images.map((image, index) => (
            <div key={index} className="card">
              <img src={image.src} alt={image.alt} />
            </div>
          ))}
        </section>
        <section className="section biography-card">
          {c["wie.body"].map((paragraph, index) => (
            <p key={index}>{renderHighlightedParagraph(paragraph)}</p>
          ))}
        </section>
      </div>
    </PageShell>
  );
}
