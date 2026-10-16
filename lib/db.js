import mysql from "mysql2/promise";

let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }

  return pool;
}

export async function query(sql, values = []) {
  const [rows] = await getPool().execute(sql, values);
  return rows;
}

export async function getHomepageNotice() {
  const rows = await query(
    "SELECT meldingTitel AS title, meldingText AS text FROM tbl_melding WHERE meldingId = ? LIMIT 1",
    [1]
  );

  return rows[0] || null;
}

export async function updateHomepageNotice(title, text) {
  await query(
    "UPDATE tbl_melding SET meldingTitel = ?, meldingText = ? WHERE meldingId = ?",
    [title, text, 1]
  );
}

export async function findActiveUserByEmail(email) {
  const rows = await query(
    "SELECT login_id AS id, login_email AS email, login_pwd AS passwordHash, login_vnaam AS firstName, login_naam AS lastName FROM tbl_login WHERE login_email = ? AND login_active = 1 LIMIT 1",
    [email]
  );

  return rows[0] || null;
}

export async function getUsers() {
  return query(
    "SELECT login_id AS id, login_vnaam AS firstName, login_naam AS lastName, login_email AS email, login_active AS active FROM tbl_login ORDER BY login_active DESC, login_id"
  );
}

export async function findUserIdByEmail(email) {
  const rows = await query("SELECT login_id AS id FROM tbl_login WHERE login_email = ? LIMIT 1", [email]);
  return rows[0]?.id ?? null;
}

export async function createUser({ firstName, lastName, email, passwordHash }) {
  await query(
    "INSERT INTO tbl_login (login_active, login_email, login_pwd, login_vnaam, login_naam) VALUES (1, ?, ?, ?, ?)",
    [email, passwordHash, firstName, lastName]
  );
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
    "SELECT login_id AS id, login_email AS email, login_vnaam AS firstName, login_naam AS lastName FROM tbl_login WHERE login_id = ? LIMIT 1",
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
