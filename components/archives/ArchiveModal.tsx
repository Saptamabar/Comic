"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArchiveEntry, ARCHIVE_DATA } from "@/lib/archive-data";
import { ArchiveCard } from "./ArchiveCard";
import { ComicButton } from "@/components/ui/ComicButton";
import { useUiSound } from "@/hooks/useUiSound";

interface ArchiveModalProps {
    isOpen: boolean;
    onClose: () => void;
    unlockedIds: string[];
}

export function ArchiveModal({ isOpen, onClose, unlockedIds }: ArchiveModalProps) {
    const [selectedEntry, setSelectedEntry] = useState<ArchiveEntry | null>(null);
    const { playClick } = useUiSound();

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.8, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.8, y: 50 }}
                    className="bg-neutral-100 w-full max-w-5xl h-[80vh] border-4 border-black shadow-[10px_10px_0_#fff] overflow-hidden flex flex-col relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-black text-white p-4 flex justify-between items-center border-b-4 border-black">
                        <h2 className="font-bangers text-4xl text-pop-yellow tracking-wider">
                            HISTORICAL ARCHIVES // TOP SECRET
                        </h2>
                        <ComicButton variant="danger" onClick={onClose} className="py-1 px-4 text-sm">
                            CLOSE X
                        </ComicButton>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-auto p-8 bg-[url('/assets/backgrounds/paper_texture.png')] bg-repeat">
                        {selectedEntry ? (
                            <div className="flex flex-col md:flex-row gap-8 animate-in fade-in slide-in-from-right duration-300">
                                <div className="md:w-1/3">
                                    <div className="w-full aspect-[3/4] bg-white border-4 border-black shadow-pop p-2 rotate-[-1deg]">
                                        <div className="w-full h-full bg-gray-200 border-2 border-black overflow-hidden">
                                            {selectedEntry.image && (
                                                <img
                                                    src={selectedEntry.image}
                                                    alt={selectedEntry.title}
                                                    className="w-full h-full object-cover grayscale contrast-125"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <ComicButton
                                        variant="neutral"
                                        onClick={() => {
                                            playClick();
                                            setSelectedEntry(null);
                                        }}
                                        className="mt-6 w-full"
                                    >
                                        &larr; BACK TO FILES
                                    </ComicButton>
                                </div>
                                <div className="md:w-2/3 bg-white border-4 border-black p-8 shadow-pop relative">
                                    <div className="absolute -top-4 -right-4 text-red-600 border-4 border-red-600 font-black text-2xl px-4 py-1 rotate-12 opacity-80 decoration-double">
                                        CONFIDENTIAL
                                    </div>
                                    <h3 className="font-bangers text-5xl mb-6 border-b-4 border-black pb-2">
                                        {selectedEntry.title}
                                    </h3>
                                    <p className="font-comic text-xl leading-relaxed whitespace-pre-wrap">
                                        {selectedEntry.content}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {ARCHIVE_DATA.map((entry) => (
                                    <ArchiveCard
                                        key={entry.id}
                                        entry={entry}
                                        isUnlocked={unlockedIds.includes(entry.id)}
                                        onClick={() => {
                                            playClick();
                                            setSelectedEntry(entry);
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
