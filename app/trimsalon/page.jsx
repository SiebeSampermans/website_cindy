import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { getSiteContent } from "@/lib/cms";

export const metadata = {
  title: "Trimsalon"
};

export const dynamic = "force-dynamic";

export default async function TrimsalonPage() {
  const c = await getSiteContent();
  const sections = [1, 2, 3, 4].map((number) => ({
    heading: c[`trimsalon.s${number}.heading`],
    paragraphs: c[`trimsalon.s${number}.paragraphs`],
    list: number === 2 ? c["trimsalon.s2.list"] : null,
    images: number === 3 ? [c["trimsalon.s3.image1"], c["trimsalon.s3.image2"], c["trimsalon.s3.image3"]] : null
  }));
  const bookingUrl = c["trimsalon.booking.url"];

  return (
    <PageShell currentPath="/trimsalon" eyebrow="Verzorging" title={c["trimsalon.title"]} content={c}>
      <div className="stack">
        {sections.map((section, sectionIndex) => (
          <section className="section" key={sectionIndex}>
            <h2>{section.heading}</h2>
            {section.paragraphs?.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            {section.list?.length ? (
              <ul className="list">
                {section.list.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : null}
            {section.images ? (
              <div className="image-strip">
                {section.images.map((image, index) => (
                  <div key={index} className="card">
                    <img src={image} alt={section.heading} className={image.includes("puppy2") ? "focus-face" : undefined} />
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        ))}

        <section className="section product-feature">
          <div className="product-feature-media">
            <img src={c["trimsalon.product.image"]} alt={c["trimsalon.product.title"]} />
          </div>
          <div className="product-feature-body">
            <p className="eyebrow">Producten</p>
            <h2>{c["trimsalon.product.title"]}</h2>
            <p>{c["trimsalon.product.text"]}</p>
            {bookingUrl ? (
              <Link href={bookingUrl} className="button-link" target="_blank">
                {c["trimsalon.booking.label"]}
              </Link>
            ) : null}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
