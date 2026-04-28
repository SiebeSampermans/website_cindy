"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

function wrapIndex(index, length) {
  return ((index % length) + length) % length;
}

export function CircularGallery({ images }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const itemCount = images.length;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isLightboxOpen, isMounted]);

  useEffect(() => {
    if (!isLightboxOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsLightboxOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen]);

  const orbitItems = useMemo(
    () =>
      images.map((image, index) => {
        const angle = (360 / itemCount) * index;
        const isActive = index === activeIndex;

        return {
          ...image,
          angle,
          index,
          isActive
        };
      }),
    [activeIndex, images, itemCount]
  );

  const activeImage = images[activeIndex];
  const lightbox = (
    <div
      className="gallery-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={activeImage.alt}
      onClick={() => setIsLightboxOpen(false)}
    >
      <button
        type="button"
        className="gallery-lightbox-close"
        onClick={(event) => {
          event.stopPropagation();
          setIsLightboxOpen(false);
        }}
        aria-label="Sluit foto"
      >
        Sluiten
      </button>
      <div className="gallery-lightbox-content" onClick={(event) => event.stopPropagation()}>
        <img src={activeImage.full} alt={activeImage.alt} />
      </div>
    </div>
  );

  return (
    <section className="circular-gallery-shell">
      <div className="circular-gallery-copy section">
        <p className="eyebrow">Circular gallery</p>
        <h2>Een ronde stroom van trimsalonmomenten.</h2>
        <p>
          Geinspireerd op de Circular Gallery van React Bits, maar vertaald naar een warmere,
          zachtere versie voor t Snuffeltje.
        </p>
      </div>

      <div className="circular-gallery-stage section">
        <div className="circular-gallery-viewer">
          <div className="circular-gallery-focus">
            <button
              type="button"
              className="circular-gallery-focus-button"
              onClick={() => setIsLightboxOpen(true)}
              aria-label={`Open ${activeImage.alt} groot op deze pagina`}
            >
              <img src={activeImage.full} alt={activeImage.alt} />
            </button>
          </div>

          <div className="circular-gallery-orbit" aria-label="Galerij cirkel">
            <div
              className="circular-gallery-orbit-track"
              style={{ transform: `translate(-50%, -50%) rotate(${-activeIndex * (360 / itemCount)}deg)` }}
            >
              {orbitItems.map((image) => (
                <button
                  key={image.thumb}
                  type="button"
                  className={image.isActive ? "gallery-orb is-active" : "gallery-orb"}
                  style={{ "--orbit-angle": `${image.angle}deg` }}
                  onClick={() => setActiveIndex(image.index)}
                  aria-label={`Toon ${image.alt}`}
                >
                  <span className="gallery-orb-glow" aria-hidden="true" />
                  <span className="gallery-orb-frame">
                    <img src={image.thumb} alt="" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="circular-gallery-meta">
          <p className="eyebrow">Foto {activeIndex + 1}</p>
          <h3>{activeImage.alt}</h3>
          <div className="circular-gallery-actions">
            <button
              type="button"
              className="button-inline"
              onClick={() => setActiveIndex((current) => wrapIndex(current - 1, itemCount))}
            >
              Vorige
            </button>
            <button
              type="button"
              className="button-link"
              onClick={() => setIsLightboxOpen(true)}
            >
              Open foto
            </button>
            <button
              type="button"
              className="button-inline"
              onClick={() => setActiveIndex((current) => wrapIndex(current + 1, itemCount))}
            >
              Volgende
            </button>
          </div>
        </div>
      </div>

      {isMounted && isLightboxOpen ? createPortal(lightbox, document.body) : null}
    </section>
  );
}
