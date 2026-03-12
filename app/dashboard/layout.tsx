"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  BookOpen,
  Sword,
  Trophy,
  Medal,
  Users,
  User,
  Home,
  LogOut,
  Bell,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/dashboard", label: "Beranda", icon: Home, color: "bg-pop-yellow" },
  { href: "/dashboard/story", label: "Story Mode", icon: BookOpen, color: "bg-pop-blue" },
  { href: "/dashboard/quest", label: "Quest Mode", icon: Sword, color: "bg-pop-red" },
  { href: "/dashboard/arena", label: "Arena", icon: Trophy, color: "bg-yellow-500" },
  { href: "/dashboard/badges", label: "Badge Gallery", icon: Medal, color: "bg-purple-500" },
  { href: "/dashboard/heroes", label: "Pahlawan", icon: Users, color: "bg-green-500" },
  { href: "/dashboard/profile", label: "Profil & Notifikasi", icon: User, color: "bg-gray-600" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/auth/user");
        return;
      }
      setUserEmail(user.email);
    });
    return () => unsub();
  }, [router]);

  const handleLogout = async () => {
    await auth.signOut();
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-black border-r-4 border-black min-h-screen sticky top-0 h-screen">
        {/* Logo */}
        <div className="p-6 border-b-4 border-white/20">
          <Link href="/" className="font-bangers text-4xl text-pop-yellow drop-shadow-[2px_2px_0_rgba(255,255,0,0.5)] tracking-wider">
            HISTOPLAY
          </Link>
          <p className="font-comic text-sm text-gray-400 mt-1">Player Dashboard</p>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 font-bangers text-xl uppercase transition-all border-2 border-transparent rounded-lg
                  ${active
                    ? `${item.color} text-black border-black shadow-[4px_4px_0_#fff]`
                    : "text-white hover:bg-white/10 hover:border-white/20"
                  }`}
              >
                <item.icon size={24} className={active ? "text-black" : "text-gray-400"} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info + Logout */}
        <div className="p-4 border-t-4 border-white/20">
          <p className="font-comic text-xs text-gray-400 truncate mb-3">{userEmail}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full font-bangers text-xl uppercase text-red-400 hover:text-red-300 transition-colors px-2 py-2"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 h-full w-72 bg-black z-50 flex flex-col lg:hidden border-r-4 border-white/20"
            >
              <div className="p-6 border-b-4 border-white/20 flex justify-between items-center">
                <span className="font-bangers text-3xl text-pop-yellow">HISTOPLAY</span>
                <button onClick={() => setSidebarOpen(false)} className="text-white">
                  <X size={28} />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 font-bangers text-xl uppercase transition-all border-2 border-transparent rounded-lg
                        ${active ? `${item.color} text-black border-black shadow-[4px_4px_0_#fff]` : "text-white hover:bg-white/10"}`}
                    >
                      <item.icon size={24} className={active ? "text-black" : "text-gray-400"} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t-4 border-white/20">
                <button onClick={handleLogout} className="flex items-center gap-2 font-bangers text-xl uppercase text-red-400 hover:text-red-300 transition-colors px-2 py-2">
                  <LogOut size={20} /> Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-black px-4 py-3 flex justify-between items-center border-b-4 border-pop-yellow shadow-md sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="text-white p-1 hover:text-pop-yellow transition-colors">
            <Menu size={28} />
          </button>
          <span className="font-bangers text-3xl text-pop-yellow">HISTOPLAY</span>
          <Link href="/dashboard/profile" className="text-white hover:text-pop-yellow transition-colors">
            <Bell size={24} />
          </Link>
        </header>
        
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
