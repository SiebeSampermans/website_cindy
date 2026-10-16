import { query } from "@/lib/db";

// Tabellen voor het beheergedeelte. Ze worden automatisch aangemaakt bij het eerste gebruik,
// zodat er geen aparte migratiestap nodig is. tbl_login en tbl_melding bestaan al uit de oude site.
const statements = [
  `CREATE TABLE IF NOT EXISTS tbl_site_content (
    content_key VARCHAR(100) NOT NULL PRIMARY KEY,
    content_value MEDIUMTEXT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT NULL
  ) DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS tbl_popup (
    popup_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    popup_title VARCHAR(200) NOT NULL,
    popup_body TEXT NOT NULL,
    popup_image VARCHAR(500) NULL,
    popup_button_label VARCHAR(100) NULL,
    popup_button_url VARCHAR(500) NULL,
    popup_pages VARCHAR(500) NOT NULL DEFAULT '*',
    popup_frequency VARCHAR(20) NOT NULL DEFAULT 'once',
    popup_starts_on DATE NULL,
    popup_ends_on DATE NULL,
    popup_active TINYINT(1) NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS tbl_mail_template (
    template_key VARCHAR(50) NOT NULL PRIMARY KEY,
    template_subject VARCHAR(255) NOT NULL,
    template_body TEXT NOT NULL,
    template_enabled TINYINT(1) NOT NULL DEFAULT 1,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) DEFAULT CHARSET=utf8mb4`
];

let ready;

export function ensureSchema() {
  if (!ready) {
    ready = (async () => {
      for (const sql of statements) {
        await query(sql);
      }
    })().catch((error) => {
      ready = undefined;
      throw error;
    });
  }

  return ready;
}
