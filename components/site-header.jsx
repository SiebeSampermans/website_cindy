import Link from "next/link";
import { navItems, socialLinks } from "@/lib/content";

export function SiteHeader({ currentPath = "/" }) {
  return (
    <header className="site-shell">
      <div className="topbar">
        <Link href="/" className="brand">
          <span className="brand-mark">t</span>
          <span>
            <strong>Snuffeltje</strong>
            <small>Trimsalon en bodywork voor honden</small>
          </span>
        </Link>
        <nav className="socials" aria-label="Social media">
          {socialLinks.map((item) => (
            <a key={item.href} href={item.href} target="_blank" rel="noreferrer">
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <nav className="main-nav" aria-label="Hoofdnavigatie">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? currentPath === "/"
              : currentPath === item.href || currentPath.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={isActive ? "nav-link active" : "nav-link"}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
