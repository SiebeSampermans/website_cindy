import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ImagePicker } from "@/components/admin/image-picker";
import { PopupCard } from "@/components/site-popup";
import { getPopup } from "@/lib/cms";
import { listImageOptions } from "@/lib/media";
import { popupFrequencies, popupPageOptions } from "@/lib/popups";
import { getSession } from "@/lib/session";

export const metadata = {
  title: "Popup bewerken"
};

const emptyPopup = {
  title: "",
  body: "",
  image: "",
  buttonLabel: "",
  buttonUrl: "",
  pages: "*",
  frequency: "once",
  startsOn: "",
  endsOn: "",
  active: false
};

function getStatus(params) {
  if (params?.error) return { type: "error", text: params.error };
  if (params?.status === "created") return { type: "success", text: "De popup is aangemaakt." };
  if (params?.status === "saved") return { type: "success", text: "De popup is opgeslagen." };
  return null;
}

export default async function AdminPopupPage({ params, searchParams }) {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const isNew = id === "nieuw";
  const popup = isNew ? emptyPopup : await getPopup(Number(id));

  if (!popup) {
    notFound();
  }

  const [imageOptions, query] = await Promise.all([listImageOptions(), searchParams]);
  const selectedPages = popup.pages === "*" ? [] : popup.pages.split(",");

  return (
    <AdminShell
      current="/admin/popups"
      session={session}
      title={isNew ? "Nieuwe popup" : "Popup bewerken"}
      status={getStatus(query)}
    >
      <section className="admin-grid">
        <article className="admin-panel">
          <div className="admin-actions">
            <Link href="/admin/popups" className="button-inline">
              Terug naar popups
            </Link>
          </div>
          <form action="/api/admin/popups" method="POST" className="form-grid">
            {isNew ? null : <input type="hidden" name="id" value={id} />}
            <label className="checkbox-field">
              <input type="checkbox" name="active" value="1" defaultChecked={popup.active} />
              Popup staat aan
            </label>
            <div className="field">
              <label htmlFor="title">Titel</label>
              <input id="title" name="title" defaultValue={popup.title} required maxLength={200} />
            </div>
            <div className="field">
              <label htmlFor="body">Tekst</label>
              <textarea id="body" name="body" defaultValue={popup.body} required />
            </div>
            <div className="field">
              <label>Afbeelding (optioneel)</label>
              <ImagePicker name="image" defaultValue={popup.image || ""} options={imageOptions} allowEmpty />
            </div>
            <div className="field">
              <label htmlFor="buttonLabel">Knop: tekst (optioneel)</label>
              <input id="buttonLabel" name="buttonLabel" defaultValue={popup.buttonLabel || ""} maxLength={100} />
            </div>
            <div className="field">
              <label htmlFor="buttonUrl">Knop: link (optioneel)</label>
              <input id="buttonUrl" name="buttonUrl" defaultValue={popup.buttonUrl || ""} placeholder="https://... of /contact" />
            </div>
            <div className="admin-grid">
              <div className="field">
                <label htmlFor="startsOn">Tonen vanaf (optioneel)</label>
                <input id="startsOn" name="startsOn" type="date" defaultValue={popup.startsOn || ""} />
              </div>
              <div className="field">
                <label htmlFor="endsOn">Tonen tot en met (optioneel)</label>
                <input id="endsOn" name="endsOn" type="date" defaultValue={popup.endsOn || ""} />
              </div>
            </div>
            <fieldset className="field">
              <legend>Op welke pagina's?</legend>
              <label className="checkbox-field">
                <input type="checkbox" name="allPages" value="1" defaultChecked={popup.pages === "*"} />
                Alle pagina's
              </label>
              {popupPageOptions.map((option) => (
                <label key={option.value} className="checkbox-field">
                  <input type="checkbox" name="pages" value={option.value} defaultChecked={selectedPages.includes(option.value)} />
                  {option.label}
                </label>
              ))}
              <p className="field-hint">Duid 'Alle pagina's' aan of kies specifieke pagina's.</p>
            </fieldset>
            <div className="field">
              <label htmlFor="frequency">Hoe vaak tonen?</label>
              <select id="frequency" name="frequency" defaultValue={popup.frequency}>
                {popupFrequencies.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="button-link">
              {isNew ? "Popup aanmaken" : "Opslaan"}
            </button>
          </form>
        </article>

        <article className="admin-panel">
          <h2>Voorbeeld</h2>
          {isNew ? (
            <p>Sla de popup op om een voorbeeld te zien.</p>
          ) : (
            <div className="popup-preview">
              <PopupCard popup={popup} />
            </div>
          )}
        </article>
      </section>
    </AdminShell>
  );
}
