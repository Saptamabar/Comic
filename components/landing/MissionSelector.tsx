"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { cn } from "@/lib/utils";
import { Lock, CheckCircle2, Loader2, Play, X, ChevronDown } from "lucide-react";

const ERA_FLOW = ["era_kemerdekaan", "era_orde_lama", "era_orde_baru", "era_reformasi"];
const ERA_LABELS: Record<string, string> = {
  era_kemerdekaan: "ERA KEMERDEKAAN",
  era_orde_lama: "ORDE LAMA",
  era_orde_baru: "ORDE BARU",
  era_reformasi: "ERA REFORMASI",
};

export function MissionSelector({ onClose, onSelectMission }: { onClose: () => void; onSelectMission?: (id: string) => void }) {
  const [missions, setMissions] = useState<any[]>([]);
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDocs(collection(db, "missions"));
        const allData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const filtered = allData
          .filter((m: any) => m.type === "explorations")
          .sort((a: any, b: any) => (Number(a.orderIndex) || 0) - (Number(b.orderIndex) || 0));
        setMissions(filtered);
      } catch (err: any) {
        console.error("Error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        const userSnap = await getDoc(doc(db, "users", user.uid));
        if (userSnap.exists()) setCompletedMissions(userSnap.data()?.completedMissions || []);
      } else {
        setIsLoggedIn(false);
        setCompletedMissions([]);
      }
    });
    return () => unsub();
  }, []);

  const getStatus = (missionId: string, globalIndex: number) => {
    if (completedMissions.includes(missionId)) return "completed";
    if (!isLoggedIn) return globalIndex === 0 ? "available" : "locked";
    if (globalIndex === 0) return "available";
    const prev = missions[globalIndex - 1];
    return (prev && completedMissions.includes(prev.id)) ? "available" : "locked";
  };

  const groupedMissions = useMemo(() => {
    const groups: Record<string, any[]> = {};
    missions.forEach((m) => {
      const era = m.era || "era_kemerdekaan";
      if (!groups[era]) groups[era] = [];
      groups[era].push(m);
    });
    return ERA_FLOW.map(era => ({
      key: era, label: ERA_LABELS[era], items: groups[era] || []
    })).filter(g => g.items.length > 0);
  }, [missions]);

  if (loading) return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
      <Loader2 className="animate-spin text-yellow-500 w-10 h-10" />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-zinc-950/98 z-50 p-4 md:p-10 overflow-y-auto scrollbar-hide">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10 border-b-4 border-white pb-6">
          <h1 className="text-3xl md:text-6xl font-black text-white italic uppercase tracking-tighter drop-shadow-[3px_3px_0_#dc2626]">ARSIP MISI</h1>
          <button onClick={onClose} className="bg-white border-2 border-black p-2 shadow-[3px_3px_0_#000]">
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        {groupedMissions.map((group, idx) => (
          <div key={group.key} className="mb-12">
            <h2 className="text-white font-black text-lg md:text-2xl mb-6 bg-red-700 inline-block px-4 py-1 shadow-[4px_4px_0_#000] -rotate-1">
              UNIT 0{idx + 1}: {group.label}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 items-start">
              {group.items.map((mission) => {
                const globalIdx = missions.findIndex(m => m.id === mission.id);
                const status = getStatus(mission.id, globalIdx);
                const isLocked = status === "locked";
                const isSelected = activeId === mission.id;

                return (
                  <motion.div
                    key={mission.id}
                    layout
                    onClick={() => !isLocked && setActiveId(isSelected ? null : mission.id)}
                    className={cn(
                      "bg-white border-[3px] border-black p-2 md:p-4 shadow-[4px_4px_0_#000] flex flex-col transition-all",
                      isLocked ? "opacity-40 grayscale cursor-not-allowed" : "cursor-pointer hover:shadow-yellow-400",
                      isSelected && "ring-4 ring-yellow-400 border-yellow-400"
                    )}
                  >
                    <div className="relative aspect-video border-2 border-black bg-zinc-800 overflow-hidden mb-3">
                      {mission.thumbnail ? (
                        <Image src={mission.thumbnail} alt={mission.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-white/20 italic">IMAGE</div>
                      )}
                      
                      {isLocked && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                          <Lock size={24} />
                        </div>
                      )}

                      {status === "completed" && (
                        <div className="absolute top-1 right-1 bg-green-500 border-2 border-black p-0.5 rounded-full text-white z-10 shadow-md">
                          <CheckCircle2 size={14} />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-start gap-1 mb-1">
                      <h3 className="text-[11px] md:text-lg font-black uppercase italic leading-tight line-clamp-2">
                        {mission.title}
                      </h3>
                      <span className="text-[10px] md:text-sm font-black text-red-600">#{mission.orderIndex}</span>
                    </div>

                    <p className="text-[9px] md:text-xs font-bold text-zinc-500 italic mb-2 leading-tight line-clamp-2 md:line-clamp-3">
                      {mission.description || "Buka arsip rahasia untuk memulai misi ini..."}
                    </p>

                    <AnimatePresence>
                      {isSelected && !isLocked && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="mt-2 border-t-2 border-black/5 pt-3"
                        >
                          <Link
                            href={`/game/story/${mission.id}/game`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onSelectMission) {
                                e.preventDefault();
                                onSelectMission(mission.id);
                              }
                            }}
                            className="flex items-center justify-center gap-1 w-full bg-black text-white py-2 md:py-3 font-black text-[10px] md:text-sm border-2 border-black hover:bg-yellow-400 hover:text-black transition-all uppercase italic shadow-[3px_3px_0_#dc2626] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                          >
                            <Play size={12} fill="currentColor" />
                            MULAI MISI
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {!isSelected && !isLocked && (
                        <div className="mt-auto flex justify-center pt-1 opacity-20">
                            <ChevronDown size={14} />
                        </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}