"use client";

import { motion } from "framer-motion";
import { useStaggerFade } from "@/hooks/useStaggerFade";
import { ParticleBackground } from "@/components/cinematic/ParticleBackground";

// Data anggota kelompok 11 TMB Batch 2
const teamMembers = [
  {
    name: "Juan Alivio Ramadhan",
    nim: "NIM. 2330105010042",
    role: "Ketua",
    speciality: "Project Manager & Koordinator Tim",
    desc: "Memimpin dan mengkoordinasikan seluruh anggota tim dalam pelaksanaan proyek DED dan infrastruktur TI Kantor Kecamatan Pahandut.",
    color: "cyan",
  },
  {
    name: "Christian Jonathan",
    nim: "NIM. 2330105010021",
    role: "Sekretaris",
    speciality: "Administrasi & Dokumentasi",
    desc: "Mengelola administrasi, notulensi rapat, surat-menyurat, serta koordinasi jadwal kegiatan proyek bersama pihak mitra.",
    color: "violet",
  },
  {
    name: "Ahmad Aldi Pratama",
    nim: "NIM. 2330205010083",
    role: "Bendahara",
    speciality: "Keuangan & Rencana Anggaran Biaya",
    desc: "Menyusun dan mengelola Rencana Anggaran Biaya (RAB) proyek, mencakup biaya bangunan dan infrastruktur server & jaringan.",
    color: "emerald",
  },
  {
    name: "Armey Kurniawan Tama",
    nim: "NIM. 2330205010067",
    role: "Anggota",
    speciality: "Desain Arsitektur & Gambar Teknis",
    desc: "Merancang desain arsitektur bangunan kantor kecamatan dan menghasilkan gambar kerja DED secara menyeluruh menggunakan AutoCAD.",
    color: "amber",
  },
  {
    name: "Joy Ronaldo Nainggolan",
    nim: "NIM. 2330205010068",
    role: "Anggota",
    speciality: "Struktur Bangunan & Modeling 3D",
    desc: "Merancang sistem struktur bangunan dan membuat model 3D Kantor Kecamatan Pahandut menggunakan SketchUp.",
    color: "rose",
  },
  {
    name: "Juan Adila Sihite",
    nim: "NIM. 2330305010097",
    role: "Dokumentasi",
    speciality: "Pengembangan Website & Perancangan Jaringan Server",
    desc: "Membangun website portofolio digital interaktif proyek serta merancang topologi jaringan dan infrastruktur server mandiri Kantor Kecamatan Pahandut.",
    color: "blue",
  },
];

const colorMap: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  cyan: { border: "border-cyan-500/30", bg: "bg-cyan-500/10", text: "text-cyan-400", glow: "shadow-cyan-500/20" },
  violet: { border: "border-violet-500/30", bg: "bg-violet-500/10", text: "text-violet-400", glow: "shadow-violet-500/20" },
  emerald: { border: "border-emerald-500/30", bg: "bg-emerald-500/10", text: "text-emerald-400", glow: "shadow-emerald-500/20" },
  amber: { border: "border-amber-500/30", bg: "bg-amber-500/10", text: "text-amber-400", glow: "shadow-amber-500/20" },
  rose: { border: "border-rose-500/30", bg: "bg-rose-500/10", text: "text-rose-400", glow: "shadow-rose-500/20" },
  blue: { border: "border-blue-500/30", bg: "bg-blue-500/10", text: "text-blue-400", glow: "shadow-blue-500/20" },
};

export default function TimPage() {
  const gridRef = useStaggerFade({ stagger: 0.1, distance: 40 });

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
            Our Team
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-[family-name:var(--font-display)] text-4xl md:text-5xl lg:text-6xl font-bold mt-3"
          >
            Tim Kami
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-text-secondary mt-4 max-w-md mx-auto"
          >
            6 anggota dengan keahlian berbeda, bersatu dalam satu misi.
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="w-16 h-px bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mt-6"
          />
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20 md:py-28">
        <div className="section-container">
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-5xl mx-auto"
          >
            {teamMembers.map((member, i) => {
              const colors = colorMap[member.color] || colorMap.cyan;
              return (
                <div
                  key={i}
                  className={`group relative p-6 rounded-2xl border ${colors.border} bg-bg-card/50 backdrop-blur-sm
                    transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                    hover:scale-[1.03] hover:shadow-xl hover:${colors.glow}
                    hover:bg-bg-card`}
                >
                  {/* Hover glow overlay */}
                  <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${colors.bg} pointer-events-none`} />

                  {/* Avatar placeholder */}
                  <div className="relative mb-5">
                    <div
                      className={`w-16 h-16 rounded-2xl ${colors.bg} border ${colors.border}
                        flex items-center justify-center transition-all duration-500
                        group-hover:shadow-lg group-hover:${colors.glow}`}
                    >
                      <span className="font-[family-name:var(--font-display)] text-xl font-bold opacity-60">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    {/* Role badge */}
                    <div className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-md ${colors.bg} border ${colors.border}`}>
                      <span className={`text-[10px] font-medium tracking-wide ${colors.text}`}>
                        {member.role}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="relative">
                    <h3 className="font-[family-name:var(--font-display)] text-base font-semibold mb-0.5">
                      {member.name}
                    </h3>
                    <p className="text-text-muted text-xs mb-3 font-mono">
                      {member.nim}
                    </p>
                    <p className={`text-xs font-medium ${colors.text} mb-2`}>
                      {member.speciality}
                    </p>
                    <p className="text-text-secondary text-xs leading-relaxed">
                      {member.desc}
                    </p>
                  </div>

                  {/* Bottom accent line */}
                  <div className={`absolute bottom-0 left-6 right-6 h-px ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
