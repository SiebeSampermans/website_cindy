import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ImagePicker } from "@/components/admin/image-picker";
import { getStoredContent } from "@/lib/cms";
import { formatFieldValue, getSection } from "@/lib/content-registry";
import { listImageOptions } from "@/lib/media";
import { getSession } from "@/lib/session";

export const metadata = {
  title: "Teksten beheren"
};

const hints = {
  paragraphs: "Laat een lege regel tussen twee alinea's.",
  list: "Eén item per regel."
};

function getStatus(status) {
  if (status === "saved") return { type: "success", text: "De wijzigingen zijn opgeslagen en staan meteen online." };
  if (status === "reset") return { type: "success", text: "Het veld staat terug op de oorspronkelijke tekst." };
  if (status === "invalid") return { type: "error", text: "Sommige velden waren ongeldig en zijn niet opgeslagen (bv. een link of afbeelding)." };
  return null;
}

export default async function AdminSectionPage({ params, searchParams }) {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const { section: sectionId } = await params;
  const section = getSection(sectionId);

  if (!section) {
    notFound();
  }

  const [stored, imageOptions, query] = await Promise.all([getStoredContent(), listImageOptions(), searchParams]);

  return (
    <AdminShell
      current="/admin/teksten"
      session={session}
      title={section.label}
      intro="Pas de velden aan en klik op Opslaan. Velden met 'aangepast' wijken af van de oorspronkelijke tekst."
      status={getStatus(query?.status)}
    >
      <section className="admin-panel">
        <div className="admin-actions">
          <Link href="/admin/teksten" className="button-inline">
            Terug naar overzicht
          </Link>
          <Link href={section.path} className="button-inline" target="_blank">
            Bekijk pagina
          </Link>
        </div>
        <form action={`/api/admin/content/${section.id}`} method="POST" className="form-grid admin-content-form">
          {section.fields.map((item) => {
            const isCustom = item.key in stored;
            const value = isCustom ? stored[item.key] : item.default;
            const id = item.key.replace(/\./g, "-");
            const hint = item.hint || hints[item.type];

            return (
              <div key={item.key} className="field">
                <label htmlFor={id}>
                  {item.label}
                  {isCustom ? <span className="badge">aangepast</span> : null}
                </label>
                {item.type === "image" ? (
                  <ImagePicker name={item.key} defaultValue={value} options={imageOptions} required />
                ) : item.type === "text" || item.type === "url" ? (
                  <input id={id} name={item.key} defaultValue={formatFieldValue(item, value)} />
                ) : (
                  <textarea
                    id={id}
                    name={item.key}
                    defaultValue={formatFieldValue(item, value)}
                    rows={item.type === "paragraphs" ? 8 : 5}
                  />
                )}
                {hint ? <p className="field-hint">{hint}</p> : null}
                {isCustom ? (
                  <button type="submit" form="reset-form" name="reset" value={item.key} className="button-inline field-reset">
                    Terugzetten naar origineel
                  </button>
                ) : null}
              </div>
            );
          })}
          <button type="submit" className="button-link">
            Opslaan
          </button>
        </form>
        {/* Aparte form zodat Enter in een veld altijd 'Opslaan' doet en niet een reset. */}
        <form id="reset-form" action={`/api/admin/content/${section.id}`} method="POST" hidden />
      </section>
    </AdminShell>
  );
}
