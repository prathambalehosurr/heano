"use client";

import { useState } from "react";
import { HSB, GameMode, hsbToHex, hsbToString } from "@/lib/game";

interface MenuScreenProps {
  onStart: (mode: GameMode, name?: string, id?: string) => void;
  difficulty: "easy" | "hard";
  onDifficultyChange: (d: "easy" | "hard") => void;
}

export function MenuScreen({ onStart, difficulty, onDifficultyChange }: MenuScreenProps) {
  const [name, setName] = useState("");
  const [multiplayerName, setMultiplayerName] = useState("");
  const [gameId, setGameId] = useState("");
  const [createdGameId, setCreatedGameId] = useState("");
  const [showMultiplayer, setShowMultiplayer] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const handleCreateGame = () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCreatedGameId(id);
    setShowCreate(true);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/game/${createdGameId}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-5xl font-bold mb-2 tracking-tight">color</h1>
        <p className="text-neutral-400 mb-12 text-sm">
          Humans can&apos;t reliably recall colors. This is a simple game to see how good (or bad) you are at it.
        </p>

        <p className="text-neutral-500 mb-6 text-sm">
          We&apos;ll show you five colors, then you&apos;ll try and recreate them.
        </p>

        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={() => onStart("daily")}
            className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors"
          >
            Daily
          </button>
          <button
            onClick={() => setShowMultiplayer(!showMultiplayer)}
            className="px-6 py-3 bg-neutral-800 text-white font-semibold rounded-lg hover:bg-neutral-700 transition-colors"
          >
            Multiplayer
          </button>
        </div>

        {!showMultiplayer && (
          <div className="space-y-4">
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

            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full max-w-xs px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-center text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600"
              />
            </div>

            <button
              onClick={() => onStart("solo", name || undefined)}
              className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors text-lg"
            >
              Play Solo
            </button>
          </div>
        )}

        {showMultiplayer && !showCreate && (
          <div className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Enter your name"
                value={multiplayerName}
                onChange={(e) => setMultiplayerName(e.target.value)}
                className="w-full max-w-xs px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-center text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600 mb-4"
              />
              <button
                onClick={() => {
                  const id = Math.random().toString(36).substring(2, 8).toUpperCase();
                  setCreatedGameId(id);
                  setShowCreate(true);
                }}
                className="w-full max-w-xs px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors"
              >
                Create Game & Copy Link
              </button>
            </div>

            <div className="border-t border-neutral-800 pt-6">
              <input
                type="text"
                placeholder="Enter game code"
                value={gameId}
                onChange={(e) => setGameId(e.target.value.toUpperCase())}
                className="w-full max-w-xs px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-center text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600 mb-4 uppercase tracking-widest"
              />
              <button
                onClick={() => onStart("multiplayer", multiplayerName || undefined, gameId || undefined)}
                className="w-full max-w-xs px-6 py-3 bg-neutral-800 text-white font-semibold rounded-lg hover:bg-neutral-700 transition-colors"
              >
                Join Game
              </button>
            </div>
          </div>
        )}

        {showCreate && (
          <div className="space-y-4">
            <p className="text-neutral-400 text-sm">Game created! Share this link with friends.</p>
            <div className="flex items-center justify-center gap-2">
              <code className="px-4 py-2 bg-neutral-900 rounded-lg text-sm">
                {window.location.origin}/game/{createdGameId}
              </code>
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors"
              >
                Copy
              </button>
            </div>
            <button
              onClick={() => onStart("multiplayer", multiplayerName || undefined, createdGameId)}
              className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors"
            >
              Start Game
            </button>
          </div>
        )}

        <footer className="mt-16 text-neutral-600 text-xs">
          <a href="/scoring" className="hover:text-neutral-400 mx-2">Scoring</a>
          <span className="mx-1">·</span>
          <a href="/privacy" className="hover:text-neutral-400 mx-2">Privacy</a>
        </footer>
      </div>
    </div>
  );
}
