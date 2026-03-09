"use client";

import React from "react";
import { ComicButton } from "@/components/ui/ComicButton";
import { useGame } from "@/context/GameContext";
import { motion } from "framer-motion";
import { LandingPage } from "@/components/landing/LandingPage";

export function StartScreen() {
    const { startGame } = useGame();

    return <LandingPage onStartGame={startGame} />;
}
