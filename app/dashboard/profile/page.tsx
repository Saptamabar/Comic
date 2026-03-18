"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { motion } from "framer-motion";
import { Trophy, BookOpen, LogOut, ChevronRight, Star, Shield, Loader2, UserPen, Target, Zap, Flame, Crown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    totalPoints: 0,
    missionsCount: 0,
    rank: "-",
    badgesCount: 0,
  });

  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/auth/user");
        return;
      }
      setUserEmail(user.email);

      try {
        const userSnap = await getDoc(doc(db, "users", user.uid));
        if (userSnap.exists()) {
          const d = userSnap.data();
          setCreatedAt(d.createdAt ? new Date(d.createdAt).toLocaleDateString("id-ID", { year: "numeric", month: "long" }) : "Maret 2026");
          setUserPhoto(d.photoURL || user.photoURL || null);
          setUserName(d.name || user.displayName || user.email?.split("@")[0]);
        }

        const allUsersSnap = await getDocs(query(collection(db, "users"), where("role", "!=", "admin")));
        const rankingList = await Promise.all(allUsersSnap.docs.map(async (uDoc) => {
          const mSnap = await getDocs(collection(db, "users", uDoc.id, "completedMissions"));
          let scoreTotal = 0;
          mSnap.forEach(m => {
            const data = m.data();
            scoreTotal += (Number(data.score) || 0) + (Number(data.finalScore) || 0);
          });
          return { uid: uDoc.id, totalPoints: scoreTotal, missionCount: mSnap.size };
        }));

        const sortedList = rankingList.sort((a, b) => b.totalPoints - a.totalPoints);
        const myData = sortedList.find(p => p.uid === user.uid);
        const myRank = sortedList.findIndex(p => p.uid === user.uid) + 1;

        const badgesSnap = await getDocs(collection(db, "badges"));
        let unlockedBadges = 0;
        const currentTotal = myData?.totalPoints || 0;
        badgesSnap.forEach((bDoc) => {
          if (currentTotal >= (bDoc.data().minPoints || 0)) unlockedBadges++;
        });

        setUserStats({
          totalPoints: currentTotal,
          missionsCount: myData?.missionCount || 0,
          rank: myRank > 0 ? `#${myRank}` : "-",
          badgesCount: unlockedBadges,
        });

      } catch (err) {
        console.error("Gagal memuat profil:", err);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router]);

  const stats = [
    { label: "Total Poin", value: userStats.totalPoints.toLocaleString(), icon: Star, color: "text-yellow-500", border: "border-yellow-400" },
    { label: "Misi Selesai", value: userStats.missionsCount, icon: BookOpen, color: "text-blue-500", border: "border-blue-400" },
    { label: "Peringkat", value: userStats.rank, icon: Trophy, color: "text-red-500", border: "border-red-400" },
    { label: "Badge Diraih", value: userStats.badgesCount, icon: Shield, color: "text-purple-500", border: "border-purple-400" },
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#f0f0f0] font-mono">
      <div className="text-center">
        <Loader2 className="animate-spin mx-auto mb-4" size={48} />
        <p className="font-black italic uppercase animate-pulse">Sinkronisasi Data Agen...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-20 pt-6 px-4 font-mono relative overflow-hidden bg-[#f3f4f6]">
      
      {/* 1. BACKGROUND DECORATION (Halftone & Lines) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{ 
        backgroundImage: `radial-gradient(#000 1.5px, transparent 0)`, 
        backgroundSize: '24px 24px' 
      }}></div>
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[120%] bg-yellow-300/10 -rotate-12 z-0"></div>

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        
        {/* --- 2. MAIN PROFILE HEADER --- */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          className="bg-black text-white border-[8px] border-black p-8 shadow-[16px_16px_0_#000] relative group"
        >
          {/* Floating Stickers */}
          <div className="absolute -top-6 -right-6 bg-red-600 p-3 border-4 border-black rotate-12 shadow-lg hidden md:block">
            <Flame className="text-white fill-white" size={32} />
          </div>
          <div className="absolute -bottom-4 -left-6 bg-blue-500 text-white px-4 py-1 border-4 border-black -rotate-6 font-black text-sm z-20">
            AGEN TERVERIFIKASI
          </div>

          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Profil Image with Neo-Brutalism Ring */}
            <div className="relative">
              <div className="w-36 h-36 rounded-full border-[8px] border-yellow-400 bg-gray-800 overflow-hidden shadow-[0_0_0_8px_#000]">
                {userPhoto ? (
                  <img src={userPhoto} alt="Hero" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">👤</div>
                )}
              </div>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2 border-2 border-dashed border-white/30 rounded-full pointer-events-none"
              ></motion.div>
            </div>

            {/* User Details */}
            <div className="text-center md:text-left space-y-4 flex-1">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <Crown className="text-yellow-400" size={20} />
                  <span className="text-xs font-black uppercase tracking-widest text-yellow-400">Pahlawan Bangsa</span>
                </div>
                <h1 className="text-6xl font-black italic uppercase leading-none tracking-tighter drop-shadow-[4px_4px_0_#ef4444]">
                  {userName}
                </h1>
                <p className="text-gray-400 italic font-bold mt-2 bg-white/10 inline-block px-3 py-1 border border-white/20">{userEmail}</p>
              </div>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="bg-white text-black px-4 py-1 font-black uppercase border-4 border-black shadow-[4px_4px_0_#fff] text-xs">
                  Misi Sejak: {createdAt}
                </div>
                <button 
                  onClick={() => router.push("/dashboard/profile/edit")}
                  className="bg-yellow-400 text-black px-6 py-1 font-black uppercase border-4 border-black shadow-[4px_4px_0_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
                >
                  <UserPen size={16} /> Edit Berkas
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- 3. STATS GRID (Lebih 'Pop') --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div 
              key={s.label}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, type: "spring" }}
              whileHover={{ y: -8, rotate: i % 2 === 0 ? 2 : -2 }}
              className={`bg-white border-[6px] border-black p-6 text-center shadow-[10px_10px_0_#000] relative overflow-hidden group`}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-black group-hover:h-2 transition-all"></div>
              <s.icon size={40} className={`${s.color} mx-auto mb-4 group-hover:scale-125 transition-transform`} />
              <p className="text-4xl font-black text-black leading-none mb-2">{s.value}</p>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-tighter border-t-2 border-black/5 pt-2">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* --- 4. ACTION CENTER --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.button 
            whileHover={{ scale: 1.03 }}
            onClick={() => router.push("/arena")}
            className="group relative flex items-center gap-6 bg-white border-[6px] border-black p-6 shadow-[10px_10px_0_#facc15] transition-all"
          >
            <div className="bg-yellow-400 p-4 border-4 border-black shadow-[4px_4px_0_#000]">
              <Trophy size={32} />
            </div>
            <div className="text-left">
              <span className="block text-2xl font-black uppercase italic italic leading-none">Papan Peringkat</span>
              <span className="text-xs font-bold text-gray-500 uppercase">Cek Rivalitas Antar Agen</span>
            </div>
            <ChevronRight size={32} className="ml-auto group-hover:translate-x-2 transition-transform" />
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.03 }}
            onClick={async () => { await auth.signOut(); router.push("/"); }}
            className="group flex items-center gap-6 bg-red-600 text-white border-[6px] border-black p-6 shadow-[10px_10px_0_#000] transition-all"
          >
            <div className="bg-black p-4 border-4 border-white shadow-[4px_4px_0_#ef4444]">
              <LogOut size={32} />
            </div>
            <div className="text-left">
              <span className="block text-2xl font-black uppercase italic leading-none">Keluar Markas</span>
              <span className="text-xs font-bold text-red-200 uppercase">Akhiri Sesi Operasi</span>
            </div>
          </motion.button>
        </div>

        {/* --- 5. DECORATIVE FOOTER --- */}
        <div className="pt-10 flex items-center justify-center gap-4 opacity-40 grayscale group hover:grayscale-0 transition-all">
           <Zap size={20} />
           <p className="text-[10px] font-black uppercase tracking-[0.5em]">HistoPlay Defense System v1.0.4</p>
           <Zap size={20} />
        </div>

      </div>
    </div>
  );
}