"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ParticleBackground } from "@/components/cinematic/ParticleBackground";

// TODO: ganti dengan data topologi asli
interface NetworkNode {
  id: string;
  label: string;
  type: "router" | "switch" | "server" | "ap" | "pc" | "printer" | "firewall";
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
  };
}

interface NetworkLink {
  from: string;
  to: string;
  label?: string;
}

const nodes: NetworkNode[] = [
  { id: "isp", label: "ISP", type: "router", x: 400, y: 50, details: { brand: "Telkom", model: "Fiber Optic", ip: "Public IP", config: "PPPoE Connection" } },
  { id: "firewall", label: "Firewall", type: "firewall", x: 400, y: 150, details: { brand: "FortiGate", model: "FortiGate 60F", ip: "192.168.1.1", config: "UTM, IPS, Web Filter" } },
  { id: "core-sw", label: "Core Switch", type: "switch", x: 400, y: 260, details: { brand: "Cisco", model: "Catalyst 2960-X", ip: "192.168.1.2", vlan: "VLAN 1 (Management)", price: "Rp 15.000.000" } },
  { id: "server", label: "Server", type: "server", x: 600, y: 260, details: { brand: "Dell", model: "PowerEdge T340", ip: "192.168.10.10", vlan: "VLAN 10 (Server)", price: "Rp 35.000.000", config: "AD, DNS, DHCP, File Server" } },
  { id: "sw-lt1", label: "Switch Lt.1", type: "switch", x: 250, y: 380, details: { brand: "Cisco", model: "Catalyst 2960-L", ip: "192.168.1.3", vlan: "VLAN 20 (Lantai 1)", price: "Rp 8.000.000" } },
  { id: "sw-lt2", label: "Switch Lt.2", type: "switch", x: 550, y: 380, details: { brand: "Cisco", model: "Catalyst 2960-L", ip: "192.168.1.4", vlan: "VLAN 30 (Lantai 2)", price: "Rp 8.000.000" } },
  { id: "ap1", label: "AP Lt.1", type: "ap", x: 120, y: 480, details: { brand: "Ubiquiti", model: "UniFi AP AC Pro", ip: "192.168.1.11", vlan: "VLAN 40 (WiFi)", price: "Rp 2.500.000" } },
  { id: "ap2", label: "AP Lt.2", type: "ap", x: 420, y: 480, details: { brand: "Ubiquiti", model: "UniFi AP AC Pro", ip: "192.168.1.12", vlan: "VLAN 40 (WiFi)", price: "Rp 2.500.000" } },
  { id: "pc1", label: "PC Pelayanan", type: "pc", x: 180, y: 560, details: { brand: "Lenovo", model: "ThinkCentre M720", ip: "DHCP (192.168.20.x)", vlan: "VLAN 20", price: "Rp 8.000.000" } },
  { id: "pc2", label: "PC Admin", type: "pc", x: 320, y: 560, details: { brand: "Lenovo", model: "ThinkCentre M720", ip: "DHCP (192.168.20.x)", vlan: "VLAN 20", price: "Rp 8.000.000" } },
  { id: "pc3", label: "PC Lt.2", type: "pc", x: 550, y: 560, details: { brand: "Lenovo", model: "ThinkCentre M720", ip: "DHCP (192.168.30.x)", vlan: "VLAN 30", price: "Rp 8.000.000" } },
  { id: "printer", label: "Printer", type: "printer", x: 680, y: 480, details: { brand: "HP", model: "LaserJet Pro M428", ip: "192.168.20.50", vlan: "VLAN 20", price: "Rp 5.500.000" } },
];

const links: NetworkLink[] = [
  { from: "isp", to: "firewall", label: "WAN" },
  { from: "firewall", to: "core-sw", label: "Trunk" },
  { from: "core-sw", to: "server", label: "VLAN 10" },
  { from: "core-sw", to: "sw-lt1", label: "Trunk" },
  { from: "core-sw", to: "sw-lt2", label: "Trunk" },
  { from: "sw-lt1", to: "ap1" },
  { from: "sw-lt1", to: "pc1" },
  { from: "sw-lt1", to: "pc2" },
  { from: "sw-lt2", to: "ap2" },
  { from: "sw-lt2", to: "pc3" },
  { from: "sw-lt2", to: "printer" },
];

