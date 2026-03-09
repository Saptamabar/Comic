"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Book, Users, Eye, CreditCard, Zap, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalComics: 0,
    totalUsers: 0,
    totalReads: 0,
    totalPoints: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        
        const comicSnap = await getDocs(collection(db, "comics"));
        
        
        const userSnap = await getDocs(collection(db, "users"));
        
        
        const transSnap = await getDocs(collection(db, "transactions"));
        let points = 0;
        transSnap.forEach((doc) => {
          points += doc.data().amount || 0;
        });

        
        let reads = 0;
        comicSnap.forEach((doc) => {
          reads += doc.data().views || 0;
        });

        setStats({
          totalComics: comicSnap.size,
          totalUsers: userSnap.size,
          totalReads: reads,
          totalPoints: points,
        });
      } catch (error) {
        console.error("BOOM! Gagal ambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="font-black text-4xl animate-bounce uppercase italic border-4 border-black p-4 bg-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          LOADING... POW!
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* GRID STATISTIK UTAMA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Komik" 
          value={stats.totalComics} 
          icon={<Book size={32} />} 
          color="bg-blue-400" 
          shadowColor="shadow-[8px_8px_0px_0px_rgba(30,64,175,1)]"
        />

        <StatCard 
          title="Total User" 
          value={stats.totalUsers} 
          icon={<Users size={32} />} 
          color="bg-green-400" 
          shadowColor="shadow-[8px_8px_0px_0px_rgba(22,101,52,1)]"
        />

        <StatCard 
          title="Total Pembaca" 
          value={stats.totalReads} 
          icon={<Eye size={32} />} 
          color="bg-purple-400" 
          shadowColor="shadow-[8px_8px_0px_0px_rgba(107,33,168,1)]"
        />

        <StatCard 
          title="Transaksi Point" 
          value={stats.totalPoints.toLocaleString()} 
          icon={<CreditCard size={32} />} 
          color="bg-red-400" 
          shadowColor="shadow-[8px_8px_0px_0px_rgba(153,27,27,1)]"
        />
      </div>

      {/* SECTION BAWAH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Grafik Pertumbuhan */}
        <div className="lg:col-span-2 border-4 border-black bg-white p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-yellow-400 border-l-4 border-b-4 border-black px-4 py-1 font-black italic">
            HOT NEWS!
          </div>
          <h3 className="text-2xl font-black uppercase mb-4 flex items-center gap-2">
            <TrendingUp /> Tren Pertumbuhan
          </h3>
          <div className="h-64 bg-slate-100 border-2 border-dashed border-black flex items-end justify-around p-4 gap-2">
            {[40, 70, 45, 90, 65, 80, 95].map((h, i) => (
              <div 
                key={i} 
                style={{ height: `${h}%` }} 
                className="w-full bg-blue-500 border-2 border-black shadow-[4px_0px_0px_0px_rgba(0,0,0,1)] hover:bg-red-500 transition-colors cursor-pointer"
              ></div>
            ))}
          </div>
          <p className="mt-4 font-bold italic text-sm text-black">
            {`* Data diperbarui secara real-time dari markas pusat.`}
          </p>
        </div>

        {/* Note Admin */}
        <div className="border-4 border-black bg-yellow-300 p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-xl font-black uppercase mb-4 underline">Admin Note</h3>
          <div className="space-y-4">
            <p className="font-bold border-b-2 border-black pb-2 italic text-black">
              {`"Jangan lupa cek laporan keuangan akhir bulan!"`}
            </p>
            <p className="font-bold border-b-2 border-black pb-2 italic text-black">
              {`"Update server pukul 24.00 WIB."`}
            </p>
            <div className="bg-white border-2 border-black p-2 font-black text-center transform rotate-2">
              {`KEEP SMASHING IT! `}
              <Zap className="inline text-yellow-500" fill="currentColor" size={16}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  shadowColor: string;
}

function StatCard({ title, value, icon, color, shadowColor }: StatCardProps) {
  return (
    <div className={`${color} border-4 border-black p-5 ${shadowColor} flex flex-col justify-between h-40 transform hover:-translate-y-1 transition-transform`}>
      <div className="flex justify-between items-start text-black">
        <span className="font-black uppercase text-xs italic tracking-widest">{title}</span>
        <div className="bg-white border-2 border-black p-1">
          {icon}
        </div>
      </div>
      <div className="text-4xl font-black tracking-tighter uppercase text-black drop-shadow-[2px_2px_0px_rgba(255,255,255,1)]">
        {value}
      </div>
    </div>
  );
}