"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { auth, db } from "@/lib/firebase";
import { updateProfile, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Camera, Save, ArrowLeft, Loader2, MapPin, Lock, User } from "lucide-react";
import Select from "react-select";

interface WilayahOption {
  value: string;
  label: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "", 
    photoURL: "",
  });

  const [provinces, setProvinces] = useState<WilayahOption[]>([]);
  const [regencies, setRegencies] = useState<WilayahOption[]>([]);
  const [selectedProv, setSelectedProv] = useState<WilayahOption | null>(null);
  const [selectedKab, setSelectedKab] = useState<WilayahOption | null>(null);

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
          name: userData?.name || userData?.nama || user.displayName || "",
          email: user.email || "", 
          photoURL: userData?.photoURL || user.photoURL || "",
        });

        const currentProv = userData?.prov || userData?.provinsi;
        const currentCity = userData?.city || userData?.kabupaten;

        if (currentProv) setSelectedProv({ value: "", label: currentProv });
        if (currentCity) setSelectedKab({ value: "", label: currentCity });

        const res = await fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json");
        const data = await res.json();
        setProvinces(data.map((p: any) => ({ value: p.id, label: p.name })));
      } catch (err) {
        console.error("Error fetching:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  useEffect(() => {
    if (selectedProv?.value) { 
      fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProv.value}.json`)
        .then((res) => res.json())
        .then((data) => {
          setRegencies(data.map((r: any) => ({ value: r.name, label: r.name })));
        });
    }
  }, [selectedProv]);

  const comicSelectStyles = {
    control: (base: any) => ({
      ...base,
      border: "4px solid black",
      borderRadius: "0",
      boxShadow: "none",
      minHeight: "45px",
      "&:hover": { border: "4px solid black" },
      fontWeight: "900",
      textTransform: "uppercase",
      fontSize: "14px"
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? "#FACC15" : "white",
      color: "black",
      fontWeight: "900",
      textTransform: "uppercase",
      fontSize: "12px"
    }),
    singleValue: (base: any) => ({
        ...base,
        textTransform: "uppercase"
    })
  };

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
      await updateProfile(user, {
        displayName: formData.name,
        photoURL: formData.photoURL,
      });

      await updateDoc(doc(db, "users", user.uid), {
        name: formData.name,
        prov: selectedProv?.label,
        city: selectedKab?.label,
        photoURL: formData.photoURL,
        updatedAt: new Date().toISOString(),
      });

      alert("WHAM! Data berhasil diperbarui!");
      router.push("/dashboard/profile");
    } catch (err: any) {
      alert("KABOOM! Gagal: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-400 font-mono p-4 text-center">
      <Loader2 className="animate-spin mb-4 text-black" size={48} />
      <h2 className="font-black text-2xl uppercase italic text-black">Membuka Arsip Pahlawan...</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-red-950 py-6 md:py-10 px-4 font-mono relative overflow-x-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-10" 
           style={{ backgroundImage: 'radial-gradient(white 2px, transparent 0)', backgroundSize: '24px 24px' }}>
      </div>

      <div className="max-w-xl mx-auto relative z-10">
        <button 
          onClick={() => router.back()} 
          className="mb-6 flex items-center gap-2 font-black uppercase text-[10px] md:text-sm bg-white border-[3px] md:border-4 border-black px-3 py-1.5 md:px-4 md:py-2 shadow-[4px_4px_0_#000] hover:translate-y-1 hover:shadow-none transition-all text-black"
        >
          <ArrowLeft size={16} /> Kembali
        </button>

        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white border-[6px] border-black p-5 sm:p-10 shadow-[8px_8px_0_#000] md:shadow-[15px_15px_0_#000]"
        >
          <div className="bg-yellow-400 text-black inline-block px-3 py-1 mb-6 md:mb-10 -rotate-2 font-black uppercase text-lg md:text-2xl border-[3px] md:border-4 border-black italic shadow-[3px_3px_0_#000]">
            Edit Identitas
          </div>

          <form onSubmit={handleSave} className="space-y-6 md:space-y-8">
            {/* Foto Profil */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-[6px] border-black overflow-hidden bg-gray-200 shadow-[6px_6px_0_#000] md:shadow-[8px_8px_0_#000]">
                  {formData.photoURL ? (
                    <img src={formData.photoURL} className="w-full h-full object-cover" alt="Profile" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl opacity-50 text-black"><User size={50} /></div>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <Loader2 className="animate-spin text-white" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-red-500 text-white border-[3px] md:border-4 border-black p-2 md:p-3 cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-[2px_2px_0_#000]">
                  <Camera size={20} />
                  <input type="file" className="hidden" onChange={handleUpload} disabled={isUploading} accept="image/*" />
                </label>
              </div>
            </div>

            <div className="space-y-5">
              {/* Input Nama */}
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-black uppercase text-red-600 tracking-tighter">Nama Lengkap Pahlawan</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border-[3px] md:border-4 border-black p-3 md:p-4 font-black text-lg md:text-xl focus:bg-yellow-50 outline-none uppercase text-black" 
                  placeholder="MASUKKAN NAMA..."
                  required
                />
              </div>

              {/* Input Email (Disabled) */}
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-tighter flex items-center gap-1">
                  <Lock size={10} /> Email Markas (Tersegel)
                </label>
                <input 
                  type="text" value={formData.email} disabled
                  className="w-full border-[3px] md:border-4 border-gray-300 p-3 md:p-4 font-black bg-gray-100 text-gray-400 cursor-not-allowed italic text-sm md:text-base"
                />
              </div>

              {/* Grid Wilayah */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-red-600 flex items-center gap-1">
                    <MapPin size={10} /> Provinsi
                  </label>
                  <Select
                    options={provinces}
                    styles={comicSelectStyles}
                    value={selectedProv}
                    onChange={(val) => { setSelectedProv(val); setSelectedKab(null); }}
                    placeholder="PILIH..."
                    className="font-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-red-600 flex items-center gap-1">
                    <MapPin size={10} /> Kabupaten
                  </label>
                  <Select
                    options={regencies}
                    styles={comicSelectStyles}
                    value={selectedKab}
                    onChange={(val) => setSelectedKab(val)}
                    placeholder={selectedProv ? "CARI..." : "PILIH PROV!"}
                    isDisabled={!selectedProv}
                    className="font-black"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isSaving || isUploading}
              className="w-full bg-blue-600 text-white border-[3px] md:border-4 border-black p-4 md:p-5 shadow-[5px_5px_0_#000] md:shadow-[8px_8px_0_#000] font-black uppercase text-xl md:text-2xl hover:translate-y-1 hover:shadow-[3px_3px_0_#000] active:translate-y-2 active:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
            >
              {isSaving ? <Loader2 className="animate-spin" /> : <Save size={24} />}
              <span className="truncate">{isSaving ? "MENYIMPAN..." : "UPDATE DATA!"}</span>
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}