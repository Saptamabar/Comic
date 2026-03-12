"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { motion } from "framer-motion";
import { Trophy, Medal, Flame, TrendingUp, Crown } from "lucide-react";

const mockLeaderboard = [
  { rank: 1, name: "Pahlawan_Raffi", score: 4850, missions: 6, badge: "🥇" },
  { rank: 2, name: "HistorianGirls", score: 4320, missions: 5, badge: "🥈" },
  { rank: 3, name: "NusaHero99", score: 3900, missions: 5, badge: "🥉" },
  { rank: 4, name: "Proklamator_Z", score: 3600, missions: 4, badge: "" },
  { rank: 5, name: "SejarahFan", score: 3200, missions: 4, badge: "" },
  { rank: 6, name: "MajapahitKid", score: 2900, missions: 3, badge: "" },
  { rank: 7, name: "Borobudur_X", score: 2500, missions: 3, badge: "" },
  { rank: 8, name: "Kamu", score: 0, missions: 0, badge: "👤", isMe: true },
];

export default function ArenaPage() {
  const [tab, setTab] = useState<"global" | "regional">("global");

  const topThree = mockLeaderboard.slice(0, 3);
  const restPlayers = mockLeaderboard.slice(3);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-bangers text-5xl drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)]">🏆 ARENA</h1>
        <p className="font-comic font-bold text-gray-500 mt-2">Bersaing dengan pahlawan-pahlawan sejarah terbaik seluruh Indonesia!</p>
      </div>

      {/* Player Stats */}
      <div className="bg-black text-white border-4 border-black p-6 shadow-[6px_6px_0_#facc15]">
        <h2 className="font-bangers text-3xl text-pop-yellow mb-4">STATISTIK AKUNMU</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: "Total Poin", value: "0", icon: TrendingUp, color: "text-pop-yellow" },
            { label: "Misi Sukses", value: "0", icon: Flame, color: "text-pop-red" },
            { label: "Peringkat Global", value: "-", icon: Trophy, color: "text-yellow-400" },
          ].map((s) => (
            <div key={s.label} className="border-2 border-white/20 p-4 text-center">
              <s.icon size={28} className={`${s.color} mx-auto mb-2`} />
              <p className="font-bangers text-4xl">{s.value}</p>
              <p className="font-comic text-xs text-gray-400 font-bold">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["global", "regional"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-bangers text-2xl uppercase px-6 py-2 border-4 border-black transition-all ${
              tab === t ? "bg-pop-yellow shadow-[4px_4px_0_#000] -translate-y-1" : "bg-white hover:bg-gray-100"
            }`}
          >
            {t === "global" ? "🌍 Global" : "🗺️ Regional"}
          </button>
        ))}
      </div>

      {/* Podium Top 3 */}
      <div className="flex items-end justify-center gap-4">
        {/* 2nd Place */}
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 bg-gray-300 border-4 border-black flex items-center justify-center text-3xl font-bangers rounded-full mb-2">
            {topThree[1]?.badge || "🥈"}
          </div>
          <div className="bg-gray-300 border-4 border-black w-28 text-center p-2">
            <p className="font-bangers text-lg text-black">{topThree[1]?.name}</p>
            <p className="font-comic text-sm font-bold text-gray-600">{topThree[1]?.score.toLocaleString()} pts</p>
          </div>
          <div className="bg-gray-400 border-4 border-t-0 border-black w-28 h-16 flex items-center justify-center">
            <span className="font-bangers text-4xl text-white">2</span>
          </div>
        </motion.div>

        {/* 1st Place */}
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0 }}
          className="flex flex-col items-center"
        >
          <Crown className="text-pop-yellow mb-2" size={40} />
          <div className="w-20 h-20 bg-pop-yellow border-4 border-black flex items-center justify-center text-4xl font-bangers rounded-full mb-2 shadow-[4px_4px_0_#000]">
            {topThree[0]?.badge || "🥇"}
          </div>
          <div className="bg-pop-yellow border-4 border-black w-32 text-center p-2 shadow-[4px_4px_0_#000]">
            <p className="font-bangers text-xl text-black">{topThree[0]?.name}</p>
            <p className="font-comic text-sm font-bold text-gray-700">{topThree[0]?.score.toLocaleString()} pts</p>
          </div>
          <div className="bg-yellow-600 border-4 border-t-0 border-black w-32 h-24 flex items-center justify-center">
            <span className="font-bangers text-5xl text-white">1</span>
          </div>
        </motion.div>

        {/* 3rd Place */}
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <div className="w-14 h-14 bg-orange-300 border-4 border-black flex items-center justify-center text-2xl font-bangers rounded-full mb-2">
            {topThree[2]?.badge || "🥉"}
          </div>
          <div className="bg-orange-300 border-4 border-black w-28 text-center p-2">
            <p className="font-bangers text-lg text-black">{topThree[2]?.name}</p>
            <p className="font-comic text-sm font-bold text-gray-600">{topThree[2]?.score.toLocaleString()} pts</p>
          </div>
          <div className="bg-orange-500 border-4 border-t-0 border-black w-28 h-10 flex items-center justify-center">
            <span className="font-bangers text-3xl text-white">3</span>
          </div>
        </motion.div>
      </div>

      {/* Full Rankings List */}
      <div className="bg-white border-4 border-black shadow-[6px_6px_0_#000]">
        <div className="bg-black text-white p-4 flex gap-4">
          <span className="font-bangers text-xl w-12 text-center">#</span>
          <span className="font-bangers text-xl flex-1">NAMA PEMAIN</span>
          <span className="font-bangers text-xl w-24 text-right">POIN</span>
          <span className="font-bangers text-xl w-24 text-right hidden md:block">MISI</span>
        </div>
        {[...topThree, ...restPlayers].map((player: any, i) => (
          <motion.div
            key={player.rank}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-center gap-4 p-4 border-b-2 border-black last:border-b-0 ${
              player.isMe ? "bg-pop-yellow" : i % 2 === 0 ? "bg-white" : "bg-gray-50"
            }`}
          >
            <span className="font-bangers text-2xl w-12 text-center text-gray-500">{player.rank}</span>
            <span className="font-comic font-bold flex-1 flex items-center gap-2">
              {player.badge && <span className="text-xl">{player.badge}</span>}
              {player.name}
              {player.isMe && <span className="bg-black text-pop-yellow font-bangers text-xs px-2 py-0.5 ml-2">KAMU</span>}
            </span>
            <span className="font-bangers text-2xl w-24 text-right">{player.score.toLocaleString()}</span>
            <span className="font-comic text-sm font-bold w-24 text-right hidden md:block text-gray-500">{player.missions} Misi</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
