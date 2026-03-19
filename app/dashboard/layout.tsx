"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
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
  ChevronDown,
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

const mobileNav = [
  { href: "/dashboard", label: "Beranda", icon: Home },
  { href: "/dashboard/heroes", label: "Pahlawan", icon: Users },
  { href: "/dashboard/quest", label: "Quest", icon: Sword, special: true },
  { href: "/dashboard/story", label: "Story", icon: BookOpen },
  { href: "/dashboard/arena", label: "Arena", icon: Trophy },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/auth/user");
        return;
      }
      setUser(currentUser);
    });
    return () => unsub();
  }, [router]);

  const handleLogout = async () => {
    await auth.signOut();
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row font-mono">
      
      <aside className="hidden lg:flex flex-col w-72 bg-black border-r-4 border-black min-h-screen sticky top-0 h-screen z-40 text-white">
        <div className="p-6 border-b-4 border-white/20">
          <Link href="/" className="font-bangers text-4xl text-pop-yellow drop-shadow-[2px_2px_0_rgba(255,255,0,0.5)] tracking-wider uppercase text-center block">
            HISTOPLAY
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-4 text-white">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 font-bangers text-xl uppercase transition-all border-2 border-transparent rounded-lg
                  ${active
                    ? `${item.color} text-black border-black shadow-[4px_4px_0_#fff]`
                    : "text-white hover:bg-white/10"
                  }`}
              >
                <item.icon size={24} className={active ? "text-black" : "text-gray-400"} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t-4 border-white/20">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-800 flex items-center justify-center shrink-0 shadow-[2px_2px_0_#fff]">
               {user?.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
               ) : (
                <User size={20} className="text-white" />
               )}
            </div>
            <p className="font-comic text-[10px] text-gray-400 truncate uppercase tracking-tighter">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 w-full font-bangers text-xl uppercase text-red-500 hover:text-red-400 px-2 py-2 transition-all active:scale-95">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black border-b-4 border-pop-yellow flex items-center justify-between px-4 z-50 shadow-lg">
        <Link href="/dashboard/badges" className="bg-pop-yellow border-2 border-black p-1.5 shadow-[2px_2px_0_#fff] -rotate-3 active:scale-90 transition-all">
          <Medal size={22} className="text-black" strokeWidth={3} />
        </Link>

        <span className="font-bangers text-3xl text-pop-yellow italic tracking-wider">HISTOPLAY</span>

        <div className="flex items-center gap-3">
          <button className="text-white relative p-1 active:scale-90 transition-all">
            <Bell size={24} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 border-2 border-black rounded-full"></span>
          </button>

          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-1 active:scale-95 transition-all"
            >
              <div className="border-2 border-white w-9 h-9 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center shadow-[2px_2px_0_rgba(255,255,255,0.3)]">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={22} className="text-white" strokeWidth={2.5} /> 
                )}
              </div>
              <ChevronDown size={14} className={`text-pop-yellow transition-transform ${showDropdown ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-48 bg-white border-4 border-black shadow-[6px_6px_0_#000] overflow-hidden"
                >
                  <Link 
                    href="/dashboard/profile"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 p-3 font-bangers text-lg uppercase text-black hover:bg-pop-yellow transition-colors border-b-2 border-black"
                  >
                    <User size={20} strokeWidth={3} />
                    Profil
                  </Link>

                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 font-bangers text-lg uppercase text-red-600 hover:bg-red-50 transition-colors px-3 text-left"
                  >
                    <LogOut size={20} strokeWidth={3} />
                    Log Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 md:p-8 pt-20 pb-24 lg:pt-8 lg:pb-8">
          {children}
        </main>
      </div>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t-4 border-black flex justify-around items-end h-16 pb-2 px-1">
        {mobileNav.map((item) => {
          const active = pathname === item.href;
          
          if (item.special) {
            return (
              <Link key={item.label} href={item.href} className="relative -top-6 active:scale-95 transition-transform">
                <div className={`absolute inset-0 border-4 border-black -rotate-12 scale-125 -z-10 shadow-[4px_4px_0_#000] ${active ? "bg-pop-red" : "bg-pop-yellow"}`} />
                <div className="bg-white border-4 border-black p-2 mb-1">
                  <item.icon size={22} className="text-black" strokeWidth={3} />
                </div>
                <span className="text-[8px] font-black uppercase italic bg-black text-white px-1 absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link key={item.label} href={item.href} className="flex-1 flex flex-col items-center justify-center h-full relative">
              {active && (
                <motion.div layoutId="navActive" className="absolute inset-x-2 inset-y-1 bg-gray-100 border-2 border-black -rotate-3 -z-10" />
              )}
              <item.icon 
                size={20} 
                className={`transition-all ${active ? "text-black -rotate-6 scale-110" : "text-gray-400"}`} 
                strokeWidth={active ? 3 : 2} 
              />
              <span className={`text-[9px] font-black uppercase mt-1 tracking-tighter ${active ? "text-black italic" : "text-gray-400"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="lg:hidden h-4 bg-white fixed bottom-0 w-full z-[49]"></div>
    </div>
  );
}