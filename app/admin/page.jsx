import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getHomepageNotice } from "@/lib/db";
import { getSession } from "@/lib/session";

export const metadata = {
  title: "Admin dashboard"
};

const tiles = [
  { href: "/admin/teksten", title: "Teksten", text: "Pas de teksten en foto's van elke pagina aan." },
  { href: "/admin/afbeeldingen", title: "Afbeeldingen", text: "Upload nieuwe foto's of ruim oude op." },
  { href: "/admin/gallerij", title: "Gallerij", text: "Kies welke foto's in de gallerij staan en in welke volgorde." },
  { href: "/admin/popups", title: "Popups", text: "Toon een popup op de website, bv. bij verlof of een actie." },
  { href: "/admin/mail", title: "Mailtemplates", text: "Pas de mails aan die de website verstuurt." },
  { href: "/admin/users", title: "Gebruikers", text: "Beheer wie kan inloggen op dit beheergedeelte." }
];

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
  const status = params?.updated === "1" ? { type: "success", text: "De melding is bijgewerkt." } : null;

  return (
    <AdminShell current="/admin" session={session} title={`Welkom, ${session.firstName}.`} status={status}>
      <section className="admin-tiles">
        {tiles.map((tile) => (
          <Link key={tile.href} href={tile.href} className="admin-panel admin-tile">
            <h2>{tile.title}</h2>
            <p>{tile.text}</p>
          </Link>
        ))}
      </section>

      <section className="admin-grid">
        <article className="admin-panel">
          <h2>Melding op de homepage</h2>
          <form action="/api/admin/message" method="POST" className="form-grid">
            <div className="field">
              <label htmlFor="titel">Titel</label>
              <input id="titel" name="titel" defaultValue={notice?.title || ""} />
            </div>
            <div className="field">
              <label htmlFor="tekst">Tekst</label>
              <textarea id="tekst" name="tekst" defaultValue={notice?.text || ""} />
              <p className="field-hint">Maak titel en tekst leeg om de melding te verbergen.</p>
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
    </AdminShell>
  );
}
