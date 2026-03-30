import Link from "next/link";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin login"
};

function getFeedback(error) {
  if (error === "blocked") {
    return "Te veel mislukte pogingen. Wacht even en probeer opnieuw.";
  }

  if (error === "invalid") {
    return "Verkeerd wachtwoord of e-mailadres.";
  }

  return "";
}

export default async function AdminLoginPage({ searchParams }) {
  const session = await getSession();

  if (session) {
    redirect("/admin");
  }

  const params = await searchParams;
  const feedback = getFeedback(params?.error);

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
          <p>Log in om de melding op de homepage en de admingebruikers te beheren.</p>
          {feedback ? <div className="status-box error">{feedback}</div> : null}
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
        </section>
      </div>
    </main>
  );
}
