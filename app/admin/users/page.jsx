import Link from "next/link";
import { redirect } from "next/navigation";
import { getActiveUsers } from "@/lib/db";
import { getSession } from "@/lib/session";

export const metadata = {
  title: "Admin gebruikers"
};

function getStatusMessage(status) {
  if (status === "added") return "De gebruiker is succesvol toegevoegd.";
  if (status === "deactivated") return "De gebruiker is gedeactiveerd.";
  if (status === "mail-sent") return "De resetmail is verzonden.";
  if (status === "mail-error") return "De resetmail kon niet verzonden worden.";
  return "";
}

export default async function AdminUsersPage({ searchParams }) {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const users = await getActiveUsers();
  const params = await searchParams;
  const message = getStatusMessage(params?.status);

  return (
    <main className="admin-wrap">
      <div className="admin-shell">
        <section className="admin-panel">
          <div className="admin-actions">
            <Link href="/admin" className="button-secondary">
              Terug naar dashboard
            </Link>
            <form action="/api/admin/logout" method="POST">
              <button type="submit" className="button-secondary">
                Logout
              </button>
            </form>
          </div>
          <h1>Gebruikersbeheer</h1>
          {message ? <div className="status-box success">{message}</div> : null}
        </section>

        <section className="admin-grid">
          <article className="admin-panel">
            <h2>Bestaande gebruikers</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Voornaam</th>
                  <th>Achternaam</th>
                  <th>E-mail</th>
                  <th>Acties</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>
                      <div className="table-actions">
                        <form action={`/api/admin/users/${user.id}/password-reset`} method="POST">
                          <button type="submit" className="button-inline">
                            Reset mail sturen
                          </button>
                        </form>
                        <form action={`/api/admin/users/${user.id}/deactivate`} method="POST">
                          <button type="submit" className="button-danger">
                            Deactiveren
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>

          <article className="admin-panel">
            <h2>Nieuwe gebruiker toevoegen</h2>
            <form action="/api/admin/users" method="POST" className="form-grid">
              <div className="field">
                <label htmlFor="vnaam">Voornaam</label>
                <input id="vnaam" name="vnaam" required />
              </div>
              <div className="field">
                <label htmlFor="naam">Achternaam</label>
                <input id="naam" name="naam" required />
              </div>
              <div className="field">
                <label htmlFor="email">E-mailadres</label>
                <input id="email" name="email" type="email" required />
              </div>
              <div className="field">
                <label htmlFor="wachtwoord">Wachtwoord</label>
                <input id="wachtwoord" name="wachtwoord" type="password" required />
              </div>
              <button type="submit" className="button-link">
                Toevoegen
              </button>
            </form>
          </article>
        </section>
      </div>
    </main>
  );
}
