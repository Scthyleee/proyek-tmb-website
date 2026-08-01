"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ParticleBackground } from "@/components/cinematic/ParticleBackground";

/* ─── Types ─── */
interface NetworkNode {
  id: string;
  label: string;
  type: "router" | "core-switch" | "access-switch" | "server" | "ap" | "pc" | "isp";
  x: number;
  y: number;
  details: {
    brand?: string;
    model?: string;
    ip?: string;
    vlan?: string;
    gateway?: string;
    price?: string;
    config?: string;
    note?: string;
  };
}

interface NetworkLink {
  from: string;
  to: string;
  label?: string;
  type?: "fiber" | "copper" | "wan";
}

/* ─── Topology Data from Cisco Packet Tracer ─── */

const nodes: NetworkNode[] = [
  // ISP
  { id: "isp", label: "ISP (Internet)", type: "isp", x: 600, y: 40, details: { brand: "Telkom Indonesia", model: "Fiber Optic IndiHome", ip: "Public IP (DHCP)", config: "PPPoE WAN Connection", note: "Bandwidth 100 Mbps" } },

  // Router
  { id: "router", label: "KECAMATAN-ROUTER", type: "router", x: 600, y: 130, details: { brand: "Cisco", model: "ISR4331", ip: "192.168.10.1", vlan: "VLAN 10 (Management)", gateway: "ISP DHCP", price: "Rp 45.000.000", config: "NAT Overload, DHCP Server (VLAN 20/30/50), Static Routes, ACL" } },

  // Core Switches
  { id: "core-sw1", label: "CORE-SW1", type: "core-switch", x: 450, y: 240, details: { brand: "Cisco", model: "Catalyst 3560-24PS", ip: "192.168.10.2", vlan: "VLAN 10/20/30/40/50/60", price: "Rp 25.000.000", config: "Layer 3, IP Routing, SVI all VLANs, Rapid-PVST, Trunk to all access switches" } },
  { id: "core-sw2", label: "CORE-SW2", type: "core-switch", x: 750, y: 240, details: { brand: "Cisco", model: "Catalyst 3560-24PS", ip: "192.168.10.3", vlan: "VLAN 10/20/30/40/50/60", price: "Rp 25.000.000", config: "Layer 3, IP Routing, Redundant Core, Stack Link Gi0/23" } },

  // Access Switches
  { id: "sw-kiri", label: "SW-KIRI", type: "access-switch", x: 120, y: 370, details: { brand: "Cisco", model: "Catalyst 2960-24TT", ip: "VLAN 10 Mgmt", vlan: "Fa0/1-20: VLAN 20, Fa0/21-24: VLAN 40", price: "Rp 8.500.000", config: "Zona Kiri: R.Kasi, R.Pera, R.Kesos, R.Peka, R.Trantib, T.Bermain Anak" } },
  { id: "sw-tengah", label: "SW-TENGAH", type: "access-switch", x: 340, y: 370, details: { brand: "Cisco", model: "Catalyst 2960-24TT", ip: "VLAN 10 Mgmt", vlan: "Fa0/1-20: VLAN 20, Fa0/21-24: VLAN 40", price: "Rp 8.500.000", config: "Zona Tengah: R.Rapat, Mushola, R.Pemerintahan, R.Umpeg" } },
  { id: "sw-kanan", label: "SW-KANAN", type: "access-switch", x: 560, y: 370, details: { brand: "Cisco", model: "Catalyst 2960-24TT", ip: "VLAN 10 Mgmt", vlan: "Fa0/1-20: VLAN 20, Fa0/21-24: VLAN 40", price: "Rp 8.500.000", config: "Zona Kanan: R.Sekcam, R.Camat" } },
  { id: "sw-aula", label: "SW-AULA", type: "access-switch", x: 780, y: 370, details: { brand: "Cisco", model: "Catalyst 2960-24TT", ip: "VLAN 10 Mgmt", vlan: "Fa0/1-12: VLAN 30, Fa0/13-24: VLAN 50", price: "Rp 8.500.000", config: "Zona Aula: Aula Kiri & Kanan, PC Presentasi" } },
  { id: "sw-tamu", label: "SW-TAMU", type: "access-switch", x: 960, y: 370, details: { brand: "Cisco", model: "Catalyst 2960-24TT", ip: "VLAN 10 Mgmt", vlan: "Fa0/1-12: VLAN 30, Fa0/13-24: VLAN 50", price: "Rp 8.500.000", config: "Zona Tamu: Resepsionis, Area Ruang Tamu" } },
  { id: "sw-server", label: "SW-SERVER", type: "access-switch", x: 1080, y: 240, details: { brand: "Cisco", model: "Catalyst 2960-24TT", ip: "VLAN 10 Mgmt", vlan: "Fa0/1-4: VLAN 10, Fa0/5: VLAN 40", price: "Rp 8.500.000", config: "Server Room: DC, File, DB, NVR" } },

  // Servers
  { id: "srv-dc", label: "SRV-DC", type: "server", x: 1020, y: 130, details: { brand: "Dell", model: "PowerEdge T340", ip: "192.168.10.10", vlan: "VLAN 10 (Management)", gateway: "192.168.10.2", price: "Rp 35.000.000", config: "Active Directory, DNS Server, DHCP Failover" } },
  { id: "srv-file", label: "SRV-FILE", type: "server", x: 1100, y: 130, details: { brand: "Dell", model: "PowerEdge T340", ip: "192.168.10.11", vlan: "VLAN 10 (Management)", gateway: "192.168.10.2", price: "Rp 30.000.000", config: "File Server, Shared Folders, Backup Storage" } },
  { id: "srv-db", label: "SRV-DB", type: "server", x: 1020, y: 60, details: { brand: "Dell", model: "PowerEdge T340", ip: "192.168.10.12", vlan: "VLAN 10 (Management)", gateway: "192.168.10.2", price: "Rp 30.000.000", config: "Database Server, MySQL/PostgreSQL" } },
  { id: "srv-nvr", label: "SRV-NVR", type: "server", x: 1100, y: 60, details: { brand: "Hikvision", model: "DS-7616NI-K2", ip: "192.168.40.10", vlan: "VLAN 40 (CCTV)", gateway: "192.168.40.1", price: "Rp 12.000.000", config: "Network Video Recorder, 16-ch CCTV Recording" } },

  // Access Points - Pegawai (zona kiri)
  { id: "ap-kasi", label: "AP R.Kasi", type: "ap", x: 40, y: 480, details: { brand: "Linksys", model: "WRT300N", ip: "192.168.20.10", vlan: "VLAN 20 (Pegawai)", price: "Rp 1.200.000", config: "SSID: Kecamatan-Pegawai, WPA2-PSK" } },
  { id: "ap-pera", label: "AP R.Pera", type: "ap", x: 110, y: 480, details: { brand: "Linksys", model: "WRT300N", ip: "192.168.20.11", vlan: "VLAN 20 (Pegawai)", price: "Rp 1.200.000", config: "SSID: Kecamatan-Pegawai, WPA2-PSK" } },
  { id: "ap-kesos", label: "AP R.Kesos", type: "ap", x: 180, y: 480, details: { brand: "Linksys", model: "WRT300N", ip: "192.168.20.12", vlan: "VLAN 20 (Pegawai)", price: "Rp 1.200.000", config: "SSID: Kecamatan-Pegawai, WPA2-PSK" } },
  // AP zona kiri lanjutan
  { id: "ap-peka", label: "AP R.Peka", type: "ap", x: 40, y: 540, details: { brand: "Linksys", model: "WRT300N", ip: "192.168.20.13", vlan: "VLAN 20 (Pegawai)", price: "Rp 1.200.000", config: "SSID: Kecamatan-Pegawai, WPA2-PSK" } },
  { id: "ap-trantib", label: "AP R.Trantib", type: "ap", x: 110, y: 540, details: { brand: "Linksys", model: "WRT300N", ip: "192.168.20.14", vlan: "VLAN 20 (Pegawai)", price: "Rp 1.200.000", config: "SSID: Kecamatan-Pegawai, WPA2-PSK" } },
  { id: "ap-bermain", label: "AP Bermain", type: "ap", x: 180, y: 540, details: { brand: "Linksys", model: "WRT300N", ip: "192.168.50.10", vlan: "VLAN 50 (Guest WiFi)", price: "Rp 1.200.000", config: "SSID: Kecamatan-Guest, WPA2-PSK" } },

  // AP zona tengah
  { id: "ap-rapat", label: "AP R.Rapat", type: "ap", x: 270, y: 480, details: { brand: "Linksys", model: "WRT300N", ip: "192.168.20.15", vlan: "VLAN 20 (Pegawai)", price: "Rp 1.200.000", config: "SSID: Kecamatan-Pegawai, WPA2-PSK" } },
  { id: "ap-mushola", label: "AP Mushola", type: "ap", x: 340, y: 480, details: { brand: "Linksys", model: "WRT300N", ip: "192.168.20.16", vlan: "VLAN 20 (Pegawai)", price: "Rp 1.200.000", config: "SSID: Kecamatan-Pegawai, WPA2-PSK" } },
  { id: "ap-pemerintahan", label: "AP R.Pemerintahan", type: "ap", x: 270, y: 540, details: { brand: "Linksys", model: "WRT300N", ip: "192.168.20.17", vlan: "VLAN 20 (Pegawai)", price: "Rp 1.200.000", config: "SSID: Kecamatan-Pegawai, WPA2-PSK" } },
  { id: "ap-umpeg", label: "AP R.Umpeg", type: "ap", x: 410, y: 480, details: { brand: "Linksys", model: "WRT300N", ip: "192.168.20.18", vlan: "VLAN 20 (Pegawai)", price: "Rp 1.200.000", config: "SSID: Kecamatan-Pegawai, WPA2-PSK" } },

  // AP zona kanan
  { id: "ap-sekcam", label: "AP R.Sekcam", type: "ap", x: 520, y: 480, details: { brand: "Linksys", model: "WRT300N", ip: "192.168.20.19", vlan: "VLAN 20 (Pegawai)", price: "Rp 1.200.000", config: "SSID: Kecamatan-Pegawai, WPA2-PSK" } },
  { id: "ap-camat", label: "AP R.Camat", type: "ap", x: 600, y: 480, details: { brand: "Linksys", model: "WRT300N", ip: "192.168.20.20", vlan: "VLAN 20 (Pegawai)", price: "Rp 1.200.000", config: "SSID: Kecamatan-Pegawai, WPA2-PSK" } },

  // AP zona aula
  { id: "ap-aula1", label: "AP Aula 1", type: "ap", x: 740, y: 480, details: { brand: "Linksys", model: "WRT300N", ip: "192.168.50.11", vlan: "VLAN 50 (Guest WiFi)", price: "Rp 1.200.000", config: "SSID: Kecamatan-Guest, WPA2-PSK" } },
  { id: "ap-aula2", label: "AP Aula 2", type: "ap", x: 820, y: 480, details: { brand: "Linksys", model: "WRT300N", ip: "192.168.50.12", vlan: "VLAN 50 (Guest WiFi)", price: "Rp 1.200.000", config: "SSID: Kecamatan-Guest, WPA2-PSK" } },

  // AP zona tamu
  { id: "ap-resepsionis", label: "AP Resepsionis", type: "ap", x: 920, y: 480, details: { brand: "Linksys", model: "WRT300N", ip: "192.168.50.13", vlan: "VLAN 50 (Guest WiFi)", price: "Rp 1.200.000", config: "SSID: Kecamatan-Guest, WPA2-PSK" } },
  { id: "ap-ruangtamu", label: "AP R.Tamu", type: "ap", x: 1000, y: 480, details: { brand: "Linksys", model: "WRT300N", ip: "192.168.50.14", vlan: "VLAN 50 (Guest WiFi)", price: "Rp 1.200.000", config: "SSID: Kecamatan-Guest, WPA2-PSK" } },

  // PCs — dari Pemerintahan
  { id: "pc-kasi", label: "PC Kasi", type: "pc", x: 60, y: 620, details: { note: "Komputer dari Pemerintahan", ip: "DHCP (192.168.20.x)", vlan: "VLAN 20 (Pegawai)" } },
  { id: "pc-pera", label: "PC Pera", type: "pc", x: 120, y: 620, details: { note: "Komputer dari Pemerintahan", ip: "DHCP (192.168.20.x)", vlan: "VLAN 20 (Pegawai)" } },
  { id: "pc-kesos", label: "PC Kesos", type: "pc", x: 180, y: 620, details: { note: "Komputer dari Pemerintahan", ip: "DHCP (192.168.20.x)", vlan: "VLAN 20 (Pegawai)" } },
  { id: "pc-peka", label: "PC Peka", type: "pc", x: 60, y: 670, details: { note: "Komputer dari Pemerintahan", ip: "DHCP (192.168.20.x)", vlan: "VLAN 20 (Pegawai)" } },
  { id: "pc-trantib", label: "PC Trantib", type: "pc", x: 140, y: 670, details: { note: "Komputer dari Pemerintahan", ip: "DHCP (192.168.20.x)", vlan: "VLAN 20 (Pegawai)" } },
  { id: "pc-rapat", label: "PC Rapat", type: "pc", x: 290, y: 620, details: { note: "Komputer dari Pemerintahan", ip: "DHCP (192.168.20.x)", vlan: "VLAN 20 (Pegawai)" } },
  { id: "pc-pemerintahan", label: "PC Pemerintahan", type: "pc", x: 360, y: 620, details: { note: "Komputer dari Pemerintahan", ip: "DHCP (192.168.20.x)", vlan: "VLAN 20 (Pegawai)" } },
  { id: "pc-umpeg", label: "PC Umpeg", type: "pc", x: 430, y: 620, details: { note: "Komputer dari Pemerintahan", ip: "DHCP (192.168.20.x)", vlan: "VLAN 20 (Pegawai)" } },
  { id: "pc-sekcam1", label: "PC Sekcam 1", type: "pc", x: 520, y: 620, details: { note: "Komputer dari Pemerintahan", ip: "DHCP (192.168.20.x)", vlan: "VLAN 20 (Pegawai)" } },
  { id: "pc-sekcam2", label: "PC Sekcam 2", type: "pc", x: 580, y: 620, details: { note: "Komputer dari Pemerintahan", ip: "DHCP (192.168.20.x)", vlan: "VLAN 20 (Pegawai)" } },
  { id: "pc-camat1", label: "PC Camat 1", type: "pc", x: 520, y: 670, details: { note: "Komputer dari Pemerintahan", ip: "DHCP (192.168.20.x)", vlan: "VLAN 20 (Pegawai)" } },
  { id: "pc-camat2", label: "PC Camat 2", type: "pc", x: 600, y: 670, details: { note: "Komputer dari Pemerintahan", ip: "DHCP (192.168.20.x)", vlan: "VLAN 20 (Pegawai)" } },
  { id: "pc-presentasi", label: "PC Presentasi", type: "pc", x: 780, y: 560, details: { note: "Komputer dari Pemerintahan", ip: "DHCP (192.168.30.x)", vlan: "VLAN 30 (Publik)" } },
  { id: "pc-registrasi", label: "PC Registrasi", type: "pc", x: 960, y: 560, details: { note: "Komputer dari Pemerintahan", ip: "DHCP (192.168.30.x)", vlan: "VLAN 30 (Publik)" } },
];

