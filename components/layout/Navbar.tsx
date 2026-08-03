"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/components/cinematic/SoundEngine";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/tentang", label: "Tentang" },
  { href: "/tim", label: "Tim" },
  { href: "/lokasi", label: "Lokasi" },
  { href: "/arsitektur", label: "Arsitektur" },
  { href: "/visualisasi-3d", label: "3D" },
  { href: "/topologi", label: "Topologi" },
  { href: "/rab", label: "RAB" },
  { href: "/dokumen", label: "Dokumen" },
  { href: "/logbook", label: "Logbook" },
  { href: "/galeri", label: "Galeri" },
  { href: "/kontak", label: "Kontak" },
];

export function Navbar() {
  const pathname = usePathname();
  const { isMuted, toggleMute, playWhoosh } = useSound();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setIsScrolled(currentScrollY > 50);
    setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100);
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    playWhoosh();
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
          isScrolled
            ? "glass-strong shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/5 rounded-full border border-accent/20 group-hover:border-accent/50 group-hover:bg-white/10 transition-all duration-300 overflow-hidden">
                <img 
                  src="/logo-tmb-transparent.png" 
                  alt="Logo Universitas Palangka Raya TMB" 
                  className="w-[90%] h-[90%] object-contain drop-shadow-[0_0_3px_rgba(255,255,255,0.8)]"
                />
              </div>
              <div className="hidden sm:block">
                <p className="font-[family-name:var(--font-display)] text-xs md:text-sm font-semibold tracking-wider text-foreground">
                  TMB
                </p>
                <p className="text-[10px] text-text-secondary tracking-widest uppercase">
                  Kelompok 11
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3 py-2 text-xs font-medium tracking-wide uppercase transition-colors duration-300 rounded-md
                      ${
                        isActive
                          ? "text-accent"
                          : "text-text-secondary hover:text-foreground"
                      }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-accent rounded-full"
                        style={{ boxShadow: "0 0 10px var(--accent-glow)" }}
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Sound toggle */}
              <button
                onClick={toggleMute}
                className="relative w-9 h-9 rounded-lg border border-border-subtle
                  hover:border-accent/30 transition-all duration-300
                  flex items-center justify-center group"
                aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
              >
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-colors duration-300 ${
                    isMuted
                      ? "text-text-muted"
                      : "text-accent"
                  }`}
                  whileTap={{ scale: 0.85 }}
                >
                  {isMuted ? (
                    <>
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <line x1="23" y1="9" x2="17" y2="15" />
                      <line x1="17" y1="9" x2="23" y2="15" />
                    </>
                  ) : (
                    <>
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    </>
                  )}
                </motion.svg>
                {!isMuted && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent rounded-full animate-pulse" />
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden relative w-9 h-9 rounded-lg border border-border-subtle
                  hover:border-accent/30 transition-all duration-300
                  flex items-center justify-center"
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                <div className="relative w-4 h-3 flex flex-col justify-between">
                  <motion.span
                    animate={{
                      rotate: isMobileMenuOpen ? 45 : 0,
                      y: isMobileMenuOpen ? 5 : 0,
                    }}
                    className="block w-full h-0.5 bg-current rounded-full origin-center"
                    transition={{ duration: 0.3 }}
                  />
                  <motion.span
                    animate={{
                      opacity: isMobileMenuOpen ? 0 : 1,
                      scaleX: isMobileMenuOpen ? 0 : 1,
                    }}
                    className="block w-full h-0.5 bg-current rounded-full"
                    transition={{ duration: 0.2 }}
                  />
                  <motion.span
                    animate={{
                      rotate: isMobileMenuOpen ? -45 : 0,
                      y: isMobileMenuOpen ? -5 : 0,
                    }}
                    className="block w-full h-0.5 bg-current rounded-full origin-center"
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[999] lg:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-72 glass-strong"
            >
              <div className="pt-24 px-6">
                <div className="space-y-1">
                  {navLinks.map((link, i) => {
                    const isActive = pathname === link.href;
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                      >
                        <Link
                          href={link.href}
                          className={`block px-4 py-3 rounded-lg text-sm font-medium tracking-wide uppercase transition-all duration-300
                            ${
                              isActive
                                ? "text-accent bg-accent/5 border-l-2 border-accent"
                                : "text-text-secondary hover:text-foreground hover:bg-white/5"
                            }`}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
