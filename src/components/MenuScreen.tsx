"use client";

import { useState } from "react";
import { HSB, GameMode } from "@/lib/game";
import { useAuth } from "@/lib/auth-context";

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
  const [view, setView] = useState<"solo" | "multi" | "created" | "home">("home");
  const { user, profileName } = useAuth();

  const handleCreate = () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCreatedId(id);
    setView("created");
    navigator.clipboard?.writeText(`${window.location.origin}/game/${id}`);
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col overflow-hidden selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full flex justify-between items-center px-8 py-6 z-50 bg-[#131313]/80 backdrop-blur-md">
        <div className="text-xl font-black tracking-tighter text-[#e2e2e2]">DIALED</div>
        <div className="flex items-center gap-6">
          <a href="/leaderboard" className="text-[#e0bfbd] hover:text-[#ffb3b0] transition-colors duration-300 flex items-center gap-2 group">
            <span className="material-symbols-outlined text-[20px]">leaderboard</span>
            <span className="text-[10px] uppercase tracking-widest font-medium opacity-0 group-hover:opacity-100 transition-opacity">Leaderboard</span>
          </a>
          {user ? (
            <a href="/profile" className="flex items-center gap-3 group">
              <span className="text-[#e0bfbd] text-sm group-hover:text-[#ffb3b0] transition-colors">{profileName || user.email?.split("@")[0]}</span>
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#584140] bg-[#1b1b1b] flex items-center justify-center group-hover:border-[#ffb3b0] transition-colors">
                 <span className="material-symbols-outlined text-[16px] text-[#e0bfbd]">person</span>
              </div>
            </a>
          ) : (
            <a href="/login" className="text-[#e0bfbd] hover:text-[#ffb3b0] transition-colors duration-300">
              <span className="material-symbols-outlined">login</span>
            </a>
          )}
        </div>
      </nav>

      {/* Main Canvas */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 relative z-10 pt-20">
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-20">
          <div className="w-[500px] h-[500px] bg-primary rounded-full blur-[120px] ambient-glow"></div>
        </div>

        <div className="max-w-2xl w-full text-center space-y-12">
          {view === "home" && (
            <>
              {/* Header Section */}
              <div className="space-y-4">
                <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-on-surface">
                  dialed
                </h1>
                <p className="text-on-surface-variant text-lg md:text-xl font-medium leading-relaxed max-w-lg mx-auto">
                  Humans can't reliably recall colors. This is a simple game to see how good (or bad) you are at it.
                </p>
              </div>

              {/* Mode Selection Section */}
              <div className="space-y-10">
                <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-on-surface-variant opacity-60">
                  Solo or multiplayer?
                </h2>

                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                  <div className="flex flex-col items-center gap-4 group">
                    <button onClick={() => setView("solo")} className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-on-surface text-surface flex items-center justify-center hover:scale-95 transition-transform duration-300">
                      <span className="material-symbols-outlined text-4xl">person</span>
                    </button>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface opacity-0 group-hover:opacity-100 transition-opacity">Solo</span>
                  </div>

                  {/* Daily Challenge (Future) - keeping it visual only or defaulting to solo */}
                  <div className="flex flex-col items-center gap-4 group">
                    <div className="rainbow-border hover:scale-95 transition-transform duration-300 cursor-pointer" onClick={() => { onStart("solo", profileName || user?.email?.split("@")[0] || undefined); }}>
                      <button className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-surface text-on-surface flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl">calendar_today</span>
                      </button>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-primary">Daily</span>
                  </div>

                  <div className="flex flex-col items-center gap-4 group">
                    <button onClick={() => setView("multi")} className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-on-surface text-surface flex items-center justify-center hover:scale-95 transition-transform duration-300">
                      <span className="material-symbols-outlined text-4xl">group</span>
                    </button>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface opacity-0 group-hover:opacity-100 transition-opacity">Party</span>
                  </div>
                </div>
              </div>

              {/* Toggle Control */}
              <div className="flex items-center justify-center gap-4 pt-8">
                <span className={`text-[10px] uppercase tracking-widest font-medium ${difficulty === "hard" ? "text-primary transition-colors" : "text-on-surface-variant transition-colors"}`}>Hard</span>
                <button
                  onClick={() => onDifficultyChange(difficulty === "easy" ? "hard" : "easy")}
                  className="w-12 h-6 rounded-full bg-surface-container-highest p-1 flex items-center transition-colors duration-300 group relative"
                >
                  <div className={`w-4 h-4 rounded-full transition-all duration-300 absolute ${difficulty === "easy" ? "bg-primary right-1" : "bg-on-surface-variant left-1"}`}></div>
                </button>
                <span className={`text-[10px] uppercase tracking-widest font-medium ${difficulty === "easy" ? "text-primary transition-colors" : "text-on-surface-variant transition-colors"}`}>Easy</span>
              </div>
            </>
          )}

          {view === "solo" && (
            <div className="space-y-8 max-w-md mx-auto fade-in">
              <h1 className="text-5xl font-black tracking-tighter text-on-surface">solo</h1>
              <p className="text-on-surface-variant">Enter your name to begin.</p>
              
              <input
                type="text"
                placeholder="Enter your name"
                value={soloName}
                onChange={(e) => setSoloName(e.target.value)}
                className="w-full px-6 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-center text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors text-lg shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
              />

              <div className="flex gap-4">
                <button
                  onClick={() => setView("home")}
                  className="px-6 py-4 border border-outline-variant/50 text-on-surface font-medium rounded-xl hover:bg-surface-container transition-colors w-1/3"
                >
                  Back
                </button>
                <button
                  onClick={() => onStart("solo", soloName || undefined)}
                  className="flex-1 px-8 py-4 bg-primary-container text-on-primary-container font-bold rounded-xl hover:bg-primary transition-colors text-lg"
                >
                  Start Game
                </button>
              </div>
            </div>
          )}

          {view === "multi" && (
            <div className="space-y-8 max-w-md mx-auto fade-in">
              <h1 className="text-5xl font-black tracking-tighter text-on-surface">multiplayer</h1>
              <p className="text-on-surface-variant text-sm">
                We show the same 5 colors to everyone. Compete to see who guesses closer.
              </p>

              <input
                type="text"
                placeholder="Enter your name"
                value={multiName}
                onChange={(e) => setMultiName(e.target.value)}
                className="w-full px-6 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-center text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors text-lg mb-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
              />

              <button
                onClick={handleCreate}
                className="w-full px-8 py-4 bg-primary-container text-on-primary-container font-bold rounded-xl hover:bg-primary transition-colors text-lg mb-8 shadow-lg shadow-black/50"
              >
                Create and Copy Link
              </button>

              <div className="border-t border-outline-variant/20 pt-8 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-surface px-4 text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
                  OR JOIN
                </div>
                <input
                  type="text"
                  placeholder="Enter game code"
                  value={gameCode}
                  onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                  className="w-full px-6 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-center text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors text-lg mb-4 uppercase tracking-[0.2em] shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
                />
                <div className="flex gap-4">
                  <button
                    onClick={() => setView("home")}
                    className="px-6 py-4 border border-outline-variant/50 text-on-surface font-medium rounded-xl hover:bg-surface-container transition-colors w-1/3"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => onStart("multiplayer", multiName || undefined, gameCode || undefined)}
                    className="flex-1 px-8 py-4 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-container-highest transition-colors text-lg"
                  >
                    Join
                  </button>
                </div>
              </div>
            </div>
          )}

          {view === "created" && (
            <div className="space-y-8 max-w-md mx-auto fade-in">
              <h1 className="text-5xl font-black tracking-tighter text-on-surface">multiplayer</h1>
              <p className="text-on-surface-variant">
                Game created! Share this link with as many people as you want.
              </p>

              <div className="flex items-center justify-center p-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl">
                <code className="text-sm text-primary tracking-wider">
                  {window.location.origin}/game/{createdId}
                </code>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setView("home")}
                  className="px-6 py-4 border border-outline-variant/50 text-on-surface font-medium rounded-xl hover:bg-surface-container transition-colors w-1/3"
                >
                  Back
                </button>
                <button
                  onClick={() => onStart("multiplayer", multiName || undefined, createdId)}
                  className="flex-1 px-8 py-4 bg-primary-container text-on-primary-container font-bold rounded-xl hover:bg-primary transition-colors text-lg shadow-lg shadow-black/50"
                >
                  Start Game
                </button>
              </div>

              <div className="border-t border-outline-variant/20 pt-8 mt-8 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-surface px-4 text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
                  OR JOIN DIFFERENT
                </div>
                <input
                  type="text"
                  placeholder="Enter game code"
                  value={gameCode}
                  onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                  className="w-full px-6 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-center text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors text-lg mb-4 uppercase tracking-[0.2em] shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
                />
                <button
                  onClick={() => onStart("multiplayer", multiName || undefined, gameCode || undefined)}
                  className="w-full px-8 py-4 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-container-highest transition-colors text-lg"
                >
                  Join Different Game
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

    </div>
  );
}
