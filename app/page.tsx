"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ParticleBackground } from "@/components/cinematic/ParticleBackground";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useStaggerFade } from "@/hooks/useStaggerFade";
import { useCountUp } from "@/hooks/useCountUp";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Stat Counter Component ───
function StatCard({
  end,
  suffix,
  label,
  prefix,
}: {
  end: number;
  suffix?: string;
  label: string;
  prefix?: string;
}) {
  const { ref, displayValue } = useCountUp({
    end,
    suffix: suffix || "",
    prefix: prefix || "",
    duration: 2.5,
  });

  return (
    <div className="text-center group">
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="font-[family-name:var(--font-display)] text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-2"
      >
        {displayValue}
      </div>
      <p className="text-text-secondary text-xs md:text-sm tracking-wider uppercase">
        {label}
      </p>
    </div>
  );
}

// ─── Navigation Card Component ───
function NavCard({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Link href={href} className="group block">
      <div
        className="relative h-full p-6 rounded-2xl border border-border-subtle
        bg-bg-card backdrop-blur-sm overflow-hidden
        transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5
        hover:-translate-y-1"
      >
        {/* Hover glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-accent/5 via-transparent to-accent-secondary/5 pointer-events-none" />

        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl border border-border-subtle bg-bg-tertiary
          flex items-center justify-center mb-4
          group-hover:border-accent/30 group-hover:shadow-md group-hover:shadow-accent/10
          transition-all duration-500"
        >
          <span className="text-accent/70 group-hover:text-accent transition-colors duration-500">
            {icon}
          </span>
        </div>

        {/* Content */}
        <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-wide mb-2 text-foreground group-hover:text-accent transition-colors duration-300">
          {title}
        </h3>
        <p className="text-text-secondary text-xs leading-relaxed">
          {description}
        </p>

        {/* Arrow */}
        <div className="mt-4 flex items-center gap-2 text-text-muted group-hover:text-accent transition-all duration-300">
          <span className="text-xs tracking-wider uppercase">Explore</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:translate-x-1 transition-transform duration-300"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

// ─── Page Icons ───
const icons = {
  building: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22V12h6v10M9 6h.01M15 6h.01M9 10h.01M15 10h.01" />
    </svg>
  ),
  team: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  map: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  ),
  blueprint: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  cube: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  network: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="6" /><rect x="16" y="16" width="6" height="6" />
      <rect x="2" y="16" width="6" height="6" /><path d="M5 16V12a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" />
      <line x1="12" y1="8" x2="12" y2="10" />
    </svg>
  ),
  calculator: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="10" y2="10" /><line x1="14" y1="10" x2="16" y2="10" />
      <line x1="8" y1="14" x2="10" y2="14" /><line x1="14" y1="14" x2="16" y2="14" />
      <line x1="8" y1="18" x2="16" y2="18" />
    </svg>
  ),
  file: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
};

// ─── Navigation Cards Data ───
const navCards = [
  {
    href: "/tentang",
    title: "Tentang Proyek",
    description: "Latar belakang, masalah, dan solusi yang dirancang",
    icon: icons.building,
  },
  {
    href: "/tim",
    title: "Tim Kami",
    description: "6 anggota tim dengan peran dan keahlian masing-masing",
    icon: icons.team,
  },
  {
    href: "/lokasi",
    title: "Lokasi Proyek",
    description: "Peta interaktif Kantor Kecamatan Pahandut",
    icon: icons.map,
  },
  {
    href: "/arsitektur",
    title: "Arsitektur DWG",
    description: "Denah, potongan, tampak, dan detail konstruksi",
    icon: icons.blueprint,
  },
  {
    href: "/visualisasi-3d",
    title: "Visualisasi 3D",
    description: "Model interaktif SketchUp gedung & infrastruktur",
    icon: icons.cube,
  },
  {
    href: "/topologi",
    title: "Topologi Jaringan",
    description: "Diagram interaktif infrastruktur jaringan TI",
    icon: icons.network,
  },
  {
    href: "/rab",
    title: "RAB",
    description: "Rencana anggaran biaya lengkap dengan filter & search",
    icon: icons.calculator,
  },
  {
    href: "/dokumen",
    title: "Dokumen",
    description: "Proposal, laporan akhir, dan jurnal proyek",
    icon: icons.file,
  },
];

