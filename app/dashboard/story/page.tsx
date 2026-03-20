"use client";
import React, { useEffect, useState } from "react";
import { Map, Trophy, Star, ChevronRight, Lock } from "lucide-react";
import { db, auth } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import LevelNode from "@/components/story/levelNode";

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
    <div className="flex flex-col h-full bg-[#f3f4f6] rounded-3xl border-4 border-black overflow-hidden shadow-[12px_12px_0_#000] relative">
      
      {/* Header Sticky */}
      <nav className="z-3 bg-white border-b-4 border-black p-4 sticky top-0 flex items-center justify-between">
        <div className="flex items-center gap-3 bg-pop-yellow border-4 border-black px-4 py-1 -rotate-1 shadow-[4px_4px_0_#000]">
          <Map size={24} strokeWidth={3} />
          <h1 className="font-black text-xl md:text-2xl italic uppercase tracking-tighter">Mission Path</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white border-4 border-black px-3 py-1 rounded-xl font-black text-lg shadow-[3px_3px_0_#000]">
            <Star fill="#ef4444" className="text-red-600" size={20}/>
            <span>{completedMissions.length}</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white border-4 border-black px-3 py-1 rounded-xl font-black text-lg shadow-[3px_3px_0_#000]">
            <Trophy fill="#eab308" className="text-yellow-500" size={20}/>
            <span>{Math.floor(completedMissions.length / 3)}</span>
          </div>
        </div>
      </nav>

      {/* Main Content: Full Width Map */}
      <div className="flex-1 overflow-y-auto bg-[radial-gradient(#d1d5db_1.5px,transparent_0)] [background-size:32px_32px] scrollbar-hide">
        <div className="max-w-4xl mx-auto py-16 px-6">
          
          {groupedData.length === 0 ? (
            <div className="text-center font-black p-10 bg-white border-8 border-black shadow-[15px_15px_0_#000] rotate-1">
              <h3 className="text-3xl">NO MISSIONS FOUND</h3>
              <p className="mt-2 opacity-60">The history archives are currently empty.</p>
            </div>
          ) : (
            groupedData.map((group, gIdx) => (
              <section key={group.eraId} className="mb-40 relative">
                
                {/* Era Banner */}
                <div className="relative mb-24 flex justify-center">
                   <div className={`${group.color} border-8 border-black p-8 text-white shadow-[15px_15px_0_#000] -rotate-2 relative z-3 min-w-[300px] text-center`}>
                      <span className="absolute -top-6 -left-6 bg-black text-white px-4 py-1 font-black italic text-xl border-4 border-white">UNIT 0{gIdx + 1}</span>
                      <h2 className="font-black text-4xl md:text-5xl italic leading-none uppercase drop-shadow-[4px_4px_0_rgba(0,0,0,0.3)]">{group.label}</h2>
                   </div>
                   {/* Decorative Line behind units */}
                   <div className="absolute top-1/2 left-0 right-0 h-2 bg-black/10 -translate-y-1/2 -z-3 rounded-full" />
                </div>
  
                {/* Nodes Path Wrapper */}
                <div className="flex flex-col items-center relative w-full" style={{ minHeight: group.missions.length * 192 }}>
                  
                  {/* Dashed lines connecting the nodes */}
                  {(() => {
                    const groupStartIndex = globalMissionIndex;
                    const xOffsets = [-60, -100, -60, 0, 60, 100, 60, 0];
                    return (
                      <div className="absolute inset-0 w-full pointer-events-none" style={{ height: group.missions.length * 192, zIndex: 0 }}>
                        {group.missions.map((m, idx) => {
                          if (idx === group.missions.length - 1) return null;
                          const currentGlobalIdx = groupStartIndex + idx;
                          // If current node is completed, the path to the next node is unlocked
                          const isCompleted = completedMissions.includes(m.id);
                          const nextNodeUnlocked = isCompleted || completedMissions.length >= currentGlobalIdx + 1;

                          const startXOffset = xOffsets[currentGlobalIdx % 8];
                          const endXOffset = xOffsets[(currentGlobalIdx + 1) % 8];
                          const startY = 96 + idx * 192;
                          // const endY = 96 + (idx + 1) * 192;
                          
                          const dx = endXOffset - startXOffset;
                          const dy = 192; // gap between nodes (y2 - y1)
                          const length = Math.sqrt(dx * dx + dy * dy);
                          const angle = Math.atan2(dy, dx) * (180 / Math.PI); // Angle in degrees

                          return (
                            <div 
                              key={`line-${m.id}`}
                              className="absolute border-t-[6px] border-dashed"
                              style={{
                                width: `${length}px`,
                                top: `${startY - 3}px`,
                                left: `calc(50% + ${startXOffset}px)`,
                                transformOrigin: "0 50%",
                                transform: `rotate(${angle}deg)`,
                                borderColor: nextNodeUnlocked ? "black" : "#d1d5db",
                                zIndex: 0
                              }}
                            />
                          );
                        })}
                      </div>
                    );
                  })()}

                  {group.missions.map((m) => {
                    const isCompleted = completedMissions.includes(m.id);
                    const isUnlocked = globalMissionIndex === 0 || isCompleted || (
                      completedMissions.length >= globalMissionIndex
                    );
  
                    const node = (
                      <div key={m.id} className="relative z-10 my-4 group">
                        <LevelNode 
                          mission={{ id: m.id, title: m.title, unlocked: isUnlocked, completed: isCompleted }} 
                          index={globalMissionIndex} 
                          color={group.color} 
                          onClick={() => setSelectedMission(m)}
                        />
                        {/* Status Indicator Floating */}
                        {!isUnlocked && (
                          <div className="absolute -top-2 -right-2 bg-black p-1 rounded-lg border-2 border-white text-white">
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
                     <div className="bg-black text-white p-2 rounded-full animate-bounce">
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
        className="fixed bottom-8 right-8 bg-pop-yellow border-4 border-black p-4 shadow-[4px_4px_0_#000] hover:translate-y-1 hover:shadow-none transition-all z-40 active:scale-90"
      >
        <ChevronRight size={32} className="-rotate-90" />
      </button>

      {/* Mission Detail Modal */}
      {selectedMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-white border-4 border-black p-6 shadow-[10px_10px_0_#000] max-w-lg w-full relative animate-in zoom-in duration-200">
            <button 
               className="absolute top-2 right-2 bg-red-500 text-white border-2 border-black w-8 h-8 flex items-center justify-center font-black hover:bg-red-600 active:translate-y-1 z-10"
               onClick={() => setSelectedMission(null)}
            >
              X
            </button>
            <h2 className="font-bangers text-3xl md:text-4xl mb-4 italic pr-8 leading-none">{selectedMission.title}</h2>
            {selectedMission.thumbnail ? (
              <img src={selectedMission.thumbnail} alt={selectedMission.title} className="w-full h-48 sm:h-56 object-cover border-4 border-black mb-4" />
            ) : (
              <div className="w-full h-48 sm:h-56 bg-gray-200 border-4 border-black mb-4 flex items-center justify-center font-bangers text-3xl text-gray-400">
                NO THUMBNAIL
              </div>
            )}
            <p className="font-comic text-sm sm:text-base md:text-lg mb-6 leading-tight max-h-32 overflow-y-auto pr-2">
              {selectedMission.description || "Tidak ada deskripsi tersedia untuk misi ini."}
            </p>
            <button 
              onClick={() => {
                window.location.href = `/game/story/${selectedMission.id}/game`;
              }}
              className="w-full bg-pop-yellow border-4 border-black p-3 font-bangers text-2xl hover:bg-yellow-400 active:translate-y-1 shadow-[4px_4px_0_#000] transition-transform"
            >
              MULAI MISI &rarr;
            </button>
          </div>
        </div>
      )}

    </div>
  );
}