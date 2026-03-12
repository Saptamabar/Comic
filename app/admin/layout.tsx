"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Layout,
  BookOpen,
  Users,
  Settings,
  LogOut,
  Zap,
  Menu,
  X
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={20}/> },
    { name: "Landing Page", href: "/admin/landing", icon: <Layout size={20}/> },
    { name: "Manajemen Komik", href: "/admin/komik", icon: <BookOpen size={20} /> },
    { name: "Manajemen User", href: "/admin/users", icon: <Users size={20} /> },
    { name: "Settings Web", href: "/admin/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-yellow-50 font-mono">

      {/* Overlay Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 w-72 bg-white border-r-8 border-black p-6 flex flex-col justify-between
        h-full transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >

        <div>

          {/* Logo */}
          <div className="mb-10 transform -rotate-2 flex justify-between items-center">
            <h2 className="bg-black text-white text-2xl font-black p-2 inline-block border-2 border-red-500 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] uppercase italic tracking-tighter">
              Admin HQ!
            </h2>

            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X />
            </button>
          </div>

          {/* Menu */}
          <nav className="space-y-4">
            {menuItems.map((item) => {

              const isActive =
                pathname === item.href ||
                pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 p-3 border-4 border-black font-black uppercase transition-all
                  ${isActive
                    ? "bg-blue-500 text-white translate-x-2 shadow-none"
                    : "bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:shadow-none"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </nav>

        </div>

        {/* Logout */}
        <button className="flex items-center gap-3 p-3 border-4 border-black bg-red-500 text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all">
          <LogOut size={20} />
          Abort Mission!
        </button>

      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">

        {/* Header */}
        <header className="mb-8 flex justify-between items-center bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sticky top-0 z-10">

          <div className="flex items-center gap-3">

            <button
              className="lg:hidden border-2 border-black p-2 bg-yellow-300"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu />
            </button>

            <h1 className="text-3xl font-black uppercase italic">
              <Zap className="inline mr-2 text-yellow-500" fill="currentColor" />
              Control Center
            </h1>

          </div>

          <span className="font-bold border-2 border-black px-2 py-1 bg-green-300">
            ADMIN_ONLINE
          </span>

        </header>

        {/* Page Content */}
        <section>
          {children}
        </section>

      </main>

    </div>
  );
}