// ═══════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const parallax = useMouseParallax(0.5);
  const overviewRef = useScrollReveal({ direction: "up", duration: 1 });
  const cardsGridRef = useStaggerFade({ stagger: 0.08, distance: 40 });

  // GSAP text reveal animation for hero title
  useEffect(() => {
    if (!titleRef.current) return;

    const chars = titleRef.current.querySelectorAll(".char");
    if (chars.length === 0) return;

    gsap.set(chars, {
      opacity: 0,
      y: 60,
      rotateX: -80,
    });

    gsap.to(chars, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 0.8,
      stagger: 0.03,
      delay: 0.5,
      ease: "power3.out",
    });
  }, []);

  // Hero parallax scroll effect
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    gsap.to(hero, {
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
      },
      scale: 1.1,
      opacity: 0.3,
      y: -100,
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === hero) t.kill();
      });
    };
  }, []);

  // Split title text into chars for animation
  const titleText = "PROYEK TMB";
  const subtitleText = "Kantor Kecamatan Pahandut";

  return (
    <div className="relative">
      {/* ═══ SECTION 1: HERO ═══ */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Particle Background */}
        <div ref={heroRef} className="absolute inset-0">
          <ParticleBackground particleCount={100} interactive showGrid showGlowOrb />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/30" />
        </div>

        {/* Decorative elements with mouse parallax */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: `translate(${parallax.x * 0.5}px, ${parallax.y * 0.5}px)`,
          }}
        >
          {/* Blueprint lines */}
          <div className="absolute top-[20%] left-[10%] w-32 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
          <div className="absolute top-[30%] right-[15%] w-24 h-px bg-gradient-to-r from-transparent via-accent-secondary/20 to-transparent" />
          <div className="absolute bottom-[35%] left-[20%] w-px h-24 bg-gradient-to-b from-transparent via-accent/15 to-transparent" />
          <div className="absolute top-[15%] right-[25%] w-px h-16 bg-gradient-to-b from-transparent via-accent/10 to-transparent" />

          {/* Glowing dots */}
          <div className="absolute top-[25%] left-[30%] w-1 h-1 bg-accent/40 rounded-full shadow-lg shadow-accent/20" />
          <div className="absolute top-[45%] right-[20%] w-1.5 h-1.5 bg-accent-secondary/30 rounded-full shadow-lg shadow-accent-secondary/20" />
          <div className="absolute bottom-[30%] left-[60%] w-1 h-1 bg-accent/30 rounded-full" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {/* Logo badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full 
              border border-accent/20 bg-accent/5 mb-8"
          >
            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            <span className="text-xs text-accent tracking-widest uppercase font-medium">
              TMB Batch 2 — Kelompok 11
            </span>
          </motion.div>

          {/* Main Title - character-by-character animation */}
          <h1
            ref={titleRef}
            className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 
              font-black tracking-tight leading-[0.9] mb-6"
            style={{ perspective: "600px" }}
          >
            {titleText.split("").map((char, i) => (
              <span
                key={i}
                className="char inline-block"
                style={{ display: char === " " ? "inline" : "inline-block" }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-lg md:text-xl lg:text-2xl text-text-secondary font-light tracking-wide mb-4"
          >
            {subtitleText}
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="text-sm md:text-base text-text-muted max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Portofolio digital interaktif — dokumentasi lengkap proyek Desain
            Engineering Detail & Teknologi Informasi
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.8 }}
          >
            <Link
              href="#overview"
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl
                border border-accent/30 bg-accent/10 text-accent font-[family-name:var(--font-display)]
                text-sm tracking-widest uppercase font-semibold
                hover:bg-accent/20 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10
                transition-all duration-500 overflow-hidden"
              style={{ animation: "glowPulse 3s ease-in-out infinite" }}
            >
              <span className="relative z-10">Explore Project</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="relative z-10 group-hover:translate-x-1 transition-transform duration-300"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              {/* Animated gradient sweep */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700
                  bg-gradient-to-r from-transparent via-accent/10 to-transparent
                  -translate-x-full group-hover:translate-x-full"
                style={{ transition: "transform 0.7s, opacity 0.3s" }}
              />
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-text-muted tracking-widest uppercase">
            Scroll
          </span>
          <div className="w-5 h-8 rounded-full border border-text-muted/30 flex items-start justify-center p-1.5">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-1 h-1.5 bg-accent rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* ═══ SECTION 2: PROJECT OVERVIEW ═══ */}
      <section id="overview" className="relative py-24 md:py-32">
        {/* Background accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-bg-secondary/50 to-background pointer-events-none" />

        <div ref={overviewRef} className="section-container relative z-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs text-accent tracking-[0.3em] uppercase font-medium"
            >
              Overview
            </motion.span>
            <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl lg:text-4xl font-bold mt-3 mb-4">
              Ringkasan Proyek
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-accent to-transparent mx-auto" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-20">
            {/* TODO: ganti dengan data asli */}
            <StatCard end={12} label="Ruangan" suffix="+" />
            <StatCard end={25} label="Perangkat" suffix="+" />
            <StatCard end={6} label="Anggota Tim" />
            <StatCard end={500} label="Total Budget" prefix="Rp " suffix="Jt" />
          </div>

          {/* Project description cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="p-6 rounded-2xl border border-border-subtle bg-bg-card"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-wide">
                  Masalah
                </h3>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                {/* TODO: ganti dengan deskripsi masalah asli */}
                Kantor Kecamatan Pahandut membutuhkan desain infrastruktur
                gedung dan jaringan IT yang modern, efisien, dan terencana
                dengan baik untuk mendukung pelayanan publik optimal.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="p-6 rounded-2xl border border-border-subtle bg-bg-card"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-wide">
                  Solusi
                </h3>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                {/* TODO: ganti dengan deskripsi solusi asli */}
                Tim kami merancang Desain Engineering Detail (DED) lengkap
                meliputi arsitektur, struktur, dan infrastruktur jaringan TI
                yang komprehensif — dari site plan hingga topologi jaringan.
              </p>
            </motion.div>
          </div>

          {/* Connector line between cards (visible on md+) */}
          <div className="hidden md:block relative">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute left-1/2 -translate-x-1/2 -top-[3.75rem] w-px h-6 bg-gradient-to-b from-transparent via-accent/40 to-transparent origin-top"
            />
          </div>
        </div>
      </section>

      {/* ═══ SECTION 3: QUICK NAVIGATION ═══ */}
      <section className="relative py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-bg-secondary/30 to-background pointer-events-none" />

        <div className="section-container relative z-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="text-xs text-accent-secondary tracking-[0.3em] uppercase font-medium">
              Jelajahi
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl lg:text-4xl font-bold mt-3 mb-4">
              Dokumentasi Proyek
            </h2>
            <p className="text-text-secondary text-sm max-w-lg mx-auto">
              Akses seluruh dokumentasi proyek TMB dari arsitektur hingga
              jaringan, semuanya dalam satu platform interaktif.
            </p>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-accent-secondary to-transparent mx-auto mt-6" />
          </div>

          {/* Cards Grid */}
          <div
            ref={cardsGridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
          >
            {navCards.map((card) => (
              <NavCard key={card.href} {...card} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
