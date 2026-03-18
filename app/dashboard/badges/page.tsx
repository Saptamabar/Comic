"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Lock, Loader2, X, Star, Zap, Shield, Trophy } from "lucide-react";
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

const BURST_COLORS = ["bg-yellow-300", "bg-red-400", "bg-blue-400", "bg-green-400", "bg-pink-400", "bg-orange-400"];

// Comic burst/star shape
function BurstStar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="currentColor" />
    </svg>
  );
}

// Halftone dots overlay
function Halftone() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ backgroundImage: HALFTONE_SVG, backgroundSize: "8px 8px" }}
    />
  );
}

// Comic panel border wrapper
function Panel({
  children,
  className = "",
  rotate = "rotate-0",
}: {
  children: React.ReactNode;
  className?: string;
  rotate?: string;
}) {
  return (
    <div
      className={`relative bg-white border-[4px] border-black shadow-[5px_5px_0_0_#000] ${rotate} ${className}`}
    >
      <Halftone />
      {children}
    </div>
  );
}

// Comic speech bubble
function SpeechBubble({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div className={`relative inline-block ${className}`}>
      <div className="bg-white border-[3px] border-black px-3 py-1 rounded-[16px] shadow-[3px_3px_0_#000]">
        <span className="font-black text-xs uppercase tracking-tight text-black">{text}</span>
      </div>
      <div className="absolute -bottom-2.5 left-4 w-0 h-0 border-l-[8px] border-l-transparent border-r-[4px] border-r-transparent border-t-[10px] border-t-black" />
      <div className="absolute -bottom-1.5 left-[18px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[3px] border-r-transparent border-t-[8px] border-t-white" />
    </div>
  );
}

// Action word (POW, ZAP, etc.)
function ActionWord({ word, className = "" }: { word: string; className?: string }) {
  return (
    <div className={`relative inline-block select-none ${className}`}>
      <BurstStar className="absolute inset-0 w-full h-full text-yellow-300 -z-10" />
      <span
        className="relative z-10 font-black text-black uppercase italic"
        style={{
          fontFamily: "'Impact', 'Arial Black', sans-serif",
          textShadow: "2px 2px 0 #fff, -1px -1px 0 #000",
        }}
      >
        {word}
      </span>
    </div>
  );
}

