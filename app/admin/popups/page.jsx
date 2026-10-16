import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getPopups } from "@/lib/cms";
import { describePopupPages } from "@/lib/popups";
import { getSession } from "@/lib/session";

export const metadata = {
  title: "Popups beheren"
};

function formatDate(value) {
  return value ? value.split("-").reverse().join("/") : "";
}

function describePeriod(popup) {
  if (popup.startsOn && popup.endsOn) return `${formatDate(popup.startsOn)} t.e.m. ${formatDate(popup.endsOn)}`;
  if (popup.startsOn) return `vanaf ${formatDate(popup.startsOn)}`;
  if (popup.endsOn) return `t.e.m. ${formatDate(popup.endsOn)}`;
  return "Altijd";
}

export default async function AdminPopupsPage({ searchParams }) {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const [popups, params] = await Promise.all([getPopups(), searchParams]);
  const status = params?.status === "deleted" ? { type: "success", text: "De popup is verwijderd." } : null;

  return (
    <AdminShell
      current="/admin/popups"
      session={session}
      title="Popups"
      intro="Een popup verschijnt bovenop de website, bijvoorbeeld om verlof of een actie aan te kondigen."
      status={status}
    >
      <section className="admin-panel">
        <div className="admin-actions">
          <Link href="/admin/popups/nieuw" className="button-link">
            Nieuwe popup
          </Link>
        </div>
        {popups.length ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Titel</th>
                <th>Status</th>
                <th>Periode</th>
                <th>Pagina's</th>
                <th>Acties</th>
              </tr>
            </thead>
            <tbody>
              {popups.map((popup) => (
                <tr key={popup.id}>
                  <td>{popup.title}</td>
                  <td>{popup.active ? <span className="badge success">Aan</span> : <span className="badge">Uit</span>}</td>
                  <td>{describePeriod(popup)}</td>
                  <td>{describePopupPages(popup)}</td>
                  <td>
                    <div className="table-actions">
                      <Link href={`/admin/popups/${popup.id}`} className="button-inline">
                        Bewerken
                      </Link>
                      <form action={`/api/admin/popups/${popup.id}/delete`} method="POST">
                        <button type="submit" className="button-danger">
                          Verwijderen
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Er zijn nog geen popups.</p>
        )}
      </section>
    </AdminShell>
  );
}
