"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const characters = [
    {
        name: "SOEKARNO",
        role: "The Oraltor",
        image: "/assets/characters/soekarno.png", // Assuming these paths exist or will exist
        bg: "bg-pop-red"
    },
    {
        name: "HATTA",
        role: "The Strategist",
        image: "/assets/characters/hatta.png",
        bg: "bg-pop-blue"
    },
    {
        name: "WIKANA",
        role: "The Catalyst",
        image: "/assets/characters/wikana.png",
        bg: "bg-pop-yellow"
    }
];

export function CharacterShowcase() {
    return (
        <section className="py-24 bg-black text-white relative overflow-hidden">
            {/* Background noise texture effect could go here */}

            <div className="container mx-auto px-4 z-10 relative">
                <motion.h2
                    initial={{ x: -100, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    className="text-6xl font-bangers text-center mb-20 text-pop-yellow drop-shadow-[4px_4px_0_#fff]"
                >
                    AGENTS OF CHANGE
                </motion.h2>

                <div className="flex flex-wrap justify-center gap-12">
                    {characters.map((char, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -10 }}
                            className="relative group w-64 text-center"
                        >
                            {/* Card Background */}
                            <div className={`absolute inset-0 ${char.bg} transform rotate-3 rounded-lg border-4 border-white transition-transform group-hover:rotate-6`} />

                            {/* Content */}
                            <div className="relative bg-white border-4 border-black p-4 transform -rotate-2 group-hover:rotate-0 transition-transform">
                                <div className="w-full h-64 bg-gray-200 mb-4 border-2 border-black relative overflow-hidden flex items-center justify-center">
                                    {/* Placeholder for character image - using a colored block or fallback if actual image fails */}
                                    <div className={`w-full h-full ${char.bg} opacity-50 absolute`} />
                                    <span className="font-bangers text-4xl opacity-20 z-0">IMG</span>
                                    {/* 
                                     <Image 
                                        src={char.image} 
                                        alt={char.name} 
                                        fill 
                                        className="object-cover z-10" 
                                    /> 
                                    */}
                                </div>
                                <h3 className="font-bangers text-3xl text-black">{char.name}</h3>
                                <p className="font-comic font-bold text-gray-600 uppercase">{char.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
