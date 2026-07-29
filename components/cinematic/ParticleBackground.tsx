"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
}

interface ParticleBackgroundProps {
  particleCount?: number;
  className?: string;
  interactive?: boolean;
  showGrid?: boolean;
  showGlowOrb?: boolean;
}

export function ParticleBackground({
  particleCount = 80,
  className = "",
  interactive = true,
  showGrid = true,
  showGlowOrb = true,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const particlesRef = useRef<Particle[]>([]);
  const animationIdRef = useRef<number>(0);
  const glowRef = useRef({ x: -1000, y: -1000 });
  const gridOffsetRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);

  const initParticles = useCallback(
    (width: number, height: number) => {
      const particles: Particle[] = [];
      const count =
        window.innerWidth < 768
          ? Math.floor(particleCount * 0.4)
          : particleCount;
      for (let i = 0; i < count; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.1,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.02 + 0.005,
        });
      }
      particlesRef.current = particles;
    },
    [particleCount]
  );

  const drawGrid = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      if (!showGrid) return;
      const spacing = 60;
      const offsetX = gridOffsetRef.current.x % spacing;
      const offsetY = gridOffsetRef.current.y % spacing;

      ctx.strokeStyle = "rgba(0, 212, 255, 0.03)";
      ctx.lineWidth = 0.5;

      for (let x = offsetX; x < width; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = offsetY; y < height; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    },
    [showGrid]
  );

  const drawGlowOrb = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!showGlowOrb || !mouseRef.current.active) return;

      // Smooth follow
      glowRef.current.x += (mouseRef.current.x - glowRef.current.x) * 0.06;
      glowRef.current.y += (mouseRef.current.y - glowRef.current.y) * 0.06;

      const gradient = ctx.createRadialGradient(
        glowRef.current.x,
        glowRef.current.y,
        0,
        glowRef.current.x,
        glowRef.current.y,
        250
      );
      gradient.addColorStop(0, "rgba(0, 212, 255, 0.08)");
      gradient.addColorStop(0.4, "rgba(123, 92, 255, 0.03)");
      gradient.addColorStop(1, "transparent");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    },
    [showGlowOrb]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const parent = canvas.parentElement;
      const width = parent ? parent.clientWidth : window.innerWidth;
      const height = parent ? parent.clientHeight : window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      initParticles(width, height);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;

      // Parallax grid offset
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      gridOffsetRef.current.x = (e.clientX - cx) * 0.02;
      gridOffsetRef.current.y = (e.clientY - cy) * 0.02;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      const parent = canvas.parentElement;
      const width = parent ? parent.clientWidth : window.innerWidth;
      const height = parent ? parent.clientHeight : window.innerHeight;
      ctx.clearRect(0, 0, width, height);
      timeRef.current += 0.016;

      // Draw grid
      drawGrid(ctx, width, height);

      // Draw glow orb
      drawGlowOrb(ctx);

      // Update and draw particles
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.pulse += p.pulseSpeed;
        const pulseOpacity = Math.sin(p.pulse) * 0.2 + p.opacity;

        // Mouse repulsion / attraction
        if (interactive && mouseRef.current.active) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 180;

          if (dist < maxDist) {
            const force = (1 - dist / maxDist) * 2;
            p.x -= (dx / dist) * force;
            p.y -= (dy / dist) * force;
          }
        }

        // Drift
        p.x += p.speedX;
        p.y += p.speedY;

        // Return to base slowly
        p.x += (p.baseX - p.x) * 0.005;
        p.y += (p.baseY - p.y) * 0.005;

        // Wrap edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${Math.max(0, pulseOpacity)})`;
        ctx.fill();

        // Draw connections between nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${
              (1 - dist / 120) * 0.12
            })`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [interactive, initParticles, drawGrid, drawGlowOrb]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ pointerEvents: "auto" }}
      aria-hidden="true"
    />
  );
}
