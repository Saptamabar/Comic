"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";
import { Scene, Choice, Mission } from "@/lib/types";
import { STORY_DATA, MISSIONS } from "@/lib/story-data";
import { ARCHIVE_DATA } from "@/lib/archive-data";

interface GameContextType {
    currentScene: Scene;
    score: number;
    history: string[];
    lastFeedback: string | null;
    lastFeedbackStyle: "pop" | "subtle  " | "none";
    gameStatus: "menu" | "playing" | "ended";
    activeMission: Mission | null;
    makeChoice: (choice: Choice) => void;
    startGame: (missionId?: string) => void;
    restartGame: () => void;
    isTransitioning: boolean;
    unlockedArchives: string[];
    lastSelectedChoiceId: string | null;
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
    const [lastSelectedChoiceId, setLastSelectedChoiceId] = useState<string | null>(null);

    // Lookup scene from active mission or fallback
    const currentScene = activeMission?.scenes[currentSceneId] || STORY_DATA["start"];

    const startGame = useCallback((missionId: string = "proklamasi") => {
        const mission = MISSIONS.find(m => m.id === missionId) || MISSIONS[0];
        setActiveMission(mission);
        setCurrentSceneId(mission.startSceneId);

        setGameStatus("playing");
        setScore(0);
        setHistory([]);
        setLastSelectedChoiceId(null);
    }, []);

    const [unlockedArchives, setUnlockedArchives] = useState<string[]>([]);

    const checkUnlocks = useCallback((sceneId: string) => {
        const newUnlocks = ARCHIVE_DATA
            .filter(entry => entry.unlockCondition === sceneId)
            .map(entry => entry.id);

        if (newUnlocks.length > 0) {
            setUnlockedArchives(prev => {
                const actuallyNew = newUnlocks.filter(id => !prev.includes(id));
                if (actuallyNew.length === 0) return prev;
                return [...prev, ...actuallyNew];
            });
        }
    }, []);

    const makeChoice = useCallback((choice: Choice) => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setLastSelectedChoiceId(choice.id);
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
            setLastSelectedChoiceId(null);
        }, delay);
    }, [isTransitioning, currentSceneId, checkUnlocks]);

    const restartGame = useCallback(() => {
        setGameStatus("menu");
        // Reset to active mission start if exists, else default
        setCurrentSceneId(activeMission?.startSceneId || "prologue_1");
        setScore(0);
        setHistory([]);
        setLastFeedback(null);
        setLastSelectedChoiceId(null);
        setIsTransitioning(false);
        checkUnlocks("start");
    }, [activeMission, checkUnlocks]);

    // Initial check
    React.useEffect(() => {
        checkUnlocks("start");
    }, [checkUnlocks]);

    const contextValue = useMemo(() => ({
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
        lastSelectedChoiceId,
    }), [
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
        lastSelectedChoiceId,
    ]);

    return (
        <GameContext.Provider value={contextValue}>
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
