"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MISSIONS } from "@/lib/story-data";
import { ComicButton } from "@/components/ui/ComicButton";
import { useUiSound } from "@/hooks/useUiSound";
import { Mission } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MissionSelectorProps {
    onSelectMission: (missionId: string) => void;
    onClose: () => void;
}

export function MissionSelector({ onSelectMission, onClose }: MissionSelectorProps) {
    const { playClick, playHover } = useUiSound();
    const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            >
                <div className="w-full max-w-6xl">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="font-bangers text-5xl text-pop-yellow tracking-wider text-shadow-pop">
                            SELECT YOUR MISSION
                        </h2>
                        <ComicButton variant="danger" onClick={onClose}>
                            CLOSE X
                        </ComicButton>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {MISSIONS.map((mission) => (
                            <motion.div
                                key={mission.id}
                                whileHover={{ scale: 1.02 }}
                                className={cn(
                                    "relative bg-white border-4 border-black shadow-pop p-4 cursor-pointer overflow-hidden group",
                                    selectedMission?.id === mission.id ? "ring-4 ring-pop-yellow" : ""
                                )}
                                onClick={() => {
                                    playClick();
                                    setSelectedMission(mission);
                                }}
                                onMouseEnter={playHover}
                            >
                                {/* Comic Cover Style */}
                                <div className="aspect-video bg-gray-300 border-2 border-black mb-4 relative overflow-hidden">
                                    {/* Thumbnail placeholder */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white font-bangers text-4xl opacity-50">
                                        COVER ART
                                    </div>
                                    <img src={mission.thumbnail} alt={mission.title} className="w-full h-full object-cover" />
                                </div>

                                <div className="bg-pop-red text-white text-xs font-bold inline-block px-2 py-1 mb-2 -rotate-2 border-2 border-black">
                                    ISSUE #{mission.id === "proklamasi" ? "01" : "02"}
                                </div>

                                <h3 className="font-bangers text-4xl mb-2">{mission.title}</h3>
                                <p className="font-comic text-lg text-gray-700 leading-snug">
                                    {mission.description}
                                </p>

                                {selectedMission?.id === mission.id && (
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="mt-6"
                                    >
                                        <ComicButton
                                            variant="primary"
                                            className="w-full text-xl py-3"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                playClick();
                                                onSelectMission(mission.id);
                                            }}
                                        >
                                            START MISSION &rarr;
                                        </ComicButton>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
