import pg from "pg";
import { schemaStatements } from "@/lib/schema";

// Postgres (op Vercel: Neon via Storage). Vercel zet DATABASE_URL automatisch zodra de databank
// aan het project gekoppeld is. Tabellen worden bij het eerste gebruik zelf aangemaakt.
let pool;
let schemaReady;

function getConnectionString() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL;
}

function getPool() {
  if (!pool) {
    const connectionString = getConnectionString();

    if (!connectionString) {
      throw new Error("DATABASE_URL ontbreekt.");
    }

    const isLocal = /@(localhost|127\.0\.0\.1)[:/]/.test(connectionString);
    pool = new pg.Pool({
      connectionString,
      ssl: !isLocal,
      max: 5
    });
  }

  return pool;
}

// Laat queries met ? schrijven; die worden omgezet naar $1, $2, ... voor Postgres.
function toPositional(sql) {
  let index = 0;
  return sql.replace(/\?/g, () => `$${++index}`);
}

function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      for (const statement of schemaStatements) {
        await getPool().query(statement);
      }
    })().catch((error) => {
      schemaReady = undefined;
      throw error;
    });
  }

  return schemaReady;
}

export async function query(sql, values = []) {
  await ensureSchema();
  const result = await getPool().query(toPositional(sql), values);
  return result.rows;
}

export async function getHomepageNotice() {
  const rows = await query(
    "SELECT meldingTitel AS title, meldingText AS text FROM tbl_melding WHERE meldingId = ? LIMIT 1",
    [1]
  );

  return rows[0]?.title ? rows[0] : null;
}

export async function updateHomepageNotice(title, text) {
  await query(
    `INSERT INTO tbl_melding (meldingId, meldingTitel, meldingText) VALUES (?, ?, ?)
     ON CONFLICT (meldingId) DO UPDATE SET meldingTitel = EXCLUDED.meldingTitel, meldingText = EXCLUDED.meldingText`,
    [1, title, text]
  );
}

export async function findActiveUserByEmail(email) {
  const rows = await query(
    `SELECT login_id AS "id", login_email AS "email", login_pwd AS "passwordHash", login_vnaam AS "firstName", login_naam AS "lastName"
     FROM tbl_login WHERE login_email = ? AND login_active = 1 LIMIT 1`,
    [email]
  );

  return rows[0] || null;
}

export async function getUsers() {
  return query(
    `SELECT login_id AS "id", login_vnaam AS "firstName", login_naam AS "lastName", login_email AS "email", login_active AS "active"
     FROM tbl_login ORDER BY login_active DESC, login_id`
  );
}

export async function countUsers() {
  const rows = await query("SELECT COUNT(*)::int AS total FROM tbl_login");
  return rows[0].total;
}

export async function findUserIdByEmail(email) {
  const rows = await query("SELECT login_id AS id FROM tbl_login WHERE login_email = ? LIMIT 1", [email]);
  return rows[0]?.id ?? null;
}

export async function createUser({ firstName, lastName, email, passwordHash }) {
  const rows = await query(
    `INSERT INTO tbl_login (login_active, login_email, login_pwd, login_vnaam, login_naam) VALUES (1, ?, ?, ?, ?)
     RETURNING login_id AS id`,
    [email, passwordHash, firstName, lastName]
  );
  return rows[0].id;
}

export async function setUserActive(id, active) {
  await query("UPDATE tbl_login SET login_active = ? WHERE login_id = ?", [active ? 1 : 0, id]);
}

export async function updateUser(id, { firstName, lastName, email }) {
  await query(
    "UPDATE tbl_login SET login_vnaam = ?, login_naam = ?, login_email = ? WHERE login_id = ?",
    [firstName, lastName, email, id]
  );
}

export async function getUserById(id) {
  const rows = await query(
    `SELECT login_id AS "id", login_email AS "email", login_vnaam AS "firstName", login_naam AS "lastName"
     FROM tbl_login WHERE login_id = ? LIMIT 1`,
    [id]
  );

  return rows[0] || null;
}

export async function storePasswordResetToken({ id, token, expiresAt }) {
  await query(
    "UPDATE tbl_login SET reset_token = ?, reset_token_expiry = ? WHERE login_id = ?",
    [token, expiresAt, id]
  );
}

export async function getUserIdByResetToken(token) {
  const rows = await query(
    "SELECT login_id AS id FROM tbl_login WHERE reset_token = ? AND reset_token_expiry > NOW() LIMIT 1",
    [token]
  );

  return rows[0]?.id || null;
}

export async function updateUserPassword(id, passwordHash) {
  await query(
    "UPDATE tbl_login SET login_pwd = ?, reset_token = NULL, reset_token_expiry = NULL WHERE login_id = ?",
    [passwordHash, id]
  );
}
