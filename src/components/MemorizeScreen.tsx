"use client";

import { useState, useEffect } from "react";
import { HSB, hsbToHex } from "@/lib/game";

interface MemorizeScreenProps {
  colors: HSB[];
  timeLeft: number;
  formatTime: (s: number) => string;
  mode: "solo" | "multiplayer" | "daily";
}

export function MemorizeScreen({ colors, timeLeft, formatTime, mode }: MemorizeScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [colors]);

  const currentColor = colors[currentIndex];
  if (!currentColor) return null;

  const hex = hsbToHex(currentColor);

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-hidden fade-in">
      {/* Background takes up the entire screen */}
      <div
        className="absolute inset-0 transition-colors duration-1000 ease-in-out"
        style={{ backgroundColor: hex }}
      />
      
      {/* Dark gradient overlay to make text readable */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/50 pointer-events-none" />

      {/* Top Nav (Minimal for memory screen) */}
      <nav className="relative z-10 w-full flex justify-between items-center px-8 py-6">
        <div className="text-xl font-black tracking-tighter text-white drop-shadow-md">DIALED</div>
        <div className="text-[12px] uppercase tracking-[0.3em] font-black text-white/90 drop-shadow-md">
          {formatTime(timeLeft)}
        </div>
      </nav>

      {/* Progress indicators centered top */}
      <div className="relative z-10 flex justify-center gap-3 pt-6">
        {colors.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 shadow-md ${
              i === currentIndex ? "bg-white scale-125 shadow-[0_0_15px_rgba(255,255,255,0.8)]" : "bg-white/30"
            }`}
          />
        ))}
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <div className="text-[12rem] font-black tracking-tighter text-white drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] leading-none">
          {timeLeft}
        </div>
        <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/80 mt-4 drop-shadow-md">
          Seconds remaining
        </div>
      </div>

      <div className="relative z-10 flex justify-center pb-12">
        <button
          onClick={() => {
            if (currentIndex + 1 < colors.length) {
              setCurrentIndex(currentIndex + 1);
            }
          }}
          className="px-10 py-4 bg-black/30 backdrop-blur-md border border-white/20 text-white text-[10px] uppercase tracking-widest font-bold rounded-full hover:bg-black/50 hover:border-white/40 transition-all duration-300"
        >
          {currentIndex + 1 < colors.length ? "Skip to Next Color" : "I'm Ready"}
        </button>
      </div>
    </div>
  );
}
