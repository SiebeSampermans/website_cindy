// Alle tabellen van de site. lib/db.js voert dit één keer per serverproces uit vóór de eerste query,
// dus een lege databank is genoeg: er is geen aparte migratiestap nodig.
export const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS tbl_login (
    login_id SERIAL PRIMARY KEY,
    login_active SMALLINT NOT NULL DEFAULT 1,
    login_email VARCHAR(200) NOT NULL UNIQUE,
    login_pwd VARCHAR(255) NOT NULL,
    login_vnaam VARCHAR(100) NOT NULL,
    login_naam VARCHAR(100) NOT NULL,
    reset_token VARCHAR(64) NULL,
    reset_token_expiry TIMESTAMPTZ NULL
  )`,
  `CREATE TABLE IF NOT EXISTS tbl_melding (
    meldingId INT PRIMARY KEY,
    meldingTitel VARCHAR(255) NOT NULL DEFAULT '',
    meldingText TEXT NOT NULL DEFAULT ''
  )`,
  `CREATE TABLE IF NOT EXISTS tbl_site_content (
    content_key VARCHAR(100) PRIMARY KEY,
    content_value TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by INT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS tbl_popup (
    popup_id SERIAL PRIMARY KEY,
    popup_title VARCHAR(200) NOT NULL,
    popup_body TEXT NOT NULL,
    popup_image VARCHAR(1000) NULL,
    popup_button_label VARCHAR(100) NULL,
    popup_button_url VARCHAR(500) NULL,
    popup_pages VARCHAR(500) NOT NULL DEFAULT '*',
    popup_frequency VARCHAR(20) NOT NULL DEFAULT 'once',
    popup_starts_on DATE NULL,
    popup_ends_on DATE NULL,
    popup_active SMALLINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS tbl_mail_template (
    template_key VARCHAR(50) PRIMARY KEY,
    template_subject VARCHAR(255) NOT NULL,
    template_body TEXT NOT NULL,
    template_enabled SMALLINT NOT NULL DEFAULT 1,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`
];
