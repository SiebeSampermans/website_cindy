export const metadata = {
  title: "Wachtwoord resetten"
};

function getMessage(status) {
  if (status === "success") {
    return { className: "status-box success", text: "Je wachtwoord is succesvol aangepast." };
  }

  if (status === "invalid") {
    return { className: "status-box error", text: "Ongeldige of verlopen resetlink." };
  }

  return null;
}

export default async function ResetPasswordPage({ searchParams }) {
  const params = await searchParams;
  const token = params?.token || "";
  const statusMessage = getMessage(params?.status);

  return (
    <main className="admin-wrap">
      <div className="admin-shell">
        <section className="admin-panel">
          <h1>Wachtwoord resetten</h1>
          {statusMessage ? <div className={statusMessage.className}>{statusMessage.text}</div> : null}
          {!params?.status || params?.status !== "success" ? (
            <form action="/api/admin/reset-password" method="POST" className="form-grid">
              <input type="hidden" name="token" value={token} />
              <div className="field">
                <label htmlFor="nieuw_wachtwoord">Nieuw wachtwoord</label>
                <input id="nieuw_wachtwoord" name="nieuw_wachtwoord" type="password" required />
              </div>
              <button type="submit" className="button-link">
                Wachtwoord instellen
              </button>
            </form>
          ) : null}
        </section>
      </div>
    </main>
  );
}
