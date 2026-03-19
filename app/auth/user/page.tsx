"use client";

import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Lock, Zap, AtSign, User, MapPin, ShieldCheck, Rocket } from "lucide-react";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import Select, { StylesConfig } from "react-select";

interface WilayahOption {
  value: string;
  label: string;
}

export default function UserAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const [provinces, setProvinces] = useState<WilayahOption[]>([]);
  const [regencies, setRegencies] = useState<WilayahOption[]>([]);
  const [selectedProv, setSelectedProv] = useState<WilayahOption | null>(null);
  const [selectedKab, setSelectedKab] = useState<WilayahOption | null>(null);

  useEffect(() => {
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((p: { id: string; name: string }) => ({ value: p.id, label: p.name }));
        setProvinces(formatted);
      });
  }, []);

  useEffect(() => {
    if (selectedProv) {
      fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProv.value}.json`)
        .then((res) => res.json())
        .then((data) => {
          const formatted = data.map((r: { name: string }) => ({ value: r.name, label: r.name }));
          setRegencies(formatted);
          setSelectedKab(null);
        });
    }
  }, [selectedProv]);

  const comicStyles: StylesConfig<WilayahOption, false> = {
    control: (base) => ({
      ...base,
      border: "4px solid black",
      borderRadius: "0",
      boxShadow: "none",
      minHeight: "45px",
      "&:hover": { border: "4px solid black" },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#FACC15" : "white",
      color: "black",
      fontWeight: "900",
      borderBottom: "2px solid black",
      cursor: "pointer",
    }),
    singleValue: (base) => ({ ...base, fontWeight: "900", textTransform: "uppercase", fontSize: "14px" }),
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const snap = await getDoc(doc(db, "users", result.user.uid));
        const role = snap.exists() ? snap.data().role : "user";
        
        Cookies.set("token", await result.user.getIdToken(), { expires: 7 });
        Cookies.set("role", role, { expires: 7 });
        window.location.href = "/dashboard";
      } else {
        if (!selectedProv || !selectedKab) return alert("Pilih Sektor Wilayah!");
        const result = await createUserWithEmailAndPassword(auth, email, password);
        
        await setDoc(doc(db, "users", result.user.uid), {
          name: displayName,
          email: email,
          prov: selectedProv.label,
          city: selectedKab.label,
          role: "user",
          createdAt: serverTimestamp(),
        });

        Cookies.set("token", await result.user.getIdToken(), { expires: 7 });
        Cookies.set("role", "user", { expires: 7 });
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      alert("KABOOM! ERROR: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden font-mono bg-yellow-400">
      
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(black 3px, transparent 0)', backgroundSize: '30px 30px' }}>
      </div>
      <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] z-0 pointer-events-none opacity-10"
           style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0px, #000 2px, transparent 2px, transparent 10px)' }}>
      </div>

      <div className="absolute top-10 left-10 -rotate-12 hidden lg:block z-0">
        <div className="bg-white border-4 border-black p-4 font-black text-3xl shadow-[8px_8px_0_#000] italic uppercase text-black">WHAM!</div>
      </div>
      <div className="absolute  right-10 rotate-12 hidden lg:block z-0">
        <div className="bg-red-600 text-white border-4 border-black p-4 font-black text-3xl shadow-[8px_8px_0_#000] italic uppercase">POW!</div>
      </div>
      <div className="absolute top-1/2 left-5 -translate-y-1/2 rotate-90 hidden lg:block z-0 opacity-40">
        <div className="text-black font-black text-sm uppercase tracking-[0.5em]">HISTOPLAY DEFENSE SYSTEM</div>
      </div>
      <motion.div 
        layout
        initial={{ y: 50, scale: 0.9, opacity: 0 }} 
        animate={{ y: 0, scale: 1, opacity: 1 }} 
        className={`w-full z-10 my-10 transition-all duration-500 ${isLogin ? 'max-w-md' : 'max-w-4xl'}`}
      >
        <div className="flex bg-white border-[6px] border-black border-b-0">
          <button 
            onClick={() => setIsLogin(true)} 
            className={`flex-1 py-4 font-black text-xl italic transition-colors flex items-center justify-center gap-3 ${isLogin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
          >
            <ShieldCheck size={24} /> MASUK
          </button>
          <button 
            onClick={() => setIsLogin(false)} 
            className={`flex-1 py-4 font-black text-xl italic transition-colors flex items-center justify-center gap-3 ${!isLogin ? 'bg-red-600 text-white' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
          >
            <Rocket size={24} /> DAFTAR
          </button>
        </div>
        <div className="bg-white border-[6px] border-black p-6 sm:p-10 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-black rotate-45"></div>
          <h1 className="text-2xl sm:text-5xl font-black text-center mb-8 uppercase italic tracking-tighter drop-shadow-[4px_4px_0_#FACC15] text-black relative z-10">
            {isLogin ? "LOG MISI" : "REKRUT BARU"}
          </h1>
          <form onSubmit={handleAuth} className="space-y-6 relative z-10">
            <div className={`grid gap-6 ${!isLogin ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
              
              <div className="space-y-5">
                {!isLogin && (
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-red-600 tracking-widest">Nama Alias Pahlawan</label>
                    <div className="flex items-center group">
                      <div className="bg-black p-3 border-2 border-black text-white group-focus-within:bg-blue-600 transition-colors"><User size={20} /></div>
                      <input type="text" placeholder="NAMA LENGKAP..." onChange={(e)=>setDisplayName(e.target.value)} className="w-full border-4 border-black border-l-0 p-2 font-black outline-none uppercase text-black" required={!isLogin} />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-red-600 tracking-widest">Alamat Email Markas</label>
                  <div className="flex items-center group">
                    <div className="bg-black p-3 border-2 border-black text-white group-focus-within:bg-blue-600 transition-colors"><AtSign size={20} /></div>
                    <input type="email" placeholder="EMAIL@KAMU.COM" onChange={(e)=>setEmail(e.target.value)} className="w-full border-4 border-black border-l-0 p-2 font-black outline-none text-black placeholder:text-gray-300" required />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-red-600 tracking-widest">Sandi Rahasia</label>
                  <div className="flex items-center group">
                    <div className="bg-black p-3 border-2 border-black text-white group-focus-within:bg-blue-600 transition-colors"><Lock size={20} /></div>
                    <input type="password" placeholder="********" onChange={(e)=>setPassword(e.target.value)} className="w-full border-4 border-black border-l-0 p-2 font-black outline-none text-black" required />
                  </div>
                </div>
              </div>

              {/* KOLOM WILAYAH (Khusus Register) */}
              {!isLogin && (
                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-5 border-t-4 border-dashed border-black pt-6 md:border-t-0 md:border-l-4 md:pt-0 md:pl-6 bg-slate-50 relative">
                    <div className="absolute top-2 right-2 bg-yellow-400 text-black px-3 py-1 text-xs font-black rotate-3 shadow-[3px_3px_0_#000]">INFO LOKASI</div>
                    
                    <div className="space-y-1">
                        <label className="text-xs font-black uppercase text-red-600 flex items-center gap-1"><MapPin size={12}/> Provinsi (Prov)</label>
                        <Select options={provinces} styles={comicStyles} placeholder="CARI PROV..." onChange={(val) => setSelectedProv(val)} />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-black uppercase text-red-600 flex items-center gap-1"><MapPin size={12}/> Kabupaten/Kota (City)</label>
                        <Select options={regencies} styles={comicStyles} placeholder={selectedProv ? "CARI KAB/KOTA..." : "SIAPKAN PROV!"} isDisabled={!selectedProv} value={selectedKab} onChange={(val) => setSelectedKab(val)} />
                    </div>

                    <div className="bg-blue-100 border-2 border-black p-3 italic text-[10px] font-bold uppercase leading-tight text-black">
                        * Data wilayah digunakan untuk menentukan Sektor Operasi Agen di Papan Peringkat.
                    </div>
                </motion.div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-red-600 text-white font-black text-2xl py-2 border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:translate-x-2 active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-4 mt-6 hover:bg-black group overflow-hidden relative"
            >
              <span className="relative z-10">
                {loading ? "PROSES..." : (isLogin ? "BERANGKAT!" : "GABUNG!")}
              </span>
              {!loading && <Zap className="group-hover:text-yellow-400 group-hover:scale-125 transition-all relative z-10" fill="currentColor" size={28} />}
              
              {/* BUTTON SHINE EFFECT */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>
            </button>
          </form>
        </div>
        <div className="mt-8 grid grid-cols-4 border-4 border-black text-center bg-white divide-x-4 divide-black text-black">
            <div className="p-2 font-black italic text-xs uppercase -skew-x-12">REVOLUSI</div>
            <div className="p-2 font-black italic text-xs uppercase rotate-3">SEJARAH</div>
            <div className="p-2 font-black italic text-xs uppercase -skew-x-12">GAME</div>
            <div className="p-2 font-black italic text-xs uppercase -rotate-3">EDUKASI</div>
        </div>

        <p className="text-center mt-3 text-black font-black uppercase italic tracking-tighter text-sm">
          --- HISTOPLAY DEFENSE SYSTEM v1.0 ---
        </p>
      </motion.div>

      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}