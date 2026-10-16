import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getUsers } from "@/lib/db";
import { getSession } from "@/lib/session";

export const metadata = {
  title: "Admin gebruikers"
};

const messages = {
  added: ["success", "De gebruiker is succesvol toegevoegd."],
  updated: ["success", "De gebruiker is bijgewerkt."],
  deactivated: ["success", "De gebruiker is gedeactiveerd en kan niet meer inloggen."],
  activated: ["success", "De gebruiker is opnieuw actief."],
  "mail-sent": ["success", "De resetmail is verzonden."],
  "mail-error": ["error", "De resetmail kon niet verzonden worden."],
  self: ["error", "Je kan jezelf niet deactiveren."],
  invalid: ["error", "Vul voornaam, achternaam en een geldig e-mailadres in."],
  duplicate: ["error", "Er bestaat al een gebruiker met dit e-mailadres."],
  "short-password": ["error", "Het wachtwoord moet minstens 8 tekens lang zijn."]
};

function getStatus(status) {
  const message = messages[status];
  return message ? { type: message[0], text: message[1] } : null;
}

export default async function AdminUsersPage({ searchParams }) {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const [users, params] = await Promise.all([getUsers(), searchParams]);

  return (
    <AdminShell
      current="/admin/users"
      session={session}
      title="Gebruikers"
      intro="Iedereen hier kan inloggen op het beheergedeelte."
      status={getStatus(params?.status)}
    >
      <section className="admin-panel">
        <h2>Bestaande gebruikers</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Naam</th>
              <th>E-mail</th>
              <th>Status</th>
              <th>Acties</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className={user.active ? undefined : "is-inactive"}>
                <td>
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.email}</td>
                <td>{user.active ? <span className="badge success">Actief</span> : <span className="badge">Gedeactiveerd</span>}</td>
                <td>
                  <div className="table-actions">
                    <details className="inline-edit">
                      <summary className="button-inline">Bewerken</summary>
                      <form action={`/api/admin/users/${user.id}`} method="POST" className="form-grid">
                        <div className="field">
                          <label htmlFor={`vnaam-${user.id}`}>Voornaam</label>
                          <input id={`vnaam-${user.id}`} name="vnaam" defaultValue={user.firstName} required />
                        </div>
                        <div className="field">
                          <label htmlFor={`naam-${user.id}`}>Achternaam</label>
                          <input id={`naam-${user.id}`} name="naam" defaultValue={user.lastName} required />
                        </div>
                        <div className="field">
                          <label htmlFor={`email-${user.id}`}>E-mailadres</label>
                          <input id={`email-${user.id}`} name="email" type="email" defaultValue={user.email} required />
                        </div>
                        <button type="submit" className="button-link">
                          Opslaan
                        </button>
                      </form>
                    </details>
                    {user.active ? (
                      <>
                        <form action={`/api/admin/users/${user.id}/password-reset`} method="POST">
                          <button type="submit" className="button-inline">
                            Reset mail sturen
                          </button>
                        </form>
                        {Number(user.id) !== Number(session.id) ? (
                          <form action={`/api/admin/users/${user.id}/deactivate`} method="POST">
                            <button type="submit" className="button-danger">
                              Deactiveren
                            </button>
                          </form>
                        ) : null}
                      </>
                    ) : (
                      <form action={`/api/admin/users/${user.id}/activate`} method="POST">
                        <button type="submit" className="button-inline">
                          Opnieuw activeren
                        </button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="admin-panel">
        <h2>Nieuwe gebruiker toevoegen</h2>
        <form action="/api/admin/users" method="POST" className="form-grid">
          <div className="admin-grid">
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
              <label htmlFor="wachtwoord">Wachtwoord (minstens 8 tekens)</label>
              <input id="wachtwoord" name="wachtwoord" type="password" minLength={8} required />
            </div>
          </div>
          <button type="submit" className="button-link">
            Toevoegen
          </button>
        </form>
      </section>
    </AdminShell>
  );
}
