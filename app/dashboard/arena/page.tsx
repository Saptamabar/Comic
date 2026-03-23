"use client";

import { useEffect, useState, useCallback } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Flame, TrendingUp, Crown, Loader2, MapPin, AlertCircle } from "lucide-react";

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

  const fetchLeaderboardData = useCallback(async () => {
    setLoading(true);
    setErrorIndex(false);
    try {
      const currentUser = auth.currentUser;
      let currentProv = myStats.prov;

      if (currentUser && !currentProv) {
        const myDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (myDoc.exists()) {
          const d = myDoc.data();
          currentProv = d.prov || d.provinsi || "Indonesia"; 
          setMyStats((prev) => ({ ...prev, prov: currentProv }));
        }
      }

      let userQuery;
      if (tab === "regional" && currentProv && currentProv !== "Indonesia") {
        userQuery = query(
          collection(db, "users"),
          where("role", "!=", "admin"),
          where("prov", "==", currentProv) 
        );
      } else {
        userQuery = query(
          collection(db, "users"),
          where("role", "!=", "admin")
        );
      }

      const usersSnap = await getDocs(userQuery);

      const promises = usersSnap.docs.map(async (userDoc) => {
        const userData = userDoc.data();
        const missionsSnap = await getDocs(collection(db, "users", userDoc.id, "completedMissions"));
        
        let totalScore = 0;
        missionsSnap.forEach((mDoc) => {
          const data = mDoc.data();
          totalScore += (Number(data.score) || Number(data.finalScore) || 0); 
        });

        return {
          id: userDoc.id,
          name: userData.name || userData.nama || userData.displayName || "Pahlawan Anonim",
          totalPoints: totalScore,
          missionCount: missionsSnap.size,
          prov: userData.prov || userData.provinsi || "Indonesia", 
          isMe: userDoc.id === currentUser?.uid
        };
      });

      const resolvedPlayers = await Promise.all(promises);
      
      const sortedPlayers = resolvedPlayers.sort((a, b) => b.totalPoints - a.totalPoints);
      setPlayers(sortedPlayers);

      const me = sortedPlayers.find(p => p.isMe);
      if (me) {
        setMyStats(prev => ({
          ...prev,
          score: me.totalPoints,
          missions: me.missionCount,
          rank: (sortedPlayers.indexOf(me) + 1).toString(),
        }));
      }
    } catch (error: any) {
      console.error("Leaderboard Error:", error);
      if (error.message?.includes("index") || error.code === "failed-precondition") {
        setErrorIndex(true);
      }
    } finally {
      setLoading(false);
    }
  }, [tab, myStats.prov]);

  useEffect(() => {
    fetchLeaderboardData();
  }, [fetchLeaderboardData]);

  const topThree = players.slice(0, 3);

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-4 pb-20 font-mono text-black">
      <header>
        <h1 className="font-black text-5xl drop-shadow-[3px_3px_0_#000] text-yellow-400 uppercase italic tracking-tighter">
          🏆 Arena Ranking
        </h1>
        <p className="font-bold text-gray-500 mt-2 uppercase italic text-xs tracking-[0.2em]">
          Akumulasi Skor Misi & Tantangan
        </p>
      </header>

      {/* Stats Summary Card */}
      <div className="bg-black border-4 border-black p-6 shadow-[8px_8px_0_#ef4444] transition-transform hover:scale-[1.01]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center border-2 border-white/20 p-4 bg-white/5">
            <TrendingUp className="text-yellow-400 mx-auto mb-1" size={20} />
            <p className="text-4xl font-black text-white">{myStats.score}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase">Total Poin</p>
          </div>
          <div className="text-center border-2 border-white/20 p-4 bg-white/5">
            <Flame className="text-red-500 mx-auto mb-1" size={20} />
            <p className="text-4xl font-black text-white">{myStats.missions}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase">Misi Selesai</p>
          </div>
          <div className="text-center border-2 border-white/20 p-4 bg-white/5">
            <Trophy className="text-blue-400 mx-auto mb-1" size={20} />
            <p className="text-4xl font-black text-white">#{myStats.rank}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase">Peringkat Anda</p>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-4 justify-center sm:justify-start overflow-x-auto pb-2">
        {["global", "regional"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`text-xl font-black px-8 py-2 border-4 border-black transition-all uppercase whitespace-nowrap ${
              tab === t 
                ? "bg-yellow-400 shadow-[4px_4px_0_#000] -translate-y-1 translate-x-[-2px] text-black" 
                : "bg-white hover:bg-gray-100 shadow-[2px_2px_0_#000] text-black"
            }`}
          >
            {t === "global" ? "🌍 Global" : `🗺️ ${myStats.prov || "Regional"}`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <Loader2 className="animate-spin mx-auto text-yellow-400 mb-4" size={50} />
          <p className="text-2xl font-black italic uppercase text-gray-400 animate-pulse">Menghitung Skor Pahlawan...</p>
        </div>
      ) : errorIndex ? (
        <div className="p-8 border-4 border-black bg-red-100 text-center space-y-4">
          <AlertCircle size={48} className="mx-auto text-red-600" />
          <p className="font-black uppercase text-red-600">Firestore Index Diperlukan!</p>
          <p className="text-sm font-bold text-black">Buka Firebase Console dan buat Composite Index untuk field 'prov' agar fitur Regional bisa digunakan.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Podium Section */}
          <div className="flex items-end justify-center gap-2 sm:gap-6 pt-12 pb-6 min-h-[300px]">
              {/* 2nd Place */}
              {topThree[1] && (
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-slate-300 border-4 border-black rounded-full flex items-center justify-center font-black text-xl mb-2 text-black">2</div>
                  <div className="bg-slate-300 border-4 border-black p-2 w-24 sm:w-36 text-center shadow-[4px_4px_0_#000]">
                     <p className="font-black text-[10px] sm:text-sm truncate uppercase text-black">{topThree[1].name}</p>
                     <p className="text-[10px] font-bold bg-white/50 rounded mt-1 px-1 text-black">{topThree[1].totalPoints} PTS</p>
                  </div>
                  <div className="bg-slate-400 border-4 border-t-0 border-black w-24 sm:w-36 h-20 flex items-center justify-center font-black text-4xl text-white">2</div>
                </motion.div>
              )}

              {/* 1st Place */}
              {topThree[0] && (
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center -translate-y-6 text-black">
                  <Crown className="text-yellow-500 mb-2 animate-bounce" size={40} fill="currentColor" />
                  <div className="w-16 h-16 bg-yellow-400 border-4 border-black rounded-full flex items-center justify-center font-black text-3xl mb-2 shadow-xl">1</div>
                  <div className="bg-yellow-400 border-4 border-black p-3 w-32 sm:w-44 text-center shadow-[6px_6px_0_#000]">
                     <p className="font-black text-xs sm:text-lg truncate uppercase leading-tight">{topThree[0].name}</p>
                     <p className="text-xs font-bold bg-black text-white rounded mt-1">{topThree[0].totalPoints} PTS</p>
                  </div>
                  <div className="bg-yellow-600 border-4 border-t-0 border-black w-32 sm:w-44 h-32 flex items-center justify-center font-black text-6xl text-white">1</div>
                </motion.div>
              )}

              {/* 3rd Place */}
              {topThree[2] && (
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-orange-300 border-4 border-black rounded-full flex items-center justify-center font-black text-lg mb-2 text-black">3</div>
                  <div className="bg-orange-300 border-4 border-black p-2 w-24 sm:w-36 text-center shadow-[4px_4px_0_#000]">
                     <p className="font-black text-[10px] sm:text-sm truncate uppercase text-black">{topThree[2].name}</p>
                     <p className="text-[10px] font-bold bg-white/50 rounded mt-1 px-1 text-black">{topThree[2].totalPoints} PTS</p>
                  </div>
                  <div className="bg-orange-500 border-4 border-t-0 border-black w-24 sm:w-36 h-12 flex items-center justify-center font-black text-2xl text-white">3</div>
                </motion.div>
              )}
          </div>

          <div className="bg-white border-4 border-black shadow-[10px_10px_0_#000] overflow-hidden rounded-sm">
            <div className="bg-black text-white p-4 flex font-black text-sm sm:text-2xs uppercase tracking-widest italic">
              <span className="w-12 text-center">#</span>
              <span className="flex-1">Nama Pahlawan</span>
              <span className="w-24 text-right">Skor Akumulasi</span>
            </div>
            
            <div className="divide-y-4 divide-black">
              <AnimatePresence>
                {players.length > 0 ? (
                  players.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`flex items-center p-4 transition-colors ${p.isMe ? "bg-yellow-100" : "bg-white hover:bg-slate-50"}`}
                    >
                      <span className="font-black text-2xl w-12 text-center text-gray-300 italic">{i + 1}</span>
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="font-black uppercase text-sm sm:text-base truncate flex items-center gap-2 text-black">
                            {p.name} 
                            {p.isMe && <span className="bg-red-500 text-white text-[8px] px-2 py-0.5 border-2 border-black tracking-tighter shadow-[2px_2px_0_#000]">YOU</span>}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] text-gray-500 flex items-center gap-1 font-bold uppercase">
                            <MapPin size={10} className="text-red-500"/> {p.prov}
                          </span>
                          <span className="text-[9px] bg-black text-white px-1.5 font-bold uppercase">{p.missionCount} Misi</span>
                        </div>
                      </div>
                      <div className="w-24 text-right">
                        <p className="font-black text-2xl leading-none text-black tracking-tighter">{p.totalPoints}</p>
                        <p className="text-[9px] font-black text-blue-600 uppercase italic mt-1">Points</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-20 text-center font-black text-xl text-gray-400 italic">BELUM ADA DATA PEMAIN</div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      <footer className="text-center">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white border-2 border-black inline-block px-4 py-1">
          Leaderboard diperbarui secara real-time berdasarkan pencapaian pahlawan
        </p>
      </footer>
    </div>
  );
}