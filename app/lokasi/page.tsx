"use client";

import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ParticleBackground } from "@/components/cinematic/ParticleBackground";

// TODO: ganti koordinat dan info lokasi asli
const locationInfo = {
  name: "Kantor Kecamatan Pahandut",
  address: "Jl. Tjilik Riwut, Pahandut, Kota Palangka Raya, Kalimantan Tengah",
  lat: -2.2045,
  lng: 113.9168,
  details: [
    { label: "Kecamatan", value: "Pahandut" },
    { label: "Kota", value: "Palangka Raya" },
    { label: "Provinsi", value: "Kalimantan Tengah" },
    { label: "Luas Bangunan", value: "± 600 m²" },
    { label: "Jumlah Lantai", value: "2 Lantai" },
    { label: "Fungsi", value: "Pelayanan Publik" },
  ],
};

// TODO: ganti dengan foto lokasi asli
const locationPhotos = [
  { title: "Tampak Depan", desc: "Fasad utama gedung kantor kecamatan" },
  { title: "Area Parkir", desc: "Area parkir kendaraan pengunjung" },
  { title: "Ruang Pelayanan", desc: "Counter pelayanan publik utama" },
  { title: "Lingkungan Sekitar", desc: "Kondisi lingkungan di sekitar lokasi" },
];

export default function LokasiPage() {
  const mapRef = useScrollReveal({ direction: "up", duration: 0.8 });
  const infoRef = useScrollReveal({ direction: "right", delay: 0.2 });

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
            Location
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-[family-name:var(--font-display)] text-4xl md:text-5xl lg:text-6xl font-bold mt-3"
          >
            Lokasi Proyek
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="w-16 h-px bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mt-6"
          />
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 md:py-28">
        <div className="section-container">
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Map */}
            <div ref={mapRef} className="lg:col-span-3">
              <div className="rounded-2xl overflow-hidden border border-border-subtle bg-bg-card">
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${locationInfo.lng - 0.01}%2C${locationInfo.lat - 0.005}%2C${locationInfo.lng + 0.01}%2C${locationInfo.lat + 0.005}&layer=mapnik&marker=${locationInfo.lat}%2C${locationInfo.lng}`}
                  width="100%"
                  height="450"
                  className="border-0 w-full"
                  loading="lazy"
                  title="Lokasi Kantor Kecamatan Pahandut"
                />
                <div className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{locationInfo.name}</p>
                    <p className="text-xs text-text-secondary">{locationInfo.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Panel */}
            <div ref={infoRef} className="lg:col-span-2">
              <div className="p-6 rounded-2xl border border-border-subtle bg-bg-card/50 backdrop-blur-sm">
                <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-wider uppercase text-accent mb-6">
                  Detail Lokasi
                </h3>
                <div className="space-y-4">
                  {locationInfo.details.map((detail, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0"
                    >
                      <span className="text-text-secondary text-sm">{detail.label}</span>
                      <span className="text-sm font-medium">{detail.value}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick stats */}
              <div className="mt-4 p-4 rounded-2xl border border-accent/10 bg-accent/5">
                <div className="flex items-center gap-2 mb-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span className="text-xs text-accent font-medium tracking-wide uppercase">Koordinat GPS</span>
                </div>
                <p className="text-sm font-mono text-text-secondary">
                  {locationInfo.lat}°S, {locationInfo.lng}°E
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Photos */}
      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-bg-secondary/30 to-background pointer-events-none" />
        <div className="section-container relative z-10">
          <div className="text-center mb-12">
            <span className="text-xs text-accent-secondary tracking-[0.3em] uppercase font-medium">
              Site Photos
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold mt-3">
              Foto Lokasi
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {locationPhotos.map((photo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-border-subtle bg-bg-tertiary"
              >
                {/* TODO: ganti dengan foto asli */}
                <div className="absolute inset-0 bg-gradient-to-br from-bg-tertiary to-bg-secondary flex items-center justify-center">
                  <div className="text-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted mx-auto mb-2">
                      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <p className="text-xs text-text-muted">Foto {photo.title}</p>
                  </div>
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div>
                    <h4 className="text-sm font-semibold">{photo.title}</h4>
                    <p className="text-xs text-text-secondary">{photo.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