const links: NetworkLink[] = [
  // ISP → Router
  { from: "isp", to: "router", label: "WAN", type: "wan" },
  // Router → Core
  { from: "router", to: "core-sw1", label: "Gi0/0/1 → Gi0/24", type: "copper" },
  // Core Stack
  { from: "core-sw1", to: "core-sw2", label: "Stack Link Gi0/23", type: "copper" },
  // Core → Access (Fiber)
  { from: "core-sw1", to: "sw-kiri", label: "Fiber Gi0/1", type: "fiber" },
  { from: "core-sw1", to: "sw-tengah", label: "Fiber Gi0/2", type: "fiber" },
  { from: "core-sw1", to: "sw-kanan", label: "Fiber Gi0/3", type: "fiber" },
  { from: "core-sw1", to: "sw-aula", label: "Fiber Gi0/4", type: "fiber" },
  { from: "core-sw1", to: "sw-tamu", label: "Fiber Gi0/5", type: "fiber" },
  { from: "core-sw1", to: "sw-server", label: "Fiber Gi0/6", type: "fiber" },
  // Server Switch → Servers
  { from: "sw-server", to: "srv-dc", type: "copper" },
  { from: "sw-server", to: "srv-file", type: "copper" },
  { from: "sw-server", to: "srv-db", type: "copper" },
  { from: "sw-server", to: "srv-nvr", type: "copper" },
  // SW-KIRI → APs + PCs
  { from: "sw-kiri", to: "ap-kasi", type: "copper" },
  { from: "sw-kiri", to: "ap-pera", type: "copper" },
  { from: "sw-kiri", to: "ap-kesos", type: "copper" },
  { from: "sw-kiri", to: "ap-peka", type: "copper" },
  { from: "sw-kiri", to: "ap-trantib", type: "copper" },
  { from: "sw-kiri", to: "ap-bermain", type: "copper" },
  { from: "sw-kiri", to: "pc-kasi", type: "copper" },
  { from: "sw-kiri", to: "pc-pera", type: "copper" },
  { from: "sw-kiri", to: "pc-kesos", type: "copper" },
  { from: "sw-kiri", to: "pc-peka", type: "copper" },
  { from: "sw-kiri", to: "pc-trantib", type: "copper" },
  // SW-TENGAH → APs + PCs
  { from: "sw-tengah", to: "ap-rapat", type: "copper" },
  { from: "sw-tengah", to: "ap-mushola", type: "copper" },
  { from: "sw-tengah", to: "ap-pemerintahan", type: "copper" },
  { from: "sw-tengah", to: "ap-umpeg", type: "copper" },
  { from: "sw-tengah", to: "pc-rapat", type: "copper" },
  { from: "sw-tengah", to: "pc-pemerintahan", type: "copper" },
  { from: "sw-tengah", to: "pc-umpeg", type: "copper" },
  // SW-KANAN → APs + PCs
  { from: "sw-kanan", to: "ap-sekcam", type: "copper" },
  { from: "sw-kanan", to: "ap-camat", type: "copper" },
  { from: "sw-kanan", to: "pc-sekcam1", type: "copper" },
  { from: "sw-kanan", to: "pc-sekcam2", type: "copper" },
  { from: "sw-kanan", to: "pc-camat1", type: "copper" },
  { from: "sw-kanan", to: "pc-camat2", type: "copper" },
  // SW-AULA → APs + PC
  { from: "sw-aula", to: "ap-aula1", type: "copper" },
  { from: "sw-aula", to: "ap-aula2", type: "copper" },
  { from: "sw-aula", to: "pc-presentasi", type: "copper" },
  // SW-TAMU → APs + PC
  { from: "sw-tamu", to: "ap-resepsionis", type: "copper" },
  { from: "sw-tamu", to: "ap-ruangtamu", type: "copper" },
  { from: "sw-tamu", to: "pc-registrasi", type: "copper" },
];

