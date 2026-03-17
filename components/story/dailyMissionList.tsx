"use client";
import React, { useEffect, useState, useCallback } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { CheckCircle2, Circle, Zap } from "lucide-react";

interface Mission {
  id: string;
  title: string;
  xpReward: number;
  isCompleted: boolean;
}

export default function DailyMissionList({ userId }: { userId: string }) {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Deklarasikan fungsi inisialisasi lebih dulu (Gunakan useCallback agar stabil)
  const initializeDailyMissions = useCallback(async (docRef: any) => {
    const initialMissions = [
      { id: "m1", title: "Selesaikan 1 Misi Sejarah", xpReward: 50, isCompleted: false },
      { id: "m2", title: "Dapatkan Skor > 80", xpReward: 100, isCompleted: false },
    ];
    try {
      await setDoc(docRef, {
        missions: initialMissions,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (err) {
      console.error("Gagal inisialisasi misi:", err);
    }
  }, []);

  // 2. Baru kemudian gunakan di dalam useEffect
  useEffect(() => {
    if (!userId) return;

    const today = new Date().toISOString().split("T")[0];
    const dailyDocRef = doc(db, "users", userId, "daily_progress", today);

    const unsub = onSnapshot(dailyDocRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setMissions(data.missions || []);
      } else {
        // Sekarang fungsi ini sudah aman untuk dipanggil
        initializeDailyMissions(dailyDocRef);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [userId, initializeDailyMissions]); // Tambahkan initializeDailyMissions ke dependencies

  if (loading) return <div className="text-xs font-black italic animate-pulse">MEMUAT MISI...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-black text-xl italic uppercase tracking-tighter text-black">Misi Harian</h4>
        <Zap size={20} className="fill-yellow-400 text-black" />
      </div>

      <div className="space-y-3">
        {missions.length > 0 ? (
          missions.map((m) => (
            <div 
              key={m.id}
              className={`border-4 border-black p-4 flex items-center justify-between transition-all ${
                m.isCompleted ? "bg-green-100 translate-x-1" : "bg-white shadow-[4px_4px_0_#000]"
              }`}
            >
              <div>
                <p className={`font-black text-sm uppercase text-black ${m.isCompleted ? "line-through opacity-50" : ""}`}>
                  {m.title}
                </p>
                <p className="text-[10px] font-bold text-blue-600">+{m.xpReward} XP</p>
              </div>
              {m.isCompleted ? (
                <CheckCircle2 className="text-green-600" size={24} strokeWidth={3} />
              ) : (
                <Circle className="text-black" size={24} strokeWidth={3} />
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-6 border-4 border-dashed border-black/10">
             <p className="text-xs italic font-bold text-black/40 uppercase">Belum Ada Misi</p>
          </div>
        )}
      </div>
    </div>
  );
}