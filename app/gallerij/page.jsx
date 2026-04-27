import { CircularGallery } from "@/components/circular-gallery";
import { PageShell } from "@/components/page-shell";
import { galleryImages } from "@/lib/content";

export const metadata = {
  title: "Gallerij"
};

export default function GalleryPage() {
  return (
    <PageShell currentPath="/gallerij" eyebrow="Foto's" title="Gallerij">
      <CircularGallery images={galleryImages} />
    </PageShell>
  );
}
