"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const BUBBLE_COUNT = 56;
const BUBBLE_COLUMNS = 14;

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function createBubble(id) {
  const duration = randomBetween(14, 28);
  const column = id % BUBBLE_COLUMNS;
  const laneWidth = 100 / BUBBLE_COLUMNS;
  const laneCenter = laneWidth * column + laneWidth / 2;
  const laneJitter = randomBetween(-laneWidth * 0.34, laneWidth * 0.34);

  return {
    id,
    key: `${id}-${Math.round(Math.random() * 1_000_000)}`,
    left: Math.max(3, Math.min(97, laneCenter + laneJitter)),
    size: randomBetween(2.6, 6.8),
    duration,
    delay: randomBetween(-duration, 0),
    drift: randomBetween(-3.2, 3.2),
    opacity: randomBetween(0.52, 0.9),
    innerScale: randomBetween(0.5, 0.7),
    popped: false
  };
}

export function BackgroundBubbles() {
  const initialBubbles = useMemo(() => [], []);
  const [hasMounted, setHasMounted] = useState(false);
  const [bubbles, setBubbles] = useState(initialBubbles);
  const timeoutsRef = useRef(new Map());

  useEffect(() => {
    setHasMounted(true);
    setBubbles(Array.from({ length: BUBBLE_COUNT }, (_, index) => createBubble(index)));

    return () => {
      timeoutsRef.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
      timeoutsRef.current.clear();
    };
  }, []);

  function popBubble(id) {
    setBubbles((current) =>
      current.map((bubble) =>
        bubble.id === id && !bubble.popped
          ? {
              ...bubble,
              popped: true
            }
          : bubble
      )
    );

    const existingTimeout = timeoutsRef.current.get(id);
    if (existingTimeout) {
      window.clearTimeout(existingTimeout);
    }

    const timeoutId = window.setTimeout(() => {
      setBubbles((current) =>
        current.map((bubble) =>
          bubble.id === id
            ? {
                ...createBubble(id),
                delay: 0
              }
            : bubble
        )
      );

      timeoutsRef.current.delete(id);
    }, 1600);

    timeoutsRef.current.set(id, timeoutId);
  }

  if (!hasMounted) {
    return null;
  }

  return (
    <div className="background-bubbles-layer" aria-hidden="true">
      {bubbles.map((bubble) => (
        <button
          key={bubble.key}
          type="button"
          className={bubble.popped ? "background-bubble is-popping" : "background-bubble"}
          style={{
            "--bubble-left": `${bubble.left}%`,
            "--bubble-size": `${bubble.size}rem`,
            "--bubble-duration": `${bubble.duration}s`,
            "--bubble-delay": `${bubble.delay}s`,
            "--bubble-drift": `${bubble.drift}rem`,
            "--bubble-opacity": bubble.opacity,
            "--bubble-inner-scale": bubble.innerScale
          }}
          tabIndex={-1}
          onClick={() => popBubble(bubble.id)}
        >
          <span className="background-bubble-shell">
            <span className="background-bubble-core" />
          </span>
          <span className="background-bubble-pop-ring" />
          <span className="background-bubble-pop-flash" />
          <span className="background-bubble-burst background-bubble-burst-a" />
          <span className="background-bubble-burst background-bubble-burst-b" />
          <span className="background-bubble-burst background-bubble-burst-c" />
          <span className="background-bubble-burst background-bubble-burst-d" />
        </button>
      ))}
    </div>
  );
}
