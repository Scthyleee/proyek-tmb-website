"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number; // -1 to 1
  normalizedY: number; // -1 to 1
}

export function useMouseParallax(intensity: number = 1) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  const getMousePosition = useCallback(
    (e: MouseEvent): MousePosition => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      return {
        x: e.clientX,
        y: e.clientY,
        normalizedX: ((e.clientX - cx) / cx) * intensity,
        normalizedY: ((e.clientY - cy) / cy) * intensity,
      };
    },
    [intensity]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const pos = getMousePosition(e);
      targetRef.current.x = pos.normalizedX * 20;
      targetRef.current.y = pos.normalizedY * 20;
    };

    const animate = () => {
      currentRef.current.x +=
        (targetRef.current.x - currentRef.current.x) * 0.08;
      currentRef.current.y +=
        (targetRef.current.y - currentRef.current.y) * 0.08;

      setOffset({
        x: currentRef.current.x,
        y: currentRef.current.y,
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [getMousePosition]);

  return offset;
}
