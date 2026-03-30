import { PageShell } from "@/components/page-shell";

export const metadata = {
  title: "Contact"
};

function getStatusMessage(status) {
  if (status === "success") {
    return { className: "status-box success", text: "Je bericht is goed verzonden." };
  }

  if (status === "error") {
    return { className: "status-box error", text: "Er liep iets mis bij het verzenden van je bericht." };
  }

  return null;
}

export default async function ContactPage({ searchParams }) {
  const params = await searchParams;
  const statusMessage = getStatusMessage(params?.status);

  return (
    <PageShell currentPath="/contact" eyebrow="Contact" title="Neem contact op">
      <div className="stack">
        <section className="section">
          <p>
            Telefonisch bereikbaar van dinsdag tot vrijdag van 9u tot 19u. Als ik je oproep
            niet meteen kan beantwoorden, spreek gerust een bericht in.
          </p>
          <p>
            Heb je nog geen online account of wil je extra informatie? Gebruik dan gerust het
            formulier hieronder.
          </p>
        </section>

        {statusMessage ? <section className={statusMessage.className}>{statusMessage.text}</section> : null}

        <section className="contact-layout">
          <div className="map-card">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d10048.164187285469!2d4.5553424!3d50.9784319!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3e113f31b0b2f%3A0x34daf55d4130e50a!2sKorenweg%2029%2C%203190%20Boortmeerbeek!5e0!3m2!1snl!2sbe!4v1707387219825!5m2!1snl!2sbe"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kaart t Snuffeltje"
            />
          </div>
          <div className="section">
            <form action="/api/contact" method="POST" className="form-grid">
              <div className="field">
                <label htmlFor="naam">Naam</label>
                <input id="naam" name="naam" required />
              </div>
              <div className="field">
                <label htmlFor="emailadres">E-mailadres</label>
                <input id="emailadres" name="emailadres" type="email" required />
              </div>
              <div className="field">
                <label htmlFor="onderwerp">Onderwerp</label>
                <select id="onderwerp" name="onderwerp" defaultValue="" required>
                  <option value="" disabled>
                    Kies een onderwerp
                  </option>
                  <option value="Trimsalon">Trimsalon</option>
                  <option value="Bodywork">Bodywork</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="bericht">Bericht</label>
                <textarea id="bericht" name="bericht" required />
              </div>
              <button type="submit" className="button-link">
                Verzenden
              </button>
            </form>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
