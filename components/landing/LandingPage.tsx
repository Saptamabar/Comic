"use client";

import React, { useState } from "react";
import { Navbar } from "./Navbar";
import { HeroSection } from "./HeroSection";
import { ProblemSection } from "./ProblemSection";
import { SolutionSection } from "./SolutionSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { StoryPreviewSection } from "./StoryPreviewSection";
import { GamificationSection } from "./GamificationSection";
import { EmotionalSection } from "./EmotionalSection";
import { FinalCtaSection } from "./FinalCtaSection";
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
        <main className="flex flex-col min-h-screen selection:bg-pop-yellow selection:text-black">
            <Navbar onPlayClick={() => {
                playClick();
                setIsMissionSelectOpen(true);
            }} />

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

            <ProblemSection />
            <SolutionSection />
            <HowItWorksSection />
            <StoryPreviewSection onPlayClick={() => {
                playClick();
                setIsMissionSelectOpen(true);
            }} />
            <GamificationSection />
            <EmotionalSection />
            <FinalCtaSection onStart={() => {
                playClick();
                setIsMissionSelectOpen(true);
            }} />

            {/* Archive Button Floating */}
            <div className="fixed bottom-6 right-6 z-40">
                <ComicButton
                    variant="neutral"
                    className="text-sm py-2 px-4 shadow-pop animate-bounce-slight bg-white text-black border-4 border-black"
                    onClick={() => {
                        playClick();
                        setIsArchiveOpen(true);
                    }}
                >
                    SECRET ARCHIVES 📂
                </ComicButton>
            </div>
            
            <Footer />
        </main>
    );
}
