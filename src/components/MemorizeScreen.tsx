"use client";

import { HSB, hsbToHex } from "@/lib/game";

interface MemorizeScreenProps {
  colors: HSB[];
  timeLeft: number;
  formatTime: (s: number) => string;
  mode: "solo" | "multiplayer" | "daily";
}

export function MemorizeScreen({ colors, timeLeft, formatTime, mode }: MemorizeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white px-4">
      <div className="w-full max-w-lg text-center">
        {mode !== "solo" && (
          <div className="mb-4 text-neutral-400 text-sm">
            {formatTime(timeLeft)}
          </div>
        )}

        <h2 className="text-2xl font-bold mb-8">Memorize these colors</h2>

        <div className="flex gap-3 justify-center mb-12">
          {colors.map((color, i) => (
            <div
              key={i}
              className="w-20 h-20 rounded-lg shadow-lg transition-transform hover:scale-105"
              style={{ backgroundColor: hsbToHex(color) }}
            />
          ))}
        </div>

        <p className="text-neutral-500 text-sm animate-pulse">
          Study carefully...
        </p>
      </div>
    </div>
  );
}
