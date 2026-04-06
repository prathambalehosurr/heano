"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getUserBest, updateProfile } from "@/lib/database";
import { supabase } from "@/lib/supabase";
import { formatScore } from "@/lib/game";

export default function ProfilePage() {
  const { user, profileName, signOut, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [bestScore, setBestScore] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
    if (user) {
      setName(profileName || user.email?.split("@")[0] || "");
      getUserBest(user.id).then(({ best }) => {
        setBestScore(best || 0);
      });
    }
  }, [user, authLoading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleSave = async () => {
    setIsSaving(true);
    if (user) {
      try {
        const { error: profileError } = await updateProfile(user.id, { name });
        if (profileError) {
           console.error(profileError);
           alert("Failed to update database profile: " + profileError);
           setIsSaving(false);
           return;
        }

        const { error: authError } = await supabase.auth.updateUser({
          data: { name }
        });
        if (authError) {
           console.error(authError);
           alert("Failed to update auth metadata: " + authError.message);
           setIsSaving(false);
           return;
        }
        
        setIsEditing(false);
        // Force reload to update context cleanly
        window.location.reload();
      } catch (e) {
        console.error("Error updating profile", e);
      }
    }
    setIsSaving(false);
  };

  const getAccuracy = (score: number) => {
     return ((score / 50) * 100).toFixed(1) + "%";
  };

  if (authLoading || !user) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center font-body">
        <div className="opacity-50 tracking-[0.2em] uppercase text-sm animate-pulse">Loading Identity...</div>
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col fade-in relative overflow-hidden">
      {/* Background Ambient */}
      <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <nav className="fixed top-0 w-full flex justify-between items-center px-8 py-6 z-50">
        <a href="/" className="text-xl font-black tracking-tighter text-on-surface hover:text-primary transition-colors">COLOURED</a>
        <a href="/leaderboard" className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant hover:text-on-surface transition-colors">Leaderboard</a>
      </nav>

      <main className="flex-grow pt-32 pb-24 px-6 md:px-24 max-w-2xl mx-auto w-full relative z-10 flex flex-col items-center">
        
        {/* Avatar */}
        <div className="w-32 h-32 rounded-full overflow-hidden border border-outline-variant/30 bg-surface-container flex items-center justify-center mb-8 shadow-2xl relative">
            <span className="material-symbols-outlined text-on-surface-variant text-6xl opacity-50">person</span>
        </div>

        {/* Name / Info */}
        <div className="text-center w-full mb-12">
            {isEditing ? (
              <div className="flex flex-col items-center gap-4 w-full">
                 <input 
                   type="text" 
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   className="bg-surface-container-high border border-outline-variant/30 rounded-xl px-6 py-4 text-center text-3xl font-bold focus:outline-none focus:border-primary transition-colors text-on-surface w-full max-w-xs"
                 />
                 <div className="flex gap-4">
                    <button onClick={handleSave} disabled={isSaving} className="text-xs uppercase tracking-widest font-bold text-surface bg-primary px-6 py-2 rounded-lg hover:bg-primary-fixed transition-colors">
                        {isSaving ? "Saving..." : "Save"}
                    </button>
                    <button onClick={() => setIsEditing(false)} className="text-xs uppercase tracking-widest font-bold text-on-surface-variant hover:text-on-surface px-6 py-2 rounded-lg transition-colors">
                        Cancel
                    </button>
                 </div>
              </div>
            ) : (
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-on-surface flex items-center justify-center gap-2 mb-2">
                    {name}
                    <button onClick={() => setIsEditing(true)} className="text-on-surface-variant opacity-40 hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                </h1>
                <p className="text-on-surface-variant uppercase tracking-widest text-xs opacity-60">{user.email}</p>
              </div>
            )}
        </div>

        {/* Stats Bento Box */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
            <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-primary mb-2 opacity-80">grade</span>
                <div className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Personal Best</div>
                <div className="text-3xl font-black text-on-surface">{formatScore(bestScore)}<span className="text-sm text-on-surface-variant font-medium">/50</span></div>
            </div>
            <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-secondary mb-2 opacity-80">psychology</span>
                <div className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Accuracy</div>
                <div className="text-3xl font-black text-on-surface">{getAccuracy(bestScore)}</div>
            </div>
        </div>

        {/* Danger Zone / Log Out */}
        <button 
          onClick={handleSignOut}
          className="border border-error/20 text-error hover:bg-error/10 px-8 py-3 rounded-lg text-xs uppercase tracking-widest font-bold transition-colors"
        >
            Sign Out
        </button>

      </main>

    </div>
  );
}
