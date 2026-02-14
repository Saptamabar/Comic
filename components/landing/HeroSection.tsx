"use client";

import React from "react";
import { ComicButton } from "@/components/ui/ComicButton";
import { motion } from "framer-motion";

interface HeroSectionProps {
    onStart: () => void;
}

export function HeroSection({ onStart }: HeroSectionProps) {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center bg-pop-yellow bg-halftone bg-[length:20px_20px] overflow-hidden p-4">
            {/* Dynamic Background Elements */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 right-0 w-[500px] h-[500px] bg-pop-red rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/2"
            />
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pop-blue rounded-full opacity-20 blur-3xl translate-y-1/2 -translate-x-1/2"
            />

            {/* Main Content */}
            <div className="z-10 text-center max-w-4xl w-full">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="mb-8 relative"
                >
                    {/* Comic Burst Background for Title */}
                    <div className="absolute inset-0 bg-white transform -rotate-2 scale-110 z-[-1] border-4 border-black shadow-pop" />

                    <h1 className="font-bangers text-7xl md:text-9xl text-pop-red drop-shadow-[6px_6px_0_#000] stroke-black tracking-wider transform rotate-2">
                        REVOLUSI 45
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white border-4 border-black p-6 shadow-pop mb-12 rotate-[-1deg] max-w-2xl mx-auto"
                >
                    <p className="font-comic text-xl md:text-2xl font-bold uppercase tracking-tight">
                        "The Fate of the Nation is in <span className="text-pop-red underline decoration-wavy">YOUR</span> Hands!"
                    </p>
                    <p className="font-comic text-lg mt-2 text-gray-700">
                        Navigate the critical moments of Indonesian Independence. Make choices. Change History.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                >
                    <ComicButton
                        onClick={onStart}
                        className="text-3xl px-16 py-6 animate-pulse hover:scale-105 transition-transform"
                    >
                        START MISSION
                    </ComicButton>
                </motion.div>
            </div>

            {/* Comic Decorative Elements from corners */}
            <div className="absolute bottom-4 right-4 font-bangers text-4xl text-black opacity-20 rotate-12">
                BOOM!
            </div>
            <div className="absolute top-10 left-10 font-bangers text-3xl text-black opacity-20 -rotate-12">
                POW!
            </div>
        </section>
    );
}
