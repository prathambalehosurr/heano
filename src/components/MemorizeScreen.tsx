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
    <div className="relative min-h-screen flex flex-col">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: hex }}
      />

      <div className="relative z-10 flex justify-center gap-2 pt-6">
        {colors.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === currentIndex ? "bg-white" : "bg-black/30"
            }`}
          />
        ))}
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <div className="text-8xl font-extrabold text-black/80">
          {timeLeft}
        </div>
        <div className="text-sm font-medium text-black/50 mt-2">
          Seconds to remember
        </div>
      </div>

      <div className="relative z-10 flex justify-center pb-8">
        <button
          onClick={() => {
            if (currentIndex + 1 < colors.length) {
              setCurrentIndex(currentIndex + 1);
            }
          }}
          className="px-6 py-2 bg-black/20 text-black/60 text-sm font-medium rounded-lg hover:bg-black/30 transition-colors"
        >
          {currentIndex + 1 < colors.length ? "Skip" : "Got it"}
        </button>
      </div>

      <div className="relative z-10 text-center pb-4">
        <span className="text-black/30 text-xs">Dialed.gg</span>
      </div>
    </div>
  );
}
