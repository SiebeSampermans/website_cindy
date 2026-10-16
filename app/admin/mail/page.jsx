import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getMailTemplate, mailTemplates } from "@/lib/mail-templates";
import { getSession } from "@/lib/session";

export const metadata = {
  title: "Mailtemplates"
};

export default async function AdminMailPage() {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const templates = await Promise.all(mailTemplates.map((item) => getMailTemplate(item.key)));

  return (
    <AdminShell
      current="/admin/mail"
      session={session}
      title="Mailtemplates"
      intro="Dit zijn de mails die de website automatisch verstuurt. Klik op een mail om onderwerp en tekst aan te passen."
    >
      <section className="admin-tiles">
        {templates.map((template) => (
          <Link key={template.key} href={`/admin/mail/${template.key}`} className="admin-panel admin-tile">
            <h2>{template.label}</h2>
            <p>{template.description}</p>
            <p>
              {template.enabled ? <span className="badge success">Aan</span> : <span className="badge">Uit</span>}
              {template.customized ? <span className="badge">aangepast</span> : null}
            </p>
          </Link>
        ))}
      </section>
    </AdminShell>
  );
}
