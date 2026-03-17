"use client";
import React, { useEffect, useState } from "react";
import { Flame, Star, Loader2 } from "lucide-react"; // Import diperbaiki
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import DailyMissionList from "./dailyMissionList";

export default function StorySidebar({ userId }: { userId: string }) {
  const [profile, setProfile] = useState({ xp: 0, streak: 0 });

  useEffect(() => {
    if (!userId) return;

    const unsub = onSnapshot(doc(db, "users", userId), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setProfile({ 
          xp: data.xp || 0, 
          streak: data.streak || 0 
        });
      }
    });
    return () => unsub();
  }, [userId]);

  // Loading state ketika userId belum tersedia
  if (!userId) return (
    <aside className="hidden lg:flex w-[380px] flex-col border-l-8 border-black bg-[#fefce8] p-6 items-center justify-center">
       <Loader2 className="animate-spin text-black" size={32} />
       <p className="mt-2 font-black italic uppercase text-xs">Otentikasi...</p>
    </aside>
  );

  return (
    <aside className="hidden lg:flex w-[380px] flex-col border-l-8 border-black bg-[#fefce8] p-6 overflow-y-auto">
      <div className="space-y-8">
        {/* PROFILE CARD */}
        <div className="bg-white border-4 border-black p-5 shadow-[8px_8px_0_#000] -rotate-1">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-amber-400 border-4 border-black flex items-center justify-center font-black text-2xl text-black">
              {/* Ambil inisial jika ada, atau default A */}
              A
            </div>
            <div>
              <h3 className="font-black text-lg leading-tight uppercase italic text-black">User Agent</h3>
              <p className="text-[10px] bg-black text-white px-2 py-0.5 inline-block font-bold">RECRUIT LEVEL 1</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
             <div className="p-2 border-2 border-black text-center bg-white shadow-[3px_3px_0_#000]">
                <Flame size={16} className="text-orange-500 mx-auto" fill="currentColor" />
                <p className="font-black text-xl text-black">{profile.streak}</p>
                <p className="text-[9px] font-bold uppercase text-black">Streak</p>
             </div>
             <div className="p-2 border-2 border-black text-center bg-white shadow-[3px_3px_0_#000]">
                <Star size={16} className="text-yellow-500 mx-auto" fill="currentColor" />
                <p className="font-black text-xl text-black">{profile.xp}</p>
                <p className="text-[9px] font-bold uppercase text-black">Total XP</p>
             </div>
          </div>
        </div>

        {/* DAILY MISSION LIST */}
        <DailyMissionList userId={userId} />
      </div>
    </aside>
  );
}