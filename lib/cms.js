import { query } from "@/lib/db";
import { getDefaults } from "@/lib/content-registry";

// ---------- Teksten en afbeeldingen ----------

export async function getStoredContent() {
  const rows = await query(`SELECT content_key AS "key", content_value AS "value" FROM tbl_site_content`);
  const values = {};

  for (const row of rows) {
    try {
      values[row.key] = JSON.parse(row.value);
    } catch {
      // Ongeldige rij negeren: dan valt de site terug op de standaardwaarde.
    }
  }

  return values;
}

// Voor publieke pagina's: standaardwaarden aangevuld met wat in de databank staat.
// Als de databank niet bereikbaar is, toont de site gewoon de standaardteksten.
export async function getSiteContent() {
  const defaults = getDefaults();

  try {
    return { ...defaults, ...(await getStoredContent()) };
  } catch {
    return defaults;
  }
}

export async function saveContentValues(entries, userId) {

  for (const [key, value] of entries) {
    await query(
      `INSERT INTO tbl_site_content (content_key, content_value, updated_by) VALUES (?, ?, ?)
       ON CONFLICT (content_key) DO UPDATE SET content_value = EXCLUDED.content_value,
         updated_by = EXCLUDED.updated_by, updated_at = NOW()`,
      [key, JSON.stringify(value), userId ?? null]
    );
  }
}

export async function resetContentValues(keys) {

  for (const key of keys) {
    await query("DELETE FROM tbl_site_content WHERE content_key = ?", [key]);
  }
}

// ---------- Popups ----------

const popupColumns = `
  popup_id AS "id",
  popup_title AS "title",
  popup_body AS "body",
  popup_image AS "image",
  popup_button_label AS "buttonLabel",
  popup_button_url AS "buttonUrl",
  popup_pages AS "pages",
  popup_frequency AS "frequency",
  to_char(popup_starts_on, 'YYYY-MM-DD') AS "startsOn",
  to_char(popup_ends_on, 'YYYY-MM-DD') AS "endsOn",
  popup_active AS "active",
  floor(extract(epoch FROM updated_at))::bigint AS "version"
`;

// Datum in België, zodat een popup om middernacht Belgische tijd start en stopt.
const TODAY = "(NOW() AT TIME ZONE 'Europe/Brussels')::date";

function normalizePopup(row) {
  return { ...row, active: Boolean(row.active), version: String(row.version) };
}

export async function getPopups() {
  const rows = await query(`SELECT ${popupColumns} FROM tbl_popup ORDER BY popup_id DESC`);
  return rows.map(normalizePopup);
}

export async function getPopup(id) {
  const rows = await query(`SELECT ${popupColumns} FROM tbl_popup WHERE popup_id = ? LIMIT 1`, [id]);
  return rows[0] ? normalizePopup(rows[0]) : null;
}

export async function getActivePopups() {
  try {
    const rows = await query(
      `SELECT ${popupColumns} FROM tbl_popup
       WHERE popup_active = 1
         AND (popup_starts_on IS NULL OR popup_starts_on <= ${TODAY})
         AND (popup_ends_on IS NULL OR popup_ends_on >= ${TODAY})
       ORDER BY popup_id DESC`
    );
    return rows.map(normalizePopup);
  } catch {
    return [];
  }
}

function popupValues(popup) {
  return [
    popup.title,
    popup.body,
    popup.image || null,
    popup.buttonLabel || null,
    popup.buttonUrl || null,
    popup.pages,
    popup.frequency,
    popup.startsOn || null,
    popup.endsOn || null,
    popup.active ? 1 : 0
  ];
}

export async function createPopup(popup) {
  const rows = await query(
    `INSERT INTO tbl_popup (popup_title, popup_body, popup_image, popup_button_label, popup_button_url,
      popup_pages, popup_frequency, popup_starts_on, popup_ends_on, popup_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     RETURNING popup_id AS id`,
    popupValues(popup)
  );
  return rows[0].id;
}

export async function updatePopup(id, popup) {
  await query(
    `UPDATE tbl_popup SET popup_title = ?, popup_body = ?, popup_image = ?, popup_button_label = ?,
      popup_button_url = ?, popup_pages = ?, popup_frequency = ?, popup_starts_on = ?, popup_ends_on = ?,
      popup_active = ?, updated_at = NOW()
     WHERE popup_id = ?`,
    [...popupValues(popup), id]
  );
}

export async function deletePopup(id) {
  await query("DELETE FROM tbl_popup WHERE popup_id = ?", [id]);
}

// ---------- Mailtemplates ----------

export async function getStoredMailTemplates() {
  const rows = await query(
    `SELECT template_key AS "key", template_subject AS "subject", template_body AS "body", template_enabled AS "enabled" FROM tbl_mail_template`
  );
  return Object.fromEntries(rows.map((row) => [row.key, { ...row, enabled: Boolean(row.enabled) }]));
}

export async function saveMailTemplate({ key, subject, body, enabled }) {
  await query(
    `INSERT INTO tbl_mail_template (template_key, template_subject, template_body, template_enabled)
     VALUES (?, ?, ?, ?)
     ON CONFLICT (template_key) DO UPDATE SET template_subject = EXCLUDED.template_subject,
       template_body = EXCLUDED.template_body, template_enabled = EXCLUDED.template_enabled, updated_at = NOW()`,
    [key, subject, body, enabled ? 1 : 0]
  );
}

export async function deleteMailTemplate(key) {
  await query("DELETE FROM tbl_mail_template WHERE template_key = ?", [key]);
}
