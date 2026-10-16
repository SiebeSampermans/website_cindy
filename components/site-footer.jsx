import Link from "next/link";

export function SiteFooter({ content }) {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <img
            src="/images/Logo/Logo transparant.png"
            alt="Logo t Snuffeltje"
            className="footer-logo"
          />
        </div>
        <div>
          <p className="footer-title">{content["footer.name"]}</p>
          {content["footer.address"].map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
        <div>
          <p className="footer-title">Contact</p>
          {content["footer.contact"].map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
        <div>
          <p className="footer-title">Openingsuren</p>
          <p>{content["footer.hours"]}</p>
          <p className="footer-admin-link">
            <Link href="/admin/login">Admin</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
