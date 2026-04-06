"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Game } from "@/components/Game";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // If we are definitely not logged in, just don't show the loading screen
  // while the redirect is happening.
  if (!loading && !user) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-[#131313] text-[#e2e2e2] min-h-screen flex items-center justify-center">
        <div className="opacity-50 tracking-[0.2em] uppercase text-sm animate-pulse">Loading Identity...</div>
      </div>
    );
  }

  // If loading is false and user is null, the useEffect will trigger.
  // We return null above to avoid flicker.
  if (!user) return null;

  return <Game />;
}