/* ─── Visual Config ─── */
const nodeIcons: Record<string, { color: string; icon: string; size: number }> = {
  isp:            { color: "#f97316", icon: "🌐", size: 22 },
  router:         { color: "#ef4444", icon: "R",  size: 22 },
  "core-switch":  { color: "#3b82f6", icon: "CS", size: 20 },
  "access-switch":{ color: "#6366f1", icon: "AS", size: 16 },
  server:         { color: "#10b981", icon: "SV", size: 16 },
  ap:             { color: "#f59e0b", icon: "AP", size: 12 },
  pc:             { color: "#8b5cf6", icon: "PC", size: 10 },
};

/* ─── VLAN Data ─── */
const vlans = [
  { id: 10, name: "MANAGEMENT", subnet: "192.168.10.0/24", color: "#ef4444", desc: "Router, Core SW, Servers" },
  { id: 20, name: "PEGAWAI", subnet: "192.168.20.0/24", color: "#3b82f6", desc: "Staff PCs + AP pegawai" },
  { id: 30, name: "PUBLIK", subnet: "192.168.30.0/24", color: "#10b981", desc: "Registrasi, Aula, R.Tamu" },
  { id: 40, name: "CCTV", subnet: "192.168.40.0/24", color: "#f59e0b", desc: "NVR + port CCTV" },
  { id: 50, name: "GUEST_WIFI", subnet: "192.168.50.0/24", color: "#ec4899", desc: "AP publik / guest" },
  { id: 60, name: "VOICE", subnet: "Reserved", color: "#6b7280", desc: "Future IP phones" },
];

