"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ParticleBackground } from "@/components/cinematic/ParticleBackground";

// 37 halaman gambar kerja dari PDF — judul diambil dari setiap lembar
const drawingTitles: Record<number, string> = {
  1: "Cover",
  2: "Site Plan",
  3: "Denah Basement",
  4: "Denah Kantor Kecamatan",
  5: "Denah Atap",
  6: "Tampak Depan",
  7: "Tampak Belakang",
  8: "Tampak Samping Kiri",
  9: "Tampak Samping Kanan",
  10: "Potongan A-A",
  11: "Potongan B-B",
  12: "Denah Pondasi",
  13: "Detail Pondasi P1",
  14: "Detail Pondasi P2",
  15: "Detail Pondasi P3",
  16: "Detail Pondasi P4",
  17: "Denah Sloof",
  18: "Denah Kolom & Balok Lt. Basement",
  19: "Denah Kolom & Balok Lt. Kantor Kecamatan",
  20: "Denah Ring Balok",
  21: "Denah Plat Lantai Basement",
  22: "Denah Plat Lantai Kantor Kecamatan",
  23: "Detail Plat Lantai",
  24: "Denah Kuda-Kuda",
  25: "Denah Tangga dan Ramp",
  26: "Detail Tangga",
  27: "Potongan A-A Tangga & Detail Ramp",
  28: "Detail Kuda-Kuda 1",
  29: "Detail Kuda-Kuda 2",
  30: "Detail Kuda-Kuda 3",
  31: "Detail Atap 1, 2, 3",
  32: "Denah Keramik",
  33: "Denah Listrik Basement",
  34: "Denah Listrik Kantor Kecamatan",
  35: "Denah Sanitasi Kantor Kecamatan",
  36: "Detail Septictank",
  37: "Detail Tandon Air",
};

const drawings = Array.from({ length: 37 }, (_, i) => ({
  id: i + 1,
  title: drawingTitles[i + 1] || `Halaman ${i + 1}`,
  image: `/drawings/page-${String(i + 1).padStart(2, "0")}.png`,
}));

export default function ArsitekturPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const openDrawing = (index: number) => {
    setSelectedIndex(index);
    resetView();
  };

  const navigate = (dir: number) => {
    if (selectedIndex === null) return;
    const next = (selectedIndex + dir + drawings.length) % drawings.length;
    setSelectedIndex(next);
    resetView();
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    setZoom((z) => Math.max(0.3, Math.min(5, z + (e.deltaY > 0 ? -0.15 : 0.15))));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
  };

  const handleMouseUp = () => setIsPanning(false);

  const selectedDrawing = selectedIndex !== null ? drawings[selectedIndex] : null;

  return (
    <div className="relative">
      {/* Page Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ParticleBackground particleCount={40} showGrid showGlowOrb={false} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-xs text-accent tracking-[0.3em] uppercase font-medium">
            Denah 2 Dimensi
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
            className="font-[family-name:var(--font-display)] text-4xl md:text-5xl lg:text-6xl font-bold mt-3">
            Gambar Kerja
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="text-text-secondary mt-4 max-w-lg mx-auto">
            37 lembar gambar teknis Kantor Kecamatan Pahandut — klik untuk melihat detail
          </motion.p>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1, duration: 0.6 }}
            className="w-16 h-px bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mt-6" />
        </div>
      </section>

      {/* Action Buttons */}
      <section className="py-6">
        <div className="section-container flex flex-wrap justify-center gap-3">
          <Link
            href="/dokumen?tab=gambar-kerja"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-bg-primary text-xs font-semibold hover:bg-accent/90 transition-all duration-300"
          >
            Lihat Seluruh PDF (37 Halaman)
          </Link>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-10 md:py-16">
        <div className="section-container">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {drawings.map((drawing, index) => (
              <motion.button
                key={drawing.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: (index % 10) * 0.03 }}
                onClick={() => openDrawing(index)}
                className="group text-left rounded-xl border border-border-subtle bg-bg-card/50
                  hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5
                  transition-all duration-300 overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="aspect-[4/3] relative overflow-hidden bg-white">
                  <Image
                    src={drawing.image}
                    alt={drawing.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
                    </div>
                  </div>
                  {/* Page number */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[10px] font-mono">
                    {drawing.id}/37
                  </div>
                </div>
                <div className="p-2.5">
                  <h3 className="font-[family-name:var(--font-display)] text-xs font-medium group-hover:text-accent transition-colors">
                    {drawing.title}
                  </h3>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Fullscreen Viewer Modal */}
      <AnimatePresence>
        {selectedDrawing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center"
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setSelectedIndex(null)} />

            {/* Navigation arrows */}
            <button
              onClick={() => navigate(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-white/10
                bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={() => navigate(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-white/10
                bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Viewer */}
            <motion.div
              key={selectedDrawing.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-[95vw] h-[92vh] rounded-2xl border border-border-subtle bg-bg-secondary overflow-hidden"
            >
              {/* Header */}
              <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-3 bg-gradient-to-b from-bg-secondary via-bg-secondary/80 to-transparent">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-[10px] font-mono">
                    {selectedDrawing.id}/37
                  </span>
                  <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold">
                    {selectedDrawing.title}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setZoom((z) => Math.max(0.3, z - 0.25))}
                    className="w-7 h-7 rounded-lg border border-border-subtle hover:border-accent/30 flex items-center justify-center text-xs transition-colors">−</button>
                  <span className="text-[10px] text-text-secondary min-w-[36px] text-center">{Math.round(zoom * 100)}%</span>
                  <button onClick={() => setZoom((z) => Math.min(5, z + 0.25))}
                    className="w-7 h-7 rounded-lg border border-border-subtle hover:border-accent/30 flex items-center justify-center text-xs transition-colors">+</button>
                  <button onClick={resetView}
                    className="px-2 h-7 rounded-lg border border-border-subtle hover:border-accent/30 text-[10px] transition-colors">Reset</button>
                  <div className="w-px h-5 bg-border-subtle mx-0.5" />
                  <button onClick={() => setSelectedIndex(null)}
                    className="w-7 h-7 rounded-lg border border-border-subtle hover:border-red-500/30 hover:text-red-400 flex items-center justify-center text-xs transition-colors">✕</button>
                </div>
              </div>

              {/* Canvas area */}
              <div
                className="w-full h-full overflow-hidden bg-white/5"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ cursor: isPanning ? "grabbing" : "grab" }}
              >
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transition: isPanning ? "none" : "transform 200ms ease",
                  }}
                >
                  <div className="relative" style={{ width: "90%", maxWidth: "1400px", aspectRatio: "1191/842" }}>
                    <Image
                      src={selectedDrawing.image}
                      alt={selectedDrawing.title}
                      fill
                      sizes="90vw"
                      className="object-contain"
                      quality={90}
                      priority
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
