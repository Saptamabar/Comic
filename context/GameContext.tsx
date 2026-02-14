"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Scene, Choice, Mission } from "@/lib/types";
import { STORY_DATA, MISSIONS } from "@/lib/story-data";
import { ARCHIVE_DATA } from "@/lib/archive-data";

interface GameContextType {
    currentScene: Scene;
    score: number;
    history: string[];
    lastFeedback: string | null;
    lastFeedbackStyle: "pop" | "subtle" | "none";
    gameStatus: "menu" | "playing" | "ended";
    activeMission: Mission | null;
    makeChoice: (choice: Choice) => void;
    startGame: (missionId?: string) => void;
    restartGame: () => void;
    isTransitioning: boolean;
    unlockedArchives: string[];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
    const [currentSceneId, setCurrentSceneId] = useState<string>("start");
    const [activeMission, setActiveMission] = useState<Mission | null>(null);
    const [score, setScore] = useState<number>(0);
    const [history, setHistory] = useState<string[]>([]);
    const [lastFeedback, setLastFeedback] = useState<string | null>(null);
    const [lastFeedbackStyle, setLastFeedbackStyle] = useState<"pop" | "subtle" | "none">("pop");
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
    const [gameStatus, setGameStatus] = useState<"menu" | "playing" | "ended">("menu");

    // Lookup scene from active mission or fallback
    const currentScene = activeMission?.scenes[currentSceneId] || STORY_DATA["start"];

    const startGame = (missionId: string = "proklamasi") => {
        const mission = MISSIONS.find(m => m.id === missionId) || MISSIONS[0];
        setActiveMission(mission);
        setCurrentSceneId(mission.startSceneId);

        setGameStatus("playing");
        setScore(0);
        setHistory([]);
    };

    const [unlockedArchives, setUnlockedArchives] = useState<string[]>([]);

    const checkUnlocks = (sceneId: string) => {
        // ... existing function ...
        const newUnlocks = ARCHIVE_DATA
            .filter(entry => entry.unlockCondition === sceneId && !unlockedArchives.includes(entry.id))
            .map(entry => entry.id);

        if (newUnlocks.length > 0) {
            setUnlockedArchives(prev => [...prev, ...newUnlocks]);
        }
    };

    const makeChoice = (choice: Choice) => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setLastFeedback(choice.feedback);
        setLastFeedbackStyle(choice.feedbackStyle || "pop");

        // Update Score
        if (choice.scoreDelta) {
            setScore((prev) => prev + choice.scoreDelta!);
        }

        // Add to history
        setHistory((prev) => [...prev, currentSceneId]);

        // Delay handling for visual feedback
        const delay = choice.feedbackStyle === "none" ? 500 : 1500;

        setTimeout(() => {
            setLastFeedback(null);

            if (choice.nextSceneId === "end") {
                setGameStatus("ended");
            } else {
                setCurrentSceneId(choice.nextSceneId);
                checkUnlocks(choice.nextSceneId);
            }
            setIsTransitioning(false);
        }, delay);
    };

    const restartGame = () => {
        setGameStatus("menu");
        // Reset to active mission start if exists, else default
        setCurrentSceneId(activeMission?.startSceneId || "prologue_1");
        setScore(0);
        setHistory([]);
        setLastFeedback(null);
        setIsTransitioning(false);
        checkUnlocks("start");
    };

    // Initial check
    React.useEffect(() => {
        checkUnlocks("start");
    }, []);

    return (
        <GameContext.Provider
            value={{
                currentScene,
                score,
                history,
                lastFeedback,
                lastFeedbackStyle,
                gameStatus,
                activeMission,
                makeChoice,
                startGame,
                restartGame,
                isTransitioning,
                unlockedArchives,
            }}
        >
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error("useGame must be used within a GameProvider");
    }
    return context;
}
