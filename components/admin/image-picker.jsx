"use client";

import { useState } from "react";

// Kies een afbeelding uit de bibliotheek of upload er meteen een nieuwe.
export function ImagePicker({ name, defaultValue = "", options = [], required = false, allowEmpty = false }) {
  const [value, setValue] = useState(defaultValue);
  const [choices, setChoices] = useState(options);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setBusy(true);
    setError("");

    try {
      const body = new FormData();
      files.forEach((file) => body.append("files", file));
      const response = await fetch("/api/admin/media", {
        method: "POST",
        body,
        headers: { Accept: "application/json" }
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Upload mislukt.");

      const added = result.urls.map((url) => ({ url, label: url.replace("/media/", ""), group: "Uploads" }));
      setChoices((current) => [...added, ...current]);
      setValue(result.urls[0]);
      setOpen(false);
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }

  return (
    <div className="image-picker">
      <input type="hidden" name={name} value={value} required={required} />
      <div className="image-picker-current">
        {value ? <img src={value} alt="" /> : <span className="image-picker-empty">Geen afbeelding</span>}
        <div className="image-picker-buttons">
          <button type="button" className="button-inline" onClick={() => setOpen((current) => !current)}>
            {open ? "Sluiten" : "Kies afbeelding"}
          </button>
          <label className="button-inline image-picker-upload">
            {busy ? "Bezig met uploaden..." : "Nieuwe uploaden"}
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={upload} disabled={busy} hidden />
          </label>
          {allowEmpty && value ? (
            <button type="button" className="button-inline" onClick={() => setValue("")}>
              Verwijderen
            </button>
          ) : null}
        </div>
      </div>
      {error ? <p className="field-error">{error}</p> : null}
      {open ? (
        <div className="media-grid compact">
          {choices.map((option) => (
            <button
              key={option.url}
              type="button"
              className={option.url === value ? "media-tile selected" : "media-tile"}
              onClick={() => {
                setValue(option.url);
                setOpen(false);
              }}
              title={option.label}
            >
              <img src={option.url} alt="" loading="lazy" />
              <span>{option.group}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
