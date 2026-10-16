import { footerInfo, galleryImages, pages } from "@/lib/content";

// Alle teksten en afbeeldingen die via /admin/teksten aanpasbaar zijn.
// De standaardwaarden zijn de huidige teksten van de site; wat in de databank staat heeft voorrang.
//
// Veldtypes:
//   text        één regel tekst
//   textarea    tekst over meerdere regels
//   paragraphs  lijst van alinea's (in het formulier gescheiden door een lege regel)
//   list        lijst van items (in het formulier één per regel)
//   image       pad naar een afbeelding (/images/... of /media/...)
//   url         link (https://... of /pagina)

function field(key, label, type, defaultValue, hint) {
  return { key, label, type, default: defaultValue, hint };
}

const trimsalon = pages.trimsalon.sections;
const huisregels = pages.huisregels.sections;

export const contentSections = [
  {
    id: "home",
    label: "Homepage",
    path: "/",
    fields: [
      field("home.title", "Titel bovenaan", "text", "Rustige, liefdevolle trimverzorging voor je hond."),
      field("home.intro.eyebrow", "Intro: kleine titel", "text", "Trimsalon in Boortmeerbeek"),
      field("home.intro.title", "Intro: titel", "text", "Een salongevoel dat zacht, warm en persoonlijk aanvoelt."),
      field(
        "home.intro.text",
        "Intro: tekst",
        "textarea",
        "Bij t Snuffeltje draait het niet om snel werken, maar om een rustige verzorging waarin jouw hond zich veilig mag voelen. Van puppy tot volwassen hond: elke afspraak krijgt tijd, aandacht en een aanpak op maat."
      ),
      field("home.highlights", "Intro: troeven", "list", [
        "Op afspraak en in alle rust",
        "Puppygewenning met zachte aanpak",
        "Verzorging op maat van vacht en karakter"
      ]),
      field("home.photo.main", "Intro: grote foto", "image", "/images/Gallerij/trimsalon_02.jpg"),
      field("home.photo.top", "Intro: foto rechtsboven", "image", "/images/puppygewenning/puppy1_optafel.jpg"),
      field("home.photo.bottom", "Intro: foto rechtsonder", "image", "/images/wie/cindy.jpeg"),
      field("home.service1.title", "Dienst 1: titel", "text", "Wassen en drogen"),
      field("home.service1.text", "Dienst 1: tekst", "textarea", "Een frisse, zachte vacht met producten die mild zijn voor huid en haar."),
      field("home.service2.title", "Dienst 2: titel", "text", "Knippen en modelleren"),
      field("home.service2.text", "Dienst 2: tekst", "textarea", "Van praktische coupe tot rasgebonden afwerking, altijd in overleg."),
      field("home.service3.title", "Dienst 3: titel", "text", "Puppygewenning"),
      field("home.service3.text", "Dienst 3: tekst", "textarea", "Een rustige eerste kennismaking met tafel, bad en geluiden van het salon."),
      field("home.story.image", "Verhaal: foto", "image", "/images/Home/trimsalon.jpg"),
      field("home.story.eyebrow", "Verhaal: kleine titel", "text", "Waarom t Snuffeltje"),
      field("home.story.title", "Verhaal: titel", "text", "Geen bandwerk, wel aandacht voor hond en eigenaar."),
      field("home.story.paragraphs", "Verhaal: tekst", "paragraphs", [
        "Voor een eerste afspraak bekijken we samen welke verzorging het best past bij de vacht, het karakter en het gewenste model. Zo ontstaat een resultaat dat mooi oogt, maar ook praktisch en comfortabel blijft voor je hond.",
        "Ook voor puppygewenning en advies rond thuis onderhoud ben je hier welkom."
      ]),
      field("home.band.image1", "Fotostrook: foto 1", "image", "/images/Gallerij/trimsalon_01.jpg"),
      field("home.band.image2", "Fotostrook: foto 2", "image", "/images/Gallerij/puppygewenning_01.jpg"),
      field("home.band.image3", "Fotostrook: foto 3", "image", "/images/Gallerij/trimsalon_03.jpg"),
      field("home.cta.eyebrow", "Afsluiter: kleine titel", "text", "Klaar voor een frisse vacht?"),
      field("home.cta.title", "Afsluiter: titel", "text", "Plan een rustig trimmoment voor jouw hond."),
      field(
        "home.cta.text",
        "Afsluiter: tekst",
        "textarea",
        "Afspraken verlopen op maat en met tijd voor een zachte aanpak, zodat je hond met een goed gevoel buiten stapt."
      )
    ]
  },
  {
    id: "wie",
    label: "Wie ben ik",
    path: "/wie",
    fields: [
      field("wie.title", "Titel", "text", pages.wie.title),
      field("wie.intro", "Intro", "paragraphs", pages.wie.intro),
      field("wie.image1", "Foto links", "image", pages.wie.images[0].src),
      field("wie.image2", "Foto rechts", "image", pages.wie.images[1].src),
      field(
        "wie.body",
        "Verhaal",
        "paragraphs",
        pages.wie.body,
        "Woorden zoals Flyball of Dog Dance worden automatisch gemarkeerd."
      )
    ]
  },
  {
    id: "trimsalon",
    label: "Trimsalon",
    path: "/trimsalon",
    fields: [
      field("trimsalon.title", "Titel", "text", pages.trimsalon.title),
      field("trimsalon.s1.heading", "Blok 1: titel", "text", trimsalon[0].heading),
      field("trimsalon.s1.paragraphs", "Blok 1: tekst", "paragraphs", trimsalon[0].paragraphs),
      field("trimsalon.s2.heading", "Blok 2: titel", "text", trimsalon[1].heading),
      field("trimsalon.s2.paragraphs", "Blok 2: tekst", "paragraphs", trimsalon[1].paragraphs),
      field("trimsalon.s2.list", "Blok 2: opsomming", "list", trimsalon[1].list),
      field("trimsalon.s3.heading", "Blok 3: titel", "text", trimsalon[2].heading),
      field("trimsalon.s3.paragraphs", "Blok 3: tekst", "paragraphs", trimsalon[2].paragraphs),
      field("trimsalon.s3.image1", "Blok 3: foto 1", "image", trimsalon[2].images[0]),
      field("trimsalon.s3.image2", "Blok 3: foto 2", "image", trimsalon[2].images[1]),
      field("trimsalon.s3.image3", "Blok 3: foto 3", "image", trimsalon[2].images[2]),
      field("trimsalon.s4.heading", "Blok 4: titel", "text", trimsalon[3].heading),
      field("trimsalon.s4.paragraphs", "Blok 4: tekst", "paragraphs", trimsalon[3].paragraphs),
      field("trimsalon.product.image", "Producten: foto", "image", "/images/product/Hownd.jpg"),
      field("trimsalon.product.title", "Producten: titel", "text", "Producten van Hownd"),
      field(
        "trimsalon.product.text",
        "Producten: tekst",
        "textarea",
        "Er wordt gewerkt met natuurlijke en dierproefvrije producten van Hownd, mild voor huid en vacht en geschikt voor een zachte, bewuste verzorging."
      ),
      field("trimsalon.booking.label", "Knop: tekst", "text", "Boek een afspraak"),
      field("trimsalon.booking.url", "Knop: link", "url", "https://groomerplanet.com/app/book/?salon=799286532")
    ]
  },
  {
    id: "huisregels",
    label: "Huisregels",
    path: "/huisregels",
    fields: [
      field("huisregels.title", "Titel", "text", pages.huisregels.title),
      field("huisregels.s1.heading", "Blok 1: titel", "text", huisregels[0].heading),
      field("huisregels.s1.list", "Blok 1: regels", "list", huisregels[0].list),
      field("huisregels.s2.heading", "Blok 2: titel", "text", huisregels[1].heading),
      field("huisregels.s2.list", "Blok 2: regels", "list", huisregels[1].list)
    ]
  },
  {
    id: "contact",
    label: "Contact",
    path: "/contact",
    fields: [
      field("contact.title", "Titel", "text", "Neem contact op"),
      field("contact.intro", "Intro", "paragraphs", [
        "Telefonisch bereikbaar van dinsdag tot vrijdag van 9u tot 19u. Als ik je oproep niet meteen kan beantwoorden, spreek gerust een bericht in.",
        "Heb je nog geen online account of wil je extra informatie? Gebruik dan gerust het formulier hieronder."
      ])
    ]
  },
  {
    id: "footer",
    label: "Footer",
    path: "/",
    fields: [
      field("footer.name", "Naam", "text", footerInfo.name),
      field("footer.address", "Adres", "list", footerInfo.address),
      field("footer.contact", "Contactgegevens", "list", footerInfo.contact),
      field("footer.hours", "Openingsuren", "text", footerInfo.hours)
    ]
  }
];

