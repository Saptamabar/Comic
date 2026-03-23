"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { 
  doc, 
  getDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy 
} from "firebase/firestore";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Sword, Trophy, Medal, Users, Star, Flame, TrendingUp, Loader2 } from "lucide-react";

// --- IMPORT DRIVER.JS ---
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

/* ─────────────────────────────────────────────
    CONFIG & THRESHOLDS
───────────────────────────────────────────── */
const BADGE_THRESHOLDS = [
  { name: "Pemula", minScore: 0 },
  { name: "Pejuang", minScore: 500 },
  { name: "Pahlawan", minScore: 1500 },
  { name: "Legenda", minScore: 5000 },
];

const EXP_PER_LEVEL = 300; 

export default function DashboardHomePage() {
  const [username, setUsername] = useState("Petualang");
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    totalPoints: 0,
    missionsDone: 0,
    badgesEarned: 0,
    rank: "-",
    totalExplorationMissions: 0,
    level: 1,
    currentExp: 0,
    progressPercent: 0
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const userData = userDoc.data();
          const currentScore = userData?.score || 0;
          const totalExp = userData?.exp || 0;
          setUsername(userData?.username || user.email?.split("@")[0] || "Pahlawan");

          const calculatedLevel = Math.floor(totalExp / EXP_PER_LEVEL) + 1;
          const expInCurrentLevel = totalExp % EXP_PER_LEVEL;
          const progressPercent = (expInCurrentLevel / EXP_PER_LEVEL) * 100;

          const completedSnap = await getDocs(collection(db, "users", user.uid, "completedMissions"));
          const completedIds = completedSnap.docs.map(d => d.id);
          
          let explorationDoneCount = 0;
          if (completedIds.length > 0) {
            const missionsSnap = await getDocs(query(collection(db, "missions"), where("type", "==", "explorations")));
            const explorationMissions = missionsSnap.docs.map(d => d.id);
            explorationDoneCount = completedIds.filter(id => explorationMissions.includes(id)).length;
          }

          const earnedBadges = BADGE_THRESHOLDS.filter(b => currentScore >= b.minScore).length;

          const allUsersQuery = query(collection(db, "users"), orderBy("score", "desc"));
          const allUsersSnap = await getDocs(allUsersQuery);
          const allUsers = allUsersSnap.docs.map(d => d.id);
          const myRank = allUsers.indexOf(user.uid) + 1;

          const totalExplorationQuery = query(collection(db, "missions"), where("type", "==", "explorations"));
          const totalExplorationSnap = await getDocs(totalExplorationQuery);

          setUserStats({
            totalPoints: currentScore,
            missionsDone: explorationDoneCount,
            badgesEarned: earnedBadges,
            rank: myRank > 0 ? `#${myRank}` : "-",
            totalExplorationMissions: totalExplorationSnap.size,
            level: calculatedLevel,
            currentExp: expInCurrentLevel,
            progressPercent: progressPercent
          });

        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        } finally {
          setLoading(false);
        }
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!loading) {
      const lastTour = localStorage.getItem("last_tour_date");
      const now = new Date();
      
      const shouldShowTour = !lastTour || 
        (now.getTime() - new Date(lastTour).getTime() > 30 * 24 * 60 * 60 * 1000);

      if (shouldShowTour) {
        const isMobile = window.innerWidth < 1024;
        const navTarget = isMobile ? "#mobile-nav" : "#desktop-nav";

        const driverObj = driver({
          showProgress: true,
          steps: [
            { 
              element: "#user-profile-header", 
              popover: { title: "Profil Pejuang", description: "Pantau level dan sisa EXP kamu untuk terus naik tingkat!", side: "bottom" } 
            },
            { 
              element: "#stats-summary", 
              popover: { title: "Statistik Kamu", description: "Lihat total poin, misi selesai, badge, dan peringkat arena kamu secara real-time.", side: "bottom" } 
            },
            { 
              element: "#features-grid-tour", 
              popover: { 
                title: "Fitur Utama Histoplay", 
                description: "Pilih mode bermainmu! Jelajahi Story Mode untuk petualangan sejarah, atau Quest Mode untuk tantangan harian.", 
                side: "top" 
              } 
            },
            { 
              element: "#top-bar-mobile-badge", 
              popover: { title: "Badge (lencana)", description: "Cek lencana apa aja yang kamu dapatkan.", side: "bottom" } 
            },
            { 
              element: "#top-bar-mobile-profil", 
              popover: { title: "Profil", description: "Akses profilmu di sini, update segera jika belum lengkap", side: "bottom" } 
            },
            { 
              element: navTarget, 
              popover: { title: "Navigasi", description: "Gunakan menu ini untuk berpindah ke halaman Pahlawan, Arena, Badge, dan sebagainya.", side: isMobile ? "top" : "right" } 
            }
          ]
        });

        setTimeout(() => driverObj.drive(), 1000);
        localStorage.setItem("last_tour_date", now.toISOString());
      }
    }
  }, [loading]);

  const stats = [
    { label: "Total Poin", value: userStats.totalPoints.toLocaleString(), icon: Star, color: "text-pop-yellow" },
    { label: "Misi Selesai", value: userStats.missionsDone, icon: Flame, color: "text-pop-red" },
    { label: "Badge Diraih", value: userStats.badgesEarned, icon: Medal, color: "text-purple-500" },
    { label: "Peringkat Arena", value: userStats.rank, icon: TrendingUp, color: "text-pop-blue" },
  ];

  const featureCards = [
    { href: "/dashboard/story", icon: BookOpen, title: "Story Mode", desc: "Eksplorasi sejarah Indonesia mulai dari era kemerdekaan hingga reformasi.", color: "bg-pop-blue", textColor: "text-white", badge: `${userStats.totalExplorationMissions} Misi`, rotate: "-rotate-1" },
    { href: "/dashboard/quest", icon: Sword, title: "Quest Mode", desc: "Uji kemahiran dengan tantangan cepat untuk kumpulkan poin!", color: "bg-pop-red", textColor: "text-white", badge: "Hadiah!", rotate: "rotate-1" },
    { href: "/dashboard/arena", icon: Trophy, title: "Arena", desc: "Leaderboard nasional & provinsi. Bersaing jadi yang terbaik!", color: "bg-pop-yellow", textColor: "text-black", badge: "Real-time", rotate: "-rotate-1" },
    { href: "/dashboard/badges", icon: Medal, title: "Badge Gallery", desc: "Kumpulan lencana dari berbagai pencapaianmu.", color: "bg-purple-500", textColor: "text-white", badge: "Buka", rotate: "rotate-1" },
    { href: "/dashboard/heroes", icon: Users, title: "Galeri Pahlawan", desc: "Kumpulan pahlawan bangsa dan ensiklopedia sejarah.", color: "bg-green-500", textColor: "text-white", badge: "Info", rotate: "-rotate-1" },
  ];

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-pop-yellow animate-spin" />
        <p className="font-bangers text-2xl animate-pulse tracking-widest uppercase">Menyiapkan Data Strategi...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        id="user-profile-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-black text-white border-4 border-black p-6 shadow-[8px_8px_0_#facc15] relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="font-comic font-bold text-pop-yellow uppercase tracking-widest text-sm">Selamat datang kembali, Pejuang!</p>
            <h1 className="font-bangers text-4xl md:text-5xl mt-1 capitalize">{username} <span className="text-pop-yellow">⚡</span></h1>
            <p className="font-comic text-gray-300 mt-2 text-sm md:text-base italic italic">"Sejarah Indonesia menunggumu hari ini."</p>
          </div>

          <div className="w-full md:w-64 bg-zinc-900 border-2 border-zinc-700 p-1 shadow-[4px_4px_0_#333]">
            <div className="flex justify-between items-end mb-1 px-1">
              <span className="font-bangers text-xl text-pop-yellow italic tracking-wide">LVL {userStats.level}</span>
              <span className="font-comic text-[9px] font-bold text-zinc-400 uppercase">{userStats.currentExp} / {EXP_PER_LEVEL} XP</span>
            </div>
            <div className="h-2 bg-black border border-zinc-700 relative overflow-hidden">
              <motion.div animate={{ width: `${userStats.progressPercent}%` }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-[0_0_12px_rgba(250,204,21,0.4)]" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Bar */}
      <div id="stats-summary" className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} className="bg-white border-4 border-black p-3 md:p-4 shadow-[4px_4px_0_#000] text-center">
            <s.icon size={28} className={`${s.color} mx-auto mb-1 md:mb-2`} />
            <p className="font-bangers text-2xl md:text-4xl text-black">{s.value}</p>
            <p className="font-comic text-[10px] md:text-sm text-gray-500 font-bold uppercase">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Feature Grid - SEKARANG JADI TARGET TOUR UTAMA */}
      <div id="features-grid-tour">
        <h2 className="font-bangers text-2xl md:text-3xl mb-4 border-b-4 border-black inline-block pb-1 uppercase">Fitur Utama</h2>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {featureCards.map((card, i) => (
            <motion.div key={card.href} className={`${i === featureCards.length - 1 ? "col-span-2 lg:col-span-1" : "col-span-1"}`}>
              <Link 
                href={card.href} 
                className={`flex flex-col h-full ${card.color} border-[3px] md:border-4 border-black p-4 md:p-6 shadow-[4px_4px_0_#000] md:shadow-[6px_6px_0_#000] ${card.rotate} hover:shadow-[8px_8px_0_#000] transition-all block`}
              >
                <div className="flex items-start justify-between mb-2 md:mb-4">
                  <card.icon size={32} className={`${card.textColor} md:w-10 md:h-10`} />
                  <span className={`font-comic text-[8px] md:text-xs font-bold bg-black ${card.textColor === "text-black" ? "text-white" : "text-pop-yellow"} px-2 py-0.5 border-2 border-black`}>
                    {card.badge}
                  </span>
                </div>
                <h3 className={`font-bangers text-xl md:text-3xl ${card.textColor} mb-1 md:mb-2 leading-tight`}>{card.title}</h3>
                <p className={`font-comic text-[10px] md:text-sm font-bold ${card.textColor} opacity-90 flex-1 leading-tight`}>{card.desc}</p>
                <div className={`mt-3 md:mt-4 font-bangers text-sm md:text-lg ${card.textColor} opacity-70 uppercase`}>Buka →</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}