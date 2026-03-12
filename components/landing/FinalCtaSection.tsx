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
    title: "Ready to Play Through History?",
    subTitle: "Start your first interactive story and explore Indonesian history in a whole new way.",
    primaryButton: "Start Your First Story \u2192",
    secondaryButton: "Create Free Account"
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
    <section className="relative py-32 bg-pop-yellow overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[repeating-conic-gradient(#000_0_15deg,transparent_0_30deg)] opacity-10 animate-spin-slow" />
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-white border-8 border-black p-12 shadow-[16px_16px_0_0_rgba(0,0,0,1)] rotate-1"
        >
          <h2 className="font-bangers text-6xl md:text-8xl text-pop-red mb-6 uppercase tracking-wider drop-shadow-[4px_4px_0_#000]">
            {ctaData.title}
          </h2>
          
          <p className="font-comic text-2xl font-bold text-gray-800 mb-12">
            {ctaData.subTitle}
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <ComicButton 
              variant="primary" 
              className="text-3xl px-12 py-6 w-full md:w-auto animate-bounce-slight"
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
                className="text-2xl px-8 py-5 w-full md:w-auto bg-pop-blue text-white"
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
