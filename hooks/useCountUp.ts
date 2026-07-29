"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpOptions {
  end: number;
  start?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  separator?: string;
}

export function useCountUp(options: CountUpOptions) {
  const {
    end,
    start = 0,
    duration = 2,
    prefix = "",
    suffix = "",
    decimals = 0,
    separator = ".",
  } = options;

  const [value, setValue] = useState(start);
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasTriggered) {
          setHasTriggered(true);

          const startTime = performance.now();
          const durationMs = duration * 1000;

          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / durationMs, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = start + (end - start) * eased;

            setValue(current);

            if (progress < 1) {
              animationRef.current = requestAnimationFrame(animate);
            }
          };

          animationRef.current = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationRef.current);
    };
  }, [end, start, duration, hasTriggered]);

  const formatNumber = (num: number): string => {
    const fixed = num.toFixed(decimals);
    const [intPart, decPart] = fixed.split(".");
    const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return `${prefix}${decPart ? `${formatted}.${decPart}` : formatted}${suffix}`;
  };

  return { ref, displayValue: formatNumber(value) };
}