const nodeIcons: Record<string, { color: string; icon: string }> = {
  router: { color: "#ef4444", icon: "R" },
  switch: { color: "#3b82f6", icon: "S" },
  server: { color: "#10b981", icon: "SV" },
  ap: { color: "#f59e0b", icon: "AP" },
  pc: { color: "#8b5cf6", icon: "PC" },
  printer: { color: "#ec4899", icon: "PR" },
  firewall: { color: "#f97316", icon: "FW" },
};

export default function TopologiPage() {
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

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
            Network
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
            className="font-[family-name:var(--font-display)] text-4xl md:text-5xl lg:text-6xl font-bold mt-3">
            Topologi Jaringan
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="text-text-secondary mt-4 max-w-lg mx-auto">
            Diagram interaktif infrastruktur jaringan TI — klik node untuk detail
          </motion.p>
        </div>
      </section>

      {/* Interactive Topology */}
      <section className="py-16 md:py-24">
        <div className="section-container">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* SVG Diagram */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-border-subtle bg-bg-card/50 backdrop-blur-sm p-4 overflow-x-auto">
                <svg viewBox="0 0 800 620" className="w-full min-w-[600px]" style={{ height: "auto" }}>
                  {/* Grid background */}
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,212,255,0.03)" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="800" height="620" fill="url(#grid)" />

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
                          stroke={active ? "#00d4ff" : "rgba(255,255,255,0.08)"}
                          strokeWidth={active ? 2 : 1}
                          strokeDasharray={active ? "none" : "4 4"}
                          className="transition-all duration-300"
                        />
                        {/* Data flow animation dots */}
                        {active && (
                          <circle r="3" fill="#00d4ff">
                            <animateMotion
                              dur="2s"
                              repeatCount="indefinite"
                              path={`M${from.x},${from.y} L${to.x},${to.y}`}
                            />
                          </circle>
                        )}
                        {/* Link label */}
                        {link.label && (
                          <text
                            x={(from.x + to.x) / 2}
                            y={(from.y + to.y) / 2 - 8}
                            textAnchor="middle"
                            fontSize="9"
                            fill={active ? "#00d4ff" : "rgba(255,255,255,0.2)"}
                            className="transition-all duration-300"
                          >
                            {link.label}
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* Nodes */}
                  {nodes.map((node) => {
                    const { color, icon } = nodeIcons[node.type];
                    const connected = isConnected(node.id);
                    const isSelected = selectedNode?.id === node.id;
                    return (
                      <g
                        key={node.id}
                        onClick={() => setSelectedNode(isSelected ? null : node)}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                        className="cursor-pointer"
                      >
                        {/* Pulse ring */}
                        <circle cx={node.x} cy={node.y} r="22" fill="none" stroke={color} strokeWidth="1" opacity={0.15}>
                          <animate attributeName="r" values="22;28;22" dur="3s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.15;0.05;0.15" dur="3s" repeatCount="indefinite" />
                        </circle>
                        {/* Glow */}
                        {(connected || isSelected) && (
                          <circle cx={node.x} cy={node.y} r="26" fill="none" stroke={color} strokeWidth="1.5" opacity={0.4}>
                            <animate attributeName="opacity" values="0.4;0.2;0.4" dur="1.5s" repeatCount="indefinite" />
                          </circle>
                        )}
                        {/* Node circle */}
                        <circle
                          cx={node.x} cy={node.y} r="18"
                          fill={isSelected ? color : `${color}22`}
                          stroke={color}
                          strokeWidth={isSelected ? 2 : 1}
                          className="transition-all duration-300"
                        />
                        {/* Icon text */}
                        <text
                          x={node.x} y={node.y + 1}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize="9"
                          fontWeight="bold"
                          fill={isSelected ? "#fff" : color}
                          fontFamily="var(--font-display)"
                        >
                          {icon}
                        </text>
                        {/* Label */}
                        <text
                          x={node.x} y={node.y + 32}
                          textAnchor="middle"
                          fontSize="10"
                          fill={connected ? "#e8e8f0" : "rgba(255,255,255,0.4)"}
                          fontFamily="var(--font-body)"
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
                        <p className="text-xs text-text-muted capitalize">{selectedNode.type}</p>
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
                          <span className="font-mono text-xs">{selectedNode.details.vlan}</span>
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
