"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Lock, Loader2, X, Share2, Star } from "lucide-react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import * as htmlToImage from 'html-to-image';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; 
  color: string;
  minPoints: number;
}

const BORDER_OPTIONS = [
  { color: "border-zinc-900", bg: "bg-zinc-900", req: 0, name: "Basic", label: "#1" },
  { color: "border-yellow-400", bg: "bg-yellow-400", req: 100, name: "Golden", label: "★" },
  { color: "border-red-500", bg: "bg-red-500", req: 300, name: "Patriot", label: "!" },
  { color: "border-purple-600", bg: "bg-purple-600", req: 500, name: "Legend", label: "∞" },
];

const HALFTONE_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Ccircle cx='2' cy='2' r='1' fill='%23000' opacity='0.06'/%3E%3C/svg%3E")`;

function Halftone() {
  return <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: HALFTONE_SVG, backgroundSize: "8px 8px" }} />;
}

function Panel({ children, className = "", rotate = "rotate-0" }: { children: React.ReactNode; className?: string; rotate?: string; }) {
  return (
    <div className={`relative bg-white border-[3px] md:border-[4px] border-black shadow-[4px_4px_0_0_#000] md:shadow-[5px_5px_0_0_#000] ${rotate} ${className}`}>
      <Halftone />
      {children}
    </div>
  );
}

function SpeechBubble({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div className={`relative inline-block ${className}`}>
      <div className="bg-white border-[2px] md:border-[3px] border-black px-2 md:px-3 py-1 rounded-[12px] md:rounded-[16px] shadow-[2px_2px_0_#000]">
        <span className="font-black text-[10px] md:text-xs uppercase tracking-tight text-black">{text}</span>
      </div>
      <div className="absolute -bottom-2 left-4 w-0 h-0 border-l-[6px] border-l-transparent border-r-[3px] border-r-transparent border-t-[8px] border-t-black" />
    </div>
  );
}

