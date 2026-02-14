"use client";

import React from "react";
import { ArchiveEntry } from "@/lib/archive-data";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ArchiveCardProps {
    entry: ArchiveEntry;
    isUnlocked: boolean;
    onClick: () => void;
}

export function ArchiveCard({ entry, isUnlocked, onClick }: ArchiveCardProps) {
    return (
        <motion.div
            whileHover={isUnlocked ? { scale: 1.05, rotate: 1 } : {}}
            className={cn(
                "relative p-4 border-4 border-black bg-white shadow-pop cursor-pointer transition-colors h-64 flex flex-col items-center justify-center text-center",
                !isUnlocked && "bg-gray-200 cursor-not-allowed opacity-80"
            )}
            onClick={isUnlocked ? onClick : undefined}
        >
            {/* Folder Tab Look */}
            <div className="absolute -top-3 left-0 w-1/3 h-4 bg-inherit border-t-4 border-l-4 border-r-4 border-black border-dashed" />

            {isUnlocked ? (
                <>
                    {/* Unlocked Content */}
                    <div className="w-24 h-24 bg-gray-300 mb-4 border-2 border-black overflow-hidden relative">
                        {/* Placeholder or Image */}
                        {entry.image && (
                            <img src={entry.image} alt={entry.title} className="w-full h-full object-cover" />
                        )}
                    </div>
                    <h3 className="font-bangers text-xl leading-none">{entry.title}</h3>
                    <div className="mt-2 text-xs font-bold text-pop-blue  uppercase">
                        [ READ FILE ]
                    </div>
                </>
            ) : (
                <>
                    {/* Locked Content */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="border-4 border-red-600 text-red-600 font-black text-3xl px-4 py-2 opacity-50 -rotate-12 border-double">
                            TOP SECRET
                        </div>
                    </div>
                    <div className="mt-auto text-xs font-mono text-gray-500">
                        ACCESS DENIED
                    </div>
                </>
            )}
        </motion.div>
    );
}
