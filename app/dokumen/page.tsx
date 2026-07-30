"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ParticleBackground } from "@/components/cinematic/ParticleBackground";

import contentData from "../../data/content.json";

const documents = contentData.dokumen;

export default function DokumenPage() {
  return (
    <Suspense fallback={null}>
      <DokumenContent />
    </Suspense>
  );
}

function DokumenContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(documents[0].id);
  const activeDoc = documents.find((d) => d.id === activeTab)!;
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (tabParam && documents.some((d) => d.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Prevent right-click on iframe overlay to block "Save As"
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.pdf-viewer-container')) {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  // Build secure PDF URL — disable toolbar, navpanes, download
  const getSecurePdfUrl = (url: string | null) => {
    if (!url) return null;
    // Add parameters to disable PDF viewer toolbar and prevent download
    const separator = url.includes('?') ? '&' : '#';
    return `${url}${separator}toolbar=0&navpanes=0&scrollbar=1&view=FitH`;
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
            Documents
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
            className="font-[family-name:var(--font-display)] text-4xl md:text-5xl lg:text-6xl font-bold mt-3">
            Proposal & Laporan
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="text-text-secondary mt-4 max-w-lg mx-auto">
            Lihat dokumen proyek langsung di browser — tanpa perlu download
          </motion.p>
        </div>
      </section>

      {/* Document Viewer */}
      <section className="py-16 md:py-24">
        <div className="section-container">
          {/* Tab Switcher */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setActiveTab(doc.id)}
                className={`relative px-5 py-2.5 rounded-xl text-sm font-medium tracking-wide transition-all duration-300 border flex items-center gap-2
                  ${activeTab === doc.id
                    ? "bg-accent/10 border-accent/30 text-accent"
                    : "bg-transparent border-border-subtle text-text-secondary hover:text-foreground hover:border-accent/20"
                  }`}
              >
                <span>{doc.icon}</span>
                {doc.title}
              </button>
            ))}
          </div>

          {/* Document Display */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-5xl mx-auto"
          >
            {/* Doc info card */}
            <div className="flex items-center justify-between p-4 rounded-t-2xl border border-b-0 border-border-subtle bg-bg-tertiary/50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{activeDoc.icon}</span>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold">
                    {activeDoc.title}
                  </h3>
                  <p className="text-xs text-text-secondary">{activeDoc.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-text-muted">
                <span>{activeDoc.pages} halaman</span>
                <span>{activeDoc.size}</span>
                {/* Security badge - no download allowed */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/20 bg-amber-500/5 text-amber-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span className="text-[10px] font-medium">View Only</span>
                </div>
              </div>
            </div>

            {/* PDF Viewer Area */}
            <div className="rounded-b-2xl border border-border-subtle bg-bg-card/50 overflow-hidden">
              {activeDoc.pdfUrl ? (
                <div className="pdf-viewer-container relative" onContextMenu={(e) => e.preventDefault()}>
                  <iframe
                    ref={iframeRef}
                    src={getSecurePdfUrl(activeDoc.pdfUrl) || ''}
                    className="w-full h-[70vh]"
                    title={activeDoc.title}
                    sandbox="allow-same-origin allow-scripts"
                    style={{ border: 'none' }}
                  />
                  {/* Invisible overlay on top-right to block download button area */}
                  <div 
                    className="absolute top-0 right-0 w-[200px] h-[48px] bg-transparent z-10"
                    style={{ pointerEvents: 'auto' }}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </div>
              ) : (
                <div className="h-[70vh] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-24 mx-auto mb-4 rounded-lg border border-border-subtle bg-bg-tertiary flex items-center justify-center relative">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-text-muted">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <line x1="10" y1="9" x2="8" y2="9" />
                      </svg>
                      <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded text-[8px] bg-red-500/20 text-red-400 border border-red-500/30 font-bold">
                        PDF
                      </span>
                    </div>
                    <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold mb-2">
                      {activeDoc.title}
                    </h3>
                    <p className="text-text-muted text-xs max-w-xs mx-auto mb-4">
                      Dokumen sedang dalam proses upload. Silakan cek kembali nanti.
                    </p>
                    <p className="text-text-muted text-[10px]">
                      {activeDoc.pages} halaman • {activeDoc.size}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Security notice */}
            <div className="mt-3 text-center">
              <p className="text-[10px] text-text-muted flex items-center justify-center gap-1.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Dokumen ini bersifat rahasia dan hanya dapat dilihat di browser. Download tidak diperbolehkan.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
