"use client";

import { useState } from "react";
import { uploadImages } from "@/components/admin/upload-utils";

// Uploadformulier voor Afbeeldingen en Gallerij. Foto's worden eerst in de browser verkleind.
export function UploadForm({ label, buttonLabel, addToGallery = false }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    const files = Array.from(event.currentTarget.elements.files.files || []);
    if (!files.length) return;

    setBusy(true);
    setError("");

    const { urls, errors } = await uploadImages(files);
    const message = errors.join(" ");

    if (addToGallery && urls.length) {
      const body = new URLSearchParams({ action: "add" });
      urls.forEach((url) => body.append("urls", url));
      await fetch("/api/admin/gallery", { method: "POST", body });
    }

    if (urls.length) {
      const target = new URL(addToGallery ? "/admin/gallerij" : "/admin/afbeeldingen", window.location.origin);
      target.searchParams.set(addToGallery ? "status" : "uploaded", addToGallery ? "saved" : String(urls.length));
      if (message) target.searchParams.set("error", message);
      window.location.assign(target);
      return;
    }

    setError(message || "Upload mislukt.");
    setBusy(false);
  }

  return (
    <form onSubmit={onSubmit} className="form-grid">
      <div className="field">
        <label htmlFor="files">{label}</label>
        <input id="files" name="files" type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple required />
      </div>
      {error ? <p className="field-error">{error}</p> : null}
      <button type="submit" className="button-link" disabled={busy}>
        {busy ? "Bezig met uploaden..." : buttonLabel}
      </button>
    </form>
  );
}
