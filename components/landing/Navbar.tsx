"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ComicButton } from "@/components/ui/ComicButton";
import { useUiSound } from "@/hooks/useUiSound";
import { Menu, X } from "lucide-react"; // Import ikon menu

interface NavbarProps {
  onPlayClick: () => void;
}

export function Navbar({ onPlayClick }: NavbarProps) {
  const { playClick, playHover } = useUiSound();
  const [isOpen, setIsOpen] = useState(false); // State untuk mobile menu

  const scrollToSection = (id: string) => {
    playClick();
    setIsOpen(false); // Tutup menu setelah klik
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleToggle = () => {
    playClick();
    setIsOpen(!isOpen);
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-black shadow-pop px-4 md:px-6 py-3 flex items-center justify-between"
    >
      {/* LEFT SIDE: LOGO & DESKTOP NAV */}
      <div className="flex items-center gap-8">
        <Link 
          href="/" 
          onClick={() => playClick()}
          onMouseEnter={() => playHover()}
          className="font-bangers text-3xl md:text-4xl text-red-500 drop-shadow-[2px_2px_0_#000] rotate-[-2deg] hover:rotate-2 transition-transform"
        >
          HISTOPLAY
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 font-comic text-xl font-bold">
          <button 
            onClick={() => scrollToSection('explore-stories')}
            onMouseEnter={() => playHover()}
            className="hover:text-blue-500 transition-colors px-2 py-1"
          >
            Explore Stories
          </button>
          <button 
            onClick={() => scrollToSection('how-it-works')}
            onMouseEnter={() => playHover()}
            className="hover:text-blue-500 transition-colors px-2 py-1"
          >
            How It Works
          </button>
        </div>
      </div>

      {/* RIGHT SIDE: BUTTONS & MOBILE TOGGLE */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Desktop Login */}
        <Link 
          href="/auth/user"
          onClick={() => playClick()}
          onMouseEnter={() => playHover()}
          className="hidden md:block font-comic text-xl font-bold hover:text-blue-500 transition-colors"
        >
          Login
        </Link>

        {/* Play Button - Always Visible but smaller on mobile */}
        <ComicButton 
          variant="primary" 
          onClick={() => {
            playClick();
            onPlayClick();
          }}
          className="text-sm md:text-xl px-4 md:px-6 py-2 animate-bounce-slight"
        >
          PLAY NOW
        </ComicButton>

        {/* Mobile Hamburger Toggle */}
        <button 
          onClick={handleToggle}
          className="md:hidden p-2 border-2 border-black shadow-[2px_2px_0_#000] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all bg-yellow-400"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b-4 border-black p-6 flex flex-col gap-4 md:hidden shadow-2xl font-comic text-lg font-bold"
          >
            <button 
              onClick={() => scrollToSection('explore-stories')}
              className="text-left py-2 border-b-2 border-dashed border-gray-200"
            >
              Explore Stories
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-left py-2 border-b-2 border-dashed border-gray-200"
            >
              How It Works
            </button>
            <Link 
              href="/auth/user"
              onClick={() => setIsOpen(false)}
              className="py-2 text-blue-600"
            >
              Login
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}