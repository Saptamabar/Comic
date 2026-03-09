"use client";

import { useCallback, useEffect, useRef } from "react";

// Define sound paths - in a real app these might be passed in or configured globally
const CLICK_SOUND = "/assets/audio/sfx/click.mp3";
const HOVER_SOUND = "/assets/audio/sfx/hover.mp3";

export function useUiSound() {
    // Use refs to hold Audio objects to avoid re-creating them on every render
    const clickAudio = useRef<HTMLAudioElement | null>(null);
    const hoverAudio = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize audio objects
        clickAudio.current = new Audio(CLICK_SOUND);
        clickAudio.current.volume = 0.5;

        hoverAudio.current = new Audio(HOVER_SOUND);
        hoverAudio.current.volume = 0.2; // Hover should be subtle
    }, []);

    const playClick = useCallback(() => {
        if (clickAudio.current) {
            clickAudio.current.currentTime = 0; // Reset to start
            clickAudio.current.play().catch(() => { /* Ignore autoplay errors */ });
        }
    }, []);

    const playHover = useCallback(() => {
        if (hoverAudio.current) {
            hoverAudio.current.currentTime = 0;
            hoverAudio.current.play().catch(() => { /* Ignore autoplay errors */ });
        }
    }, []);

    return { playClick, playHover };
}
