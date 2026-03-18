"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { auth, db } from "@/lib/firebase";
import { updateProfile, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Camera, Save, ArrowLeft, Loader2, Globe, Lock } from "lucide-react";

const countries = ["Indonesia", "Malaysia", "Singapore", "Japan", "USA", "UK", "Australia", "Netherlands", "Others"];

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "", 
    country: "",
    photoURL: "",
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/auth/user");
        return;
      }

      try {
        const userSnap = await getDoc(doc(db, "users", user.uid));
        const userData = userSnap.data();

        setFormData({
          name: user.displayName || "",
          email: user.email || "", 
          photoURL: user.photoURL || "",
          country: userData?.country || "",
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);

    try {
      const sigRes = await fetch("/api/sign-cloudinary", { method: "POST" });
      const { signature, timestamp } = await sigRes.json();

      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("signature", signature);
      uploadData.append("timestamp", timestamp.toString());
      uploadData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "");
      uploadData.append("folder", "revolusi45/agents");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: uploadData }
      );

      const result = await res.json();
      if (result.secure_url) {
        setFormData((prev) => ({ ...prev, photoURL: result.secure_url }));
      }
    } catch (err) {
      console.error("Upload Error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const user = auth.currentUser;
    if (!user) return;

    try {
      // 1. Update Auth Profile (Hanya Nama & Foto)
      await updateProfile(user, {
        displayName: formData.name,
        photoURL: formData.photoURL,
      });

      // 2. Update Firestore (Tanpa Password)
      await updateDoc(doc(db, "users", user.uid), {
        name: formData.name,
        country: formData.country,
        photoURL: formData.photoURL,
        updatedAt: new Date().toISOString(),
      });

      alert("Identitas Agen Berhasil Diperbarui!");
      router.push("/dashboard/profile");
    } catch (err: any) {
      console.error(err);
      alert("Gagal: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-mono font-black uppercase italic animate-pulse text-xl">Menghubungkan ke Berkas...</div>;

  return (
    <div className="min-h-screen bg-yellow-50 py-10 px-4 font-mono">
      <div className="max-w-xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="mb-4 flex items-center gap-2 font-black uppercase text-sm hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft size={16} className="bg-black text-white p-0.5" /> Kembali
        </button>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white border-[6px] border-black p-8 shadow-[10px_10px_0_#000]"
        >
          <div className="bg-black text-white inline-block px-3 py-1 mb-8 -rotate-1 font-black uppercase text-xl border-2 border-black italic">
            Edit Data Pahlawan
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* AVATAR SECTION */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-[6px] border-black overflow-hidden bg-gray-100 shadow-[6px_6px_0_#000]">
                  {formData.photoURL ? (
                    <img src={formData.photoURL} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">👤</div>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 className="animate-spin text-yellow-400" size={32} />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-yellow-400 border-4 border-black p-2 cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-[2px_2px_0_#000]">
                  <Camera size={20} />
                  <input type="file" className="hidden" onChange={handleUpload} disabled={isUploading} accept="image/*" />
                </label>
              </div>
            </div>

            {/* INPUT SECTION */}
            <div className="space-y-4">
              {/* EMAIL (READ ONLY) */}
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 flex items-center gap-1 mb-1">
                  <Lock size={10} /> Email Markas (Terkunci)
                </label>
                <input 
                  type="text" value={formData.email} disabled
                  className="w-full border-4 border-black p-3 font-bold bg-gray-50 text-gray-400 cursor-not-allowed italic opacity-70"
                />
              </div>

              {/* NAMA */}
              <div>
                <label className="block text-[10px] font-black uppercase mb-1 text-black">Nama Samaran (Alias)</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border-4 border-black p-3 font-bold focus:bg-yellow-50 outline-none shadow-inner" 
                  placeholder="Masukkan nama..."
                  required
                />
              </div>

              {/* NEGARA */}
              <div>
                <label className="block text-[10px] font-black uppercase mb-1 text-black flex items-center gap-1">
                  <Globe size={12} /> Wilayah Operasi
                </label>
                <select 
                  value={formData.country} 
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className="w-full border-4 border-black p-3 font-bold bg-white outline-none cursor-pointer appearance-none"
                >
                  <option value="">Pilih Wilayah...</option>
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* SAVE BUTTON */}
            <button 
              type="submit" 
              disabled={isSaving || isUploading}
              className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white border-4 border-black p-4 shadow-[6px_6px_0_#000] font-black uppercase text-xl hover:translate-y-[2px] hover:shadow-[4px_4px_0_#000] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin" /> MENGIRIM...
                </>
              ) : (
                <>
                  <Save size={24} /> SIMPAN PERUBAHAN
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}