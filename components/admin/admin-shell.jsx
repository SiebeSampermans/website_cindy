import Link from "next/link";

const adminNav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/teksten", label: "Teksten" },
  { href: "/admin/afbeeldingen", label: "Afbeeldingen" },
  { href: "/admin/gallerij", label: "Gallerij" },
  { href: "/admin/popups", label: "Popups" },
  { href: "/admin/mail", label: "Mailtemplates" },
  { href: "/admin/users", label: "Gebruikers" }
];

export function AdminShell({ current, session, title, intro, status, children }) {
  return (
    <main className="admin-wrap">
      <div className="admin-shell">
        <section className="admin-panel">
          <div className="admin-topbar">
            <nav className="admin-nav" aria-label="Beheer">
              {adminNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={item.href === current ? "admin-nav-link active" : "admin-nav-link"}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="admin-actions">
              <Link href="/" className="button-inline" target="_blank">
                Bekijk website
              </Link>
              <form action="/api/admin/logout" method="POST">
                <button type="submit" className="button-secondary">
                  Logout
                </button>
              </form>
            </div>
          </div>
          <h1>{title}</h1>
          {intro ? <p>{intro}</p> : null}
          {session ? <p className="field-hint">Ingelogd als {session.firstName} ({session.email})</p> : null}
          {status ? <div className={`status-box ${status.type}`}>{status.text}</div> : null}
        </section>
        {children}
      </div>
    </main>
  );
}
