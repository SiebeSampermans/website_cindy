import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { contentSections } from "@/lib/content-registry";
import { getSession } from "@/lib/session";

export const metadata = {
  title: "Teksten beheren"
};

export default async function AdminTextsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <AdminShell
      current="/admin/teksten"
      session={session}
      title="Teksten en foto's"
      intro="Kies de pagina die je wil aanpassen."
    >
      <section className="admin-tiles">
        {contentSections.map((section) => (
          <Link key={section.id} href={`/admin/teksten/${section.id}`} className="admin-panel admin-tile">
            <h2>{section.label}</h2>
            <p>{section.fields.length} velden</p>
          </Link>
        ))}
      </section>
    </AdminShell>
  );
}
