// Maakt een admingebruiker aan (of zet een nieuw wachtwoord als het e-mailadres al bestaat).
// Gebruik: npm run create-admin -- jouw@email.be Voornaam Achternaam
// Leest de databankgegevens uit .env.local en vraagt het wachtwoord in de terminal.
import { createInterface } from "node:readline/promises";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

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

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

const hash = await bcrypt.hash(password, 10);
const normalized = email.trim().toLowerCase();
const [rows] = await connection.execute("SELECT login_id FROM tbl_login WHERE login_email = ? LIMIT 1", [normalized]);

if (rows.length) {
  await connection.execute("UPDATE tbl_login SET login_pwd = ?, login_active = 1 WHERE login_id = ?", [hash, rows[0].login_id]);
  console.log(`Wachtwoord aangepast en account geactiveerd voor ${normalized}.`);
} else {
  await connection.execute(
    "INSERT INTO tbl_login (login_active, login_email, login_pwd, login_vnaam, login_naam) VALUES (1, ?, ?, ?, ?)",
    [normalized, hash, firstName, lastName]
  );
  console.log(`Admin ${normalized} aangemaakt. Log in op /admin/login.`);
}

await connection.end();
