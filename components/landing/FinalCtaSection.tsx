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
    <section className="relative py-12 md:py-32 bg-pop-yellow overflow-hidden border-b-8 border-black">
      <div className="absolute inset-0 bg-[repeating-conic-gradient(#000_0_15deg,transparent_0_30deg)] opacity-5 md:opacity-10 animate-spin-slow" />
      
      <div className="container mx-auto px-2 md:px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-white border-4 md:border-8 border-black p-5 md:p-16 shadow-[6px_6px_0_0_rgba(0,0,0,1)] md:shadow-[16px_16px_0_0_rgba(0,0,0,1)] rotate-1"
        >
          <h2 className="font-bangers text-3xl md:text-8xl text-pop-red mb-3 md:mb-8 uppercase tracking-wider drop-shadow-[2px_2px_0_#000] md:drop-shadow-[4px_4px_0_#000] leading-none">
            {ctaData.title}
          </h2>
          
          <p className="font-comic text-sm md:text-3xl font-bold text-gray-800 mb-6 md:mb-14 leading-tight px-2">
            {ctaData.subTitle}
          </p>

          <div className="flex flex-row items-center justify-center gap-4 md:gap-8">
            <ComicButton 
              variant="primary" 
              className="text-xs md:text-4xl px-3 py-2 md:px-14 md:py-8 flex-1 md:flex-none whitespace-nowrap animate-bounce-slight"
              onClick={() => {
                playClick();
                onStart();
              }}
              onMouseEnter={() => playHover()}
            >
              {ctaData.primaryButton}
            </ComicButton>

            <Link href="/auth/user" className="flex-1 md:flex-none">
              <ComicButton 
                variant="neutral" 
                className="text-xs md:text-2xl px-3 py-2 md:px-10 md:py-6 w-full bg-pop-blue text-white whitespace-nowrap"
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