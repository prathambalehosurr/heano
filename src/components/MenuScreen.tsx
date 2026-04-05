"use client";

import { useState, useCallback } from "react";
import { HSB, GameMode, hsbToHex } from "@/lib/game";

interface MenuScreenProps {
  onStart: (mode: GameMode, name?: string, id?: string) => void;
  difficulty: "easy" | "hard";
  onDifficultyChange: (d: "easy" | "hard") => void;
}

export function MenuScreen({ onStart, difficulty, onDifficultyChange }: MenuScreenProps) {
  const [soloName, setSoloName] = useState("");
  const [multiName, setMultiName] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [createdId, setCreatedId] = useState("");
  const [view, setView] = useState<"solo" | "multi" | "created">("solo");

  const handleCreate = () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCreatedId(id);
    setView("created");
    navigator.clipboard?.writeText(`${window.location.origin}/game/${id}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white px-4">
      <div className="w-full max-w-md text-center">
        {view === "solo" && (
          <>
            <h1 className="text-5xl font-bold mb-4 tracking-tight">color</h1>
            <p className="text-neutral-400 mb-8 text-sm leading-relaxed">
              Humans can&apos;t reliably recall colors. This is a simple game to see how good (or bad) you are at it.
            </p>
            <p className="text-neutral-500 mb-6 text-sm">
              We&apos;ll show you five colors, then you&apos;ll try and recreate them.
            </p>

            <p className="text-neutral-400 mb-4 text-sm">Solo or multiplayer?</p>

            <div className="flex gap-3 justify-center mb-8">
              <button
                onClick={() => setView("solo")}
                className="px-5 py-2 bg-white text-black font-semibold rounded-lg text-sm"
              >
                Solo
              </button>
              <button
                onClick={() => setView("multi")}
                className="px-5 py-2 bg-neutral-800 text-white font-semibold rounded-lg text-sm hover:bg-neutral-700 transition-colors"
              >
                Multiplayer
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={() => onDifficultyChange("easy")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  difficulty === "easy"
                    ? "bg-white text-black"
                    : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                }`}
              >
                Easy
              </button>
              <button
                onClick={() => onDifficultyChange("hard")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  difficulty === "hard"
                    ? "bg-white text-black"
                    : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                }`}
              >
                Hard
              </button>
            </div>

            <input
              type="text"
              placeholder="Enter your name"
              value={soloName}
              onChange={(e) => setSoloName(e.target.value)}
              className="w-full max-w-xs px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-center text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600 mb-4"
            />

            <button
              onClick={() => onStart("solo", soloName || undefined)}
              className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors text-lg"
            >
              Play
            </button>
          </>
        )}

        {view === "multi" && (
          <>
            <h1 className="text-5xl font-bold mb-4 tracking-tight">multiplayer</h1>
            <p className="text-neutral-400 mb-8 text-sm leading-relaxed">
              We show the same 5 colors to everyone. You compete to see who guesses closer.
            </p>

            <input
              type="text"
              placeholder="Enter your name"
              value={multiName}
              onChange={(e) => setMultiName(e.target.value)}
              className="w-full max-w-xs px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-center text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600 mb-6"
            />

            <button
              onClick={handleCreate}
              className="w-full max-w-xs px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors mb-8"
            >
              Create and copy game link
            </button>

            <div className="border-t border-neutral-800 pt-6">
              <p className="text-neutral-500 text-sm mb-4">Challenge friends</p>
              <input
                type="text"
                placeholder="Enter game code"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                className="w-full max-w-xs px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-center text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600 mb-4 uppercase tracking-widest"
              />
              <button
                onClick={() => onStart("multiplayer", multiName || undefined, gameCode || undefined)}
                className="w-full max-w-xs px-6 py-3 bg-neutral-800 text-white font-semibold rounded-lg hover:bg-neutral-700 transition-colors"
              >
                Join Game
              </button>
            </div>
          </>
        )}

        {view === "created" && (
          <>
            <h1 className="text-5xl font-bold mb-4 tracking-tight">multiplayer</h1>
            <p className="text-neutral-400 mb-2 text-sm">
              Game created! Share this link with as many people as you want.
            </p>
            <p className="text-neutral-600 text-xs mb-6">Generating link...</p>

            <div className="flex items-center justify-center gap-2 mb-6">
              <code className="px-4 py-2 bg-neutral-900 rounded-lg text-sm text-neutral-300">
                {window.location.origin}/game/{createdId}
              </code>
            </div>

            <button
              onClick={() => onStart("multiplayer", multiName || undefined, createdId)}
              className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors text-lg mb-8"
            >
              Start Game
            </button>

            <div className="border-t border-neutral-800 pt-6">
              <input
                type="text"
                placeholder="Enter game code"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                className="w-full max-w-xs px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-center text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600 mb-4 uppercase tracking-widest"
              />
              <button
                onClick={() => onStart("multiplayer", multiName || undefined, gameCode || undefined)}
                className="w-full max-w-xs px-6 py-3 bg-neutral-800 text-white font-semibold rounded-lg hover:bg-neutral-700 transition-colors"
              >
                Join Game
              </button>
            </div>
          </>
        )}

        <footer className="mt-16 text-neutral-600 text-xs flex items-center justify-center gap-1">
          <a href="https://x.com/gt" className="hover:text-neutral-400">Color v1.4</a>
          <span className="mx-1">·</span>
          <a href="/privacy" className="hover:text-neutral-400">Privacy</a>
          <span className="mx-1">·</span>
          <a href="/scoring" className="hover:text-neutral-400">Scoring</a>
          <span className="mx-1">·</span>
          <a href="/sound" className="hover:text-neutral-400">Play Sound</a>
        </footer>
      </div>
    </div>
  );
}
