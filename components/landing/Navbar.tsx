"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ComicButton } from "@/components/ui/ComicButton";
import { useUiSound } from "@/hooks/useUiSound";
import { Menu, X } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase"; 
import { User } from "firebase/auth"; 

interface NavbarProps {
  onPlayClick: () => void;
}

export function Navbar({ onPlayClick }: NavbarProps) {
  const { playClick, playHover } = useUiSound();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            setRole(userSnap.data().role); 
          }
        } catch (error) {
          console.error("Gagal mengambil role:", error);
        }
      } else {
        setRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const scrollToSection = (id: string) => {
    playClick();
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-black shadow-pop px-4 md:px-6 py-3 flex items-center justify-between"
    >
      <div className="flex items-center gap-8">
        <Link
          href="/"
          onClick={() => playClick()}
          onMouseEnter={() => playHover()}
          className="font-bangers text-3xl md:text-4xl text-red-500 drop-shadow-[2px_2px_0_#000] rotate-[-2deg] hover:rotate-2 transition-transform uppercase"
        >
          HISTOPLAY
        </Link>

        <div className="hidden md:flex items-center gap-6 font-comic text-xl font-bold">
          <button onClick={() => scrollToSection("explore-stories")} className="hover:text-blue-500 uppercase">
            Jelajah Cerita
          </button>
          <button onClick={() => scrollToSection("how-it-works")} className="hover:text-blue-500 uppercase">
            Cara Bermain
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {user ? (
          role === "admin" ? (
            <Link href="/admin/dashboard" className="hidden md:block font-comic text-xl font-bold text-red-600 hover:scale-110 transition-transform uppercase">
              Panel Admin
            </Link>
          ) : (
            <Link href="/dashboard" className="hidden md:block font-comic text-xl font-bold text-green-600 hover:scale-110 transition-transform uppercase">
              Dashboard
            </Link>
          )
        ) : (
          <Link href="/auth/user" className="hidden md:block font-comic text-xl font-bold text-blue-600 uppercase">
            Masuk
          </Link>
        )}

        <ComicButton
          variant="primary"
          onClick={() => { playClick(); onPlayClick(); }}
          className="text-xs md:text-xl px-4 md:px-6 py-2 animate-bounce-slight"
        >
          MAINKAN SEKARANG!
        </ComicButton>

        <button
          onClick={() => { playClick(); setIsOpen(!isOpen); }}
          className="md:hidden p-2 border-2 border-black bg-yellow-400 shadow-[2px_2px_0_#000]"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-white border-b-4 border-black p-6 flex flex-col gap-4 md:hidden shadow-2xl font-comic text-lg font-bold"
          >
            <button onClick={() => scrollToSection("explore-stories")} className="text-left py-2 border-b-2 border-dashed uppercase">
              Jelajah Cerita
            </button>
            <button onClick={() => scrollToSection("how-it-works")} className="text-left py-2 border-b-2 border-dashed uppercase">
              Cara Bermain
            </button>

            {user ? (
              role === "admin" ? (
                <Link href="/admin/dashboard" onClick={() => setIsOpen(false)} className="py-2 text-red-600 uppercase italic">
                   Panel Admin
                </Link>
              ) : (
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="py-2 text-green-600 uppercase italic">
                   Ke Dashboard
                </Link>
              )
            ) : (
              <Link href="/auth/user" onClick={() => setIsOpen(false)} className="py-2 text-blue-600 uppercase italic">
                Masuk / Login
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}