"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ColorResult, hsbToHex, formatScore } from "@/lib/game";
import { submitScore } from "@/lib/database";
import { shareScore } from "@/lib/share";
import { useAuth } from "@/lib/auth-context";

interface ResultsScreenProps {
  results: ColorResult[];
  totalScore: number;
  formattedScore: string;
  mode: "solo" | "multiplayer" | "daily";
  playerName: string;
  difficulty: "easy" | "hard";
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
  difficulty,
  gameId,
  onPlayAgain,
  onStartNew,
}: ResultsScreenProps) {
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmitScore = async () => {
    if (submitted) return;
    setSubmitted(true);
    if (!user) return;

    await submitScore({
      userId: user.id,
      score: totalScore,
      mode,
      difficulty,
      colorResults: results.map((r) => ({
        hue: r.guess.h,
        saturation: r.guess.s,
        brightness: r.guess.b,
        score: r.score,
        deltaE: r.deltaE,
      })),
    });
  };

  const handleShare = () => {
    shareScore(totalScore, mode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const finalPercentage = Math.round((totalScore / 50) * 100);

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container min-h-screen pt-32 pb-24 px-6 md:px-12 fade-in">
      {/* Top Navigation Shell */}
      <nav className="fixed top-0 left-0 w-full bg-[#131313]/90 backdrop-blur-md flex justify-between items-center px-8 py-6 z-50">
        <div className="text-xl font-black tracking-tighter text-[#e2e2e2]">COLOURED</div>
        <div className="flex items-center gap-6">
          <button onClick={() => router.push("/leaderboard")} className="material-symbols-outlined text-[#ffb3b0] hover:text-[#ff6b6b] transition-colors duration-300">leaderboard</button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto">
        {/* Hero Analytics Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Big Score Card */}
          <div className="lg:col-span-5 flex flex-col justify-center items-start space-y-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-semibold">Final Accuracy</span>
            <div className="relative">
              <h1 className="text-8xl md:text-9xl font-black tracking-tighter leading-none italic">
                {finalPercentage}<span className="text-primary text-4xl md:text-5xl not-italic font-normal align-top opacity-50 ml-2">/100</span>
              </h1>
            </div>
            <p className="text-on-surface-variant max-w-xs leading-relaxed text-sm">
              Your absolute score was {formattedScore} out of 50. 
              {finalPercentage >= 90 ? " Exceptional precision. You have an eye for color." : finalPercentage >= 70 ? " Good job. You have decent color memory." : " Keep practicing to improve your hue matching!"}
            </p>
            
            {/* Leaderboard Auth action / Save Score */}
            <div className="w-full mt-4 max-w-xs space-y-3">
              {!user && !submitted && (
                <div className="p-4 bg-surface-container-low border border-outline-variant/30 rounded-xl mb-4">
                  <p className="text-on-surface-variant text-xs mb-3">Sign in to save your scores to the global leaderboard.</p>
                  <button
                     onClick={() => router.push("/login")}
                     className="w-full py-2 bg-on-surface text-surface text-xs font-bold uppercase tracking-widest rounded-lg hover:brightness-110 transition-colors"
                  >
                     Sign In
                  </button>
                </div>
              )}
              {user && (
                <button
                  onClick={handleSubmitScore}
                  disabled={submitted}
                  className={`w-full py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all ${
                    submitted
                      ? "bg-surface-container-low text-on-surface-variant/50 cursor-default"
                      : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest border border-outline-variant/50"
                  }`}
                >
                  {submitted ? "Score Saved" : "Save to Leaderboard"}
                </button>
              )}
            </div>
          </div>

          {/* Performance Chart - Decorative UI representation of consistency */}
          <div className="lg:col-span-7 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between border border-outline-variant/10 shadow-2xl">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-lg font-bold tracking-tight">Consistency Trend</h3>
                <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Score Distribution</span>
              </div>
            </div>
            {/* Abstract visual bars representing scores of rounds */}
            <div className="w-full h-32 flex items-end gap-2">
               {results.map((r, i) => {
                  const heightPct = Math.max(10, Math.round(((r.score/10) / 10) * 100)); // relative to max 10 pts per round
                  return (
                    <div key={i} className="flex-1 rounded-t-sm transition-all duration-1000 ease-out" 
                         style={{ height: `${heightPct}%`, backgroundColor: i === results.length - 1 ? 'var(--color-primary)' : 'var(--color-surface-container-highest)', opacity: i === results.length - 1 ? 1 : 0.6 }} 
                    />
                  );
               })}
               <div className="flex-1 bg-surface-container-highest rounded-t-sm h-[60%] opacity-20 hidden md:block"></div>
               <div className="flex-1 bg-surface-container-highest rounded-t-sm h-[45%] opacity-20 hidden md:block"></div>
               <div className="flex-1 bg-surface-container-highest rounded-t-sm h-[70%] opacity-20 hidden md:block"></div>
            </div>
          </div>
        </section>

        {/* Round Breakdown Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
          {results.map((result, i) => {
             const points = (result.score / 10).toFixed(1);
             return (
              <div key={i} className="bg-surface-container-low p-6 rounded-xl flex flex-col gap-6 border border-outline-variant/10 hover:border-outline-variant/30 transition-colors">
                <span className="text-[10px] text-on-surface-variant font-bold tracking-widest uppercase">Round 0{i + 1}</span>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2 relative">
                    <div className="w-12 h-12 rounded-full absolute top-0 left-0 border-2 border-surface shadow-md z-10 hover:z-30 hover:scale-125 transition-transform origin-left" title="Target" style={{ backgroundColor: hsbToHex(result.original) }}></div>
                    <div className="w-12 h-12 rounded-full absolute top-4 left-4 border-2 border-surface shadow-lg z-20 hover:z-30 hover:scale-125 transition-transform origin-left" title="Your Guess" style={{ backgroundColor: hsbToHex(result.guess) }}></div>
                    <div className="w-12 h-12 opacity-0 mb-4"></div> {/* Spacer */}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black">{points}</div>
                    <div className="text-[10px] text-primary">Pts</div>
                  </div>
                </div>
              </div>
             )
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 border-t border-outline-variant/10">
          <button onClick={onPlayAgain} className="w-full sm:w-auto px-12 py-4 bg-primary-container text-on-primary-container text-xs font-bold uppercase tracking-widest rounded-xl hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-black/30">
            Play Again
          </button>
          {onStartNew && (
            <button onClick={onStartNew} className="w-full sm:w-auto px-12 py-4 border border-outline-variant/30 bg-surface-container-highest/20 text-on-surface text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-surface-container-highest/40 transition-all active:scale-95">
              New Game
            </button>
          )}
          <button onClick={handleShare} className="w-full sm:w-auto px-12 py-4 border border-outline-variant/20 bg-surface-container-low text-on-surface text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-surface-container transition-all active:scale-95 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">share</span>
            {copied ? "Copied!" : "Share Results"}
          </button>
        </div>
      </main>

    </div>
  );
}
