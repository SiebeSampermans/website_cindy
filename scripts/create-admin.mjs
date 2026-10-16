// Maakt een admingebruiker aan (of zet een nieuw wachtwoord als het e-mailadres al bestaat).
// Gebruik: npm run create-admin -- jouw@email.be Voornaam Achternaam
// Leest DATABASE_URL uit .env.local en vraagt het wachtwoord in de terminal.
// De tabellen moeten al bestaan: open de website één keer om ze aan te maken.
import { createInterface } from "node:readline/promises";
import bcrypt from "bcryptjs";
import pg from "pg";

const [email, firstName = "Admin", lastName = "-"] = process.argv.slice(2);

if (!email || !email.includes("@")) {
  console.error("Gebruik: npm run create-admin -- jouw@email.be Voornaam Achternaam");
  process.exit(1);
}

const rl = createInterface({ input: process.stdin, output: process.stdout });
const password = await rl.question("Wachtwoord (minstens 8 tekens): ");
rl.close();

if (password.length < 8) {
  console.error("Het wachtwoord moet minstens 8 tekens lang zijn.");
  process.exit(1);
}

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const client = new pg.Client({
  connectionString,
  ssl: /@(localhost|127\.0\.0\.1)[:/]/.test(connectionString || "") === false
});
await client.connect();

const hash = await bcrypt.hash(password, 10);
const normalized = email.trim().toLowerCase();
const { rows } = await client.query("SELECT login_id FROM tbl_login WHERE login_email = $1 LIMIT 1", [normalized]);

if (rows.length) {
  await client.query("UPDATE tbl_login SET login_pwd = $1, login_active = 1 WHERE login_id = $2", [hash, rows[0].login_id]);
  console.log(`Wachtwoord aangepast en account geactiveerd voor ${normalized}.`);
} else {
  await client.query(
    "INSERT INTO tbl_login (login_active, login_email, login_pwd, login_vnaam, login_naam) VALUES (1, $1, $2, $3, $4)",
    [normalized, hash, firstName, lastName]
  );
  console.log(`Admin ${normalized} aangemaakt. Log in op /admin/login.`);
}

await client.end();
