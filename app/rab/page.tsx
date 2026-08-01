"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ParticleBackground } from "@/components/cinematic/ParticleBackground";
import rabRawData from "./rab-data.json";

/* ─── Types ─── */
interface RekapItem { no: string; name: string; amount: number | null; }
interface RabDetailItem { type: string; no?: string; name: string; code?: string; volume?: number | null; unit?: string; unit_price?: number | null; total_price?: number | null; category?: string; }
interface RincianItem { type: string; no?: string; name: string; code?: string; unit?: string; spec?: string; category?: string; }

const rekap = rabRawData.rekapitulasi;
const rabDetail = rabRawData.rabDetail;
const rincian = rabRawData.rincian;

/* ─── Formatters ─── */
function formatCurrency(n: number | null | undefined): string {
  if (n == null || isNaN(n)) return "-";
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

function formatNumber(n: number | null | undefined): string {
  if (n == null || isNaN(n)) return "-";
  return n.toLocaleString("id-ID", { maximumFractionDigits: 2 });
}

/* ─── Animated Counter ─── */
function AnimatedTotal({ total }: { total: number }) {
  const [val, setVal] = useState(0);
  const animRef = useRef(0);
  useEffect(() => {
    cancelAnimationFrame(animRef.current);
    const start = performance.now();
    const startVal = 0;
    const dur = 2000;
    const animate = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(startVal + (total - startVal) * eased));
      if (p < 1) animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [total]);
  return <span>{formatCurrency(val)}</span>;
}

/* ─── Tab IDs ─── */
type TabId = "rekap" | "detail" | "rincian";

export default function RABPage() {
  const [activeTab, setActiveTab] = useState<TabId>("rekap");
  const [search, setSearch] = useState("");

  const tabs: { id: TabId; label: string; count: number }[] = [
    { id: "rekap", label: "Rekapitulasi", count: rekap.items.length },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { id: "detail", label: "RAB Detail", count: rabDetail.items.filter((i: any) => i.type === "item").length },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { id: "rincian", label: "Rincian Pekerjaan", count: rincian.items.filter((i: any) => i.type === "item").length },
  ];

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ParticleBackground particleCount={35} showGrid={false} showGlowOrb />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-xs text-accent tracking-[0.3em] uppercase font-medium">Budget</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
            className="font-[family-name:var(--font-display)] text-4xl md:text-5xl lg:text-6xl font-bold mt-3">
            Rencana Anggaran Biaya
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="text-text-secondary mt-4 max-w-lg mx-auto">
            Rincian biaya pembangunan & infrastruktur server Kantor Kecamatan Pahandut
          </motion.p>
          {/* Grand Total */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2 }}
            className="mt-6 inline-block px-6 py-3 rounded-2xl border border-accent/20 bg-accent/5 backdrop-blur-sm">
            <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1">Grand Total</p>
            <p className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold gradient-text">
              <AnimatedTotal total={rekap.total_rounded ?? 0} />
            </p>
            {rekap.luas_bangunan && (
              <p className="text-[10px] text-text-muted mt-1">
                Luas {formatNumber(rekap.luas_bangunan)} m² &middot; {formatCurrency(rekap.biaya_per_m2)}/m²
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Security Notice + Search */}
      <section className="py-4">
        <div className="section-container flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-400 text-xs font-medium">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Dokumen Rahasia — Hanya Dapat Dilihat
          </div>
          <div className="relative">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari pekerjaan..."
              className="pl-9 pr-4 py-2 w-64 rounded-xl bg-bg-card/80 border border-border-subtle text-xs
                focus:outline-none focus:border-accent/30 placeholder:text-text-muted transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="pb-16 md:pb-24">
        <div className="section-container">
          <div className="flex gap-1 p-1 rounded-xl bg-bg-card/50 border border-border-subtle w-fit mx-auto mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-2
                  ${activeTab === tab.id
                    ? "bg-accent/10 text-accent border border-accent/20"
                    : "text-text-secondary hover:text-foreground"
                  }`}
              >
                {tab.label}
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  activeTab === tab.id ? "bg-accent/20" : "bg-bg-tertiary"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* TAB: Rekapitulasi */}
          {activeTab === "rekap" && <RekapTable items={rekap.items as RekapItem[]} search={search} rekap={rekap} />}

          {/* TAB: RAB Detail */}
          {activeTab === "detail" && <DetailTable items={rabDetail.items as RabDetailItem[]} search={search} />}

          {/* TAB: Rincian */}
          {activeTab === "rincian" && <RincianTable items={rincian.items as RincianItem[]} search={search} />}
        </div>
      </section>
    </div>
  );
}

/* ─── Rekapitulasi Table ─── */
function RekapTable({ items, search, rekap }: { items: RekapItem[]; search: string; rekap: typeof rabRawData.rekapitulasi }) {
  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((i) => i.name.toLowerCase().includes(q));
  }, [items, search]);

  return (
    <div className="rounded-2xl border border-border-subtle overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-bg-tertiary/50 border-b border-border-subtle">
              <th className="text-left py-3 px-4 font-semibold text-text-secondary w-16">No</th>
              <th className="text-left py-3 px-4 font-semibold text-text-secondary">Uraian Pekerjaan</th>
              <th className="text-right py-3 px-4 font-semibold text-text-secondary w-48">Jumlah Harga (Rp)</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-border-subtle/50 hover:bg-accent/3 transition-colors"
              >
                <td className="py-3 px-4 text-accent font-semibold">{item.no}</td>
                <td className="py-3 px-4">{item.name}</td>
                <td className="py-3 px-4 text-right font-mono text-accent">{formatCurrency(item.amount)}</td>
              </motion.tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-bg-tertiary/30 border-t-2 border-accent/20">
              <td colSpan={2} className="py-3 px-4 font-semibold text-right">TOTAL JUMLAH HARGA</td>
              <td className="py-3 px-4 text-right font-mono font-bold text-accent">{formatCurrency(rekap.subtotal)}</td>
            </tr>
            <tr className="bg-bg-tertiary/20">
              <td colSpan={2} className="py-2 px-4 text-right text-text-secondary">PPN {rekap.ppn_percent}%</td>
              <td className="py-2 px-4 text-right font-mono text-text-secondary">{formatCurrency(rekap.ppn_amount)}</td>
            </tr>
            <tr className="bg-accent/5 border-t border-accent/20">
              <td colSpan={2} className="py-4 px-4 font-bold text-right">GRAND TOTAL (DIBULATKAN)</td>
              <td className="py-4 px-4 text-right">
                <span className="font-[family-name:var(--font-display)] text-lg font-bold gradient-text">
                  {formatCurrency(rekap.total_rounded)}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      {rekap.terbilang && (
        <div className="px-4 py-3 bg-bg-tertiary/30 border-t border-border-subtle">
          <p className="text-[10px] text-text-muted italic">{rekap.terbilang}</p>
        </div>
      )}
    </div>
  );
}

/* ─── RAB Detail Table ─── */
function DetailTable({ items, search }: { items: RabDetailItem[]; search: string }) {
  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((i) =>
      i.name?.toLowerCase().includes(q) || i.category?.toLowerCase().includes(q)
    );
  }, [items, search]);

  return (
    <div className="rounded-2xl border border-border-subtle overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-bg-tertiary/50 border-b border-border-subtle">
              <th className="text-left py-3 px-3 font-semibold text-text-secondary w-20">No</th>
              <th className="text-left py-3 px-3 font-semibold text-text-secondary">Uraian Pekerjaan</th>
              <th className="text-left py-3 px-3 font-semibold text-text-secondary w-24">Kode</th>
              <th className="text-right py-3 px-3 font-semibold text-text-secondary w-20">Volume</th>
              <th className="text-left py-3 px-3 font-semibold text-text-secondary w-16">Satuan</th>
              <th className="text-right py-3 px-3 font-semibold text-text-secondary w-32">Harga Satuan</th>
              <th className="text-right py-3 px-3 font-semibold text-text-secondary w-36">Jumlah Harga</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => {
              if (item.type === "category") {
                return (
                  <tr key={`cat-${i}`} className="bg-accent/5 border-y border-accent/10">
                    <td className="py-3 px-3 font-bold text-accent">{item.no}</td>
                    <td colSpan={6} className="py-3 px-3 font-bold uppercase">{item.name}</td>
                  </tr>
                );
              }
              if (item.type === "subcategory") {
                return (
                  <tr key={`sub-${i}`} className="bg-bg-tertiary/20">
                    <td className="py-2 px-3 font-semibold text-text-secondary">{item.no}</td>
                    <td colSpan={6} className="py-2 px-3 font-semibold text-text-secondary">{item.name}</td>
                  </tr>
                );
              }
              if (item.type === "total") {
                return (
                  <tr key={`tot-${i}`} className="bg-bg-tertiary/30 border-t border-accent/10">
                    <td colSpan={6} className="py-3 px-3 text-right font-semibold">{item.name}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-accent">{formatCurrency(item.total_price)}</td>
                  </tr>
                );
              }
              return (
                <tr key={`item-${i}`} className="border-b border-border-subtle/30 hover:bg-accent/3 transition-colors">
                  <td className="py-2 px-3 text-text-muted">{item.no}</td>
                  <td className="py-2 px-3">{item.name}</td>
                  <td className="py-2 px-3 font-mono text-[10px] text-text-muted">{item.code || ""}</td>
                  <td className="py-2 px-3 text-right font-mono">{formatNumber(item.volume)}</td>
                  <td className="py-2 px-3 text-text-muted">{item.unit || ""}</td>
                  <td className="py-2 px-3 text-right font-mono text-text-secondary">{formatCurrency(item.unit_price)}</td>
                  <td className="py-2 px-3 text-right font-mono text-accent">{formatCurrency(item.total_price)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Rincian Table ─── */
function RincianTable({ items, search }: { items: RincianItem[]; search: string }) {
  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((i) =>
      i.name?.toLowerCase().includes(q) || i.category?.toLowerCase().includes(q) || i.spec?.toLowerCase().includes(q)
    );
  }, [items, search]);

  return (
    <div className="rounded-2xl border border-border-subtle overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-bg-tertiary/50 border-b border-border-subtle">
              <th className="text-left py-3 px-3 font-semibold text-text-secondary w-20">No</th>
              <th className="text-left py-3 px-3 font-semibold text-text-secondary">Uraian Pekerjaan</th>
              <th className="text-left py-3 px-3 font-semibold text-text-secondary w-28">Kode Analisa</th>
              <th className="text-left py-3 px-3 font-semibold text-text-secondary w-20">Satuan</th>
              <th className="text-left py-3 px-3 font-semibold text-text-secondary w-52">Spesifikasi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => {
              if (item.type === "category") {
                return (
                  <tr key={`cat-${i}`} className="bg-accent/5 border-y border-accent/10">
                    <td className="py-3 px-3 font-bold text-accent">{item.no}</td>
                    <td colSpan={4} className="py-3 px-3 font-bold uppercase">{item.name}</td>
                  </tr>
                );
              }
              if (item.type === "subcategory") {
                return (
                  <tr key={`sub-${i}`} className="bg-bg-tertiary/20">
                    <td className="py-2 px-3 font-semibold text-text-secondary">{item.no}</td>
                    <td colSpan={4} className="py-2 px-3 font-semibold text-text-secondary">{item.name}</td>
                  </tr>
                );
              }
              return (
                <tr key={`item-${i}`} className="border-b border-border-subtle/30 hover:bg-accent/3 transition-colors">
                  <td className="py-2 px-3 text-text-muted">{item.no}</td>
                  <td className="py-2 px-3">{item.name}</td>
                  <td className="py-2 px-3 font-mono text-[10px] text-text-muted">{item.code || ""}</td>
                  <td className="py-2 px-3 text-text-muted">{item.unit || ""}</td>
                  <td className="py-2 px-3 text-text-secondary text-[10px]">{item.spec || ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
