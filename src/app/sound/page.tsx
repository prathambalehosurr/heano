"use client";

import { useState } from "react";

export default function SoundPage() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="flex flex-col items-center min-h-screen bg-neutral-950 text-white px-4 py-12">
      <div className="w-full max-w-md">
        <a href="/" className="text-neutral-400 hover:text-white text-sm mb-8 inline-block">
          ← DIALED
        </a>

        <h1 className="text-3xl font-bold mb-2">Play Sound</h1>
        <p className="text-neutral-400 mb-8 text-sm">
          Enable sound effects for the color game.
        </p>

        <div className="flex items-center justify-between bg-neutral-900 rounded-xl p-5 mb-8">
          <span className="text-white font-medium">Sound Effects</span>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              enabled ? "bg-white" : "bg-neutral-700"
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full transition-transform ${
                enabled
                  ? "translate-x-6 bg-black"
                  : "translate-x-0.5 bg-neutral-400"
              }`}
            />
          </button>
        </div>

        <a
          href="/"
          className="inline-block px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors"
        >
          Back to Game
        </a>
      </div>
    </div>
  );
}
