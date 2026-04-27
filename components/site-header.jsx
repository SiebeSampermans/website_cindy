"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navItems, socialLinks } from "@/lib/content";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5.25" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M13.4 20.5v-7.1h2.4l.36-2.78H13.4V8.88c0-.8.22-1.35 1.37-1.35h1.46V5.05c-.25-.03-1.12-.1-2.13-.1-2.1 0-3.54 1.28-3.54 3.65v2.03H8.22v2.78h2.38v7.1h2.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function GroomingToggleIcon({ isOpen }) {
  return (
    <span className={isOpen ? "grooming-toggle-icon is-open" : "grooming-toggle-icon"} aria-hidden="true">
      <svg className="grooming-icon grooming-icon-comb" viewBox="0 0 96 96">
        <path
          d="M9 53.8c0-6.3 2.4-9.8 8.7-13.8 16.2-10.4 48.2-19.1 63.8-19.1 4.5 0 6.4 1.5 7.8 4.6 1.4 3 2.7 9 2.7 15.5v16.2h-10.4l-7-31.1-5.3 1.2 6.8 29.9h-7.3l-7.2-32.3-5.2 1.1 7.1 31.2h-7.4l-7.1-32.8-5.2 1 7 31.8h-7.1l-7.2-32.4-5.3 1 7.1 31.4h-7.3l-7-30-5.2 1.2 6.7 28.8h-7l-6.3-26.1-5.1 1.5 5.8 24.6H18c-6 0-9-1.5-9-7.3Z"
          fill="currentColor"
        />
      </svg>

      <svg className="grooming-icon grooming-icon-scissors" viewBox="0 0 96 96">
        <circle cx="23" cy="25" r="13" fill="none" stroke="currentColor" strokeWidth="6.5" />
        <circle cx="23" cy="71" r="13" fill="none" stroke="currentColor" strokeWidth="6.5" />
        <path
          d="M31 37 45 47 56 36c9-9 18-14 28-15l3 3c-7 6-15 11-25 17l-11 6-5-5-15-5Z"
          fill="currentColor"
        />
        <path
          d="M31 59 45 49l11 11c9 9 18 14 28 15l3-3c-7-6-15-11-25-17l-11-6-5 5-15 5Z"
          fill="currentColor"
        />
        <path d="M35 39 51 55" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
        <path d="M35 57 51 41" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
        <circle cx="48" cy="48" r="4.8" fill="#fffaf4" />
      </svg>
    </span>
  );
}

const socialIcons = {
  Instagram: InstagramIcon,
  Facebook: FacebookIcon
};

export function SiteHeader({ currentPath = "/" }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [currentPath]);

  return (
    <header className="site-shell header-shell">
      <div className="topbar">
        <Link href="/" className="brand">
          <span className="brand-mark">
            <img src="/images/dog_brown_transparent.png" alt="Logo t Snuffeltje" />
          </span>
          <span>
            <strong>Snuffeltje</strong>
            <small>Trimsalon voor honden</small>
          </span>
        </Link>

        <div className="header-actions">
          <nav className="socials" aria-label="Social media">
            {socialLinks.map((item) => {
              const Icon = socialIcons[item.label];

              return (
                <a key={item.href} href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}>
                  {Icon ? <Icon /> : item.label}
                </a>
              );
            })}
          </nav>

          <button
            type="button"
            className={isMenuOpen ? "menu-toggle is-open" : "menu-toggle"}
            aria-expanded={isMenuOpen}
            aria-controls="main-navigation"
            aria-label={isMenuOpen ? "Sluit menu" : "Open menu"}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            <GroomingToggleIcon isOpen={isMenuOpen} />
          </button>
        </div>
      </div>

      <nav
        id="main-navigation"
        className={isMenuOpen ? "main-nav is-open" : "main-nav"}
        aria-label="Hoofdnavigatie"
      >
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
              onClick={() => setIsMenuOpen(false)}
            >
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
