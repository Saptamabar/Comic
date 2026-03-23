"use client";

import React from "react";

export function Footer() {
  return (
    <footer className="relative bg-[#3e2723] text-[#fdf6e3] py-6 md:py-8 border-t-4 border-[#b71c1c]">
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none select-none" 
        style={{ backgroundImage: 'radial-gradient(#fdf6e3 1px, transparent 0)', backgroundSize: '15px 15px' }} 
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <h3 className="font-bangers text-xl md:text-2xl tracking-wider text-[#ffca28] drop-shadow-[1px_1px_0_#b71c1c] uppercase">
              Histoplay
            </h3>
            <div className="hidden md:block w-[2px] h-6 bg-[#fdf6e3] opacity-20" />
            <p className="font-comic text-[10px] md:text-xs font-bold opacity-70 italic max-w-[200px] leading-tight text-center md:text-left">
              Edukasi sejarah melalui pengalaman interaktif.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-1">
            <p className="font-comic text-xs md:text-sm font-bold tracking-wide">
              &copy; {new Date().getFullYear()} Histoplay.
            </p>
            <p className="font-comic text-[10px] opacity-50 uppercase tracking-widest">
              Hak Cipta Dilindungi
            </p>
          </div>

        </div>
      </div>

      <div className="absolute bottom-0 right-0 w-24 h-1 bg-[#ffca28] opacity-30" />
    </footer>
  );
}