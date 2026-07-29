"use client";

import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const quickLinks = [
  { href: "/tentang", label: "Tentang Proyek" },
  { href: "/tim", label: "Tim Kami" },
  { href: "/arsitektur", label: "Arsitektur" },
  { href: "/topologi", label: "Topologi Jaringan" },
  { href: "/rab", label: "RAB" },
  { href: "/kontak", label: "Kontak" },
];

export function Footer() {
  const footerRef = useScrollReveal<HTMLElement>({
    direction: "up",
    distance: 30,
    duration: 0.8,
  });

  return (
    <footer
      ref={footerRef}
      className="relative border-t border-border-subtle bg-bg-secondary/50"
    >
      {/* Accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="section-container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg border border-accent/30 flex items-center justify-center">
                <span className="font-[family-name:var(--font-display)] text-accent text-base font-bold">
                  T
                </span>
              </div>
              <div>
                <p className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-wider">
                  TMB Kelompok 11
                </p>
                <p className="text-[10px] text-text-secondary tracking-widest uppercase">
                  Batch 2
                </p>
              </div>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              Portofolio digital dokumentasi proyek DED & Teknologi Informasi
              Kantor Kecamatan Pahandut.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-xs font-semibold tracking-widest uppercase text-text-secondary mb-4">
              Navigasi
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-accent transition-colors duration-300 inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-px bg-text-muted group-hover:bg-accent group-hover:w-3 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Project Info */}
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-xs font-semibold tracking-widest uppercase text-text-secondary mb-4">
              Proyek
            </h3>
            <div className="space-y-3 text-sm text-text-secondary">
              <p>
                <span className="text-text-muted">Mata Kuliah:</span>{" "}
                <span className="text-foreground">
                  Teknologi dan Manajemen Bangunan
                </span>
              </p>
              <p>
                <span className="text-text-muted">Lokasi:</span>{" "}
                <span className="text-foreground">
                  Kecamatan Pahandut, Palangka Raya
                </span>
              </p>
              <p>
                <span className="text-text-muted">Tahun:</span>{" "}
                {/* TODO: ganti dengan tahun asli */}
                <span className="text-foreground">2025</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            © 2025 TMB Batch 2 — Kelompok 11. Seluruh hak dilindungi.
          </p>
          <p className="text-xs text-text-muted flex items-center gap-1.5">
            Dibuat dengan
            <span className="inline-block w-3 h-3 text-accent">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </span>
            oleh Kelompok 11
          </p>
        </div>
      </div>
    </footer>
  );
}
