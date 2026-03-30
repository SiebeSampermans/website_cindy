import Link from "next/link";
import { footerInfo } from "@/lib/content";

export function SiteFooter() {
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
          <p className="footer-title">{footerInfo.name}</p>
          {footerInfo.address.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <div>
          <p className="footer-title">Contact</p>
          {footerInfo.contact.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <div>
          <p className="footer-title">Openingsuren</p>
          <p>{footerInfo.hours}</p>
          <p className="footer-admin-link">
            <Link href="/admin/login">Admin</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
