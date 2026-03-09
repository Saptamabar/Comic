import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CharacterAvatarProps {
    src?: string;
    name: string;
    className?: string;
    align?: "left" | "right";
}

export function CharacterAvatar({
    src,
    name,
    className,
    align = "left",
}: CharacterAvatarProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center gap-2",
                align === "left" ? "self-start" : "self-end",
                className
            )}
        >
            <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-black bg-gray-200 overflow-hidden shadow-pop">
                {src ? (
                    <Image src={src} alt={name} fill className="object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-pop-red text-white font-bangers text-4xl">
                        {name[0]}
                    </div>
                )}
            </div>
            <span className="bg-black text-white px-3 py-1 font-bangers text-lg border-2 border-white -rotate-2 shadow-lg">
                {name}
            </span>
        </div>
    );
}
