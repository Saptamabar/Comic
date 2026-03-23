"use client";
import React, { useEffect, useState } from "react";
import { Map, Trophy, Star, ChevronRight, Lock, X, Play } from "lucide-react";
import { db, auth } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import LevelNode from "@/components/story/levelNode";

import Link from "next/link";
import Image from "next/image";

// Types
type EraType = "era_kemerdekaan" | "era_orde_lama" | "era_order_lama" | "era_orde_baru" | "era_order_baru" | "era_reformasi";

interface MissionData {
  id: string;
  title: string;
  orderIndex: number;
  era: EraType;
  type: string;
  description?: string;
  thumbnail?: string;
}

interface GroupedEra {
  eraId: EraType;
  label: string;
  color: string;
  missions: MissionData[];
}

export default function StoryPathPage() {
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [groupedData, setGroupedData] = useState<GroupedEra[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMission, setSelectedMission] = useState<MissionData | null>(null);

  const eraMeta: Record<EraType, { label: string; color: string }> = {
    era_kemerdekaan: { label: "Era Kemerdekaan", color: "bg-red-600" },
    era_orde_lama: { label: "Era Orde Lama", color: "bg-orange-500" },
    era_order_lama: { label: "Era Orde Lama", color: "bg-orange-500" },
    era_orde_baru: { label: "Era Orde Baru", color: "bg-blue-600" },
    era_order_baru: { label: "Era Orde Baru", color: "bg-blue-600" },
    era_reformasi: { label: "Era Reformasi", color: "bg-emerald-600" },
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "missions"), orderBy("orderIndex", "asc"));
    const unsubscribeMissions = onSnapshot(q, (snapshot) => {
      const allMissions = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as MissionData))
        .filter(m => m.type === "explorations");

      const eraOrder: EraType[] = ["era_kemerdekaan", "era_orde_lama", "era_order_lama", "era_orde_baru", "era_order_baru", "era_reformasi"];
      const groups = allMissions.reduce((acc, mission) => {
        const era = mission.era || "era_kemerdekaan";
        if (!acc[era]) acc[era] = [];
        acc[era].push(mission);
        return acc;
      }, {} as Record<string, MissionData[]>);

      const formatted = eraOrder
        .filter(eraId => groups[eraId])
        .map((eraId) => ({
          eraId: eraId,
          label: eraMeta[eraId]?.label || "Unknown Era",
          color: eraMeta[eraId]?.color || "bg-gray-600",
          missions: groups[eraId],
        }));

      setGroupedData(formatted);
      setLoading(false);
    });
    return () => unsubscribeMissions();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const unsubProgress = onSnapshot(collection(db, "users", userId, "completedMissions"), (snap) => {
      setCompletedMissions(snap.docs.map(doc => doc.id));
    });
    return () => unsubProgress();
  }, [userId]);

  if (loading) return (
    <div className="h-full flex items-center justify-center font-black text-3xl italic text-gray-400 animate-pulse">
      LOADING ARCHIVES...
    </div>
  );

  let globalMissionIndex = 0;

  return (
    <div className="flex flex-col h-full bg-[#fdf6e3] rounded-3xl border-4 border-[#3e2723] overflow-hidden shadow-[12px_12px_0_#3e2723] relative">
      
      {/* Header Sticky */}
      <nav className="z-3 bg-[#fcf8ef] border-b-4 border-[#3e2723] p-4 sticky top-0 flex items-center justify-between">
        <div className="flex items-center gap-3 bg-pop-yellow border-4 border-[#3e2723] px-4 py-1 -rotate-1 shadow-[4px_4px_0_#3e2723]">
          <Map size={24} strokeWidth={3} />
          <h1 className="font-black text-xl md:text-2xl italic uppercase tracking-tighter">Mission Path</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#fcf8ef] border-4 border-[#3e2723] px-3 py-1 rounded-xl font-black text-lg shadow-[3px_3px_0_#3e2723]">
            <Star fill="#ef4444" className="text-red-600" size={20}/>
            <span>{completedMissions.length}</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-[#fcf8ef] border-4 border-[#3e2723] px-3 py-1 rounded-xl font-black text-lg shadow-[3px_3px_0_#3e2723]">
            <Trophy fill="#eab308" className="text-yellow-500" size={20}/>
            <span>{Math.floor(completedMissions.length / 3)}</span>
          </div>
        </div>
      </nav>

      {/* Main Content: Full Width Map */}
      <div className="flex-1 overflow-y-auto bg-[radial-gradient(rgba(62,39,35,0.15)_1.5px,transparent_0)] [background-size:24px_24px] scrollbar-hide">
        <div className="max-w-4xl mx-auto py-16 px-6">
          
          {groupedData.length === 0 ? (
            <div className="text-center font-black p-10 bg-[#fcf8ef] border-8 border-[#3e2723] shadow-[15px_15px_0_#3e2723] rotate-1">
              <h3 className="text-3xl text-[#3e2723]">NO MISSIONS FOUND</h3>
              <p className="mt-2 opacity-60 text-[#3e2723]">The history archives are currently empty.</p>
            </div>
          ) : (
            groupedData.map((group, gIdx) => (
              <section key={group.eraId} className="mb-40 relative">
                
                {/* Era Banner */}
                <div className="relative mb-24 flex justify-center">
                   <div className={`${group.color} border-8 border-[#3e2723] p-8 text-white shadow-[15px_15px_0_#3e2723] -rotate-2 relative z-3 min-w-[300px] text-center`}>
                      <span className="absolute -top-6 -left-6 bg-[#3e2723] text-white px-4 py-1 font-black italic text-xl border-4 border-white">UNIT 0{gIdx + 1}</span>
                      <h2 className="font-black text-4xl md:text-5xl italic leading-none uppercase drop-shadow-[4px_4px_0_rgba(62,39,35,0.5)]">{group.label}</h2>
                   </div>
                   {/* Decorative Line behind units */}
                   <div className="absolute top-1/2 left-0 right-0 h-2 bg-[#3e2723]/10 -translate-y-1/2 -z-3 rounded-full" />
                </div>
  
                {/* Nodes Path Wrapper */}
                <div className="flex flex-col items-center relative">
                 

                  {group.missions.map((m, mIdx) => {
                    const isCompleted = completedMissions.includes(m.id);
                    const isUnlocked = globalMissionIndex === 0 || isCompleted || (
                      completedMissions.length >= globalMissionIndex
                    );
  
                    const isLast = mIdx === group.missions.length - 1;
                    const node = (
                      <div key={m.id} className="relative z-10 group w-full">
                        <LevelNode 
                          mission={{ id: m.id, title: m.title, unlocked: isUnlocked, completed: isCompleted }} 
                          index={gIdx === 0 ? globalMissionIndex : m.orderIndex - 1} // use a better index logic if needed, but globalMissionIndex is fine
                          color={group.color}
                          isLast={isLast}
                          onClick={() => setSelectedMission(m)}
                        />
                        {/* Status Indicator Floating */}
                        {!isUnlocked && (
                          <div className="absolute top-10 right-1/4 bg-[#3e2723] p-1 rounded-lg border-2 border-[#fdf6e3] text-[#fdf6e3]">
                            <Lock size={14} />
                          </div>
                        )}
                      </div>
                    );
                    globalMissionIndex++;
                    return node;
                  })}
                </div>

                {/* Transition to next era */}
                {gIdx < groupedData.length - 1 && (
                  <div className="flex justify-center mt-20">
                     <div className="bg-[#3e2723] text-[#ffca28] p-2 rounded-full animate-bounce">
                        <ChevronRight size={32} className="rotate-90" />
                     </div>
                  </div>
                )}
              </section>
            ))
          )}

          
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-pop-yellow border-4 border-[#3e2723] p-4 shadow-[4px_4px_0_#3e2723] hover:translate-y-1 hover:shadow-none transition-all z-40 active:scale-90 text-[#3e2723]"
      >
        <ChevronRight size={32} className="-rotate-90" />
      </button>

      {/* Mission Preview Modal */}
      {selectedMission && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex justify-center items-center p-4">
          <div className="bg-[#fcf8ef] border-4 border-[#3e2723] max-w-sm md:max-w-md w-full shadow-[8px_8px_0_#3e2723] flex flex-col relative animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b-4 border-[#3e2723] bg-pop-yellow text-[#3e2723]">
              <h2 className="font-black text-xl italic uppercase tracking-tighter line-clamp-1">{selectedMission.title}</h2>
              <button onClick={() => setSelectedMission(null)} className="hover:scale-110 active:scale-95 transition-transform bg-[#fdf6e3] border-2 border-[#3e2723] rounded-full p-1 shadow-[2px_2px_0_#3e2723]">
                <X size={20} className="text-[#3e2723]" strokeWidth={3} />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-4 flex flex-col gap-4">
              <div className="relative w-full aspect-video border-4 border-[#3e2723] bg-[#e5e7eb] overflow-hidden shadow-[4px_4px_0_#3e2723]">
                {selectedMission.thumbnail ? (
                  <Image src={selectedMission.thumbnail} alt={selectedMission.title} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-[#3e2723]/40 font-bold italic">NO IMAGE</div>
                )}
              </div>
              <div className="bg-[#fdf6e3] border-2 border-[#3e2723] p-3 shadow-inner">
                <p className="font-bold text-sm md:text-base text-[#3e2723] break-words line-clamp-4">
                  {selectedMission.description || "Sebuah tugas rahasia menanti. Persiapkan dirimu untuk misi ini!"}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 pt-0 border-t-0 flex justify-center mt-2">
              <Link
                href={`/game/story/${selectedMission.id}/game`}
                className="w-full flex items-center justify-center gap-2 bg-red-600 border-4 border-[#3e2723] text-white font-black py-3 text-lg hover:bg-red-700 hover:scale-[1.02] active:scale-95 transition-all shadow-[4px_4px_0_#3e2723] italic uppercase"
              >
                <Play fill="white" size={20} />
                MULAI MISI
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}