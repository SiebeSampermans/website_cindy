import Link from "next/link";
import { redirect } from "next/navigation";
import { getHomepageNotice } from "@/lib/db";
import { getSession } from "@/lib/session";

export const metadata = {
  title: "Admin dashboard"
};

function renderMessage(text) {
  return text?.split("<br>").map((line, index) => (
    <span key={`${line}-${index}`}>
      {line}
      <br />
    </span>
  ));
}

export default async function AdminPage({ searchParams }) {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const notice = await getHomepageNotice();
  const params = await searchParams;
  const updated = params?.updated === "1";

  return (
    <main className="admin-wrap">
      <div className="admin-shell">
        <section className="admin-panel">
          <div className="admin-actions">
            <Link href="/admin/users" className="button-secondary">
              Gebruikers beheren
            </Link>
            <form action="/api/admin/logout" method="POST">
              <button type="submit" className="button-secondary">
                Logout
              </button>
            </form>
          </div>
          <h1>Welkom, {session.firstName}.</h1>
          <p>Hier beheer je de melding op de homepage.</p>
          {updated ? <div className="status-box success">De melding is bijgewerkt.</div> : null}
        </section>

        <section className="admin-grid">
          <article className="admin-panel">
            <h2>Melding aanpassen</h2>
            <form action="/api/admin/message" method="POST" className="form-grid">
              <div className="field">
                <label htmlFor="titel">Titel</label>
                <input id="titel" name="titel" defaultValue={notice?.title || ""} required />
              </div>
              <div className="field">
                <label htmlFor="tekst">Tekst</label>
                <textarea id="tekst" name="tekst" defaultValue={notice?.text || ""} required />
              </div>
              <button type="submit" className="button-link">
                Opslaan
              </button>
            </form>
          </article>

          <article className="admin-panel">
            <h2>Preview</h2>
            <p className="eyebrow">Homepage melding</p>
            <h3>{notice?.title}</h3>
            <p>{renderMessage(notice?.text || "")}</p>
          </article>
        </section>
      </div>
    </main>
  );
}
