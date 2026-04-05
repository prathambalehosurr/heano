"use client";

import { ColorResult, hsbToHex, hsbToString, formatScore } from "@/lib/game";

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
  const maxScore = results.length * 1000;
  const percentage = Math.round((totalScore / maxScore) * 100);

  return (
    <div className="flex flex-col items-center min-h-screen bg-neutral-950 text-white px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Results</h2>
          <div className="text-5xl font-bold mb-1">{formattedScore}/50</div>
          <p className="text-neutral-400 text-sm">{percentage}% accuracy</p>
        </div>

        <div className="space-y-4 mb-10">
          {results.map((result, i) => (
            <div
              key={i}
              className="flex items-center gap-4 bg-neutral-900 rounded-xl p-4"
            >
              <div className="flex gap-2">
                <div
                  className="w-14 h-14 rounded-lg border-2 border-neutral-700"
                  style={{ backgroundColor: hsbToHex(result.original) }}
                  title={`Original: ${hsbToString(result.original)}`}
                />
                <div
                  className="w-14 h-14 rounded-lg border-2 border-neutral-700"
                  style={{ backgroundColor: hsbToHex(result.guess) }}
                  title={`Your guess: ${hsbToString(result.guess)}`}
                />
              </div>
              <div className="flex-1">
                <div className="text-sm text-neutral-400">Color {i + 1}</div>
                <div className="text-lg font-semibold">{result.score}/1000</div>
              </div>
            </div>
          ))}
        </div>

        {mode === "daily" && (
          <div className="space-y-3 mb-8">
            <input
              type="text"
              placeholder="Enter your initials"
              maxLength={3}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-center text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600 uppercase tracking-widest"
            />
            <button className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors">
              Post Score & Challenge a Friend
            </button>
          </div>
        )}

        {(mode === "solo" || mode === "multiplayer") && (
          <div className="space-y-3 mb-8">
            <button className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors">
              Share Your Score
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
      </div>
    </div>
  );
}