export default function TopologiPage() {
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [showVlans, setShowVlans] = useState(false);

  const getNode = (id: string) => nodes.find((n) => n.id === id);

  const isConnected = (nodeId: string) => {
    if (!hoveredNode && !selectedNode) return false;
    const activeId = hoveredNode || selectedNode?.id;
    return links.some(
      (l) =>
        (l.from === activeId && l.to === nodeId) ||
        (l.to === activeId && l.from === nodeId) ||
        nodeId === activeId
    );
  };

  const isLinkActive = (link: NetworkLink) => {
    if (!hoveredNode && !selectedNode) return false;
    const activeId = hoveredNode || selectedNode?.id;
    return link.from === activeId || link.to === activeId;
  };

  const getLinkColor = (link: NetworkLink, active: boolean) => {
    if (active) return "#00d4ff";
    switch (link.type) {
      case "wan": return "rgba(239,68,68,0.15)";
      case "fiber": return "rgba(99,102,241,0.12)";
      default: return "rgba(255,255,255,0.06)";
    }
  };

  return (
    <div className="relative">
      {/* Page Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ParticleBackground particleCount={50} showGrid showGlowOrb />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-xs text-accent tracking-[0.3em] uppercase font-medium">
            Network Infrastructure
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
            className="font-[family-name:var(--font-display)] text-4xl md:text-5xl lg:text-6xl font-bold mt-3">
            Topologi Jaringan
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="text-text-secondary mt-4 max-w-lg mx-auto">
            Diagram interaktif infrastruktur jaringan Kantor Kecamatan Pahandut — {nodes.length} perangkat, {vlans.length} VLAN
          </motion.p>
        </div>
      </section>

      {/* Interactive Topology */}
      <section className="py-16 md:py-24">
        <div className="section-container">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex flex-wrap gap-2">
              {Object.entries(nodeIcons).map(([type, { color }]) => {
                const count = nodes.filter(n => n.type === type).length;
                const label = type === "core-switch" ? "Core SW" : type === "access-switch" ? "Access SW" : type.toUpperCase();
                return (
                  <span key={type} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium border border-border-subtle bg-bg-card/50">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    {label} ({count})
                  </span>
                );
              })}
            </div>
            <button
              onClick={() => setShowVlans(!showVlans)}
              className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${showVlans
                ? "bg-accent/10 border-accent/30 text-accent"
                : "border-border-subtle text-text-secondary hover:border-accent/20"}`}
            >
              {showVlans ? "✕ Hide VLANs" : "⬡ Show VLANs"}
            </button>
          </div>

          {/* VLAN Table */}
          <AnimatePresence>
            {showVlans && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                  {vlans.map(v => (
                    <div key={v.id} className="p-3 rounded-xl border border-border-subtle bg-bg-card/50">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: v.color }} />
                        <span className="text-xs font-bold">VLAN {v.id}</span>
                      </div>
                      <p className="text-[10px] text-accent font-mono">{v.name}</p>
                      <p className="text-[10px] text-text-muted font-mono">{v.subnet}</p>
                      <p className="text-[10px] text-text-secondary mt-1">{v.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* SVG Diagram */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-border-subtle bg-bg-card/50 backdrop-blur-sm p-4 overflow-x-auto">
                <svg viewBox="0 0 1200 720" className="w-full min-w-[800px]" style={{ height: "auto" }}>
                  {/* Grid background */}
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,212,255,0.03)" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="1200" height="720" fill="url(#grid)" />

                  {/* Zone Labels */}
                  <text x="120" y="350" fontSize="9" fill="rgba(255,255,255,0.12)" fontWeight="bold" textAnchor="middle">ZONA KIRI</text>
                  <text x="340" y="350" fontSize="9" fill="rgba(255,255,255,0.12)" fontWeight="bold" textAnchor="middle">ZONA TENGAH</text>
                  <text x="560" y="350" fontSize="9" fill="rgba(255,255,255,0.12)" fontWeight="bold" textAnchor="middle">ZONA KANAN</text>
                  <text x="780" y="350" fontSize="9" fill="rgba(255,255,255,0.12)" fontWeight="bold" textAnchor="middle">ZONA AULA</text>
                  <text x="960" y="350" fontSize="9" fill="rgba(255,255,255,0.12)" fontWeight="bold" textAnchor="middle">ZONA TAMU</text>
                  <text x="1060" y="210" fontSize="9" fill="rgba(255,255,255,0.12)" fontWeight="bold" textAnchor="middle">SERVER ROOM</text>

                  {/* Links */}
                  {links.map((link, i) => {
                    const from = getNode(link.from);
                    const to = getNode(link.to);
                    if (!from || !to) return null;
                    const active = isLinkActive(link);
                    return (
                      <g key={i}>
                        <line
                          x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                          stroke={getLinkColor(link, active)}
                          strokeWidth={active ? 2 : link.type === "fiber" ? 1 : 0.5}
                          strokeDasharray={link.type === "fiber" && !active ? "6 3" : "none"}
                          className="transition-all duration-300"
                        />
                        {active && (
                          <circle r="2.5" fill="#00d4ff">
                            <animateMotion
                              dur="1.5s"
                              repeatCount="indefinite"
                              path={`M${from.x},${from.y} L${to.x},${to.y}`}
                            />
                          </circle>
                        )}
                        {link.label && active && (
                          <text
                            x={(from.x + to.x) / 2}
                            y={(from.y + to.y) / 2 - 6}
                            textAnchor="middle"
                            fontSize="7"
                            fill="#00d4ff"
                          >
                            {link.label}
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* Nodes */}
                  {nodes.map((node) => {
                    const config = nodeIcons[node.type];
                    const connected = isConnected(node.id);
                    const isSelected = selectedNode?.id === node.id;
                    const r = config.size;
                    return (
                      <g
                        key={node.id}
                        onClick={() => setSelectedNode(isSelected ? null : node)}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                        className="cursor-pointer"
                      >
                        {/* Pulse */}
                        {(connected || isSelected) && (
                          <circle cx={node.x} cy={node.y} r={r + 6} fill="none" stroke={config.color} strokeWidth="1" opacity={0.3}>
                            <animate attributeName="opacity" values="0.3;0.1;0.3" dur="1.5s" repeatCount="indefinite" />
                          </circle>
                        )}
                        {/* Node */}
                        <circle
                          cx={node.x} cy={node.y} r={r}
                          fill={isSelected ? config.color : `${config.color}18`}
                          stroke={config.color}
                          strokeWidth={isSelected ? 2 : 0.8}
                          className="transition-all duration-300"
                        />
                        {/* Icon */}
                        <text
                          x={node.x} y={node.y + 1}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize={r > 16 ? "9" : r > 12 ? "7" : "6"}
                          fontWeight="bold"
                          fill={isSelected ? "#fff" : config.color}
                        >
                          {config.icon}
                        </text>
                        {/* Label */}
                        <text
                          x={node.x} y={node.y + r + 10}
                          textAnchor="middle"
                          fontSize={r > 16 ? "8" : "6"}
                          fill={connected ? "#e8e8f0" : "rgba(255,255,255,0.3)"}
                          className="transition-all duration-300"
                        >
                          {node.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Detail Panel */}
            <div className="lg:col-span-1">
              <AnimatePresence mode="wait">
                {selectedNode ? (
                  <motion.div
                    key={selectedNode.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-5 rounded-2xl border border-border-subtle bg-bg-card/50 backdrop-blur-sm sticky top-24"
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                        style={{
                          backgroundColor: `${nodeIcons[selectedNode.type].color}22`,
                          color: nodeIcons[selectedNode.type].color,
                          border: `1px solid ${nodeIcons[selectedNode.type].color}44`,
                        }}
                      >
                        {nodeIcons[selectedNode.type].icon}
                      </div>
                      <div>
                        <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold">
                          {selectedNode.label}
                        </h3>
                        <p className="text-xs text-text-muted capitalize">{selectedNode.type.replace("-", " ")}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {selectedNode.details.brand && (
                        <div className="flex justify-between text-sm border-b border-border-subtle pb-2">
                          <span className="text-text-secondary">Brand</span>
                          <span className="font-medium">{selectedNode.details.brand}</span>
                        </div>
                      )}
                      {selectedNode.details.model && (
                        <div className="flex justify-between text-sm border-b border-border-subtle pb-2">
                          <span className="text-text-secondary">Model</span>
                          <span className="font-medium text-right text-xs">{selectedNode.details.model}</span>
                        </div>
                      )}
                      {selectedNode.details.ip && (
                        <div className="flex justify-between text-sm border-b border-border-subtle pb-2">
                          <span className="text-text-secondary">IP</span>
                          <span className="font-mono text-xs text-accent">{selectedNode.details.ip}</span>
                        </div>
                      )}
                      {selectedNode.details.vlan && (
                        <div className="flex justify-between text-sm border-b border-border-subtle pb-2">
                          <span className="text-text-secondary">VLAN</span>
                          <span className="font-mono text-xs text-right max-w-[140px]">{selectedNode.details.vlan}</span>
                        </div>
                      )}
                      {selectedNode.details.gateway && (
                        <div className="flex justify-between text-sm border-b border-border-subtle pb-2">
                          <span className="text-text-secondary">Gateway</span>
                          <span className="font-mono text-xs">{selectedNode.details.gateway}</span>
                        </div>
                      )}
                      {selectedNode.details.price && (
                        <div className="flex justify-between text-sm border-b border-border-subtle pb-2">
                          <span className="text-text-secondary">Harga</span>
                          <span className="font-medium text-emerald-400 text-xs">{selectedNode.details.price}</span>
                        </div>
                      )}
                      {selectedNode.details.config && (
                        <div className="text-sm pt-1">
                          <span className="text-text-secondary text-xs block mb-1">Konfigurasi</span>
                          <span className="text-xs leading-relaxed">{selectedNode.details.config}</span>
                        </div>
                      )}
                      {selectedNode.details.note && (
                        <div className="text-sm pt-1 px-3 py-2 rounded-lg bg-accent/5 border border-accent/10">
                          <span className="text-xs text-text-secondary">{selectedNode.details.note}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-5 rounded-2xl border border-border-subtle bg-bg-card/50 text-center py-16 sticky top-24"
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-text-muted mx-auto mb-3">
                      <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
                    </svg>
                    <p className="text-text-muted text-sm">
                      Klik node pada diagram untuk melihat detail perangkat
                    </p>
                    <div className="mt-4 text-[10px] text-text-muted">
                      <p>{nodes.length} perangkat • {links.length} koneksi</p>
                      <p>{vlans.length} VLAN segments</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
