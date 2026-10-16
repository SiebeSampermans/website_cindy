import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { UploadForm } from "@/components/admin/upload-form";
import { listSiteImages, listUploads } from "@/lib/media";
import { getSession } from "@/lib/session";

export const metadata = {
  title: "Afbeeldingen beheren"
};

function getStatus(params) {
  if (params?.error) return { type: "error", text: params.error };
  if (params?.uploaded) return { type: "success", text: `${params.uploaded} afbeelding(en) geüpload.` };
  if (params?.deleted) return { type: "success", text: "De afbeelding is verwijderd." };
  return null;
}

function formatSize(bytes) {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} kB`;
}

export default async function AdminMediaPage({ searchParams }) {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const [uploads, siteImages, params] = await Promise.all([listUploads(), listSiteImages(), searchParams]);

  return (
    <AdminShell
      current="/admin/afbeeldingen"
      session={session}
      title="Afbeeldingen"
      intro="Upload hier foto's. Daarna kan je ze kiezen bij Teksten, Gallerij en Popups."
      status={getStatus(params)}
    >
      <section className="admin-panel">
        <h2>Nieuwe afbeeldingen uploaden</h2>
        <UploadForm
          label="Kies één of meerdere foto's (JPG, PNG, WEBP of GIF). Grote foto's worden automatisch verkleind."
          buttonLabel="Uploaden"
        />
      </section>

      <section className="admin-panel">
        <h2>Jouw uploads ({uploads.length})</h2>
        {uploads.length ? (
          <div className="media-grid">
            {uploads.map((item) => (
              <figure key={item.name} className="media-tile">
                <a href={item.url} target="_blank" rel="noreferrer">
                  <img src={item.url} alt="" loading="lazy" />
                </a>
                <figcaption>
                  <span title={item.name}>{item.name}</span>
                  <span>{formatSize(item.size)}</span>
                </figcaption>
                <form action="/api/admin/media/delete" method="POST">
                  <input type="hidden" name="url" value={item.url} />
                  <button type="submit" className="button-danger">
                    Verwijderen
                  </button>
                </form>
              </figure>
            ))}
          </div>
        ) : (
          <p>Nog geen uploads.</p>
        )}
      </section>

      <section className="admin-panel">
        <h2>Bestaande afbeeldingen van de website ({siteImages.length})</h2>
        <p className="field-hint">Deze horen bij de website zelf en kan je hier niet verwijderen, maar wel overal kiezen.</p>
        <div className="media-grid">
          {siteImages.map((item) => (
            <figure key={item.url} className="media-tile">
              <img src={item.url} alt="" loading="lazy" />
              <figcaption>
                <span title={item.name}>{item.name}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
