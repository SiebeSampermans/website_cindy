"use client";

function GalleryLane({ items, reverse = false, speedClass = "gallery-lane-track-slow" }) {
  const duplicatedItems = [...items, ...items];

  return (
    <div className="gallery-lane">
      <div className={`gallery-lane-track ${speedClass} ${reverse ? "is-reverse" : ""}`}>
        {duplicatedItems.map((image, index) => (
          <a
            key={`${image.thumb}-${index}`}
            href={image.full}
            target="_blank"
            rel="noreferrer"
            className="gallery-orb"
          >
            <span className="gallery-orb-glow" aria-hidden="true" />
            <span className="gallery-orb-frame">
              <img src={image.thumb} alt={image.alt} />
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

export function InfiniteGallery({ images }) {
  const laneSize = Math.ceil(images.length / 3);
  const lanes = [
    images.slice(0, laneSize),
    images.slice(laneSize, laneSize * 2),
    images.slice(laneSize * 2)
  ].filter((lane) => lane.length > 0);

  return (
    <section className="infinite-gallery-shell">
      <div className="infinite-gallery-intro section">
        <p className="eyebrow">Oneindige galerij</p>
        <h2>Blijf door de sfeerbeelden wandelen.</h2>
        <p>
          Geinspireerd op het idee van een infinite menu, maar hier vertaald naar een zachte,
          doorlopende fotostroom van het trimsalon.
        </p>
      </div>

      <div className="infinite-gallery-stage">
        {lanes.map((lane, index) => (
          <GalleryLane
            key={`lane-${index}`}
            items={lane}
            reverse={index % 2 === 1}
            speedClass={index === 1 ? "gallery-lane-track-medium" : "gallery-lane-track-slow"}
          />
        ))}
      </div>
    </section>
  );
}
