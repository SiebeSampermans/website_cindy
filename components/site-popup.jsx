"use client";

import { useEffect, useState } from "react";

export function PopupCard({ popup, onClose }) {
  const paragraphs = popup.body.split(/\n\s*\n/).filter(Boolean);
  const isExternal = /^https?:\/\//.test(popup.buttonUrl || "");

  return (
    <div className="site-popup-card">
      {onClose ? (
        <button type="button" className="site-popup-close" onClick={onClose} aria-label="Sluiten">
          ×
        </button>
      ) : null}
      {popup.image ? <img src={popup.image} alt="" className="site-popup-image" /> : null}
      <div className="site-popup-body">
        <h2 id="site-popup-title">{popup.title}</h2>
        {paragraphs.map((paragraph, index) => (
          <p key={index}>
            {paragraph.split("\n").map((line, lineIndex) => (
              <span key={lineIndex}>
                {lineIndex > 0 ? <br /> : null}
                {line}
              </span>
            ))}
          </p>
        ))}
        {popup.buttonUrl && popup.buttonLabel ? (
          <a
            href={popup.buttonUrl}
            className="button-link"
            onClick={onClose}
            {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            {popup.buttonLabel}
          </a>
        ) : null}
      </div>
    </div>
  );
}

function storageFor(frequency) {
  try {
    if (frequency === "once") return window.localStorage;
    if (frequency === "session") return window.sessionStorage;
  } catch {
    // Opslag geblokkeerd: dan tonen we de popup gewoon.
  }
  return null;
}

// Toont de eerste popup die deze bezoeker nog niet weggeklikt heeft.
export function SitePopup({ popups }) {
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    const next = popups.find((item) => {
      try {
        return !storageFor(item.frequency)?.getItem(`popup-${item.id}-${item.version}`);
      } catch {
        return true;
      }
    });

    setPopup(next || null);
  }, [popups]);

  useEffect(() => {
    if (!popup) return undefined;

    function onKey(event) {
      if (event.key === "Escape") close();
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function close() {
    if (!popup) return;

    try {
      storageFor(popup.frequency)?.setItem(`popup-${popup.id}-${popup.version}`, "1");
    } catch {
      // Niet erg als dit niet lukt.
    }

    setPopup(null);
  }

  if (!popup) return null;

  return (
    <div
      className="site-popup-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="site-popup-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <PopupCard popup={popup} onClose={close} />
    </div>
  );
}
