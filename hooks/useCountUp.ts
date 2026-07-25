"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useInView } from "framer-motion";

const NUMERIC_PREFIX = /^(\d*\.?\d+)(.*)$/;

function formatAt(value: string, current: number) {
  const match = value.match(NUMERIC_PREFIX);
  if (!match) return value;
  const decimals = match[1].includes(".") ? match[1].split(".")[1].length : 0;
  return current.toFixed(decimals) + match[2];
}

/**
 * Animates a stat label like "50+", "5000+" or "4.8/5" counting up from zero
 * once its element scrolls into view. Falls back to the static label for
 * values with no leading number.
 */
export function useCountUp(value: string, duration = 1400): {
  ref: RefObject<HTMLDivElement | null>;
  display: string;
} {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(() => formatAt(value, 0));

  useEffect(() => {
    if (!inView) return;
    const match = value.match(NUMERIC_PREFIX);
    // No leading number to animate — the initial state already rendered
    // `value` as-is via formatAt's fallback, so there's nothing to do.
    if (!match) return;
    const target = parseFloat(match[1]);
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(formatAt(value, target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration]);

  return { ref, display };
}
