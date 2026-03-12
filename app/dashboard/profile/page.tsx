"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { Bell, Trophy, BookOpen, Settings, LogOut, ChevronRight, Star, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

const mockNotifications = [
  { id: "n1", type: "mission", title: "Misi Baru Tersedia!", desc: "Misi 'Konferensi Asia-Afrika' sudah bisa dimainkan.", time: "2 jam lalu", read: false },
  { id: "n2", type: "arena", title: "Peringkat Tergeser!", desc: "HistorianGirls mengalahkan posisimu di Arena. Ayo kejar!", time: "1 hari lalu", read: false },
  { id: "n3", type: "badge", title: "Badge Baru Menanti!", desc: "Selesaikan misi pertamamu untuk mendapatkan 'Pejuang Pertama'.", time: "3 hari lalu", read: true },
];

const stats = [
  { label: "Total Poin", value: "0", icon: Star },
  { label: "Misi Selesai", value: "0", icon: BookOpen },
  { label: "Peringkat", value: "-", icon: Trophy },
  { label: "Badge Diraih", value: "0", icon: Shield },
];

export default function ProfilePage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [notifications, setNotifications] = useState(mockNotifications);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { router.push("/auth/user"); return; }
      setUserEmail(user.email);
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        const d = snap.data();
        setCreatedAt(d.createdAt ? new Date(d.createdAt).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" }) : "Unknown");
      }
    });
    return () => unsub();
  }, [router]);

  const handleLogout = async () => {
    await auth.signOut();
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push("/");
  };

  const markAllRead = () => setNotifications(n => n.map(notif => ({ ...notif, read: true })));
  const unreadCount = notifications.filter(n => !n.read).length;

  const username = userEmail?.split("@")[0] ?? "Player";

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Profile Card */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="bg-black text-white border-4 border-black p-6 shadow-[8px_8px_0_#facc15]"
      >
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full border-4 border-pop-yellow bg-gray-700 flex items-center justify-center text-4xl shadow-[4px_4px_0_rgba(250,204,21,0.5)]">
            👤
          </div>
          <div>
            <h1 className="font-bangers text-4xl text-pop-yellow capitalize">{username}</h1>
            <p className="font-comic text-sm text-gray-400">{userEmail}</p>
            <p className="font-comic text-xs text-gray-500 mt-1">Bergabung sejak: {createdAt ?? "..."}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
            className="bg-white border-4 border-black p-4 text-center shadow-[4px_4px_0_#000]"
          >
            <s.icon size={28} className="text-pop-blue mx-auto mb-2" />
            <p className="font-bangers text-3xl text-black">{s.value}</p>
            <p className="font-comic text-xs font-bold text-gray-500">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Notifications */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bangers text-3xl flex items-center gap-2">
            <Bell size={28} />
            NOTIFIKASI
            {unreadCount > 0 && (
              <span className="bg-pop-red text-white font-bangers text-lg px-2 py-0.5 border-2 border-black">
                {unreadCount}
              </span>
            )}
          </h2>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="font-comic text-sm font-bold text-blue-500 underline hover:text-blue-700">
              Tandai semua dibaca
            </button>
          )}
        </div>
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div key={notif.id}
              className={`border-4 border-black p-4 flex items-start gap-3 shadow-[4px_4px_0_#000] transition-all
                ${notif.read ? "bg-white" : "bg-pop-yellow"}`}
            >
              <div className="text-2xl mt-0.5">
                {notif.type === "mission" ? "📖" : notif.type === "arena" ? "⚔️" : "🏅"}
              </div>
              <div className="flex-1">
                <p className="font-bangers text-xl text-black leading-tight">{notif.title}</p>
                <p className="font-comic text-sm font-bold text-gray-700 mt-0.5">{notif.desc}</p>
                <p className="font-comic text-xs text-gray-500 mt-1">{notif.time}</p>
              </div>
              {!notif.read && <div className="w-3 h-3 bg-pop-red border-2 border-black rounded-full flex-shrink-0 mt-1" />}
            </div>
          ))}
          {notifications.length === 0 && (
            <p className="font-comic font-bold text-gray-400 text-center py-8">Tidak ada notifikasi terbaru.</p>
          )}
        </div>
      </div>

      {/* Settings / Logout */}
      <div className="bg-white border-4 border-black shadow-[6px_6px_0_#000]">
        <div className="border-b-4 border-black p-4 font-bangers text-2xl uppercase">Pengaturan Akun</div>
        {[
          { label: "Edit Profil", icon: Settings, action: () => {} },
        ].map((item) => (
          <button key={item.label} onClick={item.action} className="w-full flex items-center gap-3 px-4 py-4 border-b-2 border-black hover:bg-gray-50 transition-colors">
            <item.icon size={20} className="text-gray-500" />
            <span className="font-comic font-bold text-black flex-1 text-left">{item.label}</span>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-4 text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-comic font-bold flex-1 text-left">Keluar (Logout)</span>
        </button>
      </div>
    </div>
  );
}
