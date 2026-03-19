"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import {
  LayoutDashboard,
  Layout,
  BookOpen,
  Users,
  Settings,
  LogOut,
  Zap,
  Menu,
  X,
  ShieldCheck
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={20}/> },
    { name: "Landing Page", href: "/admin/landing", icon: <Layout size={20}/> },
    { name: "Manajemen Komik", href: "/admin/komik", icon: <BookOpen size={20} /> },
    { name: "Achievement", href: "/admin/reward", icon: <ShieldCheck size={20} /> },
    { name: "Manajemen User", href: "/admin/users", icon: <Users size={20} /> },
    { name: "Settings Web", href: "/admin/settings", icon: <Settings size={20} /> },
  ];

  const handleLogout = async () => {
    if (confirm("Keluar dari markas besar?")) {
      try {
        await signOut(auth);
        router.push("/"); 
      } catch (error) {
        console.error("Logout Error:", error);
      }
    }
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-yellow-50 font-mono">
      
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 z-[70] w-72 bg-white border-r-8 border-black p-6 flex flex-col justify-between
        h-full transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div>
          <div className="mb-10 flex justify-between items-center">
            <h2 className="bg-black text-white text-xl font-black p-2 inline-block border-2 border-red-500 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] uppercase italic -rotate-2">
              Admin HQ!
            </h2>
            <button 
              className="lg:hidden p-2 border-2 border-black hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          <nav className="space-y-3">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 p-3 border-4 border-black font-black uppercase transition-all text-sm
                  ${isActive
                    ? "bg-blue-500 text-white translate-x-2 shadow-none"
                    : "bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:shadow-none"
                  }`}
                >
                  {item.icon}
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4">
            <Link 
                href="/" 
                className="flex items-center justify-center gap-2 text-xs font-bold uppercase underline decoration-2 hover:text-blue-600"
            >
                Lihat Web Utama
            </Link>
            <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 p-3 border-4 border-black bg-red-500 text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 active:translate-y-2 transition-all"
            >
                <LogOut size={20} />
                Abort Mission!
            </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        <header className="flex justify-between items-center bg-white border-b-8 border-black p-4 lg:p-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden border-4 border-black p-2 bg-yellow-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>

            <h1 className="text-xl lg:text-3xl font-black uppercase italic flex items-center gap-2 truncate">
              <Zap className="text-yellow-500 hidden sm:block" fill="currentColor" />
              <span className="truncate">Control Center</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block font-black border-4 border-black px-3 py-1 bg-green-400 text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] uppercase">
              Online
            </span>
            <div className="w-10 h-10 border-4 border-black bg-blue-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-black">
                A
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
             {children}
          </div>
        </main>

      </div>
    </div>
  );
}