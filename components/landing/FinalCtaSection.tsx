"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ComicButton } from "@/components/ui/ComicButton";
import { useUiSound } from "@/hooks/useUiSound";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

interface FinalCtaSectionProps {
  onStart: () => void;
}

export function FinalCtaSection({ onStart }: FinalCtaSectionProps) {
  const { playClick, playHover } = useUiSound();

  const [ctaData, setCtaData] = useState({
    title: "Siap Menjelajah Sejarah?",
    subTitle: "Mulai petualangan interaktif pertamamu dan jelajahi sejarah Indonesia dengan cara yang seru!",
    primaryButton: "Mulai Sekarang",
    secondaryButton: "Daftar"
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "web_settings", "homepage"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.finalCta) setCtaData(data.finalCta);
      }
    });
    return () => unsub();
  }, []);

  return (
    <section className="relative py-12 md:py-24 bg-[#fdf6e3] overflow-hidden border-b-8 border-[#3e2723]">
      {/* Background Sunburst Effect */}
      <div className="absolute inset-0 bg-[repeating-conic-gradient(#3e2723_0_15deg,transparent_0_30deg)] opacity-5 animate-spin-slow" />
      
      {/* Corak Diagonal Tipis */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(62,39,35,0.03)_25%,transparent_25%,transparent_75%,rgba(62,39,35,0.03)_75%,rgba(62,39,35,0.03))] bg-[length:40px_40px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto bg-[#fcf8ef] border-[3px] md:border-6 border-[#3e2723] p-6 md:p-10 shadow-[6px_6px_0_0_#3e2723] md:shadow-[10px_10px_0_0_#3e2723] rotate-1"
        >
          <h2 className="font-bangers text-3xl md:text-5xl text-[#b71c1c] mb-3 md:mb-4 uppercase tracking-wider drop-shadow-[1.5px_1.5px_0_#ffca28] leading-none">
            {ctaData.title}
          </h2>
          
          <p className="font-comic text-xs md:text-lg font-bold text-[#3e2723] mb-6 md:mb-8 leading-tight px-2 opacity-90">
            {ctaData.subTitle}
          </p>

          {/* FLEX INLINE: Selalu menyamping baik di HP maupun Desktop */}
          <div className="flex flex-row items-center justify-center gap-3 md:gap-6">
            <ComicButton 
              variant="primary" 
              className="text-xs md:text-lg px-4 py-2 md:px-8 md:py-4 bg-[#b71c1c] hover:bg-[#a01818] text-white border-[#3e2723] shadow-[3px_3px_0_0_#3e2723] whitespace-nowrap animate-bounce-slight"
              onClick={() => {
                playClick();
                onStart();
              }}
              onMouseEnter={() => playHover()}
            >
              {ctaData.primaryButton}
            </ComicButton>

            <Link href="/auth/user">
              <ComicButton 
                variant="neutral" 
                className="text-xs md:text-lg px-4 py-2 md:px-8 md:py-4 bg-[#2b5ba9] hover:bg-[#234b8c] text-white border-[#3e2723] shadow-[3px_3px_0_0_#3e2723] whitespace-nowrap"
                onClick={() => playClick()}
                onMouseEnter={() => playHover()}
              >
                {ctaData.secondaryButton}
              </ComicButton>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}