export default function BadgeGalleryPage() {
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [userTotalPoints, setUserTotalPoints] = useState(0);
  const [userName, setUserName] = useState("Pejuang");
  const [loading, setLoading] = useState(true);
  const [activeBadge, setActiveBadge] = useState<Badge | null>(null);
  const [activeBorder, setActiveBorder] = useState(BORDER_OPTIONS[0]);
  const [downloading, setDownloading] = useState(false);
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);

  const medalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          onSnapshot(doc(db, "users", user.uid), (snap) => {
            if (snap.exists()) setUserName(snap.data().name || "Pejuang");
          });

          const qBadges = query(collection(db, "badges"), orderBy("minPoints", "asc"));
          const badgesSnap = await getDocs(qBadges);
          const badgesList = badgesSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Badge));
          setAllBadges(badgesList);

          const missionsSnap = await getDocs(collection(db, "users", user.uid, "completedMissions"));
          let total = 0;
          missionsSnap.forEach((mDoc) => {
            const data = mDoc.data();
            total += (Number(data.score) || 0) + (Number(data.finalScore) || 0);
          });
          setUserTotalPoints(total);
        } catch (error) {
          console.error("Firestore Error:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubAuth();
  }, []);

  const downloadBadgeImage = async () => {
    if (!medalRef.current || !activeBadge) return;
    setDownloading(true);
    try {
      const dataUrl = await htmlToImage.toPng(medalRef.current, { cacheBust: true });
      const link = document.createElement("a");
      link.download = `Medali-${activeBadge.name.replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Gagal mengunduh gambar:", err);
      alert("Maaf, gagal mengunduh gambar medali.");
    } finally {
      setDownloading(false);
    }
  };

  const userRank =
    userTotalPoints >= 500
      ? "⚡ JENDERAL"
      : userTotalPoints >= 300
      ? "🛡️ KAPTEN"
      : userTotalPoints >= 100
      ? "⭐ SERSAN"
      : "🪖 PRAJURIT";

  const unlockedCount = allBadges.filter((b) => userTotalPoints >= b.minPoints).length;

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 bg-yellow-50">
        <div className="relative">
          <BurstStar className="w-24 h-24 text-yellow-300 animate-spin [animation-duration:3s]" />
          <Loader2 className="absolute inset-0 m-auto text-black animate-spin" size={32} strokeWidth={3} />
        </div>
        <Panel className="px-6 py-3">
          <p
            className="text-2xl uppercase italic font-black text-black"
            style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}
          >
            Membuka Brankas...
          </p>
        </Panel>
      </div>
    );

  return (
    <div className="min-h-screen bg-amber-100 relative overflow-x-hidden">
      {/* ── Page-level comic background ── */}
      <Halftone />
      {/* Decorative background words */}
      <div
        className="fixed inset-0 pointer-events-none select-none overflow-hidden opacity-[0.03] text-black font-black italic"
        style={{ fontFamily: "'Impact', 'Arial Black', sans-serif", fontSize: "clamp(4rem, 12vw, 9rem)", lineHeight: 1.1 }}
      >
        <div className="absolute top-10 left-0">POW!</div>
        <div className="absolute top-1/3 right-0">ZAP!</div>
        <div className="absolute bottom-20 left-10">BOOM!</div>
        <div className="absolute bottom-1/3 right-10">BANG!</div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-6 md:py-10 space-y-6 md:space-y-8">

        {/* ══════════════════════════════════
             HEADER
        ══════════════════════════════════ */}
        <Panel  className="p-4 md:p-6 overflow-hidden">
          {/* Red stripe top */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-red-600" />

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 mt-2">
            <div className="flex items-center gap-3">
              <ActionWord word="!" className="text-3xl md:text-4xl w-14 h-14 md:w-16 md:h-16 flex items-center justify-center" />
              <div>
                <div className="inline-block bg-red-600 border-[3px] border-black px-2 py-0.5 shadow-[3px_3px_0_#000] mb-1">
                  <span className="text-white font-black text-[10px] uppercase tracking-widest">Museum Digital</span>
                </div>
                <h1
                  className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black uppercase italic text-black leading-none"
                  style={{ fontFamily: "'Impact', 'Arial Black', sans-serif", textShadow: "3px 3px 0 #fde047" }}
                >
                  🎖️ Ruang Pencapaian
                </h1>
              </div>
            </div>

            {/* Stats pills */}
            <div className="sm:ml-auto flex flex-wrap gap-2">
              <div className="border-[3px] border-black bg-black text-yellow-300 px-3 py-1 shadow-[3px_3px_0_#555] font-black text-sm uppercase">
                {userTotalPoints.toLocaleString()} PTS
              </div>
              <div className="border-[3px] border-black bg-yellow-300 text-black px-3 py-1 shadow-[3px_3px_0_#000] font-black text-sm uppercase">
                {unlockedCount}/{allBadges.length} Lencana
              </div>
            </div>
          </div>
        </Panel>

        {/* ══════════════════════════════════
             PROFIL + BORDER SELECTOR (1 BOX)
        ══════════════════════════════════ */}
        <Panel  className="p-4 md:p-5">
          <div className="absolute top-3 right-3 opacity-10">
            <Trophy size={64} strokeWidth={1} />
          </div>

          {/* Profil */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-5">
            <div className="relative flex-shrink-0">
              <div
                className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-[6px] ${activeBorder.color} bg-zinc-100 flex items-center justify-center text-5xl shadow-[5px_5px_0_#000] transition-all duration-300`}
              >
                👤
              </div>
              <div className="absolute -bottom-2 -right-2 bg-red-600 border-[2px] border-black text-white font-black text-[9px] px-1.5 py-0.5 uppercase shadow-[2px_2px_0_#000]">
                {activeBorder.name}
              </div>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h2
                className="text-3xl md:text-4xl font-black uppercase text-black leading-none mb-2"
                style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}
              >
                {userName}
              </h2>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-3">
                <span className="bg-black text-yellow-300 border-[2px] border-black px-2 py-0.5 font-black text-xs uppercase shadow-[2px_2px_0_#555]">
                  {userRank}
                </span>
              </div>
              <SpeechBubble text={`Total: ${userTotalPoints.toLocaleString()} Poin Perjuangan!`} />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t-[3px] border-dashed border-black mb-4" />

          {/* Border Selector */}
          <div className="flex items-center gap-2 mb-3">
            <Shield size={14} strokeWidth={3} />
            <h3
              className="text-sm font-black uppercase italic text-black"
              style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}
            >
              Pilih Bingkai Profil
            </h3>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {BORDER_OPTIONS.map((b) => {
              const isLocked = userTotalPoints < b.req;
              const isActive = activeBorder.color === b.color;
              return (
                <button
                  key={b.color}
                  disabled={isLocked}
                  onClick={() => !isLocked && setActiveBorder(b)}
                  className={`relative flex flex-col items-center gap-2 p-3 border-[3px] transition-all duration-150
                    ${isActive ? "border-black bg-black scale-[1.04] shadow-none" : "border-black bg-white shadow-[3px_3px_0_#000] hover:-translate-y-0.5 hover:shadow-[3px_5px_0_#000]"}
                    ${isLocked ? "opacity-40 cursor-not-allowed" : "cursor-pointer active:translate-y-0.5 active:shadow-none"}`}
                >
                  {isLocked && <Lock size={10} className="absolute top-1.5 right-1.5 text-gray-400" />}
                  <div className={`w-10 h-10 rounded-full border-[5px] ${b.color} ${isActive ? "bg-zinc-700" : "bg-zinc-100"}`} />
                  <div className="text-center leading-none">
                    <p
                      className={`font-black text-xs uppercase ${isActive ? "text-white" : "text-black"}`}
                      style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}
                    >
                      {b.name}
                    </p>
                    <p className={`text-[10px] font-bold ${isLocked ? "text-red-500" : isActive ? "text-yellow-300" : "text-zinc-500"}`}>
                      {b.req === 0 ? "Gratis" : `≥${b.req} pts`}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </Panel>

        {/* ══════════════════════════════════
             BADGE COLLECTION
        ══════════════════════════════════ */}
        <div>
          {/* Section header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-[4px] bg-black" />
            <div className="bg-yellow-300 text-black border-[3px] border-black px-4 py-1.5 shadow-[4px_4px_0_#000] flex items-center gap-2">
              <Star size={16} className="fill-black text-black" />
              <span
                className="font-black text-xl md:text-2xl uppercase italic text-black"
                style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}
              >
                Koleksi Lencana
              </span>
            </div>
            <div className="flex-1 h-[4px] bg-black" />
          </div>

          {/* Badge grid */}
          <div className="border-[5px] border-black bg-amber-50 p-3 md:p-4 shadow-[8px_8px_0_#000]">
            <div
              className="grid gap-3 md:gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))" }}
            >
              {allBadges.map((badge, i) => {
                const isUnlocked = userTotalPoints >= badge.minPoints;
                const isHovered = hoveredBadge === badge.id;
                const burstColor = BURST_COLORS[i % BURST_COLORS.length];

                return (
                  <motion.button
                    key={badge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, type: "spring", stiffness: 200, damping: 18 }}
                    whileTap={isUnlocked ? { scale: 0.94 } : {}}
                    onClick={() => isUnlocked && setActiveBadge(badge)}
                    onMouseEnter={() => isUnlocked && setHoveredBadge(badge.id)}
                    onMouseLeave={() => setHoveredBadge(null)}
                    className={`group relative flex flex-col items-center justify-center p-3 border-[4px] border-black transition-all duration-150 overflow-hidden aspect-square
                      ${isUnlocked
                        ? `${badge.color || "bg-blue-300"} cursor-pointer shadow-[4px_4px_0_#000] hover:-translate-y-1.5 hover:shadow-[4px_6px_0_#000] `
                        : "bg-stone-200 cursor-not-allowed shadow-[2px_2px_0_#aaa]"}`}
                  >
                    <Halftone />

                    {/* Locked overlay */}
                    {!isUnlocked && (
                      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60">
                        <Lock size={22} className="text-zinc-500 mb-1.5" strokeWidth={2.5} />
                        <div className="bg-red-600 border-[2px] border-black px-2 py-0.5 transform shadow-[2px_2px_0_#000]">
                          <p className="text-[9px] font-black text-white uppercase whitespace-nowrap">
                            {badge.minPoints} PTS
                          </p>
                        </div>
                      </div>
                    )}

                    {/* KA-POW hover burst */}
                    {isUnlocked && isHovered && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
                        animate={{ opacity: 1, scale: 1, rotate: 10 }}
                        className="absolute top-1 right-1 z-30 pointer-events-none"
                      >
                        <div className={`relative w-10 h-10 ${burstColor} flex items-center justify-center`} style={{ clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" }}>
                          <span className="text-[7px] font-black text-black uppercase italic">POW!</span>
                        </div>
                      </motion.div>
                    )}

                    {/* Badge icon */}
                    <span
                      className={`text-4xl md:text-5xl mb-2 relative z-10 transition-transform duration-150 ${isUnlocked ? "drop-shadow-[2px_2px_0_rgba(0,0,0,0.25)] group-hover:scale-110" : "opacity-30 grayscale"}`}
                    >
                      {badge.icon}
                    </span>

                    {/* Badge name */}
                    <p
                      className={`relative z-10 font-black text-xs md:text-sm uppercase text-center leading-tight ${isUnlocked ? "text-black" : "text-stone-400"}`}
                      style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}
                    >
                      {badge.name}
                    </p>

                    {/* Progress chip */}
                    {isUnlocked && (
                      <div className="absolute bottom-1.5 right-1.5 bg-black border border-white px-1 py-0.5 z-10">
                        <span className="text-[8px] font-black text-yellow-300 uppercase">{badge.minPoints}+</span>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-2 pb-8">
          <div className="inline-flex items-center gap-2 opacity-30">
            <div className="h-px w-8 bg-black" />
            <p className="font-black text-xs uppercase italic text-black tracking-widest">
              Pusat Arsip Sejarah Indonesia • Bangsa yang besar tidak melupakan sejarah!
            </p>
            <div className="h-px w-8 bg-black" />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
           MODAL DETAIL
      ══════════════════════════════════ */}
      <AnimatePresence>
        {activeBadge && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/85 z-[100] backdrop-blur-[2px]"
              onClick={() => setActiveBadge(null)}
            />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.7, y: 80, rotate: -8 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.7, y: 80, rotate: 8 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              className="fixed inset-0 z-[110] flex items-center justify-center px-4 py-6 pointer-events-none"
            >
              <div className="pointer-events-auto w-full max-w-sm bg-white border-[6px] border-black shadow-[12px_12px_0_#000] relative overflow-hidden">
                <Halftone />

                {/* Top red bar */}
                <div className="h-3 bg-red-600 border-b-[3px] border-black" />

                {/* Close button */}
                <button
                  onClick={() => setActiveBadge(null)}
                  className="absolute top-3 right-3 bg-black text-white p-1.5 border-[3px] border-white hover:bg-red-600 transition-colors shadow-[2px_2px_0_#555] z-20 active:scale-90"
                >
                  <X size={18} strokeWidth={3} />
                </button>

                {/* MEDAL AREA (for download) */}
                <div ref={medalRef} className="bg-white p-5 pt-4">
                  {/* Action word decorations */}
                  <div className="absolute -top-6 -left-6 pointer-events-none select-none opacity-10">
                    <ActionWord word="WOW!" className="text-5xl w-20 h-20 flex items-center justify-center" />
                  </div>

                  {/* Badge icon */}
                  <div className="flex justify-center mb-4">
                    <div
                      className={`relative w-28 h-28 ${activeBadge.color} border-[6px] border-black rounded-full flex items-center justify-center shadow-[6px_6px_0_#000]`}
                    >
                      <span className="text-6xl drop-shadow-[2px_2px_0_rgba(0,0,0,0.2)]">{activeBadge.icon}</span>
                      {/* Mini star accents */}
                      <BurstStar className="absolute -top-3 -right-3 w-8 h-8 text-yellow-300" />
                      <BurstStar className="absolute -bottom-2 -left-3 w-6 h-6 text-yellow-300" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-center font-black text-3xl uppercase italic text-black leading-none mb-2"
                    style={{
                      fontFamily: "'Impact', 'Arial Black', sans-serif",
                      textShadow: "2px 2px 0 #fde047",
                    }}
                  >
                    {activeBadge.name}
                  </h3>

                  {/* Unlocked badge */}
                  <div className="flex justify-center mb-4">
                    <div className="bg-red-600 border-[3px] border-black text-white px-3 py-0.5 shadow-[3px_3px_0_#000] flex items-center gap-1.5">
                      <Zap size={12} className="fill-yellow-300 text-yellow-300" />
                      <span className="font-black text-xs uppercase tracking-widest">Pencapaian Terbuka!</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-yellow-50 border-[3px] border-black p-3 shadow-[4px_4px_0_#000] relative">
                    <div className="absolute -top-3 left-3 bg-black text-yellow-300 px-2 py-0.5 text-[9px] font-black uppercase border border-yellow-300">
                      DESKRIPSI
                    </div>
                    <p className="font-bold text-sm italic text-zinc-800 leading-snug text-center mt-1">
                      "{activeBadge.description}"
                    </p>
                  </div>

                  {/* Points required */}
                  <div className="flex justify-center mt-3">
                    <div className="bg-black text-white px-3 py-1 border-[2px] border-black font-black text-xs uppercase">
                      ⚡ Min. {activeBadge.minPoints} PTS
                    </div>
                  </div>
                </div>
                {/* END MEDAL AREA */}

                {/* Download button */}
                <div className="px-5 pb-5">
                  <button
                    onClick={downloadBadgeImage}
                    disabled={downloading}
                    className="w-full flex items-center justify-center gap-2 bg-black text-yellow-300 font-black text-xl uppercase py-3.5 border-[4px] border-black hover:bg-yellow-300 hover:text-black transition-all shadow-[5px_5px_0_#555] active:translate-y-1 active:shadow-none relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}
                  >
                    {downloading ? (
                      <>
                        <Loader2 className="animate-spin" size={22} />
                        <span>Memproses...</span>
                      </>
                    ) : (
                      <>
                        <Download size={22} strokeWidth={3} />
                        <span>Unduh Medali (PNG)</span>
                      </>
                    )}
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