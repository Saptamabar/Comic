"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, BookOpen, Heart, Star, Loader2, X, Trophy } from "lucide-react";
import { db, auth } from "@/lib/firebase"; 
import { collection, onSnapshot, query, orderBy, getDocs } from "firebase/firestore";

interface Hero {
  id: string;
  name: string;
  role: string;
  era: string;
  icon: string;
  color: string;
  bio: string;
  contribution: string;
  moralValues: string[];
  minPoints: number; 
}

export default function HeroesPage() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [userTotalPoints, setUserTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Hero | null>(null);
  const [tab, setTab] = useState<"bio" | "contribution" | "values">("bio");

  useEffect(() => {
    const qHeroes = query(collection(db, "heroes"), orderBy("minPoints", "asc"));
    const unsubHeroes = onSnapshot(qHeroes, (snap) => {
      setHeroes(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Hero[]);
    });

    const unsubAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const missionsSnap = await getDocs(collection(db, "users", user.uid, "completedMissions"));
          let totalScore = 0;
          missionsSnap.forEach((mDoc) => {
            const data = mDoc.data();
            totalScore += (Number(data.score) || 0) + (Number(data.finalScore) || 0);
          });
          setUserTotalPoints(totalScore);
        } catch (error) {
          console.error("Gagal ambil poin:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => { unsubHeroes(); unsubAuth(); };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="animate-spin text-red-600" size={40} />
        <p className="font-bangers text-xl uppercase text-black">Memuat Arsip...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-3 py-4 md:py-8 space-y-6 md:space-y-8">
      
      {/* --- HEADER (LEBIH RINGKAS) --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b-[6px] border-black pb-4">
        <div className="text-center sm:text-left">
          <h1 className="font-bangers text-3xl md:text-5xl drop-shadow-[2px_2px_0_#000] uppercase italic leading-none text-black">
            🦸 Galeri Pahlawan
          </h1>
          <p className="font-comic font-black text-[10px] md:text-xs text-gray-500 mt-1 uppercase bg-yellow-300 px-2 py-0.5 inline-block transform rotate-[-1deg]">
            Skor Perjuangan: {userTotalPoints} PTS
          </p>
        </div>

        <div className="bg-red-600 border-4 border-black p-2 md:px-4 shadow-[4px_4px_0_#000] flex items-center gap-3 transform rotate-[-2deg]">
          <Trophy size={24} className="text-white fill-white" />
          <div className="leading-tight text-white">
            <p className="font-comic font-black text-[10px] uppercase">Reputasi</p>
            <p className="font-bangers text-xl md:text-2xl">{userTotalPoints}</p>
          </div>
        </div>
      </div>

      {/* --- HERO GRID (UKURAN KARTU DIPERKECIL) --- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {heroes.map((hero, i) => {
          const isUnlocked = userTotalPoints >= (hero.minPoints || 0);

          return (
            <motion.button
              key={hero.id}
              whileHover={isUnlocked ? { scale: 1.03, rotate: -1 } : {}}
              onClick={() => isUnlocked && setSelected(hero)}
              className={`group relative flex flex-col items-center p-3 md:p-4 border-[4px] border-black transition-all
                ${isUnlocked 
                  ? `${hero.color} shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-none` 
                  : "bg-gray-200 grayscale opacity-80 cursor-not-allowed shadow-[2px_2px_0_#000]"}`}
            >
              {!isUnlocked && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-1 text-center bg-black/20">
                  <Lock size={20} className="mb-1 text-white" />
                  <div className="bg-white border-2 border-black px-1.5 py-0.5 transform -rotate-2">
                    <p className="text-[8px] font-black uppercase tracking-tighter">Min: {hero.minPoints}</p>
                  </div>
                </div>
              )}
              
              <span className={`text-4xl md:text-5xl mb-2 flex items-center justify-center w-16 h-16 ${isUnlocked ? "drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)]" : "opacity-30"}`}>
                {hero.icon?.startsWith('http') ? (
                   <img src={hero.icon} alt={hero.name} className="w-full h-full object-cover border-2 border-black bg-white" />
                ) : (
                   hero.icon
                )}
              </span>
              <p className={`font-bangers text-base md:text-lg leading-tight uppercase text-center ${isUnlocked ? "text-white" : "text-gray-400"}`}>
                {hero.name}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* --- DETAIL MODAL (LEBIH COMPACT) --- */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-[100]" onClick={() => setSelected(null)} />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="fixed bottom-0 left-0 right-0 z-[110] bg-white border-t-[6px] border-black md:max-w-xl md:mx-auto md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:border-6 md:shadow-[10px_10px_0_#000] overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Header Modal */}
              <div className={`${selected.color} p-3 md:p-4 border-b-[6px] border-black flex items-center gap-3`}>
                <div className="bg-white border-[3px] border-black p-1 text-4xl shadow-[3px_3px_0_#000] -rotate-2 flex w-16 h-16 items-center justify-center shrink-0">
                  {selected.icon?.startsWith('http') ? (
                    <img src={selected.icon} alt={selected.name} className="w-full h-full object-cover border border-black" />
                  ) : (
                    selected.icon
                  )}
                </div>
                <div className="flex-1 min-w-0 text-white leading-none">
                  <h2 className="font-bangers text-2xl md:text-3xl uppercase truncate">{selected.name}</h2>
                  <p className="font-comic font-black text-[9px] uppercase mt-0.5 opacity-90 tracking-tighter">{selected.role}</p>
                </div>
                <button onClick={() => setSelected(null)} className="bg-black text-white border-2 border-white p-1 active:scale-90"><X size={20}/></button>
              </div>

              {/* Tabs Content */}
              <div className="p-3 md:p-5 overflow-y-auto space-y-4">
                <div className="flex gap-1.5">
                  {["bio", "contribution", "values"].map((t) => (
                    <button key={t} onClick={() => setTab(t as any)} className={`flex-1 py-1.5 font-bangers text-xs md:text-sm border-[3px] border-black transition-all ${tab === t ? "bg-black text-white" : "bg-white shadow-[2px_2px_0_#000]"}`}>
                      {t === "bio" ? "KISAH" : t === "contribution" ? "JASA" : "TELADAN"}
                    </button>
                  ))}
                </div>

                <div className="bg-yellow-50 border-[4px] border-black p-4 shadow-inner min-h-[150px] relative">
                   {tab === "bio" && (
                     <p className="font-comic font-bold text-sm md:text-base leading-snug italic text-gray-800">"{selected.bio}"</p>
                   )}
                   {tab === "contribution" && (
                     <div className="space-y-2">
                       {selected.contribution?.split(",").map((c, idx) => (
                         <div key={idx} className="flex gap-2 bg-white border-2 border-black p-2 font-comic font-black text-[10px] md:text-xs uppercase shadow-[2px_2px_0_#000]">
                           <Star size={12} className="text-yellow-500 fill-yellow-500 shrink-0" /> {c.trim()}
                         </div>
                       ))}
                     </div>
                   )}
                   {tab === "values" && (
                     <div className="grid grid-cols-1 gap-2">
                       {selected.moralValues?.map((v, idx) => (
                         <div key={idx} className="flex items-center gap-2 bg-red-50 border-2 border-black p-2 font-bangers text-sm md:text-lg uppercase">
                           <Heart size={14} className="text-red-500 fill-red-500" /> {v}
                         </div>
                       ))}
                     </div>
                   )}
                </div>
                <p className="text-center font-bangers text-[10px] opacity-30 uppercase tracking-widest">Arsip Nasional Republik Indonesia</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}