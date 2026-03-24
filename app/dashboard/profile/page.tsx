"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { motion } from "framer-motion";
import { Trophy, BookOpen, LogOut, ChevronRight, Star, Shield, Loader2, UserPen, MapPin, Zap, Flame, Crown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  
  const [userLocation, setUserLocation] = useState({
    prov: "-",
    city: "-",
  });

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
          setCreatedAt(d.createdAt ? new Date(d.createdAt.seconds * 1000).toLocaleDateString("id-ID", { year: "numeric", month: "long" }) : "Maret 2026");
          setUserPhoto(d.photoURL || user.photoURL || null);
          
          setUserName(d.name || d.nama || user.displayName || user.email?.split("@")[0]);
          setUserLocation({
            prov: d.prov || d.provinsi || "-",
            city: d.city || d.kabupaten || "-",
          });
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
    { label: "Total Poin", value: userStats.totalPoints.toLocaleString(), icon: Star, color: "text-yellow-500" },
    { label: "Misi Selesai", value: userStats.missionsCount, icon: BookOpen, color: "text-blue-500" },
    { label: "Peringkat", value: userStats.rank, icon: Trophy, color: "text-red-500" },
    { label: "Badge Diraih", value: userStats.badgesCount, icon: Shield, color: "text-purple-500" },
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#f0f0f0] font-mono p-4">
      <div className="text-center">
        <Loader2 className="animate-spin mx-auto mb-4 text-[#3e2723]" size={48} />
        <p className="font-black italic uppercase animate-pulse text-[#3e2723]">Sinkronisasi Data Agen...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 font-mono relative overflow-x-hidden bg-[#fdf6e3]">
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{ 
        backgroundImage: `radial-gradient(#3e2723 1.5px, transparent 0)`, 
        backgroundSize: '24px 24px' 
      }}></div>

      <div className="max-w-4xl mx-auto space-y-6 md:space-y-12 relative z-10">
        
        {/* Profile Hero Card */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          className="bg-[#3e2723] text-white border-[6px] md:border-[8px] border-[#3e2723] p-5 md:p-8 shadow-[8px_8px_0_#ffca28] md:shadow-[16px_16px_0_#ffca28] relative group"
        >
          {/* Flame Icon - Hidden on mobile to save space */}
          <div className="absolute -top-6 -right-6 bg-red-600 p-3 border-4 border-[#3e2723] rotate-12 shadow-lg hidden lg:block">
            <Flame className="text-white fill-white" size={32} />
          </div>

          <div className="absolute -top-3 left-4 bg-blue-500 text-white px-3 py-0.5 border-[3px] border-[#3e2723] -rotate-2 font-black text-[10px] md:text-sm z-20">
            AGEN TERVERIFIKASI
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 mt-2">
            {/* Avatar Section */}
            <div className="relative">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-[6px] md:border-[8px] border-yellow-400 bg-gray-800 overflow-hidden shadow-[0_0_0_4px_#000]">
                {userPhoto ? (
                  <img src={userPhoto} alt="Hero" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl md:text-6xl">👤</div>
                )}
              </div>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2 border-2 border-dashed border-white/30 rounded-full pointer-events-none"
              ></motion.div>
            </div>

            {/* Info Section */}
            <div className="text-center md:text-left space-y-3 md:space-y-4 flex-1 w-full">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <Crown className="text-yellow-400" size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400">Pahlawan Bangsa</span>
                </div>
                {/* Responsive Name Font */}
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-black italic uppercase leading-none tracking-tighter drop-shadow-[2px_2px_0_#ef4444] break-words">
                  {userName}
                </h1>
                
                <div className="mt-2 space-y-1">
                  <p className="text-gray-400 italic font-bold bg-white/10 inline-block px-2 py-0.5 border border-white/20 text-[11px] md:text-sm truncate max-w-full">
                    {userEmail}
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-1 text-yellow-400 font-black uppercase text-[10px] md:text-xs tracking-tighter">
                    <MapPin size={12} /> 
                    <span className="truncate">Sektor: {userLocation.city}, {userLocation.prov}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start pt-2">
                <div className="bg-[#fcf8ef] text-[#3e2723] px-3 py-1 font-black uppercase border-[3px] border-[#3e2723] shadow-[3px_3px_0_#fcf8ef] text-[10px] flex items-center justify-center">
                  Sejak: {createdAt}
                </div>
                <button 
                  onClick={() => router.push("/dashboard/profile/edit")}
                  className="bg-yellow-400 text-[#3e2723] px-4 py-1.5 md:py-1 font-black uppercase border-[3px] border-[#3e2723] shadow-[4px_4px_0_#3e2723] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:scale-95 transition-all flex items-center justify-center gap-2 text-xs"
                >
                  <UserPen size={14} /> Edit Berkas
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid - 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {stats.map((s, i) => (
            <motion.div 
              key={s.label}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, type: "spring" }}
              whileHover={{ y: -5, rotate: i % 2 === 0 ? 1 : -1 }}
              className="bg-[#fcf8ef] border-[4px] md:border-[6px] border-[#3e2723] p-4 md:p-6 text-center shadow-[6px_6px_0_#3e2723] md:shadow-[10px_10px_0_#3e2723] relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-[#3e2723] group-hover:h-2 transition-all"></div>
              <s.icon size={28} className={`${s.color} mx-auto mb-2 md:mb-4 group-hover:scale-110 transition-transform`} />
              <p className="text-2xl md:text-4xl font-black text-[#3e2723] leading-none mb-1 md:mb-2">{s.value}</p>
              <p className="text-[8px] md:text-[10px] font-black text-[#3e2723]/60 uppercase tracking-tighter border-t-2 border-[#3e2723]/10 pt-1 md:pt-2">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Menu Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/dashboard/arena")}
            className="group relative flex items-center gap-4 md:gap-6 bg-[#fcf8ef] border-[4px] md:border-[6px] border-[#3e2723] p-4 md:p-6 shadow-[6px_6px_0_#ffca28] md:shadow-[10px_10px_0_#ffca28] transition-all"
          >
            <div className="bg-yellow-400 p-2 md:p-4 border-[3px] border-[#3e2723] shadow-[2px_2px_0_#3e2723]">
              <Trophy size={24} className="text-[#3e2723] md:w-8 md:h-8" />
            </div>
            <div className="text-left flex-1">
              <span className="block text-lg md:text-2xl font-black uppercase italic leading-none text-[#3e2723]">Papan Peringkat</span>
              <span className="text-[9px] md:text-xs font-bold text-[#3e2723]/60 uppercase">Cek Rivalitas Agen</span>
            </div>
            <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform text-[#3e2723]" />
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={async () => { if(confirm("Keluar markas sekarang?")) { await auth.signOut(); router.push("/"); } }}
            className="group flex items-center gap-4 md:gap-6 bg-red-600 text-white border-[4px] md:border-[6px] border-[#3e2723] p-4 md:p-6 shadow-[6px_6px_0_#3e2723] md:shadow-[10px_10px_0_#3e2723] transition-all"
          >
            <div className="bg-[#3e2723] p-2 md:p-4 border-[3px] border-white shadow-[2px_2px_0_#ef4444]">
              <LogOut size={24} className="md:w-8 md:h-8" />
            </div>
            <div className="text-left flex-1">
              <span className="block text-lg md:text-2xl font-black uppercase italic leading-none">Keluar Markas</span>
              <span className="text-[9px] md:text-xs font-bold text-red-200 uppercase">Akhiri Operasi</span>
            </div>
          </motion.button>
        </div>

        {/* Footer Version Info */}
        <div className="pt-6 md:pt-10 flex items-center justify-center gap-2 md:gap-4 opacity-30 grayscale hover:grayscale-0 transition-all text-[#3e2723]">
           <Zap size={14} className="md:w-5 md:h-5" />
           <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.5em] text-center">HistoPlay Defense System v1.0.4</p>
           <Zap size={14} className="md:w-5 md:h-5" />
        </div>

      </div>
    </div>
  );
}