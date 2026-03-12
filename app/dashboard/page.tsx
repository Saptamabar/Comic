"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Sword, Trophy, Medal, Users, Star, Flame, TrendingUp } from "lucide-react";

const featureCards = [
  {
    href: "/dashboard/story",
    icon: BookOpen,
    title: "Story Mode",
    desc: "Jalani misi sejarah interaktif dan tentukan nasib bangsa!",
    color: "bg-pop-blue",
    textColor: "text-white",
    badge: "8 Misi Tersedia",
    rotate: "-rotate-1"
  },
  {
    href: "/dashboard/quest",
    icon: Sword,
    title: "Quest Mode",
    desc: "Tantangan cepat dengan batas waktu untuk kumpulkan poin bonus!",
    color: "bg-pop-red",
    textColor: "text-white",
    badge: "Hadiah Badge!",
    rotate: "rotate-1"
  },
  {
    href: "/dashboard/arena",
    icon: Trophy,
    title: "Arena",
    desc: "Bersaing dengan pemain lain dan raih posisi teratas leaderboard!",
    color: "bg-pop-yellow",
    textColor: "text-black",
    badge: "Real-time",
    rotate: "-rotate-1"
  },
  {
    href: "/dashboard/badges",
    icon: Medal,
    title: "Badge Gallery",
    desc: "Koleksi badge, border, dan aset pencapaian digitalmu.",
    color: "bg-purple-500",
    textColor: "text-white",
    badge: "Buka Koleksi",
    rotate: "rotate-1"
  },
  {
    href: "/dashboard/heroes",
    icon: Users,
    title: "Galeri Pahlawan",
    desc: "Temui, pelajari, dan teladani para pahlawan yang kamu jumpai.",
    color: "bg-green-500",
    textColor: "text-white",
    badge: "Ensiklopedia",
    rotate: "-rotate-1"
  },
];

const stats = [
  { label: "Total Poin", value: "0", icon: Star, color: "text-pop-yellow" },
  { label: "Misi Selesai", value: "0", icon: Flame, color: "text-pop-red" },
  { label: "Badge Diraih", value: "0", icon: Medal, color: "text-purple-500" },
  { label: "Peringkat Arena", value: "-", icon: TrendingUp, color: "text-pop-blue" },
];

export default function DashboardHomePage() {
  const [username, setUsername] = useState("Petualang");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUsername(user.email?.split("@")[0] ?? "Pahlawan");
        // TODO: fetch real stats from Firestore
      }
    });
    return () => unsub();
  }, []);

  return (
    <div className="space-y-8">
      {/* Greeting Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-black text-white border-4 border-black p-6 shadow-[8px_8px_0_#facc15] relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }}
        />
        <p className="font-comic font-bold text-pop-yellow uppercase tracking-widest text-sm">Welcome back, player!</p>
        <h1 className="font-bangers text-5xl mt-1 capitalize">{username} <span className="text-pop-yellow">⚡</span></h1>
        <p className="font-comic text-gray-300 mt-2">Sejarah Indonesia menunggumu. Misi baru tersedia hari ini!</p>
      </motion.div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border-4 border-black p-4 shadow-[4px_4px_0_#000] text-center"
          >
            <s.icon size={32} className={`${s.color} mx-auto mb-2`} />
            <p className="font-bangers text-4xl text-black">{s.value}</p>
            <p className="font-comic text-sm text-gray-500 font-bold">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Feature Grid */}
      <div>
        <h2 className="font-bangers text-3xl mb-4 border-b-4 border-black inline-block pb-1">FITUR UTAMA</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {featureCards.map((card, i) => (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <Link href={card.href} className={`flex flex-col h-full ${card.color} border-4 border-black p-6 shadow-[6px_6px_0_#000] ${card.rotate} hover:shadow-[10px_10px_0_#000] transition-all block`}>
                <div className="flex items-start justify-between mb-4">
                  <card.icon size={40} className={card.textColor} />
                  <span className={`font-comic text-xs font-bold bg-black ${card.textColor === "text-black" ? "text-white" : "text-pop-yellow"} px-2 py-1 border-2 border-black`}>
                    {card.badge}
                  </span>
                </div>
                <h3 className={`font-bangers text-3xl ${card.textColor} mb-2`}>{card.title}</h3>
                <p className={`font-comic text-sm font-bold ${card.textColor} opacity-90 flex-1`}>{card.desc}</p>
                <div className={`mt-4 font-bangers text-lg ${card.textColor} opacity-70`}>BUKA →</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
