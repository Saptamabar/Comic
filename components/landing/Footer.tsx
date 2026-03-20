"use client";

import React from "react";

export function Footer() {
    return (
        <footer className="bg-black text-white py-8 text-center border-t-4 border-pop-red">
            <p className="font-comic text-sm">
                &copy; {new Date().getFullYear()} Histoplay. Hak Cipta Dilindungi.
            </p>
            <p className="font-comic text-xs mt-2 text-gray-500">
                Sebuah proyek untuk mengedukasi dan menginspirasi melalui sejarah interaktif.
            </p>
        </footer>
    );
}
