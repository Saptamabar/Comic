"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ComicButton } from "@/components/ui/ComicButton";
import { useUiSound } from "@/hooks/useUiSound";

interface NavbarProps {
  onPlayClick: () => void;
}

export function Navbar({ onPlayClick }: NavbarProps) {
  const { playClick, playHover } = useUiSound();

  const scrollToSection = (id: string) => {
    playClick();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-black shadow-pop px-6 py-4 flex items-center justify-between"
    >
      <div className="flex items-center gap-8">
        <Link 
          href="/" 
          onClick={() => playClick()}
          onMouseEnter={() => playHover()}
          className="font-bangers text-4xl text-red-500 drop-shadow-[2px_2px_0_#000] rotate-[-2deg] hover:rotate-2 transition-transform"
        >
          HISTOPLAY
        </Link>
        
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

      <div className="flex items-center gap-4">
        <Link 
          href="/auth/user"
          onClick={() => playClick()}
          onMouseEnter={() => playHover()}
          className="hidden md:block font-comic text-xl font-bold hover:text-blue-500 transition-colors"
        >
          Login
        </Link>
        <ComicButton 
          variant="primary" 
          onClick={() => {
            playClick();
            onPlayClick();
          }}
          className="text-xl px-6 py-2 animate-bounce-slight"
        >
          PLAY NOW
        </ComicButton>
      </div>
    </motion.nav>
  );
}
