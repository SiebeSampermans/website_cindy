import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SitePopup } from "@/components/site-popup";
import { getActivePopups, getSiteContent } from "@/lib/cms";
import { popupMatchesPath } from "@/lib/popups";

export async function PageShell({ currentPath, title, eyebrow, content, children }) {
  const [siteContent, popups] = await Promise.all([content || getSiteContent(), getActivePopups()]);

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
      <SiteFooter content={siteContent} />
      <SitePopup popups={popups.filter((popup) => popupMatchesPath(popup, currentPath))} />
    </>
  );
}
