"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ParticleBackground } from "@/components/cinematic/ParticleBackground";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TentangPage() {
  const connectorRef = useRef<HTMLDivElement>(null);
  const sectionRef = useScrollReveal({ direction: "up" });
  const timelineRef = useRef<HTMLDivElement>(null);

  // Animate the connector line between Masalah and Solusi
  useEffect(() => {
    const connector = connectorRef.current;
    if (!connector) return;

    gsap.fromTo(
      connector,
      { scaleY: 0 },
      {
        scaleY: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: connector,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === connector) t.kill();
      });
    };
  }, []);

  // Animate timeline items
  useEffect(() => {
    const container = timelineRef.current;
    if (!container) return;

    const items = container.querySelectorAll(".timeline-item");
    items.forEach((item, i) => {
      gsap.fromTo(
        item,
        { opacity: 0, x: i % 2 === 0 ? -40 : 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="relative">
      {/* Page Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ParticleBackground particleCount={40} showGrid={false} showGlowOrb />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs text-accent tracking-[0.3em] uppercase font-medium"
          >
            About
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-[family-name:var(--font-display)] text-4xl md:text-5xl lg:text-6xl font-bold mt-3"
          >
            Tentang Proyek
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="w-16 h-px bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mt-6"
          />
        </div>
      </section>

      {/* Project Description */}
      <section className="py-20 md:py-28">
        <div ref={sectionRef} className="section-container max-w-4xl">
          <div className="space-y-6 text-text-secondary leading-relaxed">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-lg md:text-xl text-foreground font-light"
            >
              {/* TODO: ganti dengan deskripsi proyek asli */}
              Proyek ini merupakan bagian dari mata kuliah Teknologi dan
              Manajemen Bangunan (TMB) Batch 2 yang berfokus pada perancangan{" "}
              <span className="text-accent font-medium">
                Desain Engineering Detail (DED)
              </span>{" "}
              dan{" "}
              <span className="text-accent font-medium">
                infrastruktur Teknologi Informasi (TI)
              </span>{" "}
              untuk Kantor Kecamatan Pahandut, Kota Palangka Raya.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              Kelompok 11 ditugaskan untuk merancang keseluruhan aspek teknis
              bangunan, mulai dari denah arsitektur, sistem struktur, hingga
              topologi jaringan komputer yang akan diimplementasikan di gedung
              tersebut.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Website ini berfungsi sebagai portofolio digital yang menyatukan
              seluruh dokumentasi proyek — dari gambar teknis, model 3D,
              topologi jaringan, rencana anggaran biaya, hingga logbook
              harian — dalam satu platform interaktif yang profesional.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Masalah → Solusi Section */}
      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-bg-secondary/30 to-background pointer-events-none" />
        <div className="section-container relative z-10">
          <div className="text-center mb-16">
            <span className="text-xs text-accent tracking-[0.3em] uppercase font-medium">
              Problem & Solution
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold mt-3 mb-4">
              Dari Masalah ke Solusi
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-accent to-transparent mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-16 max-w-5xl mx-auto relative">
            {/* Masalah */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="p-8 rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-red-400">
                    Masalah
                  </h3>
                </div>
                <ul className="space-y-4 text-text-secondary text-sm">
                  {/* TODO: ganti dengan masalah asli */}
                  <li className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/50 mt-2 shrink-0" />
                    <span>Kantor Kecamatan Pahandut belum memiliki desain infrastruktur gedung yang memenuhi standar modern.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/50 mt-2 shrink-0" />
                    <span>Belum ada perencanaan jaringan TI yang terstruktur dan mendukung kebutuhan operasional.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/50 mt-2 shrink-0" />
                    <span>Dokumentasi teknis yang tersebar dan tidak terintegrasi dalam satu platform.</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Connector (desktop only) */}
            <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div ref={connectorRef} className="relative origin-top">
                <div className="w-px h-32 bg-gradient-to-b from-red-500/40 via-accent to-emerald-500/40" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-accent/30 bg-bg-secondary flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="7 13 12 18 17 13" /><polyline points="7 6 12 11 17 6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Solusi */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-emerald-400">
                    Solusi
                  </h3>
                </div>
                <ul className="space-y-4 text-text-secondary text-sm">
                  {/* TODO: ganti dengan solusi asli */}
                  <li className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 mt-2 shrink-0" />
                    <span>Perancangan DED lengkap meliputi arsitektur, struktur, dan MEP sesuai standar.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 mt-2 shrink-0" />
                    <span>Desain topologi jaringan TI komprehensif dengan VLAN, server, dan perangkat enterprise.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 mt-2 shrink-0" />
                    <span>Website portofolio interaktif sebagai platform dokumentasi terpadu.</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Scope / Ruang Lingkup */}
      <section className="py-20 md:py-28">
        <div className="section-container">
          <div className="text-center mb-16">
            <span className="text-xs text-accent-secondary tracking-[0.3em] uppercase font-medium">
              Scope
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold mt-3 mb-4">
              Ruang Lingkup Proyek
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-accent-secondary to-transparent mx-auto" />
          </div>

          <div ref={timelineRef} className="max-w-3xl mx-auto space-y-6">
            {/* TODO: ganti dengan ruang lingkup asli */}
            {[
              {
                title: "Desain Arsitektur",
                desc: "Site plan, denah lantai, tampak, potongan, detail pondasi, kolom, balok, atap, dan tangga.",
                icon: "🏗️",
              },
              {
                title: "Desain Struktur",
                desc: "Perhitungan struktur dan gambar teknis untuk pondasi, kolom, balok, plat, dan atap.",
                icon: "🔩",
              },
              {
                title: "Infrastruktur Jaringan",
                desc: "Topologi jaringan LAN/WAN, konfigurasi VLAN, server, wireless AP, dan keamanan jaringan.",
                icon: "🌐",
              },
              {
                title: "Rencana Anggaran Biaya",
                desc: "Perhitungan volume pekerjaan dan analisa harga satuan untuk seluruh komponen proyek.",
                icon: "💰",
              },
              {
                title: "Visualisasi 3D",
                desc: "Model 3D bangunan menggunakan SketchUp untuk visualisasi desain yang lebih nyata.",
                icon: "📐",
              },
              {
                title: "Dokumentasi & Laporan",
                desc: "Proposal, laporan akhir, logbook harian, dan dokumentasi foto/video kegiatan.",
                icon: "📋",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="timeline-item flex gap-4 md:gap-6 p-5 rounded-xl border border-border-subtle bg-bg-card/50 hover:border-accent/20 hover:bg-bg-card transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-bg-tertiary border border-border-subtle flex items-center justify-center text-xl shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold mb-1">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
