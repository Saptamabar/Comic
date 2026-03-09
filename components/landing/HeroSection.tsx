"use client";

import React, { useEffect, useState } from "react";
import { ComicButton } from "@/components/ui/ComicButton";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase"; 
import { doc, onSnapshot } from "firebase/firestore";

interface HeroSectionProps {
    onStart: () => void;
}

export function HeroSection({ onStart }: HeroSectionProps) {
    const [heroData, setHeroData] = useState({
        title: "REVOLUSI 45",
        subTitle: '"The Fate of the Nation is in YOUR Hands!"',
        description: "Navigate the critical moments of Indonesian Independence. Make choices. Change History.",
        buttonText: "START MISSION" 
    });

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "web_settings", "homepage"), (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                if (data.hero) {
                    setHeroData({
                        title: data.hero.title || "REVOLUSI 45",
                        subTitle: data.hero.subTitle || "",
                        description: data.hero.description || "",
                        buttonText: data.hero.buttonText || "START MISSION"
                    });
                }
            }
        });
        return () => unsub();
    }, []);

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center bg-pop-yellow bg-halftone bg-[length:24px_24px] overflow-hidden p-4">
            
            {/* 1. ACTION LINES (Efek garis komik di background) */}
            <div className="absolute inset-0 opacity-10 pointer-events-none select-none" 
                 style={{ backgroundImage: `radial-gradient(circle, transparent 20%, #000 20%, #000 21%, transparent 21%, transparent 100%)`, backgroundSize: '40px 40px' }}>
                <div className="absolute inset-0 bg-[repeating-conic-gradient(#000_0_15deg,transparent_0_30deg)] opacity-20" />
            </div>

            {/* 2. FLOATING COMIC SHAPES */}
            <motion.div 
                animate={{ y: [0, -20, 0] }} 
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-20 right-[10%] w-32 h-32 bg-pop-red border-4 border-black rotate-12 flex items-center justify-center shadow-pop hidden md:flex"
            >
                <span className="font-bangers text-white text-3xl">ZAP!</span>
            </motion.div>

            <motion.div 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ duration: 0.5, repeat: Infinity }}
                className="absolute bottom-40 left-[5%] w-24 h-24 bg-pop-blue rounded-full border-4 border-black -rotate-12 flex items-center justify-center shadow-pop hidden md:flex"
            >
                <span className="font-bangers text-white text-2xl">BAM!</span>
            </motion.div>

            {/* Main Content */}
            <div className="z-10 text-center max-w-4xl w-full relative">
                
                {/* 3. TITLE SECTION WITH BURST */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="mb-8 relative inline-block"
                >
                    {/* Kotak Putih Ber-layer */}
                    <div className="absolute -inset-4 bg-black transform rotate-1 scale-105 z-[-2]" />
                    <div className="absolute -inset-4 bg-white transform -rotate-2 scale-105 z-[-1] border-4 border-black shadow-pop" />
                    
                    <h1 className="font-bangers text-6xl md:text-9xl text-pop-red drop-shadow-[6px_6px_0_#000] stroke-black tracking-wider transform rotate-2 break-words uppercase px-4">
                        {heroData.title}
                    </h1>
                </motion.div>

                {/* 4. SPEECH BUBBLE STYLE DESCRIPTION */}
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative bg-white border-4 border-black p-8 shadow-pop mb-12 rotate-[-1deg] max-w-2xl mx-auto"
                >
                    {/* Ekor Gelembung Bicara */}
                    <div className="absolute -bottom-6 left-10 w-0 h-0 border-l-[20px] border-l-transparent border-t-[30px] border-t-black border-r-[20px] border-r-transparent after:content-[''] after:absolute after:-top-[34px] after:-left-[16px] after:border-l-[16px] after:border-l-transparent after:border-t-[26px] after:border-t-white after:border-r-[16px] after:border-r-transparent" />

                    <p className="font-comic text-xl md:text-3xl font-black uppercase tracking-tight text-black mb-4 italic">
                        {heroData.subTitle}
                    </p>
                    <div className="h-1 w-20 bg-pop-red mx-auto mb-4 border-2 border-black" />
                    <p className="font-comic text-lg md:text-xl font-bold text-gray-800 leading-tight">
                        {heroData.description}
                    </p>
                </motion.div>

                {/* 5. START BUTTON WITH DECORATIVE BLAST */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                    className="relative inline-block"
                >
                    {/* Decorative Blast Line behind button */}
                    <div className="absolute inset-0 bg-pop-yellow animate-ping rounded-full blur-xl opacity-30" />
                    <ComicButton
                        onClick={onStart}
                        className="relative z-10 text-3xl px-16 py-8 hover:scale-110 transition-transform active:scale-95"
                    >
                        {heroData.buttonText}
                    </ComicButton>
                </motion.div>
            </div>
            
            {/* 6. CORNER DECORATIONS */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pop-red border-8 border-black rotate-45 shadow-pop" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-pop-blue border-8 border-black -rotate-45 shadow-pop" />

            {/* Comic Text on corners */}
            <div className="absolute bottom-10 right-10 font-bangers text-5xl text-black opacity-30 rotate-12 select-none hover:opacity-100 transition-opacity cursor-default">CRASH!</div>
            <div className="absolute top-20 left-10 font-bangers text-4xl text-black opacity-30 -rotate-12 select-none hover:opacity-100 transition-opacity cursor-default">WHAM!</div>
        </section>
    );
}