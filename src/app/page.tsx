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

  if (loading || !user) {
    return (
      <div className="bg-[#131313] text-[#e2e2e2] min-h-screen flex items-center justify-center">
        <div className="opacity-50 tracking-[0.2em] uppercase text-sm animate-pulse">Loading...</div>
      </div>
    );
  }

  return <Game />;
}
