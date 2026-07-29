"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ParticleBackground } from "@/components/cinematic/ParticleBackground";

export default function KontakPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useScrollReveal({ direction: "up" });
  const socialRef = useScrollReveal({ direction: "up", delay: 0.2 });

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Nama wajib diisi";
    if (!formData.email.trim()) errs.email = "Email wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Format email tidak valid";
    if (!formData.message.trim()) errs.message = "Pesan wajib diisi";
    else if (formData.message.trim().length < 10)
      errs.message = "Pesan minimal 10 karakter";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    // Simulate submit
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // TODO: ganti dengan kontak asli
  const socials = [
    {
      name: "WhatsApp",
      href: "https://wa.me/6281234567890",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20",
    },
    {
      name: "Instagram",
      href: "https://instagram.com/tmb_kelompok11",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
      color: "bg-pink-500/10 border-pink-500/20 text-pink-400 hover:bg-pink-500/20",
    },
    {
      name: "Email",
      href: "mailto:kelompok11@tmb.ac.id",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      color: "bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20",
    },
  ];

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
            Contact
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-[family-name:var(--font-display)] text-4xl md:text-5xl lg:text-6xl font-bold mt-3"
          >
            Kontak
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-text-secondary mt-4 max-w-md mx-auto"
          >
            Punya pertanyaan tentang proyek kami? Hubungi kami.
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="w-16 h-px bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mt-6"
          />
        </div>
      </section>

      {/* Contact Form + Social */}
      <section className="py-20 md:py-28">
        <div className="section-container">
          <div className="grid lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
            {/* Form */}
            <div ref={formRef} className="lg:col-span-3">
              <div className="p-6 md:p-8 rounded-2xl border border-border-subtle bg-bg-card/50 backdrop-blur-sm">
                <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold mb-6">
                  Kirim Pesan
                </h2>

                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-12"
                    >
                      {/* Animated checkmark */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 12 }}
                        className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4"
                      >
                        <motion.svg
                          width="32" height="32" viewBox="0 0 24 24" fill="none"
                          stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </motion.svg>
                      </motion.div>
                      <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-emerald-400 mb-2">
                        Pesan Terkirim!
                      </h3>
                      <p className="text-text-secondary text-sm text-center mb-6">
                        Terima kasih telah menghubungi kami. Kami akan segera merespon pesan Anda.
                      </p>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="px-4 py-2 rounded-lg border border-border-subtle text-sm hover:border-accent/30 transition-colors"
                      >
                        Kirim Pesan Lagi
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >
                      {/* Name */}
                      <div>
                        <label htmlFor="contact-name" className="block text-xs text-text-secondary uppercase tracking-wider mb-2">
                          Nama
                        </label>
                        <input
                          id="contact-name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl bg-bg-tertiary border ${
                            errors.name ? "border-red-500/50" : "border-border-subtle"
                          } text-sm focus:outline-none focus:border-accent/50 transition-colors`}
                          placeholder="Masukkan nama Anda"
                        />
                        {errors.name && (
                          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 mt-1.5">
                            {errors.name}
                          </motion.p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="contact-email" className="block text-xs text-text-secondary uppercase tracking-wider mb-2">
                          Email
                        </label>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl bg-bg-tertiary border ${
                            errors.email ? "border-red-500/50" : "border-border-subtle"
                          } text-sm focus:outline-none focus:border-accent/50 transition-colors`}
                          placeholder="email@contoh.com"
                        />
                        {errors.email && (
                          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 mt-1.5">
                            {errors.email}
                          </motion.p>
                        )}
                      </div>

                      {/* Message */}
                      <div>
                        <label htmlFor="contact-message" className="block text-xs text-text-secondary uppercase tracking-wider mb-2">
                          Pesan
                        </label>
                        <textarea
                          id="contact-message"
                          name="message"
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl bg-bg-tertiary border ${
                            errors.message ? "border-red-500/50" : "border-border-subtle"
                          } text-sm focus:outline-none focus:border-accent/50 transition-colors resize-none`}
                          placeholder="Tulis pesan Anda di sini..."
                        />
                        {errors.message && (
                          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 mt-1.5">
                            {errors.message}
                          </motion.p>
                        )}
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 rounded-xl bg-accent/10 border border-accent/30 text-accent
                          font-[family-name:var(--font-display)] text-sm tracking-wider uppercase font-semibold
                          hover:bg-accent/20 hover:border-accent/50 disabled:opacity-50 disabled:cursor-not-allowed
                          transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                            </svg>
                            Mengirim...
                          </>
                        ) : (
                          "Kirim Pesan"
                        )}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Social Links */}
            <div ref={socialRef} className="lg:col-span-2 space-y-4">
              <h3 className="font-[family-name:var(--font-display)] text-xs font-semibold tracking-widest uppercase text-text-secondary mb-4">
                Hubungi Langsung
              </h3>
              {socials.map((social, i) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border ${social.color} transition-all duration-300 group`}
                >
                  <div className="shrink-0">{social.icon}</div>
                  <div>
                    <p className="text-sm font-medium">{social.name}</p>
                    <p className="text-xs text-text-secondary">
                      {social.name === "WhatsApp" && "Chat langsung via WA"}
                      {social.name === "Instagram" && "@tmb_kelompok11"}
                      {social.name === "Email" && "kelompok11@tmb.ac.id"}
                    </p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </motion.a>
              ))}

              {/* Additional info card */}
              <div className="mt-6 p-5 rounded-xl border border-border-subtle bg-bg-card/50">
                <h4 className="font-[family-name:var(--font-display)] text-xs font-semibold tracking-widest uppercase text-text-secondary mb-3">
                  Info
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-text-secondary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {/* TODO: ganti dengan semester/tahun asli */}
                    <span>Semester Genap 2024/2025</span>
                  </div>
                  <div className="flex items-center gap-3 text-text-secondary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                    <span>TMB Batch 2 — Kelompok 11</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
