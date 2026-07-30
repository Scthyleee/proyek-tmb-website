"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ADMIN_PASSWORD = "TMBK11";

export default function AdminPage() {
  // ─── Semua hooks harus di atas, sebelum return apapun ───
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("galeri");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // Check session auth on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("tmb-admin-auth");
    if (saved === "true") setAuthenticated(true);
  }, []);

  // Fetch data hanya setelah authenticated
  useEffect(() => {
    if (!authenticated) return;
    setLoading(true);
    fetch("/api/admin/data")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [authenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      sessionStorage.setItem("tmb-admin-auth", "true");
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 2000);
    }
  };

  const handleSave = async (newData: any) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      const result = await res.json();
      if (result.success) {
        setData(result.data);
        setMessage("Berhasil disimpan!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (e) {
      alert("Gagal menyimpan");
    }
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return null;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      setUploading(false);
      if (result.success) return result;
      alert("Gagal upload");
      return null;
    } catch (err) {
      setUploading(false);
      alert("Error upload");
      return null;
    }
  };

  // ─── Login Screen ───
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl border border-accent/30 bg-accent/5 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Panel Admin</h1>
            <p className="text-gray-500 text-sm">Masukkan password untuk mengakses panel kelola</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password..."
                className={`w-full px-4 py-3 rounded-xl bg-gray-900 border text-white text-sm
                  focus:outline-none focus:border-accent/50 transition-colors
                  ${passwordError ? "border-red-500 animate-pulse" : "border-gray-700"}`}
                autoFocus
              />
              {passwordError && (
                <p className="text-red-400 text-xs mt-2">Password salah. Coba lagi.</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-accent text-black font-bold text-sm hover:bg-accent/90 transition-colors"
            >
              Masuk
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ─── Loading Screen ───
  if (loading && !data) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <p className="text-gray-400 text-sm">Memuat data...</p>
      </div>
    );
  }

  // ─── Admin Dashboard ───
  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-[family-name:var(--font-inter)]">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">Panel Kelola Rahasia</h1>
          <button
            onClick={() => {
              sessionStorage.removeItem("tmb-admin-auth");
              setAuthenticated(false);
            }}
            className="text-xs text-gray-500 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg border border-gray-800 hover:border-red-500/30"
          >
            Keluar
          </button>
        </div>
        <p className="text-gray-400 mb-8 text-sm">
          Perubahan di sini akan tersimpan ke file JSON lokal. Harap lakukan deploy ulang jika ingin perubahan tampil di live server.
        </p>

        {message && (
          <div className="bg-emerald-500/20 text-emerald-400 p-3 rounded mb-4 text-sm border border-emerald-500/30">
            {message}
          </div>
        )}

        <div className="flex gap-2 mb-6 border-b border-gray-800 pb-2">
          {["galeri", "dokumen", "logbook"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm rounded ${
                activeTab === tab ? "bg-accent text-black font-bold" : "bg-gray-900 text-gray-400 hover:text-white"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* GALERI */}
        {activeTab === "galeri" && (
          <div className="space-y-6">
            <div className="flex items-end gap-4 bg-gray-900 p-4 rounded border border-gray-800">
              <div className="flex-1">
                <label className="block text-xs mb-1 text-gray-400">Upload Foto Baru</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const res = await handleFileUpload(e, "image");
                    if (res) {
                      const newId = `galeri-${Date.now()}`;
                      const newItem = {
                        id: newId,
                        src: res.url,
                        title: "Judul Baru",
                        category: "Kategori",
                        date: new Date().toISOString().split("T")[0],
                      };
                      handleSave({ ...data, galeri: [...(data.galeri || []), newItem] });
                    }
                  }}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-accent file:text-black file:font-semibold"
                  disabled={uploading}
                />
              </div>
              {uploading && <div className="text-sm text-accent">Uploading...</div>}
            </div>

            <div className="grid gap-3">
              {(data?.galeri || []).map((item: any, idx: number) => (
                <div key={item.id} className="flex gap-4 items-center bg-gray-900/50 p-3 rounded border border-gray-800">
                  <img src={item.src} className="w-16 h-16 object-cover rounded" alt={item.title} />
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const newGal = [...data.galeri];
                        newGal[idx].title = e.target.value;
                        setData({ ...data, galeri: newGal });
                      }}
                      className="bg-black border border-gray-700 px-2 py-1 text-sm rounded"
                    />
                    <input
                      type="text"
                      value={item.category}
                      onChange={(e) => {
                        const newGal = [...data.galeri];
                        newGal[idx].category = e.target.value;
                        setData({ ...data, galeri: newGal });
                      }}
                      className="bg-black border border-gray-700 px-2 py-1 text-sm rounded"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const newGal = data.galeri.filter((_: any, i: number) => i !== idx);
                      handleSave({ ...data, galeri: newGal });
                    }}
                    className="text-red-500 text-xs px-3 py-2 bg-red-500/10 rounded hover:bg-red-500/20"
                  >
                    Hapus
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleSave(data)}
                className="w-full py-3 bg-accent text-black font-bold rounded mt-4"
              >
                Simpan Perubahan Judul/Kategori
              </button>
            </div>
          </div>
        )}

        {/* DOKUMEN */}
        {activeTab === "dokumen" && (
          <div className="space-y-6">
            <div className="flex items-end gap-4 bg-gray-900 p-4 rounded border border-gray-800">
              <div className="flex-1">
                <label className="block text-xs mb-1 text-gray-400">Upload PDF Baru</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={async (e) => {
                    const res = await handleFileUpload(e, "document");
                    if (res) {
                      const newItem = {
                        id: `doc-${Date.now()}`,
                        title: res.name.replace(".pdf", ""),
                        desc: "Deskripsi dokumen...",
                        icon: "📄",
                        pages: 1,
                        size: (res.size / 1024 / 1024).toFixed(1) + " MB",
                        pdfUrl: res.url,
                      };
                      handleSave({ ...data, dokumen: [...(data.dokumen || []), newItem] });
                    }
                  }}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-accent file:text-black file:font-semibold"
                  disabled={uploading}
                />
              </div>
              {uploading && <div className="text-sm text-accent">Uploading...</div>}
            </div>

            <div className="grid gap-3">
              {(data?.dokumen || []).map((item: any, idx: number) => (
                <div key={item.id} className="flex gap-4 items-start bg-gray-900/50 p-4 rounded border border-gray-800">
                  <div className="text-2xl">{item.icon}</div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const newDoc = [...data.dokumen];
                        newDoc[idx].title = e.target.value;
                        setData({ ...data, dokumen: newDoc });
                      }}
                      className="bg-black border border-gray-700 px-2 py-1 text-sm rounded w-full font-bold"
                    />
                    <textarea
                      value={item.desc}
                      onChange={(e) => {
                        const newDoc = [...data.dokumen];
                        newDoc[idx].desc = e.target.value;
                        setData({ ...data, dokumen: newDoc });
                      }}
                      className="bg-black border border-gray-700 px-2 py-1 text-sm rounded w-full h-16"
                    />
                    <div className="text-xs text-gray-500 font-mono">{item.pdfUrl || "No File"} • {item.size}</div>
                  </div>
                  <button
                    onClick={() => {
                      const newDoc = data.dokumen.filter((_: any, i: number) => i !== idx);
                      handleSave({ ...data, dokumen: newDoc });
                    }}
                    className="text-red-500 text-xs px-3 py-2 bg-red-500/10 rounded hover:bg-red-500/20"
                  >
                    Hapus
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleSave(data)}
                className="w-full py-3 bg-accent text-black font-bold rounded mt-4"
              >
                Simpan Perubahan Teks
              </button>
            </div>
          </div>
        )}

        {/* LOGBOOK */}
        {activeTab === "logbook" && (
          <div className="space-y-6">
            <button
              onClick={() => {
                const newItem = {
                  id: `lb-${Date.now()}`,
                  date: new Date().toLocaleDateString("id-ID"),
                  title: "Judul Kegiatan",
                  desc: "Deskripsi...",
                  progress: 50,
                };
                handleSave({ ...data, logbook: [...(data.logbook || []), newItem] });
              }}
              className="px-4 py-2 bg-gray-800 text-sm rounded hover:bg-gray-700 text-white"
            >
              + Tambah Logbook
            </button>

            <div className="grid gap-3">
              {(data?.logbook || []).map((item: any, idx: number) => (
                <div key={item.id} className="flex flex-col gap-2 bg-gray-900/50 p-4 rounded border border-gray-800">
                  <div className="flex justify-between items-center mb-2">
                    <input
                      type="text"
                      value={item.date}
                      onChange={(e) => {
                        const newLb = [...data.logbook];
                        newLb[idx].date = e.target.value;
                        setData({ ...data, logbook: newLb });
                      }}
                      className="bg-black border border-gray-700 px-2 py-1 text-sm rounded text-accent w-40"
                    />
                    <button
                      onClick={() => {
                        const newLb = data.logbook.filter((_: any, i: number) => i !== idx);
                        handleSave({ ...data, logbook: newLb });
                      }}
                      className="text-red-500 text-xs px-3 py-1 bg-red-500/10 rounded"
                    >
                      Hapus
                    </button>
                  </div>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const newLb = [...data.logbook];
                      newLb[idx].title = e.target.value;
                      setData({ ...data, logbook: newLb });
                    }}
                    className="bg-black border border-gray-700 px-2 py-1 text-sm rounded w-full font-bold"
                  />
                  <textarea
                    value={item.desc}
                    onChange={(e) => {
                      const newLb = [...data.logbook];
                      newLb[idx].desc = e.target.value;
                      setData({ ...data, logbook: newLb });
                    }}
                    className="bg-black border border-gray-700 px-2 py-1 text-sm rounded w-full h-16"
                  />
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-400">Progress %:</label>
                    <input
                      type="number"
                      value={item.progress}
                      onChange={(e) => {
                        const newLb = [...data.logbook];
                        newLb[idx].progress = parseInt(e.target.value) || 0;
                        setData({ ...data, logbook: newLb });
                      }}
                      className="bg-black border border-gray-700 px-2 py-1 text-sm rounded w-20"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => handleSave(data)}
                className="w-full py-3 bg-accent text-black font-bold rounded mt-4"
              >
                Simpan Perubahan Logbook
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
