"use client";

import React, { useState } from "react";
import Image from "next/image";
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
                className="fixed inset-0 z-[60] flex items-start md:items-center justify-center bg-black/85 p-4 md:p-8 overflow-y-auto"
            >
                <div className="w-full max-w-6xl my-auto">
                    <div className="flex flex-col-2 md:flex-row justify-between items-center gap-4 mb-6 md:mb-12">
                        <h2 className="font-bangers text-2xl md:text-6xl text-pop-yellow tracking-wider text-shadow-pop text-center md:text-left uppercase">
                            Pilih Misimu
                        </h2>
                        <ComicButton 
                            variant="danger" 
                            onClick={onClose}
                            className="text-sm md:text-xl py-2 px-6"
                        >
                            TUTUP [X]
                        </ComicButton>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 pb-10">
                        {MISSIONS.map((mission) => (
                            <motion.div
                                key={mission.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                    "relative bg-white border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] md:shadow-pop p-4 cursor-pointer overflow-hidden group transition-all",
                                    selectedMission?.id === mission.id ? "ring-4 ring-pop-yellow border-pop-yellow" : "hover:border-pop-blue"
                                )}
                                onClick={() => {
                                    playClick();
                                    setSelectedMission(mission);
                                }}
                                onMouseEnter={playHover}
                            >
                                <div className="aspect-video bg-gray-200 border-2 border-black mb-4 relative overflow-hidden">
                                    <Image 
                                        src={mission.thumbnail} 
                                        alt={mission.title} 
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw" 
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        priority={mission.id === "proklamasi"} 
                                    />
                                    <div className={cn(
                                        "absolute inset-0 bg-black/20 transition-opacity z-10",
                                        selectedMission?.id === mission.id ? "opacity-0" : "group-hover:opacity-0"
                                    )} />
                                </div>

                                <div className="bg-pop-red text-white text-[10px] md:text-xs font-bold inline-block px-2 py-1 mb-2 -rotate-2 border-2 border-black uppercase relative z-20">
                                    EDISI #{mission.id === "proklamasi" ? "01" : "02"}
                                </div>

                                <h3 className="font-bangers text-2xl md:text-4xl mb-2 leading-tight relative z-20">
                                    {mission.title}
                                </h3>
                                
                                <p className="font-comic text-sm md:text-lg text-gray-700 leading-snug line-clamp-3 md:line-clamp-none relative z-20">
                                    {mission.description}
                                </p>

                                <AnimatePresence>
                                    {selectedMission?.id === mission.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden relative z-20"
                                        >
                                            <div className="mt-4 pt-4 border-t-2 border-dashed border-black">
                                                <ComicButton
                                                    variant="primary"
                                                    className="w-full text-lg md:text-2xl py-3 md:py-4"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        playClick();
                                                        onSelectMission(mission.id);
                                                    }}
                                                >
                                                    MULAI MISI &rarr;
                                                </ComicButton>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}