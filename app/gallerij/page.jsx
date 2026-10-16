import { CircularGallery } from "@/components/circular-gallery";
import { PageShell } from "@/components/page-shell";
import { getSiteContent } from "@/lib/cms";
import { GALLERY_KEY } from "@/lib/content-registry";

export const metadata = {
  title: "Gallerij"
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const c = await getSiteContent();
  const images = c[GALLERY_KEY];

  return (
    <PageShell currentPath="/gallerij" eyebrow="Foto's" title="Gallerij" content={c}>
      {images.length ? (
        <CircularGallery images={images} />
      ) : (
        <section className="section">
          <p>Binnenkort verschijnen hier nieuwe foto's.</p>
        </section>
      )}
    </PageShell>
  );
}
