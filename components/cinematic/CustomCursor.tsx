"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const mousePos = useRef({ x: -100, y: -100 });
  const outerPos = useRef({ x: -100, y: -100 });
  const animationId = useRef<number>(0);

  const createRipple = useCallback((x: number, y: number) => {
    const ripple = document.createElement("div");
    ripple.className = "cursor-ripple";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }, []);

  useEffect(() => {
    // Check for touch device
    const isTouch =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
    if (isTouch) return;

    // Activate custom cursor on body
    document.body.classList.add("custom-cursor-active");

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => {
      setIsClicking(true);
      createRipple(mousePos.current.x, mousePos.current.y);
    };

    const handleMouseUp = () => setIsClicking(false);

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Check hover on interactive elements
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest(
        "a, button, [role='button'], input, textarea, select, [data-cursor-hover], .cursor-hover"
      );
      setIsHovering(!!interactive);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousemove", handleElementHover);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Smooth animation loop for outer cursor
    const animate = () => {
      // Lerp outer position towards mouse
      outerPos.current.x +=
        (mousePos.current.x - outerPos.current.x) * 0.12;
      outerPos.current.y +=
        (mousePos.current.y - outerPos.current.y) * 0.12;

      if (outerRef.current) {
        const halfSize = isHovering ? 30 : 20;
        outerRef.current.style.transform = `translate(${
          outerPos.current.x - halfSize
        }px, ${outerPos.current.y - halfSize}px)`;
      }

      if (dotRef.current) {
        const halfDot = 4;
        dotRef.current.style.transform = `translate(${
          mousePos.current.x - halfDot
        }px, ${mousePos.current.y - halfDot}px)`;
      }

      animationId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId.current);
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousemove", handleElementHover);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible, isHovering, createRipple]);

  if (isTouchDevice) return null;

  return (
    <>
      <div
        ref={outerRef}
        className={`cursor-outer ${isVisible ? "active" : ""} ${
          isHovering ? "hovering" : ""
        } ${isClicking ? "clicking" : ""}`}
      />
      <div
        ref={dotRef}
        className={`cursor-dot ${isVisible ? "active" : ""} ${
          isHovering ? "hovering" : ""
        }`}
      />
    </>
  );
}
