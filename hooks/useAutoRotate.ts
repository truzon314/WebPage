"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Cycles an index from 0..length on an interval, with pause/resume for
 * hover-to-pause carousels and a manual select that restarts the timer
 * (so clicking a dot doesn't get immediately overridden by the interval).
 */
export function useAutoRotate(length: number, intervalMs: number) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pause = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const start = useCallback(() => {
    pause();
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % length);
    }, intervalMs);
  }, [length, intervalMs, pause]);

  const select = useCallback(
    (i: number) => {
      setIndex(i);
      start();
    },
    [start]
  );

  useEffect(() => {
    start();
    return pause;
  }, [start, pause]);

  return { index, pause, resume: start, select };
}
