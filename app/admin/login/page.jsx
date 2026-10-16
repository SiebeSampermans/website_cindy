import Link from "next/link";
import { redirect } from "next/navigation";
import { countUsers } from "@/lib/db";
import { getSession } from "@/lib/session";

export const metadata = {
  title: "Admin login"
};

const feedback = {
  blocked: "Te veel mislukte pogingen. Wacht even en probeer opnieuw.",
  invalid: "Verkeerd wachtwoord of e-mailadres.",
  "setup-code": "De setupcode klopt niet.",
  "setup-invalid": "Vul alle velden in. Het wachtwoord moet minstens 8 tekens lang zijn.",
  database: "De databank is niet bereikbaar. Controleer DATABASE_URL in de instellingen van de host."
};

async function needsSetup() {
  try {
    return (await countUsers()) === 0;
  } catch {
    return null;
  }
}

export default async function AdminLoginPage({ searchParams }) {
  const session = await getSession();

  if (session) {
    redirect("/admin");
  }

  const params = await searchParams;
  const setup = await needsSetup();
  const message = feedback[setup === null ? "database" : params?.error] || "";

  return (
    <main className="admin-wrap">
      <div className="admin-shell">
        <section className="admin-panel">
          <div className="admin-actions">
            <Link href="/" className="button-secondary">
              Terug naar website
            </Link>
          </div>
          <h1>t Snuffeltje admin</h1>
          {message ? <div className="status-box error">{message}</div> : null}

          {setup ? (
            <>
              <p>
                Er bestaat nog geen admin. Maak hier het eerste account aan. Je hebt de setupcode nodig die in de
                instellingen van de website staat (<code>ADMIN_SETUP_CODE</code>).
              </p>
              {process.env.ADMIN_SETUP_CODE ? (
                <form action="/api/admin/setup" method="POST" className="form-grid">
                  <div className="field">
                    <label htmlFor="code">Setupcode</label>
                    <input id="code" name="code" type="password" required />
                  </div>
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
                  <button type="submit" className="button-link">
                    Account aanmaken
                  </button>
                </form>
              ) : (
                <div className="status-box error">
                  Stel eerst de omgevingsvariabele <code>ADMIN_SETUP_CODE</code> in en deploy opnieuw.
                </div>
              )}
            </>
          ) : setup === false ? (
            <>
              <p>Log in om de teksten, foto&apos;s, popups, mails en gebruikers van de website te beheren.</p>
              <form action="/api/admin/login" method="POST" className="form-grid">
                <div className="field">
                  <label htmlFor="email">E-mailadres</label>
                  <input id="email" name="email" type="email" required />
                </div>
                <div className="field">
                  <label htmlFor="password">Wachtwoord</label>
                  <input id="password" name="password" type="password" required />
                </div>
                <button type="submit" className="button-link">
                  Login
                </button>
              </form>
            </>
          ) : null}
        </section>
      </div>
    </main>
  );
}
