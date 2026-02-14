import React from "react";
import { cn } from "@/lib/utils";

interface SpeechBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "oval" | "jagged" | "box";
    tailPosition?: "bottom-left" | "bottom-right" | "top-left";
}

export function SpeechBubble({
    className,
    variant = "oval",
    tailPosition = "bottom-left",
    children,
    ...props
}: SpeechBubbleProps) {
    const variants = {
        oval: "rounded-[50px] p-6",
        jagged: "clip-path-jagged p-8 bg-yellow-100", // Needs custom clip-path or SVG background
        box: "rounded-lg p-4",
    };

    const tails = {
        "bottom-left": "after:bottom-[-20px] after:left-10 after:border-t-[20px] after:border-t-black after:border-x-[15px] after:border-x-transparent",
        "bottom-right": "after:bottom-[-20px] after:right-10 after:border-t-[20px] after:border-t-black after:border-x-[15px] after:border-x-transparent",
        "top-left": "before:top-[-20px] before:left-10 before:border-b-[20px] before:border-b-black before:border-x-[15px] before:border-x-transparent",
    };

    return (
        <div className="relative group">
            {/* Shadow Layer for Oval */}
            {variant === "oval" && (
                <div className={cn(
                    "absolute inset-0 bg-black rounded-[50px] translate-x-2 translate-y-2",
                    "z-0"
                )} />
            )}

            {/* Main Bubble */}
            <div
                className={cn(
                    "relative z-10 border-4 border-black bg-white font-comic text-lg text-black",
                    variants[variant],
                    className
                )}
                {...props}
            >
                {children}

                {/* CSS Triangle Tail (Simplified) */}
                {/* We need a better tail implementation, typically SVG or pseudo-elements. 
            Using pseudo-elements for simple triangle. 
            Note: Border radius makes it tricky, but let's try a simple block tail. 
        */}
                <div className={cn(
                    "absolute w-0 h-0 border-solid",
                    tailPosition === "bottom-left" && "bottom-[-24px] left-10 border-t-[24px] border-t-black border-x-[12px] border-x-transparent",
                    tailPosition === "bottom-right" && "bottom-[-24px] right-10 border-t-[24px] border-t-black border-x-[12px] border-x-transparent"
                )}>
                    {/* Inner White Triangle to mask border (Optional for outlined tail, but solid black is cleaner for pop art) */}
                </div>
            </div>
        </div>
    );
}
