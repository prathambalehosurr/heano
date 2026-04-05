"use client";

import { useState } from "react";
import { ColorResult, hsbToHex, hsbToString, formatScore } from "@/lib/game";
import { saveScore } from "@/lib/scores";
import { shareScore } from "@/lib/share";

interface ResultsScreenProps {
  results: ColorResult[];
  totalScore: number;
  formattedScore: string;
  mode: "solo" | "multiplayer" | "daily";
  playerName: string;
  gameId?: string;
  onPlayAgain: () => void;
  onStartNew: () => void;
}

export function ResultsScreen({
  results,
  totalScore,
  formattedScore,
  mode,
  playerName,
  gameId,
  onPlayAgain,
  onStartNew,
}: ResultsScreenProps) {
  const [initials, setInitials] = useState("");
  const [copied, setCopied] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const maxScore = results.length * 1000;
  const percentage = Math.round((totalScore / maxScore) * 100);

  const handleSaveScore = () => {
    saveScore({
      name: initials || playerName || "Anonymous",
      score: totalScore,
      mode,
      date: new Date().toISOString(),
    });
  };

  const handleShare = () => {
    shareScore(totalScore, mode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const current = results[currentIndex];
  if (!current) return null;

  const guessHex = hsbToHex(current.guess);
  const originalHex = hsbToHex(current.original);

  return (
    <div className="flex flex-col items-center min-h-screen bg-neutral-950 text-white px-4 py-8">
      <div className="w-full max-w-md">
        {/* Score header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-1">results</h2>
          <div className="text-5xl font-bold">{formattedScore}/50</div>
        </div>

        {/* Two-panel card */}
        <div className="relative w-full rounded-2xl overflow-hidden shadow-xl mb-6" style={{ height: 360 }}>
          {/* Top panel - Your selection */}
          <div className="relative h-1/2" style={{ backgroundColor: guessHex }}>
            <div className="absolute top-3 left-4 text-sm text-black/70">
              {currentIndex + 1} / {results.length}
            </div>
            <div className="absolute top-0 right-6 text-right">
              <div className="text-6xl font-extrabold text-black/90">
                {(current.score / 10).toFixed(2)}
              </div>
            </div>
            <div className="absolute left-6 bottom-6 text-sm text-black/70">
              <div className="font-medium">Your selection</div>
              <div className="font-semibold text-black/90">{hsbToString(current.guess)}</div>
            </div>
          </div>

          {/* Bottom panel - Original */}
          <div className="relative h-1/2" style={{ backgroundColor: originalHex }}>
            <div className="absolute left-6 bottom-6 text-sm text-black/70">
              <div className="font-medium">Original</div>
              <div className="font-semibold text-black/90">{hsbToString(current.original)}</div>
            </div>
          </div>

          {/* Next button */}
          {currentIndex + 1 < results.length && (
            <button
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="absolute right-4 bottom-4 w-12 h-12 rounded-full bg-white text-black font-bold text-xl shadow-lg hover:bg-neutral-200 transition-colors flex items-center justify-center"
            >
              →
            </button>
          )}
        </div>

        {/* Progress dots */}
        <div className="flex gap-2 justify-center mb-8">
          {results.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentIndex ? "bg-white" : "bg-neutral-700"
              }`}
            />
          ))}
        </div>

        {/* Action buttons */}
        {currentIndex + 1 >= results.length && (
          <>
            {mode === "daily" && (
              <div className="space-y-3 mb-6">
                <input
                  type="text"
                  placeholder="Enter your initials"
                  maxLength={3}
                  value={initials}
                  onChange={(e) => setInitials(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-center text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600 uppercase tracking-widest"
                />
                <button
                  onClick={handleSaveScore}
                  className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors"
                >
                  Post score & challenge a friend
                </button>
              </div>
            )}

            {(mode === "solo" || mode === "multiplayer") && (
              <div className="space-y-3 mb-6">
                <button
                  onClick={handleShare}
                  className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors"
                >
                  {copied ? "Copied!" : "Share your score"}
                </button>
                <button className="w-full py-3 bg-neutral-800 text-white font-semibold rounded-lg hover:bg-neutral-700 transition-colors">
                  Daily Leaderboard
                </button>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onPlayAgain}
                className="flex-1 py-3 bg-neutral-800 text-white font-semibold rounded-lg hover:bg-neutral-700 transition-colors"
              >
                Play Again
              </button>
              <button
                onClick={onStartNew}
                className="flex-1 py-3 bg-neutral-800 text-white font-semibold rounded-lg hover:bg-neutral-700 transition-colors"
              >
                New Game
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
