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
import { Award, Flag, Info, LogOut } from "lucide-react";

export function GameContainer() {
    const { currentScene, activeMission, makeChoice, isTransitioning, history, lastFeedback, lastFeedbackStyle, score, lastSelectedChoiceId, restartGame } = useGame();

    // Initialize Sound Manager
    useSoundManager(currentScene.audio?.bgm, currentScene.audio?.sfx);

    const totalScenes = activeMission ? Object.keys(activeMission.scenes).length : 20;
    const progressPercent = Math.min(100, Math.round((history.length / totalScenes) * 100));

    // Define which characters should be rendered as narration boxes instead of avatars
    const NARRATION_ENTITIES = ["Sejarah", "Radio Jepang", "Narator", "17 Agustus 1945", "INDONESIA MERDEKA", "Game Over", "Radio Pemberontakan", "Pertahanan Kota", "Kekalahan"];
    const isNarration = NARRATION_ENTITIES.includes(currentScene.characterName);

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8 flex items-center justify-center relative">

            <div className="max-w-6xl xl:max-w-7xl w-full grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mt-4 md:mt-0">

                {/* Main Scene Panel */}
                <ComicPanel
                    withHalftone
                    className={cn(
                        "md:col-span-8 min-h-[400px] md:min-h-[550px] lg:min-h-[650px] flex flex-col justify-between p-0 overflow-hidden bg-cover bg-center border-4 border-black relative",
                        currentScene.backgroundClass
                    )}
                    style={{
                        backgroundImage: currentScene.backgroundImage ? `url(${currentScene.backgroundImage})` : undefined
                    }}
                >
                    {/* Embedded HUD */}
                    <div className="flex justify-between items-start z-40 p-4">
                        <div className="flex items-center gap-2 md:gap-4">
                            <button
                                onClick={restartGame}
                                className="bg-pop-red text-white border-2 border-black px-2 py-1 md:px-3 md:py-2 flex items-center gap-1 md:gap-2 font-bangers text-lg md:text-xl shadow-[3px_3px_0_#000] hover:bg-red-600 transition-all hover:translate-y-[2px] hover:shadow-[1px_1px_0_#000] active:translate-y-[3px] active:shadow-none"
                                title="Kembali ke Menu Utama"
                            >
                                <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                                <span className="hidden sm:inline">MENU</span>
                            </button>
                            <div className="bg-white border-2 border-black px-3 py-1 md:px-4 md:py-2 flex items-center gap-2 font-bangers text-base md:text-xl shadow-[3px_3px_0_#000]">
                                <Flag className="w-4 h-4 md:w-5 md:h-5 text-pop-blue" />
                                <span className="hidden sm:inline">PROGRESS:</span> {progressPercent}%
                            </div>
                        </div>
                        <div className="bg-pop-yellow border-2 border-black px-3 py-1 md:px-4 md:py-2 flex items-center gap-2 font-bangers text-lg md:text-xl shadow-[3px_3px_0_#000]">
                            <Award className="w-4 h-4 md:w-5 md:h-5 text-pop-red" />
                            <span>SCORE: {score}</span>
                        </div>
                    </div>

                    {isNarration ? (
                        /* NARRATION BOX UI */
                        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 lg:p-8 z-20">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`narration-${currentScene.id}`}
                                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    exit={{ scale: 0.9, opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                    className="flex flex-col items-center max-w-2xl w-full"
                                >
                                    {/* Caption Box */}
                                    <div className="bg-pop-yellow border-4 border-black p-6 md:p-8 shadow-[8px_8px_0_#000] text-center relative w-full mt-[-20px] pt-8">
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 font-bangers tracking-wider text-xl uppercase">
                                            {currentScene.characterName}
                                        </div>
                                        <p className="font-comic text-base md:text-xl font-bold leading-relaxed whitespace-pre-wrap">
                                            {currentScene.dialogue}
                                        </p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    ) : (
                        /* REGULAR CHARACTER DIALOGUE UI */
                        <div className="flex-1 flex flex-row items-end justify-start p-4 md:p-6 lg:p-8 overflow-hidden z-10">
                            {/* Character (Animated In) */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentScene.id}
                                    initial={{ x: -100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -50, opacity: 0 }}
                                    transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                                    className="relative z-20 w-40 md:w-56 lg:w-72 shrink-0 pointer-events-none -ml-4 md:-ml-2 -mb-4 md:-mb-10"
                                >
                                    <CharacterAvatar
                                        name={currentScene.characterName}
                                        src={currentScene.characterImage}
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Dialogue Bubble */}
                            <div className="relative z-30 mb-8 md:mb-16 -ml-4 md:ml-4 flex-1 max-w-[70%] md:max-w-2xl">
                                <SpeechBubble variant="oval" tailPosition="bottom-left" className="backdrop-blur-sm bg-white/95 p-4 md:p-6 shadow-[6px_6px_0_#000]">
                                    <p className="whitespace-pre-wrap font-comic text-sm md:text-xl font-bold leading-relaxed">{currentScene.dialogue}</p>
                                </SpeechBubble>
                            </div>
                        </div>
                    )}
                </ComicPanel>

                {/* Choices Panel */}
                <div className="md:col-span-4 flex flex-col gap-3">
                    {/* Error Explanation Context */}
                    {currentScene.explanation && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-red-50 border-4 border-red-900 p-4 mb-2 shadow-[6px_6px_0_#7f1d1d] text-red-900 rotate-1 relative z-30"
                        >
                            <h3 className="font-bangers text-xl md:text-2xl mb-2 flex items-center gap-2">
                                <Info className="w-5 h-5 md:w-6 md:h-6 shrink-0" /> FAKTA SEJARAH
                            </h3>
                            <p className="font-comic text-sm md:text-base font-bold leading-relaxed">
                                {currentScene.explanation}
                            </p>
                        </motion.div>
                    )}

                    <div className="bg-black text-white p-2 font-bangers text-center text-xl border-4 border-white shadow-lg rotate-1">
                        WHAT WILL YOU DO?
                    </div>
                    {currentScene.choices.map((choice, index) => {
                        const isSelected = isTransitioning && choice.id === lastSelectedChoiceId;
                        const isWrong = isSelected && (choice.isCorrect === false || (choice.scoreDelta !== undefined && choice.scoreDelta < 0));
                        const isRight = isSelected && (choice.isCorrect === true || (choice.scoreDelta !== undefined && choice.scoreDelta > 0));

                        return (
                            <motion.div
                                key={choice.id}
                                initial={{ x: 50, opacity: 0 }}
                                animate={isWrong ? { x: [-10, 10, -10, 10, 0], opacity: 1 } : { x: 0, opacity: 1 }}
                                transition={isWrong ? { duration: 0.4 } : { delay: index * 0.1 }}
                            >
                                <ComicButton
                                    variant={isWrong ? "danger" : (isRight ? "primary" : "neutral")}
                                    onClick={() => makeChoice(choice)}
                                    className={cn(
                                        "w-full text-left text-lg py-4 transition-colors duration-200",
                                        isWrong && "bg-red-500 text-white border-red-900",
                                        isRight && "bg-green-500 text-white border-green-900"
                                    )}
                                    disabled={isTransitioning}
                                >
                                    {choice.text}
                                </ComicButton>
                            </motion.div>
                        );
                    })}
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
