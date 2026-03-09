import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        pop: {
          yellow: "#facc15", // yellow-400
          red: "#ef4444",    // red-500
          blue: "#3b82f6",   // blue-500
        }
      },
      boxShadow: {
        'pop': '8px 8px 0px 0px rgba(0,0,0,1)',
      },
      fontFamily: {
        bangers: ["var(--font-bangers)"],
        comic: ["var(--font-comic-neue)"],
      },
      backgroundImage: {
        'halftone': 'radial-gradient(circle, #000 1px, transparent 1px)',
      }
    },
  },
  plugins: [],
};
export default config;
