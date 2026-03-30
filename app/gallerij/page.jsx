import { PageShell } from "@/components/page-shell";
import { galleryImages } from "@/lib/content";

export const metadata = {
  title: "Gallerij"
};

export default function GalleryPage() {
  return (
    <PageShell currentPath="/gallerij" eyebrow="Foto's" title="Gallerij">
      <section className="gallery-grid">
        {galleryImages.map((image) => (
          <a key={image.thumb} href={image.full} target="_blank" rel="noreferrer">
            <img src={image.thumb} alt={image.alt} />
          </a>
        ))}
      </section>
    </PageShell>
  );
}
