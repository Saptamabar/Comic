"use client";

import React from "react";
import { ComicButton } from "@/components/ui/ComicButton";
import { useGame } from "@/context/GameContext";
import { motion } from "framer-motion";

export function EndScreen() {
    const { score, restartGame } = useGame();

    let rank = "History Rookie";
    if (score > 20) rank = "Time Lord";
    else if (score > 0) rank = "Agent";

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-400 p-4 bg-halftone bg-[length:20px_20px]">
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white border-4 border-black p-8 shadow-pop text-center max-w-lg"
            >
                <h2 className="font-bangers text-5xl text-pop-yellow drop-shadow-[2px_2px_0_#000] mb-6">
                    MISSION REPORT
                </h2>

                <div className="mb-6">
                    <p className="font-comic text-2xl mb-2">Final Score:</p>
                    <p className="font-bangers text-6xl">{score}</p>
                </div>

                <div className="mb-8">
                    <p className="font-comic text-xl">Rank:</p>
                    <p className="font-bangers text-4xl text-pop-red">{rank}</p>
                </div>

                <ComicButton onClick={restartGame} variant="primary">
                    PLAY AGAIN
                </ComicButton>
            </motion.div>
        </div>
    );
}
