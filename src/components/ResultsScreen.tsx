"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ColorResult, hsbToHex } from "@/lib/game";
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
  mode,
  difficulty,
  onPlayAgain,
  onStartNew,
}: ResultsScreenProps) {
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleAutoSubmit = async () => {
      if (user && !submitted) {
        setSubmitted(true);
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
      }
    };
    handleAutoSubmit();
  }, [user, submitted, totalScore, mode, difficulty, results]);

  const handleShare = () => {
    shareScore(totalScore, mode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const accuracy = Math.round((totalScore / 50) * 100);

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="w-full top-0 sticky bg-[#131313] z-50">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          <div className="text-2xl font-black tracking-tighter text-[#e2e2e2] uppercase">
            DIALED
          </div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-[#ffb3b0]" data-icon="leaderboard">
              leaderboard
            </span>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_#1b1b1b,_#131313)] pt-24 pb-12">
        <div className="w-full max-w-4xl space-y-8">
          {/* Hero Analytics Section */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Big Score Card */}
            <div className="lg:col-span-5 bg-surface-container-low rounded-xl p-10 flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-container to-transparent opacity-30"></div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold mb-4">
                TOTAL ACCURACY
              </span>
              <div className="relative">
                <h1 className="text-8xl md:text-9xl font-black tracking-tighter leading-none italic text-on-surface">
                  {accuracy}<span className="text-primary text-3xl not-italic align-top opacity-50">%</span>
                </h1>
              </div>
              <div className="mt-8 pt-8 border-t border-outline-variant/15 w-full">
                 <p className="text-on-surface-variant text-xs uppercase tracking-widest font-bold">
                   Performance Index: {accuracy >= 90 ? "ELITE" : accuracy >= 70 ? "STABLE" : "IMPROVING"}
                 </p>
              </div>
            </div>

            {/* Consistency Trend */}
            <div className="lg:col-span-7 bg-surface-container-low rounded-xl p-10 flex flex-col justify-between shadow-2xl border border-outline-variant/5">
              <div className="mb-8">
                <h3 className="text-xl font-black tracking-tight uppercase italic">Consistency Trend</h3>
                <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Session Delta Analysis</span>
              </div>
              
              <div className="w-full h-40 flex items-end gap-3 px-2">
                {results.map((r, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div 
                      className="w-full rounded-t-lg transition-all duration-700 ease-out min-h-[4px]" 
                      style={{ 
                        height: `${Math.max(5, (r.score / 10) * 100)}%`,
                        backgroundColor: i === results.length - 1 ? 'var(--color-primary)' : 'var(--color-surface-container-highest)',
                        opacity: i === results.length - 1 ? 1 : 0.4
                      }}
                    />
                    <span className="text-[8px] font-bold text-on-surface-variant">R0{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Round Breakdown */}
          <div className="space-y-4">
            <h2 className="text-[10px] uppercase tracking-[0.3em] font-black text-on-surface-variant ml-2">Round Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {results.map((result, i) => (
                <div key={i} className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 hover:border-primary/30 transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[9px] text-on-surface-variant font-black tracking-widest">0{i + 1}</span>
                    <div className="text-right">
                      <div className="text-xl font-black italic">{(result.score / 10).toFixed(1)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      <div 
                        className="w-10 h-10 rounded-full border-2 border-surface shadow-lg z-10" 
                        style={{ backgroundColor: hsbToHex(result.original) }}
                        title="Target"
                      />
                      <div 
                        className="w-10 h-10 rounded-full border-2 border-surface shadow-lg z-20" 
                        style={{ backgroundColor: hsbToHex(result.guess) }}
                        title="Your Guess"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-4 pt-12">
            <button 
              onClick={onPlayAgain}
              className="flex-1 bg-primary text-on-primary font-black py-5 rounded-xl uppercase tracking-widest text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-primary/10"
            >
              Reset Session
            </button>
            <button 
              onClick={handleShare}
              className="flex-1 bg-surface-container-highest text-on-surface font-black py-5 rounded-xl uppercase tracking-widest text-sm hover:bg-on-surface hover:text-surface transition-all border border-white/5"
            >
              {copied ? "Link Copied" : "Share Analytics"}
            </button>
            {onStartNew && (
              <button 
                onClick={onStartNew}
                className="px-8 py-5 bg-surface-container-low text-on-surface-variant font-black rounded-xl uppercase tracking-widest text-sm hover:text-on-surface transition-all"
              >
                Menu
              </button>
            )}
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-white/5 flex flex-col items-center opacity-40">
         <div className="text-[10px] uppercase tracking-[0.2em] font-black">
          Precision Metrics End-to-End
        </div>
      </footer>
    </div>
  );
}
