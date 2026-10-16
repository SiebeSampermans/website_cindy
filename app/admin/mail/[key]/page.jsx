import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getMailTemplate, getMailTemplateDefinition, renderMailTemplate } from "@/lib/mail-templates";
import { getSession } from "@/lib/session";

export const metadata = {
  title: "Mailtemplate bewerken"
};

function getStatus(params, email) {
  if (params?.status === "saved") return { type: "success", text: "De mailtemplate is opgeslagen." };
  if (params?.status === "reset") return { type: "success", text: "De oorspronkelijke tekst is teruggezet." };
  if (params?.status === "test-sent") return { type: "success", text: `Er is een testmail verstuurd naar ${email}.` };
  if (params?.status === "test-error") return { type: "error", text: "De testmail kon niet verstuurd worden. Controleer de mailinstellingen." };
  if (params?.status === "invalid") return { type: "error", text: "Onderwerp en tekst zijn verplicht." };
  return null;
}

export default async function AdminMailTemplatePage({ params, searchParams }) {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const { key } = await params;

  if (!getMailTemplateDefinition(key)) {
    notFound();
  }

  const [template, query] = await Promise.all([getMailTemplate(key), searchParams]);
  const preview = renderMailTemplate(template, template.sample);

  return (
    <AdminShell
      current="/admin/mail"
      session={session}
      title={template.label}
      intro={template.description}
      status={getStatus(query, session.email)}
    >
      <section className="admin-grid">
        <article className="admin-panel">
          <div className="admin-actions">
            <Link href="/admin/mail" className="button-inline">
              Terug naar mailtemplates
            </Link>
          </div>
          <form action={`/api/admin/mail/${key}`} method="POST" className="form-grid">
            {template.canDisable ? (
              <label className="checkbox-field">
                <input type="checkbox" name="enabled" value="1" defaultChecked={template.enabled} />
                Deze mail versturen
              </label>
            ) : null}
            <div className="field">
              <label htmlFor="subject">Onderwerp</label>
              <input id="subject" name="subject" defaultValue={template.subject} required maxLength={255} />
            </div>
            <div className="field">
              <label htmlFor="body">Tekst</label>
              <textarea id="body" name="body" defaultValue={template.body} required rows={12} />
            </div>
            <div className="field-hint">
              <p>Je kan deze velden gebruiken; ze worden automatisch ingevuld:</p>
              <ul className="list">
                {Object.entries(template.variables).map(([name, description]) => (
                  <li key={name}>
                    <code>{`{{${name}}}`}</code> {description}
                  </li>
                ))}
              </ul>
            </div>
            <div className="admin-actions">
              <button type="submit" className="button-link">
                Opslaan
              </button>
              <button type="submit" formAction={`/api/admin/mail/${key}/test`} className="button-inline">
                Opslaan en testmail naar mij sturen
              </button>
            </div>
          </form>
          {template.customized ? (
            <form action={`/api/admin/mail/${key}`} method="POST">
              <input type="hidden" name="reset" value="1" />
              <button type="submit" className="button-danger">
                Oorspronkelijke tekst terugzetten
              </button>
            </form>
          ) : null}
        </article>

        <article className="admin-panel">
          <h2>Voorbeeld</h2>
          <p className="field-hint">Met voorbeeldgegevens. Sla eerst op om je wijzigingen hier te zien.</p>
          <p>
            <strong>Onderwerp:</strong> {preview.subject}
          </p>
          <div className="mail-preview" dangerouslySetInnerHTML={{ __html: preview.html }} />
        </article>
      </section>
    </AdminShell>
  );
}