export default function BadgeGalleryPage() {
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [userTotalPoints, setUserTotalPoints] = useState(0);
  const [userName, setUserName] = useState("Pejuang");
  const [userPhoto, setUserPhoto] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeBadge, setActiveBadge] = useState<Badge | null>(null);
  const [activeBorder, setActiveBorder] = useState(BORDER_OPTIONS[0]);
  const [processing, setProcessing] = useState(false);

  const medalRef = useRef<HTMLDivElement>(null);

  const renderBadgeIcon = (icon: string, isUnlocked: boolean, className: string = "") => {
    const isBase64 = icon.startsWith("data:image");
    return isBase64 ? (
      <img src={icon} alt="badge" className={`${className} object-contain ${isUnlocked ? "" : "opacity-30 grayscale"}`} />
    ) : (
      <span className={`${className} flex items-center justify-center ${isUnlocked ? "" : "opacity-30 grayscale"}`}>{icon}</span>
    );
  };

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        onSnapshot(doc(db, "users", user.uid), (snap) => {
          if (snap.exists()) {
            setUserName(snap.data().name || "Pejuang");
            setUserPhoto(snap.data().photoURL || user.photoURL || "");
          }
        });
        const qBadges = query(collection(db, "badges"), orderBy("minPoints", "asc"));
        const badgesSnap = await getDocs(qBadges);
        setAllBadges(badgesSnap.docs.map(d => ({ id: d.id, ...d.data() } as Badge)));

        const missionsSnap = await getDocs(collection(db, "users", user.uid, "completedMissions"));
        let total = 0;
        missionsSnap.forEach(mDoc => {
          const data = mDoc.data();
          total += (Number(data.score) || 0) + (Number(data.finalScore) || 0);
        });
        setUserTotalPoints(total);
        setLoading(false);
      } else { setLoading(false); }
    });
    return () => unsubAuth();
  }, []);

  const handleDownload = async () => {
    if (!medalRef.current || !activeBadge) return;
    setProcessing(true);
    try {
      const dataUrl = await htmlToImage.toPng(medalRef.current, { 
        cacheBust: true, 
        pixelRatio: 3, 
        backgroundColor: '#FFFBEC' 
      });
      const link = document.createElement("a");
      link.download = `Histoplay-${activeBadge.name}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleShare = async () => {
    if (!medalRef.current || !activeBadge) return;
    setProcessing(true);
    try {
      const dataUrl = await htmlToImage.toPng(medalRef.current, { cacheBust: true, pixelRatio: 2, backgroundColor: '#FFFBEC' });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `Badge-${activeBadge.name}.png`, { type: 'image/png' });

      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: `Lencana ${activeBadge.name}`,
          text: `Gue baru dapet lencana "${activeBadge.name}" di Histoplay! Cek koleksi gue!`,
        });
      } else {
        handleDownload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const unlockedCount = allBadges.filter((b) => userTotalPoints >= b.minPoints).length;

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-yellow-50 font-black italic uppercase">Membuka Brankas...</div>;

  return (
    <div className="min-h-screen bg-amber-100 relative overflow-x-hidden pb-10">
      <Halftone />
      
      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-4 py-4 md:py-8 space-y-4 md:space-y-6">

        {/* HEADER */}
        <Panel className="p-3 md:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h1 className="text-xl sm:text-3xl md:text-5xl font-black uppercase italic leading-none text-black" style={{ fontFamily: "'Impact', sans-serif" }}>
              🎖️ Ruang Pencapaian
            </h1>
            <div className="flex gap-2">
              <div className="bg-black text-yellow-300 px-3 py-1 border-[2px] border-black font-black text-xs">
                {userTotalPoints.toLocaleString()} PTS
              </div>
              <div className="bg-yellow-300 text-black px-3 py-1 border-[2px] border-black font-black text-xs">
                {unlockedCount}/{allBadges.length} Lencana
              </div>
            </div>
          </div>
        </Panel>

        {/* PROFIL */}
        <Panel className="p-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-shrink-0">
              <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full border-[4px] md:border-[6px] ${activeBorder.color} bg-white overflow-hidden shadow-[4px_4px_0_#000]`}>
                {userPhoto ? <img src={userPhoto} className="w-full h-full object-cover" alt="pfp" /> : <div className="w-full h-full flex items-center justify-center text-3xl">👤</div>}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-red-600 border border-black text-white font-black text-[8px] px-2 py-0.5 uppercase rotate-12">{activeBorder.name}</div>
            </div>
            <div className="text-center sm:text-left flex-1 space-y-2">
              <h2 className="text-2xl md:text-4xl font-black uppercase italic leading-none text-black" style={{ fontFamily: "'Impact', sans-serif" }}>{userName}</h2>
              <SpeechBubble text={`Total: ${userTotalPoints.toLocaleString()} Poin Perjuangan!`} />
              <div className="grid grid-cols-4 gap-2 pt-2">
                {BORDER_OPTIONS.map((b) => (
                  <button key={b.name} disabled={userTotalPoints < b.req} onClick={() => setActiveBorder(b)} className={`p-1 border-[2px] border-black text-[8px] md:text-[10px] font-black uppercase transition-all ${activeBorder.name === b.name ? 'bg-black text-white' : 'bg-white text-black'} ${userTotalPoints < b.req ? 'opacity-30' : 'shadow-[2px_2px_0_#000] active:translate-y-0.5'}`}>
                    {b.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Panel>

        {/* COLLECTION */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {allBadges.map((badge) => {
            const isUnlocked = userTotalPoints >= badge.minPoints;
            return (
              <motion.button key={badge.id} whileTap={isUnlocked ? { scale: 0.95 } : {}} onClick={() => isUnlocked && setActiveBadge(badge)} className={`relative p-3 border-[3px] border-black aspect-square flex flex-col items-center justify-center transition-all ${isUnlocked ? `${badge.color} shadow-[4px_4px_0_#000]` : "bg-stone-200 grayscale opacity-60 cursor-not-allowed"}`}>
                <Halftone />
                {!isUnlocked && <Lock className="absolute top-1 left-1 text-black/20" size={14} />}
                {renderBadgeIcon(badge.icon, isUnlocked, "w-12 h-12 md:w-16 md:h-16 mb-1 relative z-10")}
                <p className="font-black text-[10px] uppercase text-center leading-tight z-10" style={{ fontFamily: "'Impact', sans-serif" }}>{badge.name}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* MODAL PREVIEW - FOKUS KE BADGE & LINGKARAN */}
      <AnimatePresence>
        {activeBadge && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-blue-600/30 backdrop-blur-md z-[100]" onClick={() => setActiveBadge(null)} />
            <motion.div initial={{ scale: 0.8, opacity: 0, rotate: -5 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} exit={{ scale: 0.8, opacity: 0 }} className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
              <div className="pointer-events-auto w-full max-w-[340px]">
                
                {/* AREA YANG DI-RENDER JADI GAMBAR */}
                <div ref={medalRef} className="bg-[#FFFBEC] border-[6px] border-black shadow-[12px_12px_0_#000] p-8 text-center relative overflow-hidden">
                  <Halftone />
                  
                  {/* Dekorasi Sticker */}
                  <div className="absolute top-2 right-2 bg-yellow-400 border-[3px] border-black px-4 py-1 font-black text-xs rotate-6 z-20">TERBUKA!</div>
                  <Star className="absolute top-4 left-4 text-red-500 animate-pulse" size={24} fill="currentColor" />

                  {/* ICON BADGE - LINGKARAN SEMPURNA */}
                  <div className={`w-36 h-36 mx-auto ${activeBadge.color} border-[5px] border-black rounded-full flex items-center justify-center shadow-[8px_8px_0_#000] mb-8 relative z-10`}>
                    <div className="absolute inset-2 border-2 border-dashed border-black rounded-full opacity-40"></div> {/* Efek lingkaran putus-putus di dalam */}
                    {renderBadgeIcon(activeBadge.icon, true, "w-20 h-20 drop-shadow-[4px_4px_0_rgba(0,0,0,0.2)]")}
                  </div>
                  
                  <div className="space-y-2 relative z-10">
                    <h3 className="font-black text-4xl uppercase italic leading-none text-black tracking-tighter" style={{ fontFamily: "'Impact', sans-serif" }}>{activeBadge.name}</h3>
                    <div className="bg-black text-white px-3 py-1 font-black text-[10px] uppercase inline-block italic skew-x-[-12deg]">ACHIEVEMENT UNLOCKED</div>
                    
                    <div className="mt-8 border-t-4 border-black border-dashed pt-5">
                      <p className="text-xs font-bold italic text-black leading-tight uppercase">
                        "{activeBadge.description}"
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 text-[8px] font-black uppercase opacity-20 tracking-[0.4em]">Histoplay Digital Achievement</div>
                </div>

                {/* TOMBOL AKSI */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button onClick={handleShare} disabled={processing} className="bg-black text-yellow-400 flex items-center justify-center gap-2 font-black py-4 border-[4px] border-black shadow-[4px_4px_0_#555] active:translate-y-1 active:shadow-none uppercase text-xs italic transition-all">
                    {processing ? <Loader2 className="animate-spin" size={16} /> : <Share2 size={16} />} Bagikan
                  </button>
                  <button onClick={() => setActiveBadge(null)} className="bg-white text-black flex items-center justify-center font-black py-4 border-[4px] border-black shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-none uppercase text-xs italic">
                    Tutup
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}