import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function PageShell({ currentPath, title, eyebrow, children }) {
  return (
    <>
      <SiteHeader currentPath={currentPath} />
      <main className="page">
        <section className="page-hero">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1>{title}</h1>
        </section>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
