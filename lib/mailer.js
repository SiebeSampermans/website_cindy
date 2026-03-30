import nodemailer from "nodemailer";

let transporter;

function createTransporter() {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE) === "true",
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
          }
        : undefined
    });
  }

  return nodemailer.createTransport({
    sendmail: true,
    newline: "unix"
  });
}

function getTransporter() {
  if (!transporter) {
    transporter = createTransporter();
  }

  return transporter;
}

export async function sendMail({ to, subject, text, html }) {
  const fromName = process.env.CONTACT_FROM_NAME || "t Snuffeltje Website";
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "website@localhost";

  return getTransporter().sendMail({
    from: `${fromName} <${fromEmail}>`,
    to,
    subject,
    text,
    html
  });
}
