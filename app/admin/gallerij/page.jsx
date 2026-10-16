import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getSiteContent } from "@/lib/cms";
import { GALLERY_KEY } from "@/lib/content-registry";
import { listImageOptions } from "@/lib/media";
import { getSession } from "@/lib/session";

export const metadata = {
  title: "Gallerij beheren"
};

function getStatus(params) {
  if (params?.error) return { type: "error", text: params.error };
  if (params?.status === "saved") return { type: "success", text: "De gallerij is bijgewerkt." };
  if (params?.status === "restored") return { type: "success", text: "De oorspronkelijke gallerij is teruggezet." };
  return null;
}

export default async function AdminGalleryPage({ searchParams }) {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const [content, options, params] = await Promise.all([getSiteContent(), listImageOptions(), searchParams]);
  const images = content[GALLERY_KEY];
  const inGallery = new Set(images.map((image) => image.full));
  const available = options.filter((option) => !inGallery.has(option.url));

  return (
    <AdminShell
      current="/admin/gallerij"
      session={session}
      title="Gallerij"
      intro="Bepaal welke foto's op de gallerijpagina staan en in welke volgorde."
      status={getStatus(params)}
    >
      <section className="admin-panel">
        <div className="admin-actions">
          <Link href="/gallerij" className="button-inline" target="_blank">
            Bekijk gallerij
          </Link>
        </div>
        <h2>Foto's in de gallerij ({images.length})</h2>
        <form action="/api/admin/gallery" method="POST" className="form-grid">
          {/* Eerste knop = standaardknop bij Enter. */}
          <button type="submit" name="action" value="save" className="button-link">
            Beschrijvingen opslaan
          </button>
          <div className="gallery-admin-list">
            {images.map((image, index) => (
              <div key={`${image.full}-${index}`} className="gallery-admin-item">
                <img src={image.thumb} alt="" loading="lazy" />
                <div className="field">
                  <label htmlFor={`alt-${index}`}>Beschrijving (voor zoekmachines en schermlezers)</label>
                  <input id={`alt-${index}`} name={`alt-${index}`} defaultValue={image.alt} />
                </div>
                <div className="table-actions">
                  <button type="submit" name="action" value={`up:${index}`} className="button-inline" disabled={index === 0}>
                    Omhoog
                  </button>
                  <button
                    type="submit"
                    name="action"
                    value={`down:${index}`}
                    className="button-inline"
                    disabled={index === images.length - 1}
                  >
                    Omlaag
                  </button>
                  <button type="submit" name="action" value={`remove:${index}`} className="button-danger">
                    Uit gallerij halen
                  </button>
                </div>
              </div>
            ))}
          </div>
        </form>
      </section>

      <section className="admin-grid">
        <article className="admin-panel">
          <h2>Nieuwe foto's uploaden</h2>
          <form action="/api/admin/gallery" method="POST" encType="multipart/form-data" className="form-grid">
            <input type="hidden" name="action" value="upload" />
            <div className="field">
              <label htmlFor="files">Foto's (worden achteraan de gallerij toegevoegd)</label>
              <input id="files" name="files" type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple required />
            </div>
            <button type="submit" className="button-link">
              Uploaden en toevoegen
            </button>
          </form>
        </article>

        <article className="admin-panel">
          <h2>Herstellen</h2>
          <p>Zet de gallerij terug zoals ze oorspronkelijk was. Je uploads blijven bewaard bij Afbeeldingen.</p>
          <form action="/api/admin/gallery" method="POST">
            <input type="hidden" name="action" value="restore" />
            <button type="submit" className="button-danger">
              Oorspronkelijke gallerij terugzetten
            </button>
          </form>
        </article>
      </section>

      <section className="admin-panel">
        <h2>Bestaande afbeelding toevoegen</h2>
        <form action="/api/admin/gallery" method="POST" className="form-grid">
          <input type="hidden" name="action" value="add" />
          <div className="media-grid">
            {available.map((option) => (
              <label key={option.url} className="media-tile media-check">
                <input type="checkbox" name="urls" value={option.url} />
                <img src={option.url} alt="" loading="lazy" />
                <span>{option.group}</span>
              </label>
            ))}
          </div>
          <button type="submit" className="button-link">
            Geselecteerde toevoegen
          </button>
        </form>
      </section>
    </AdminShell>
  );
}
