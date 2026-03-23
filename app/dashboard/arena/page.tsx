"use client";

import { useEffect, useState, useCallback } from "react";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, getDoc, query, where, orderBy, limit } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Flame, TrendingUp, Crown, Loader2, MapPin, AlertCircle } from "lucide-react";

import { driver } from "driver.js";
import "driver.js/dist/driver.css";

interface Player {
  id: string;
  name: string;
  totalPoints: number;
  missionCount: number;
  prov: string;
  isMe?: boolean;
}

export default function ArenaPage() {
  const [tab, setTab] = useState<"global" | "regional">("global");
  const [players, setPlayers] = useState<Player[]>([]);
  const [myStats, setMyStats] = useState({ score: 0, missions: 0, rank: "-", prov: "" });
  const [loading, setLoading] = useState(true);
  const [errorIndex, setErrorIndex] = useState(false);

  // FUNGSI TOUR DRIVER.JS
  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        { 
          element: '#stats-card', 
          popover: { 
            title: 'Statistik Kamu', 
            description: 'Di sini lo bisa lihat total poin, jumlah misi yang beres, dan peringkat lo saat ini.', 
            side: "bottom", 
            align: 'start' 
          } 
        },
        { 
          element: '#tab-switcher', 
          popover: { 
            title: 'Filter Wilayah', 
            description: 'Mau lihat peringkat se-Indonesia atau cuma di provinsi lo aja? Klik di sini!', 
            side: "bottom", 
            align: 'start' 
          } 
        },
        { 
          element: '#podium-area', 
          popover: { 
            title: 'Top Pahlawan', 
            description: 'Tiga pahlawan dengan skor tertinggi tampil di podium kehormatan.', 
            side: "bottom", 
            align: 'center' 
          } 
        },
        { 
          element: '#leaderboard-list', 
          popover: { 
            title: 'Daftar Peringkat', 
            description: 'Cek posisi lo di antara pahlawan lainnya. Terus selesaikan misi buat naik ke atas!', 
            side: "top", 
            align: 'center' 
          } 
        },
      ]
    });

    driverObj.drive();
  };

  const fetchLeaderboardData = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const myDoc = await getDoc(doc(db, "users", userId));
      let currentProv = "Indonesia";
      
      if (myDoc.exists()) {
        const d = myDoc.data();
        currentProv = d.prov || d.provinsi || "Indonesia";
        const myMissions = await getDocs(collection(db, "users", userId, "completedMissions"));
        
        setMyStats(prev => ({ 
          ...prev, 
          prov: currentProv,
          score: Number(d.score) || 0,
          missions: myMissions.size
        }));
      }

      let userQuery = query(
        collection(db, "users"),
        where("role", "!=", "admin"),
        ...(tab === "regional" && currentProv !== "Indonesia" ? [where("prov", "==", currentProv)] : []),
        orderBy("score", "desc"),
        limit(25)
      );

      const usersSnap = await getDocs(userQuery);
      const resolvedPlayers = await Promise.all(
        usersSnap.docs.map(async (userDoc) => {
          const userData = userDoc.data();
          const mSnap = await getDocs(collection(db, "users", userDoc.id, "completedMissions"));
          return {
            id: userDoc.id,
            name: userData.name || userData.nama || "Pahlawan",
            totalPoints: Number(userData.score) || 0,
            missionCount: mSnap.size,
            prov: userData.prov || "Indonesia",
            isMe: userDoc.id === userId
          };
        })
      );

      setPlayers(resolvedPlayers);
      const myRankIndex = resolvedPlayers.findIndex(p => p.isMe);
      setMyStats(prev => ({ ...prev, rank: myRankIndex !== -1 ? (myRankIndex + 1).toString() : "25+" }));

      // JALANKAN TOUR JIKA PERTAMA KALI (Optional: pake localStorage biar gak muncul terus)
      if(!localStorage.getItem("arena_tour_done")) {
        setTimeout(startTour, 1000);
        localStorage.setItem("arena_tour_done", "true");
      }

    } catch (error: any) {
      console.error(error);
      if (error.code === "failed-precondition") setErrorIndex(true);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) fetchLeaderboardData(user.uid);
      else setLoading(false);
    });
    return () => unsub();
  }, [fetchLeaderboardData]);

  const topThree = players.slice(0, 3);

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-3 sm:p-4 pb-24 font-mono text-[#3e2723]">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="font-black text-xl sm:text-4xl drop-shadow-[2px_2px_0_#3e2723] text-yellow-400 uppercase italic tracking-tighter">
            🏆 Arena Ranking
          </h1>
        </div>
        <button onClick={startTour} className="text-[10px] bg-black text-white px-2 py-1 font-bold uppercase hover:bg-yellow-400 hover:text-black border-2 border-black">
          Bantuan?
        </button>
      </header>

      {/* ID: stats-card */}
      <div id="stats-card" className="bg-black border-4 border-black p-4 shadow-[6px_6px_0_#ef4444]">
        <div className="grid grid-cols-3 gap-2 sm:gap-6">
          <div className="text-center border border-white/20 p-2 sm:p-4 bg-white/5">
            <p className="text-xl sm:text-4xl font-black text-white">{myStats.score}</p>
            <p className="text-[7px] sm:text-[10px] font-black text-gray-400 uppercase leading-none">Poin</p>
          </div>
          <div className="text-center border border-white/20 p-2 sm:p-4 bg-white/5">
            <p className="text-xl sm:text-4xl font-black text-white">{myStats.missions}</p>
            <p className="text-[7px] sm:text-[10px] font-black text-gray-400 uppercase leading-none">Misi</p>
          </div>
          <div className="text-center bg-yellow-400 border-2 border-black p-2 sm:p-4 shadow-[2px_2px_0_#fff]">
            <p className="text-xl sm:text-4xl font-black text-black">#{myStats.rank}</p>
            <p className="text-[7px] sm:text-[10px] font-black text-black uppercase leading-none">Rank</p>
          </div>
        </div>
      </div>

      {/* ID: tab-switcher */}
      <div id="tab-switcher" className="flex bg-zinc-100 border-4 border-black p-1">
        <button onClick={() => setTab("global")} className={`flex-1 py-2 font-black uppercase text-[10px] sm:text-sm ${tab === "global" ? "bg-yellow-400 shadow-[inset_0_-4px_0_rgba(0,0,0,0.2)]" : "text-gray-400"}`}>
          🌍 Global
        </button>
        <button onClick={() => setTab("regional")} className={`flex-1 py-2 font-black uppercase text-[10px] sm:text-sm ${tab === "regional" ? "bg-blue-500 text-white shadow-[inset_0_-4px_0_rgba(0,0,0,0.2)]" : "text-gray-400"}`}>
          🗺️ {myStats.prov || "Wilayah"}
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-yellow-400" size={40} /></div>
      ) : (
        <div className="space-y-8">
          {/* ID: podium-area */}
          <div id="podium-area" className="grid grid-cols-3 items-end gap-1.5 pt-4 pb-2 max-w-sm mx-auto">
            {topThree[1] && (
               <div className="flex flex-col items-center">
                 <div className="bg-slate-300 border-2 sm:border-4 border-black p-1 w-full text-center text-[8px] sm:text-[10px] font-black truncate uppercase">{topThree[1].name}</div>
                 <div className="bg-slate-400 border-2 sm:border-4 border-t-0 border-black w-full h-8 sm:h-12 flex items-center justify-center font-black text-xl text-white">2</div>
               </div>
            )}
            {topThree[0] && (
               <div className="flex flex-col items-center -translate-y-1">
                 <Crown className="text-yellow-500 mb-0.5" size={20} fill="currentColor" />
                 <div className="bg-yellow-400 border-2 sm:border-4 border-black p-1 w-full text-center text-[9px] sm:text-xs font-black truncate uppercase">{topThree[0].name}</div>
                 <div className="bg-yellow-600 border-2 sm:border-4 border-t-0 border-black w-full h-10 sm:h-16 flex items-center justify-center font-black text-3xl text-white">1</div>
               </div>
            )}
            {topThree[2] && (
               <div className="flex flex-col items-center">
                 <div className="bg-orange-300 border-2 sm:border-4 border-black p-1 w-full text-center text-[8px] sm:text-[10px] font-black truncate uppercase">{topThree[2].name}</div>
                 <div className="bg-orange-500 border-2 sm:border-4 border-t-0 border-black w-full h-6 sm:h-10 flex items-center justify-center font-black text-lg text-white">3</div>
               </div>
            )}
          </div>

          {/* ID: leaderboard-list */}
          <div id="leaderboard-list" className="bg-white border-4 border-black shadow-[8px_8px_0_#000] overflow-hidden">
            <div className="bg-black text-white p-3 flex font-black text-[8px] sm:text-[10px] uppercase italic tracking-tighter">
              <span className="w-8 sm:w-12 text-center">#</span>
              <span className="flex-1">Pahlawan</span>
              <span className="w-20 sm:w-28 text-right pr-2">Skor</span>
            </div>
            <div className="divide-y-2 sm:divide-y-4 divide-black">
              <AnimatePresence>
                {players.map((p, i) => (
                  <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`flex items-center p-3 sm:p-4 ${p.isMe ? "bg-yellow-100" : "bg-white"}`}>
                    <span className="font-black text-lg sm:text-2xl w-8 sm:w-12 text-center text-gray-300 italic">{i + 1}</span>
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="font-black uppercase text-xs sm:text-base truncate">{p.name} {p.isMe && <span className="bg-red-500 text-white text-[7px] px-1 border-2 border-black ml-1">YOU</span>}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-[8px] font-bold text-gray-500 uppercase"><MapPin size={8} /> {p.prov}</div>
                    </div>
                    <div className="w-20 sm:w-28 text-right">
                      <p className="font-black text-xl sm:text-3xl italic leading-none">{p.totalPoints}</p>
                      <p className="text-[8px] font-black text-blue-600 uppercase mt-0.5 italic">Points</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}