"use client";

import React from "react";
import { motion } from "framer-motion";

const features = [
    {
        title: "REWIRING HISTORY",
        description: "Your choices ripple through time. Can you navigate the chaos?",
        color: "bg-pop-red",
        rotate: "-rotate-2"
    },
    {
        title: "ICONIC HEROES",
        description: "Stand beside Soekarno, Hatta, and the youth in their finest hour.",
        color: "bg-pop-blue",
        rotate: "rotate-1"
    },
    {
        title: "CRITICAL MISSION",
        description: "Learn the strategy behind the Proclamation. It wasn't just luck.",
        color: "bg-pop-yellow",
        rotate: "-rotate-1"
    }
];

export function FeatureSection() {
    return (
        <section className="py-20 bg-white bg-halftone bg-[length:10px_10px]">
            <div className="container mx-auto px-4">
                <h2 className="text-6xl font-bangers text-center mb-16 drop-shadow-[4px_4px_0_#000]">
                    MISSION BRIEFING
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className={`p-6 border-4 border-black shadow-pop ${feature.color} ${feature.rotate} hover:scale-105 transition-transform`}
                        >
                            <div className="bg-white border-2 border-black p-4 h-full relative">
                                <h3 className="font-bangers text-3xl mb-4 text-center border-b-4 border-black pb-2">
                                    {feature.title}
                                </h3>
                                <p className="font-comic text-lg text-center font-bold">
                                    {feature.description}
                                </p>
                                <div className="absolute -top-3 -right-3 w-8 h-8 bg-black rounded-full" />
                                <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-black rounded-full" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
