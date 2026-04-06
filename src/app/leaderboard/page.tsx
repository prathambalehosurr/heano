"use client";

import { useState, useEffect } from "react";
import { getLeaderboard, getUserBest, clearLeaderboard } from "@/lib/database";
import { formatScore } from "@/lib/game";
import { useAuth } from "@/lib/auth-context";

interface LeaderboardEntry {
  id: string;
  score: number;
  mode: string;
  difficulty: string;
  created_at: string;
  profiles: { name: string; avatar_url: string | null } | null;
}

export default function LeaderboardPage() {
  const [filter, setFilter] = useState<"all" | "solo" | "daily" | "multiplayer">("all");
  const [diffFilter, setDiffFilter] = useState<"all" | "easy" | "hard">("all");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isClearing, setIsClearing] = useState(false);
  const [userBestScore, setUserBestScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    getLeaderboard({
      mode: filter === "all" ? undefined : filter,
      difficulty: diffFilter === "all" ? undefined : diffFilter,
      limit: 50,
    }).then(({ data }) => {
      setEntries((data as unknown as LeaderboardEntry[]) || []);
      setLoading(false);
    });

    if (user?.id) {
       getUserBest(user.id).then(({ best }) => {
          setUserBestScore(best || 0);
       });
    }
  }, [filter, diffFilter, user?.id]);

  const handleClear = async () => {
     if (!confirm("Are you absolutely sure you want to clear the global leaderboard? This action cannot be undone.")) return;
     setIsClearing(true);
     await clearLeaderboard();
     setEntries([]);
     setIsClearing(false);
  };

  const getRankBadge = (rank: number) => {
    if (rank < 10) return `0${rank}`;
    return `${rank}`;
  };

  const getAccuracy = (score: number) => {
     return ((score / 50) * 100).toFixed(1) + "%";
  };
  
  const getTier = (score: number) => {
     const pct = score / 50;
     if (pct > 0.98) return "Grandmaster";
     if (pct > 0.90) return "Master";
     if (pct > 0.80) return "Elite Recaller";
     return "Challenger";
  };

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col fade-in">
      <nav className="bg-[#131313]/90 backdrop-blur-md fixed top-0 w-full flex justify-between items-center px-8 py-6 z-50">
        <a href="/" className="text-xl font-black tracking-tighter text-[#e2e2e2] hover:text-primary transition-colors">COLOURED</a>
        <div className="flex items-center gap-6">
          {user?.email === "prathambalehosur.work@gmail.com" && (
            <button 
              onClick={handleClear} 
              disabled={isClearing}
              className="text-xs uppercase tracking-widest font-bold text-error border border-error/50 px-4 py-2 rounded-lg hover:bg-error/10 transition-colors"
            >
              {isClearing ? "Clearing..." : "Reset Leaderboard"}
            </button>
          )}
          {user ? (
             <a href="/profile" className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/20 bg-surface-container flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant">person</span>
             </a>
          ) : (
             <a href="/login" className="text-[10px] uppercase tracking-widest font-bold text-on-surface hover:text-primary transition-colors">Sign In</a>
          )}
        </div>
      </nav>

      <main className="flex-grow pt-32 pb-24 px-6 md:px-24 max-w-7xl mx-auto w-full">
        <header className="mb-16">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-on-surface mb-2 uppercase">LEADERBOARD</h1>
          <p className="text-on-surface-variant tracking-[0.2em] text-sm font-medium uppercase opacity-80">The world's most accurate color recallers.</p>
        </header>

        {user && userBestScore > 0 && (
           <section className="mb-20">
             <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
               <div className="md:col-span-8">
                 <div className="border border-outline-variant/20 bg-surface-container-low p-8 rounded-xl flex items-center justify-between shadow-2xl relative overflow-hidden">
                   <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
                   <div className="flex items-center gap-8 relative z-10">
                     <div>
                       <div className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Your Best</div>
                       <div className="text-2xl font-bold tracking-tight">{user?.user_metadata?.name || 'Player'}</div>
                     </div>
                   </div>
                   <div className="text-right relative z-10">
                     <div className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Accuracy</div>
                     <div className="text-4xl font-black text-primary tracking-tighter">{getAccuracy(userBestScore)}</div>
                   </div>
                 </div>
               </div>
               <div className="md:col-span-4 bg-surface-container-low p-8 rounded-xl flex flex-col justify-center border border-primary/10">
                 <span className="material-symbols-outlined text-primary mb-2">auto_awesome</span>
                 <p className="text-sm leading-relaxed text-on-surface-variant">You have a personal best of <span className="text-primary font-bold">{getAccuracy(userBestScore)}</span>. Keep playing to climb the global ranks!</p>
               </div>
             </div>
           </section>
        )}

        <section className="relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 px-4 gap-4">
            <h2 className="text-xs font-medium uppercase tracking-[0.3em] text-on-surface-variant">Top Players</h2>
            <div className="flex flex-wrap gap-4">
              {(["all", "solo", "daily", "multiplayer"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-[10px] uppercase tracking-widest font-bold pb-1 transition-all ${
                    filter === f ? "text-primary border-b border-primary" : "text-on-surface-variant opacity-40 hover:opacity-100"
                  }`}
                >
                  {f}
                </button>
              ))}
              <span className="text-on-surface-variant opacity-20 hidden md:inline">|</span>
              {(["all", "easy", "hard"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDiffFilter(d)}
                  className={`text-[10px] uppercase tracking-widest font-bold pb-1 transition-all ${
                    diffFilter === d ? "text-secondary border-b border-secondary" : "text-on-surface-variant opacity-40 hover:opacity-100"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-16 text-on-surface-variant uppercase tracking-widest text-xs animate-pulse">Syncing Leaderboard...</div>
            ) : entries.length === 0 ? (
              <div className="text-center py-16 bg-surface-container-low/30 rounded-xl border border-outline-variant/5">
                 <p className="text-on-surface-variant opacity-60 uppercase tracking-widest text-sm">No scores found</p>
              </div>
            ) : (
              entries.map((entry, i) => {
                 const rank = i + 1;
                 const isTop3 = rank <= 3;
                 
                 return (
                   <div key={entry.id} className={`group transition-all duration-300 p-4 md:p-6 rounded-xl flex items-center gap-6 border-b border-outline-variant/10 md:border-none ${isTop3 ? 'bg-surface-container-high/40 hover:bg-surface-container-high' : 'bg-transparent hover:bg-surface-container-low/30'}`}>
                     <div className={`w-12 text-2xl font-black italic ${rank === 1 ? 'text-secondary' : rank === 2 ? 'text-on-surface/80' : rank === 3 ? 'text-on-surface/60' : 'text-on-surface/20'}`}>
                        {getRankBadge(rank)}
                     </div>
                     <div className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 ${isTop3 ? 'border-2 border-primary/30' : 'border border-outline-variant/10 bg-surface-container-highest'}`}>
                        <span className="material-symbols-outlined opacity-30 text-2xl">person</span>
                     </div>
                     <div className="flex-grow">
                        <div className="text-lg font-bold tracking-tight flex items-center gap-2">
                           {entry.profiles?.name || "Anonymous"}
                           {rank === 1 && <span className="material-symbols-outlined text-[16px] text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>}
                        </div>
                        <div className="text-[10px] uppercase tracking-widest text-on-surface-variant">{getTier(entry.score)}</div>
                     </div>
                     <div className="flex items-center gap-6 md:gap-12">
                        <div className="hidden md:block text-right">
                           <div className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Mode</div>
                           <div className="font-bold text-on-surface capitalize text-sm">{entry.mode}</div>
                        </div>
                        <div className="text-right">
                           <div className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Accuracy</div>
                           <div className="font-black text-xl text-on-surface tracking-tighter">{getAccuracy(entry.score)}</div>
                        </div>
                     </div>
                   </div>
                 );
              })
            )}
          </div>
        </section>

        <div className="mt-20 flex justify-center">
           <a href="/" className="bg-on-surface text-surface px-10 py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-primary hover:text-on-primary transition-colors cursor-pointer inline-block">
               Play to Rank Up
           </a>
        </div>
      </main>

    </div>
  );
}
