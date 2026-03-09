"use client";

import { useEffect, useRef } from "react";

export function useSoundManager(bgmSrc?: string, sfxSrc?: string) {
    const bgmRef = useRef<HTMLAudioElement | null>(null);
    const sfxRef = useRef<HTMLAudioElement | null>(null);

    // Handle BGM
    useEffect(() => {
        if (!bgmSrc) return;

        if (!bgmRef.current) {
            bgmRef.current = new Audio(bgmSrc);
            bgmRef.current.loop = true;
            bgmRef.current.volume = 0.5;
        } else if (bgmRef.current.src !== bgmSrc) {
            bgmRef.current.src = bgmSrc;
        }

        const playPromise = bgmRef.current.play();
        if (playPromise !== undefined) {
            playPromise.catch((error) => {
                console.log("Audio play failed (user interaction required):", error);
            });
        }

        return () => {
            bgmRef.current?.pause();
        };
    }, [bgmSrc]);

    // Handle SFX
    useEffect(() => {
        if (!sfxSrc) return;

        // Create new audio instance for SFX to allow overlapping sounds
        const sfx = new Audio(sfxSrc);
        sfx.volume = 0.8;
        sfx.play().catch((e) => console.log("SFX play failed:", e));

    }, [sfxSrc]);

    return null;
}
