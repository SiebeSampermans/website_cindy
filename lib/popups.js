import { formString } from "@/lib/admin-route";
import { isSafeImage, isSafeUrl } from "@/lib/content-registry";
import { navItems } from "@/lib/content";

export const popupFrequencies = [
  { value: "once", label: "Eén keer per bezoeker (tot je de popup wijzigt)" },
  { value: "session", label: "Eén keer per bezoek" },
  { value: "always", label: "Op elke pagina die de bezoeker opent" }
];

export const popupPageOptions = navItems.map((item) => ({ value: item.href, label: item.label }));

const DATE = /^\d{4}-\d{2}-\d{2}$/;

// Leest het popupformulier. Geeft { popup } of { error }.
export function parsePopupForm(formData) {
  const pages = formData.getAll("pages").map(String);
  const allPages = formData.get("allPages") === "1";
  const validPages = pages.filter((page) => popupPageOptions.some((option) => option.value === page));
  const frequency = formString(formData, "frequency", 20);

  const popup = {
    title: formString(formData, "title", 200),
    body: formString(formData, "body", 5000),
    image: formString(formData, "image", 500),
    buttonLabel: formString(formData, "buttonLabel", 100),
    buttonUrl: formString(formData, "buttonUrl", 500),
    pages: allPages || !validPages.length ? "*" : validPages.join(","),
    frequency: popupFrequencies.some((option) => option.value === frequency) ? frequency : "once",
    startsOn: formString(formData, "startsOn", 10),
    endsOn: formString(formData, "endsOn", 10),
    active: formData.get("active") === "1"
  };

  if (!popup.title || !popup.body) return { popup, error: "Titel en tekst zijn verplicht." };
  if (popup.image && !isSafeImage(popup.image)) return { popup, error: "Ongeldige afbeelding." };
  if (popup.buttonUrl && !isSafeUrl(popup.buttonUrl)) return { popup, error: "De link van de knop moet beginnen met https:// of /." };
  if (popup.buttonUrl && !popup.buttonLabel) return { popup, error: "Geef de knop ook een tekst." };
  if ((popup.startsOn && !DATE.test(popup.startsOn)) || (popup.endsOn && !DATE.test(popup.endsOn))) {
    return { popup, error: "Ongeldige datum." };
  }
  if (popup.startsOn && popup.endsOn && popup.startsOn > popup.endsOn) {
    return { popup, error: "De einddatum ligt voor de startdatum." };
  }

  return { popup };
}

export function popupMatchesPath(popup, pathname) {
  if (popup.pages === "*") return true;
  return popup.pages.split(",").includes(pathname);
}

export function describePopupPages(popup) {
  if (popup.pages === "*") return "Alle pagina's";
  return popup.pages
    .split(",")
    .map((page) => popupPageOptions.find((option) => option.value === page)?.label || page)
    .join(", ");
}
