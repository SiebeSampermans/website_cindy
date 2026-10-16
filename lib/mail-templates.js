import { getStoredMailTemplates } from "@/lib/cms";
import { sendMail } from "@/lib/mailer";

// Mails die de site verstuurt. Onderwerp en tekst zijn aanpasbaar via /admin/mail;
// {{naam}} en dergelijke worden bij het versturen ingevuld.
export const mailTemplates = [
  {
    key: "contact_notification",
    label: "Contactformulier: melding naar jezelf",
    description: "Wordt naar het salon gestuurd wanneer iemand het contactformulier invult.",
    canDisable: false,
    variables: {
      naam: "Naam van de afzender",
      email: "E-mailadres van de afzender",
      onderwerp: "Gekozen onderwerp",
      bericht: "Het bericht"
    },
    sample: { naam: "Jan Peeters", email: "jan@example.com", onderwerp: "Trimsalon", bericht: "Hallo,\nKan ik volgende week een afspraak maken voor mijn poedel?" },
    subject: "Mail via formulier: {{onderwerp}}",
    body: "Iemand heeft het contactformulier ingevuld.\n\nNaam: {{naam}}\nE-mail: {{email}}\nOnderwerp: {{onderwerp}}\n\nBericht:\n{{bericht}}"
  },
  {
    key: "contact_confirmation",
    label: "Contactformulier: bevestiging naar de klant",
    description:
      "Optioneel automatisch antwoord naar wie het formulier invult. Het bericht zelf zit er bewust niet in, zodat het formulier niet misbruikt kan worden om spam te versturen.",
    canDisable: true,
    defaultEnabled: false,
    variables: {
      naam: "Naam van de afzender",
      onderwerp: "Gekozen onderwerp"
    },
    sample: { naam: "Jan Peeters", onderwerp: "Trimsalon" },
    subject: "Bedankt voor je bericht",
    body: "Dag {{naam}},\n\nBedankt voor je bericht over {{onderwerp}}. Ik neem zo snel mogelijk contact met je op.\n\nTot binnenkort!\nCindy\nt'Snuffeltje"
  },
  {
    key: "password_reset",
    label: "Wachtwoord resetten",
    description: "Wordt verstuurd wanneer je in Gebruikers op 'Reset mail sturen' klikt.",
    canDisable: false,
    variables: {
      voornaam: "Voornaam van de gebruiker",
      link: "Link om een nieuw wachtwoord in te stellen (1 uur geldig)"
    },
    sample: { voornaam: "Cindy", link: "https://www.tsnuffeltje.be/admin/reset-password?token=voorbeeld" },
    subject: "Wachtwoord resetten",
    body: "Dag {{voornaam}},\n\nEr is gevraagd om je wachtwoord voor de website opnieuw in te stellen. Gebruik deze link binnen het uur:\n\n{{link}}\n\nHeb je dit niet zelf gevraagd? Dan mag je deze mail negeren."
  }
];

export function getMailTemplateDefinition(key) {
  return mailTemplates.find((item) => item.key === key) || null;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const PLACEHOLDER = /\{\{\s*([a-z_]+)\s*\}\}/gi;

function fill(template, values, transform = (value) => value) {
  let result = "";
  let last = 0;

  for (const match of template.matchAll(PLACEHOLDER)) {
    result += transform(template.slice(last, match.index), false);
    const name = match[1].toLowerCase();
    result += name in values ? transform(String(values[name] ?? ""), true) : transform(match[0], false);
    last = match.index + match[0].length;
  }

  return result + transform(template.slice(last), false);
}

// Zet een template om naar onderwerp, tekst en HTML. Ingevulde waarden worden altijd ge-escaped.
export function renderMailTemplate({ subject, body }, values) {
  const html = fill(body, values, (part) => escapeHtml(part))
    .replace(/https?:\/\/[^\s<]+/g, (url) => `<a href="${url}">${url}</a>`)
    .replace(/\n/g, "<br>\n");

  return {
    subject: fill(subject, values).replace(/[\r\n]+/g, " ").trim(),
    text: fill(body, values),
    html: `<div style="font-family: Arial, sans-serif; font-size: 15px; line-height: 1.6;">${html}</div>`
  };
}

// Geeft de actuele versie van een template: wat in de databank staat, anders de standaard.
export async function getMailTemplate(key) {
  const definition = getMailTemplateDefinition(key);

  if (!definition) {
    throw new Error(`Onbekende mailtemplate: ${key}`);
  }

  let stored = null;

  try {
    stored = (await getStoredMailTemplates())[key] || null;
  } catch {
    stored = null;
  }

  return {
    ...definition,
    subject: stored?.subject ?? definition.subject,
    body: stored?.body ?? definition.body,
    enabled: definition.canDisable ? stored?.enabled ?? definition.defaultEnabled ?? true : true,
    customized: Boolean(stored)
  };
}

export async function sendTemplateMail(key, { to, replyTo, values }) {
  const template = await getMailTemplate(key);

  if (!template.enabled) {
    return null;
  }

  return sendMail({ to, replyTo, ...renderMailTemplate(template, values) });
}
