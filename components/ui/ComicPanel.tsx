import React from "react";
import { cn } from "@/lib/utils";

interface ComicPanelProps extends React.HTMLAttributes<HTMLDivElement> {
    withHalftone?: boolean;
}

export function ComicPanel({
    className,
    children,
    withHalftone = false,
    ...props
}: ComicPanelProps) {
    return (
        <div
            className={cn(
                "relative border-4 border-black bg-white p-4 shadow-pop",
                withHalftone && "bg-halftone bg-[length:20px_20px]",
                className
            )}
            {...props}
        >
            {/* Optional overlay for better text readability if halftone is strong */}
            {withHalftone && (
                <div className="absolute inset-0 bg-white/50 pointer-events-none" />
            )}
            <div className="relative z-10">{children}</div>
        </div>
    );
}