// De galerij wordt apart beheerd via /admin/gallerij maar staat in dezelfde tabel.
export const GALLERY_KEY = "gallery.images";
export const defaultGallery = galleryImages;

export const allFields = contentSections.flatMap((section) => section.fields);

export function getSection(id) {
  return contentSections.find((section) => section.id === id) || null;
}

export function getDefaults() {
  const values = Object.fromEntries(allFields.map((item) => [item.key, item.default]));
  values[GALLERY_KEY] = defaultGallery;
  return values;
}

const MAX_TEXT = 5000;

export function isSafeImage(value) {
  return /^\/(images|media)\/[^\s"'<>]+$/.test(value) || /^https:\/\/[^\s"'<>]+$/.test(value);
}

export function isSafeUrl(value) {
  return /^\/[^\s"'<>]*$/.test(value) || /^https?:\/\/[^\s"'<>]+$/.test(value) || /^mailto:[^\s"'<>]+$/.test(value);
}

// Zet een formulierwaarde om naar wat we opslaan. Geeft undefined bij een ongeldige waarde.
export function parseFieldValue(item, raw) {
  const value = String(raw ?? "").replace(/\r\n/g, "\n").trim();

  switch (item.type) {
    case "paragraphs":
      return value
        .split(/\n\s*\n/)
        .map((part) => part.replace(/\s*\n\s*/g, " ").trim())
        .filter(Boolean)
        .map((part) => part.slice(0, MAX_TEXT));
    case "list":
      return value
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => line.slice(0, MAX_TEXT));
    case "image":
      return isSafeImage(value) ? value : undefined;
    case "url":
      return isSafeUrl(value) ? value : undefined;
    case "text":
      return value.replace(/\s*\n\s*/g, " ").slice(0, MAX_TEXT);
    default:
      return value.slice(0, MAX_TEXT);
  }
}

// Omgekeerd: waarde naar tekst voor in het formulier.
export function formatFieldValue(item, value) {
  if (item.type === "paragraphs") return (value || []).join("\n\n");
  if (item.type === "list") return (value || []).join("\n");
  return value ?? "";
}
