"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStaggerFade } from "@/hooks/useStaggerFade";
import { ParticleBackground } from "@/components/cinematic/ParticleBackground";

import contentData from "../../data/content.json";

const galleryItems = contentData.galeri.map((item: any) => ({
  ...item,
  type: "photo" as const,
  aspect: "landscape" as const
}));

const categories = ["Semua", "Dokumentasi", "Lokasi", "Proses"];

export default function GaleriPage() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [selectedItem, setSelectedItem] = useState<typeof galleryItems[0] | null>(null);
  const gridRef = useStaggerFade({ stagger: 0.05 });

  const filtered = activeCategory === "Semua"
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

  const navigateItem = (direction: number) => {
    if (!selectedItem) return;
    const currentIdx = filtered.findIndex((item) => item.id === selectedItem.id);
    const nextIdx = (currentIdx + direction + filtered.length) % filtered.length;
    setSelectedItem(filtered[nextIdx]);
  };

  return (
    <div className="relative">
      {/* Page Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ParticleBackground particleCount={40} showGrid={false} showGlowOrb />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-xs text-accent tracking-[0.3em] uppercase font-medium">
            Gallery
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
            className="font-[family-name:var(--font-display)] text-4xl md:text-5xl lg:text-6xl font-bold mt-3">
            Galeri
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="text-text-secondary mt-4 max-w-lg mx-auto">
            Dokumentasi foto & video terbaik selama proyek berlangsung
          </motion.p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 md:py-24">
        <div className="section-container">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-medium tracking-wide uppercase transition-all duration-300 border
                  ${activeCategory === cat
                    ? "bg-accent/10 border-accent/30 text-accent"
                    : "bg-transparent border-border-subtle text-text-secondary hover:text-foreground hover:border-accent/20"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Masonry-like Grid */}
          <div ref={gridRef} className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {filtered.map((item) => (
              <motion.button
                key={item.id}
                layout
                onClick={() => setSelectedItem(item)}
                className={`group relative w-full block rounded-xl overflow-hidden border border-border-subtle bg-bg-tertiary
                  break-inside-avoid mb-4
                  hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5
                  transition-all duration-300`}
              >
                {/* Placeholder image */}
                <div
                  className={`relative w-full ${
                    item.aspect === "portrait" ? "aspect-[3/4]" : "aspect-[4/3]"
                  } bg-gradient-to-br from-bg-tertiary to-bg-secondary flex items-center justify-center`}
                >
                  {/* TODO: ganti dengan gambar asli */}
                  <div className="text-center p-4">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5"
                      className="text-text-muted/30 mx-auto mb-2 group-hover:text-accent/30 transition-colors duration-300">
                      {item.type === "photo" ? (
                        <>
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </>
                      ) : (
                        <>
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </>
                      )}
                    </svg>
                    <span className="text-[10px] text-text-muted/40">{item.title}</span>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="text-left">
                      <h4 className="text-sm font-semibold">{item.title}</h4>
                      <p className="text-xs text-text-secondary">{item.category}</p>
                    </div>
                  </div>

                  {/* Zoom icon */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center"
            onClick={() => setSelectedItem(null)}
          >
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md" />

            {/* Navigation */}
            <button
              onClick={(e) => { e.stopPropagation(); navigateItem(-1); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-white/10
                bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); navigateItem(1); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-white/10
                bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Close */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full border border-white/10
                bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              ✕
            </button>

            {/* Image */}
            <motion.div
              key={selectedItem.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative z-10 max-w-4xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* TODO: ganti dengan gambar asli */}
              <div className={`w-full ${
                selectedItem.aspect === "portrait" ? "aspect-[3/4] max-h-[80vh]" : "aspect-[16/10]"
              } rounded-2xl bg-bg-tertiary border border-border-subtle flex items-center justify-center mx-auto`}
                style={{ maxWidth: selectedItem.aspect === "portrait" ? "500px" : "100%" }}
              >
                <div className="text-center">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-text-muted/30 mx-auto mb-3">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                  </svg>
                  <p className="text-text-muted text-sm">{selectedItem.title}</p>
                  <p className="text-text-muted text-xs mt-1">{selectedItem.category}</p>
                </div>
              </div>

              {/* Caption */}
              <div className="text-center mt-4">
                <h3 className="text-sm font-semibold">{selectedItem.title}</h3>
                <p className="text-xs text-text-secondary">{selectedItem.category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
