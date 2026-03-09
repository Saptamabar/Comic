"use client";

import React, { useState } from "react";
import { HeroSection } from "./HeroSection";
import { FeatureSection } from "./FeatureSection";
import { CharacterShowcase } from "./CharacterShowcase";
import { Footer } from "./Footer";
import { useSoundManager } from "@/hooks/useSoundManager";
import { useUiSound } from "@/hooks/useUiSound";
import { ArchiveModal } from "@/components/archives/ArchiveModal";
import { useGame } from "@/context/GameContext";
import { ComicButton } from "@/components/ui/ComicButton";
import { MissionSelector } from "./MissionSelector";

interface LandingPageProps {
    onStartGame: (missionId?: string) => void;
}

export function LandingPage({ onStartGame }: LandingPageProps) {
    const { playClick, playHover } = useUiSound();
    const [isArchiveOpen, setIsArchiveOpen] = useState(false);
    const [isMissionSelectOpen, setIsMissionSelectOpen] = useState(false);

    // Play Intro BGM
    useSoundManager("/assets/audio/bgm/intro.mp3");

    // We need access to unlocked archives. 
    // Ideally LandingPage shouldn't need GameProvider if it's outside, 
    // but StartScreen wraps it in GameProvider, so we can use useGame().
    const { unlockedArchives } = useGame();

    return (
        <main className="flex flex-col min-h-screen">
            {isMissionSelectOpen && (
                <MissionSelector
                    onSelectMission={(id) => {
                        setIsMissionSelectOpen(false);
                        onStartGame(id);
                    }}
                    onClose={() => setIsMissionSelectOpen(false)}
                />
            )}

            <ArchiveModal
                isOpen={isArchiveOpen}
                onClose={() => setIsArchiveOpen(false)}
                unlockedIds={unlockedArchives}
            />

            <HeroSection onStart={() => {
                playClick();
                setIsMissionSelectOpen(true);
            }} />

            {/* Archive Button Floating or in Section? Let's add it to Hero or Feature */}
            <div className="fixed top-4 right-4 z-50">
                <ComicButton
                    variant="neutral"
                    className="text-sm py-2 px-4 shadow-pop"
                    onClick={() => {
                        playClick();
                        setIsArchiveOpen(true);
                    }}
                >
                    SECRET ARCHIVES 📂
                </ComicButton>
            </div>
            <FeatureSection />
            <CharacterShowcase />
            <Footer />
        </main>
    );
}
