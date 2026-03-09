"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { useUiSound } from "@/hooks/useUiSound";

interface ComicButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "danger" | "neutral";
}

export function ComicButton({
    className,
    variant = "primary",
    children,
    ...props
}: ComicButtonProps) {
    const { playClick, playHover } = useUiSound();

    const variants = {
        primary: "bg-pop-blue text-white hover:bg-blue-600",
        danger: "bg-pop-red text-white hover:bg-red-600",
        neutral: "bg-white text-black hover:bg-gray-100",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95, x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)" }}
            onMouseEnter={playHover}
            onClick={(e) => {
                playClick();
                props.onClick?.(e);
            }}
            className={cn(
                "px-6 py-3 font-bangers text-xl uppercase tracking-wider",
                "border-4 border-black",
                "shadow-pop transition-all",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
}
