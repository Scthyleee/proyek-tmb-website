"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface StaggerFadeOptions {
  direction?: "up" | "down" | "left" | "right";
  stagger?: number;
  duration?: number;
  distance?: number;
  delay?: number;
  triggerPosition?: string;
  childSelector?: string;
}

export function useStaggerFade<T extends HTMLElement = HTMLDivElement>(
  options: StaggerFadeOptions = {}
) {
  const ref = useRef<T>(null);

  const {
    direction = "up",
    stagger = 0.1,
    duration = 0.7,
    distance = 30,
    delay = 0,
    triggerPosition = "top 85%",
    childSelector = ":scope > *",
  } = options;

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const children = container.querySelectorAll(childSelector);
    if (children.length === 0) return;

    const dirMap = {
      up: { y: distance, x: 0 },
      down: { y: -distance, x: 0 },
      left: { y: 0, x: distance },
      right: { y: 0, x: -distance },
    };

    const { x, y } = dirMap[direction];

    gsap.set(children, { opacity: 0, x, y });

    gsap.to(children, {
      opacity: 1,
      x: 0,
      y: 0,
      duration,
      delay,
      stagger,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container,
        start: triggerPosition,
        toggleActions: "play none none none",
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === container) t.kill();
      });
    };
  }, [direction, stagger, duration, distance, delay, triggerPosition, childSelector]);

  return ref;
}
