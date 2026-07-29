"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ParticleBackground } from "@/components/cinematic/ParticleBackground";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

import contentData from "../../data/content.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const logEntries: any[] = contentData.logbook;

export default function LogbookPage() {
  const timelineLineRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    const line = timelineLineRef.current;
    if (!line) return;

    const totalLength = line.getTotalLength();
    gsap.set(line, { strokeDasharray: totalLength, strokeDashoffset: totalLength });

    gsap.to(line, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: ".timeline-container",
        start: "top 80%",
        end: "bottom 20%",
        scrub: 0.5,
      },
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
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-xs text-accent tracking-[0.3em] uppercase font-medium">
            Timeline
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
            className="font-[family-name:var(--font-display)] text-4xl md:text-5xl lg:text-6xl font-bold mt-3">
            Logbook Proyek
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="text-text-secondary mt-4 max-w-lg mx-auto">
            Catatan harian perjalanan proyek dari awal hingga akhir
          </motion.p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24">
        <div className="section-container max-w-4xl timeline-container">
          <div className="relative">
            {/* Animated vertical line (SVG) */}
            <svg
              className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 h-full"
              preserveAspectRatio="none"
            >
              <line
                ref={timelineLineRef}
                x1="0" y1="0" x2="0" y2="100%"
                stroke="var(--accent)"
                strokeWidth="2"
                opacity="0.4"
              />
            </svg>
            {/* Static background line */}
            <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-border-subtle" />

            {/* Entries */}
            <div className="space-y-8 md:space-y-12">
              {logEntries.map((entry, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className={`relative flex items-start gap-6 md:gap-0 ${
                      isLeft ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Content */}
                    <div className={`flex-1 pl-10 md:pl-0 ${isLeft ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                      <div className={`p-5 rounded-xl border border-border-subtle bg-bg-card/50 backdrop-blur-sm
                        hover:border-accent/20 transition-all duration-300 ${isLeft ? "md:ml-auto" : ""}`}>
                        <div className={`flex items-center gap-3 mb-3 ${isLeft ? "md:justify-end" : ""}`}>
                          {entry.day && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium border border-accent/20">
                              {entry.day}
                            </span>
                          )}
                          <span className="text-xs text-text-muted font-mono">{entry.date}</span>
                        </div>
                        <h3 className="font-[family-name:var(--font-display)] text-lg font-bold mb-2">
                          {entry.title}
                        </h3>
                        <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                          {entry.desc}
                        </p>
                        
                        {entry.tags && entry.tags.length > 0 && (
                          <div className={`flex flex-wrap gap-2 mb-4 ${isLeft ? "md:justify-end" : ""}`}>
                            {entry.tags.map((tag: string, i: number) => (
                              <span key={i} className="text-[10px] px-2 py-1 rounded-md bg-bg-tertiary text-text-muted border border-border-subtle">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        {/* Progress bar */}
                        <div className="mt-3">
                          <div className="flex justify-between text-[10px] text-text-muted mb-1">
                            <span>Progress</span>
                            <span>{entry.progress}%</span>
                          </div>
                          <div className="w-full h-1 rounded-full bg-bg-tertiary overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${entry.progress}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.3 }}
                              className="h-full rounded-full bg-gradient-to-r from-accent to-accent-secondary"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline dot */}
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-bg-secondary border-2 border-accent z-10 mt-6">
                      <div className="absolute inset-0 rounded-full bg-accent animate-ping opacity-20" />
                    </div>

                    {/* Spacer for opposite side on desktop */}
                    <div className="hidden md:block flex-1" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
