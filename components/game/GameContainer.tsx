"use client";

import React from "react";
import { useGame } from "@/context/GameContext";
import { ComicPanel } from "@/components/ui/ComicPanel";
import { ComicButton } from "@/components/ui/ComicButton";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { CharacterAvatar } from "@/components/ui/CharacterAvatar";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSoundManager } from "@/hooks/useSoundManager";

export function GameContainer() {
    const { currentScene, makeChoice, isTransitioning, history, lastFeedback, lastFeedbackStyle } = useGame();

    // Initialize Sound Manager
    useSoundManager(currentScene.audio?.bgm, currentScene.audio?.sfx);

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex items-center justify-center">
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-4">

                {/* Main Scene Panel */}
                <ComicPanel
                    withHalftone
                    className={cn(
                        "md:col-span-8 min-h-[400px] flex flex-col justify-end p-0 overflow-hidden bg-cover bg-center",
                        currentScene.backgroundClass
                    )}
                    style={{
                        backgroundImage: currentScene.backgroundImage ? `url(${currentScene.backgroundImage})` : undefined
                    }}
                >
                    {/* Character (Animated In) */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentScene.id}
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute bottom-0 left-4 z-10"
                        >
                            <CharacterAvatar
                                name={currentScene.characterName}
                                src={currentScene.characterImage}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Dialogue Bubble */}
                    <div className="relative z-20 mb-32 ml-36 mr-4 self-start">
                        <SpeechBubble variant="oval" tailPosition="bottom-left">
                            <p className="whitespace-pre-wrap">{currentScene.dialogue}</p>
                        </SpeechBubble>
                    </div>
                </ComicPanel>

                {/* Choices Panel */}
                <div className="md:col-span-4 flex flex-col gap-3">
                    <div className="bg-black text-white p-2 font-bangers text-center text-xl border-4 border-white shadow-lg rotate-1">
                        WHAT WILL YOU DO?
                    </div>
                    {currentScene.choices.map((choice, index) => (
                        <motion.div
                            key={choice.id}
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <ComicButton
                                variant="neutral"
                                onClick={() => makeChoice(choice)}
                                className="w-full text-left text-lg py-4"
                                disabled={isTransitioning}
                            >
                                {choice.text}
                            </ComicButton>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Feedback Overlay */}
            <AnimatePresence mode="wait">
                {lastFeedback && lastFeedbackStyle !== "none" && (
                    lastFeedbackStyle === "pop" ? (
                        <motion.div
                            key="feedback-pop"
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1.2, rotate: 0 }}
                            exit={{ scale: 2, opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                        >
                            <div className="relative">
                                {/* Starburst Shape using CSS or SVG */}
                                <div className="absolute inset-0 bg-pop-red w-80 h-80 rounded-full animate-pulse mix-blend-multiply filter blur-sm"></div>
                                <div className="relative bg-pop-yellow border-4 border-black p-12 shadow-[10px_10px_0_#000] rotate-12 clip-path-jagged">
                                    <h2 className="font-bangers text-4xl text-center uppercase leading-none">
                                        {lastFeedback.split("! ")[0]}!
                                    </h2>
                                    <p className="font-comic text-xl text-center mt-2">
                                        {lastFeedback.split("! ")[1] || ""}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="feedback-subtle"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                        >
                            <div className="bg-black text-white border-2 border-pop-yellow px-6 py-3 font-comic text-lg shadow-lg rounded-full">
                                {lastFeedback}
                            </div>
                        </motion.div>
                    )
                )}
            </AnimatePresence>
        </div>
    );
}

// Wait, I missed updating GameContext to store the style!
// I need to abort this replacement and update context first.
