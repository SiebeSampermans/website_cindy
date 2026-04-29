"use client";

import { useEffect, useRef, useState } from "react";

const STAMP_LIFETIME = 2400;
const STAMP_DISTANCE = 34;
const MAX_STAMPS = 24;
const STEP_SIDE_OFFSET = 10;
const STEP_ANGLE_SWAY = 12;

function getNow() {
  return Date.now();
}

function PawStamp({ stamp }) {
  return (
    <span
      className="paw-trail-stamp"
      style={{
        left: stamp.x,
        top: stamp.y,
        "--paw-rotation": `${stamp.angle}deg`,
        animationDuration: `${STAMP_LIFETIME}ms`
      }}
      aria-hidden="true"
    >
      <img src="/paw-cursor.svg" alt="" />
    </span>
  );
}

export function PawTrail() {
  const [stamps, setStamps] = useState([]);
  const lastPointRef = useRef(null);
  const nextSideRef = useRef(1);

  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return undefined;
    }

    let cleanupTimer = null;

    const pruneExpired = () => {
      const now = getNow();
      setStamps((current) => current.filter((stamp) => now - stamp.createdAt < STAMP_LIFETIME));
    };

    const scheduleCleanup = () => {
      window.clearTimeout(cleanupTimer);
      cleanupTimer = window.setTimeout(pruneExpired, STAMP_LIFETIME + 80);
    };

    const handlePointerMove = (event) => {
      const point = { x: event.clientX, y: event.clientY };
      const lastPoint = lastPointRef.current;

      if (!lastPoint) {
        lastPointRef.current = point;
        return;
      }

      const dx = point.x - lastPoint.x;
      const dy = point.y - lastPoint.y;
      const distance = Math.hypot(dx, dy);

      if (distance < STAMP_DISTANCE) {
        return;
      }

      const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
      const normalX = -dy / distance;
      const normalY = dx / distance;

      const stepCount = Math.max(1, Math.floor(distance / STAMP_DISTANCE));
      const nextStamps = Array.from({ length: stepCount }, (_, index) => {
        const progress = (index + 1) / stepCount;
        const side = nextSideRef.current * (index % 2 === 0 ? 1 : -1);
        const x = lastPoint.x + dx * progress + normalX * STEP_SIDE_OFFSET * side;
        const y = lastPoint.y + dy * progress + normalY * STEP_SIDE_OFFSET * side;

        return {
          id: `${getNow()}-${Math.random().toString(36).slice(2)}`,
          x,
          y,
          angle: angle + STEP_ANGLE_SWAY * side,
          createdAt: getNow()
        };
      });

      setStamps((current) => [...current, ...nextStamps].slice(-MAX_STAMPS));
      if (stepCount % 2 !== 0) {
        nextSideRef.current *= -1;
      }
      lastPointRef.current = point;
      scheduleCleanup();
    };

    const handlePointerLeave = () => {
      lastPointRef.current = null;
      nextSideRef.current = 1;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave);

    return () => {
      window.clearTimeout(cleanupTimer);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
    };
  }, []);

  return (
    <div className="paw-trail-layer" aria-hidden="true">
      {stamps.map((stamp) => (
        <PawStamp key={stamp.id} stamp={stamp} />
      ))}
    </div>
  );
}
