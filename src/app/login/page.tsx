"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithOAuth } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const { error: err } = await signIn(email, password);
        if (err) {
          setError(typeof err === "string" ? err : "Login failed");
        } else {
          router.push("/");
        }
      } else {
        if (!name.trim()) {
          setError("Name is required");
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
        }
        const { error: err } = await signUp(email, password, name);
        if (err) {
          setError(typeof err === "string" ? err : "Sign up failed");
        } else {
          router.push("/");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col fade-in">
      {/* Top Navigation Bar */}
      <nav className="w-full top-0 sticky bg-[#131313] z-50">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          <Link
            href="/"
            className="text-2xl font-black tracking-tighter text-[#e2e2e2] uppercase font-sans"
          >
            COLOURED
          </Link>
          <div className="flex items-center gap-4">
            <span
              className="material-symbols-outlined text-[#ffb3b0]"
              data-icon="help_outline"
            >
              help_outline
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content: The Obsidian Gallery Canvas */}
      <main className="flex-grow flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_#1b1b1b,_#131313)]">
        <div className="w-full max-w-md">
          {/* Central Login Card */}
          <div className="bg-surface-container-low rounded-xl p-10 md:p-12 relative overflow-hidden shadow-2xl">
            {/* Subtle depth accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-container via-secondary to-transparent opacity-30"></div>

            {/* Display Typography Header */}
            <header className="mb-10 text-center md:text-left">
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-on-surface uppercase mb-2 italic">
                {isLogin ? "LOGIN" : "REGISTER"}
              </h1>
              <p className="text-on-surface-variant text-sm tracking-[0.1em] uppercase font-medium">
                {isLogin ? "Access Precision Performance" : "Join the Precision Hunt"}
              </p>
            </header>

            {error && (
              <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg text-sm border border-error/10">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant ml-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      className="w-full bg-surface-container-lowest border-none rounded-xl py-4 px-5 text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-1 focus:ring-primary-container focus:border-[#ff6b6b] focus:shadow-[0_0_15px_rgba(255,107,107,0.2)] transition-all duration-300"
                      placeholder="Enter your name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-lowest border-none rounded-xl py-4 px-5 text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-1 focus:ring-primary-container focus:border-[#ff6b6b] focus:shadow-[0_0_15px_rgba(255,107,107,0.2)] transition-all duration-300"
                    placeholder="name@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant">
                    Password
                  </label>
                  {isLogin && (
                    <a
                      className="text-[10px] uppercase tracking-[0.1em] text-primary hover:text-primary-fixed transition-colors"
                      href="#"
                    >
                      Forgot?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-lowest border-none rounded-xl py-4 px-5 text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-1 focus:ring-primary-container focus:border-[#ff6b6b] focus:shadow-[0_0_15px_rgba(255,107,107,0.2)] transition-all duration-300"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  disabled={loading}
                  className="w-full bg-primary-container text-on-primary-container font-black py-5 rounded-xl uppercase tracking-widest text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary-container/10 disabled:opacity-50"
                  type="submit"
                >
                  {loading ? "PROCESSING..." : isLogin ? "LOGIN" : "CREATE ACCOUNT"}
                </button>
              </div>
            </form>

            {/* Social Logins */}
            {isLogin && (
              <>
                <div className="relative mt-8 mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-outline-variant/15"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                    <span className="bg-surface-container-low px-4 text-on-surface-variant font-bold">
                      Or
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    disabled
                    className="flex flex-col items-center justify-center gap-1 py-3 bg-surface-container-lowest rounded-xl text-[10px] font-bold tracking-widest uppercase border border-white/5 opacity-30 cursor-not-allowed"
                  >
                    Google
                    <span className="text-[8px] tracking-normal normal-case font-medium">Coming Soon</span>
                  </button>
                  <button
                    type="button"
                    disabled
                    className="flex flex-col items-center justify-center gap-1 py-3 bg-surface-container-lowest rounded-xl text-[10px] font-bold tracking-widest uppercase border border-white/5 opacity-30 cursor-not-allowed"
                  >
                    GitHub
                    <span className="text-[8px] tracking-normal normal-case font-medium">Coming Soon</span>
                  </button>
                </div>
              </>
            )}

            {/* Toggle Link */}
            <div className="mt-8 pt-8 border-t border-outline-variant/15 text-center">
              <p className="text-on-surface-variant text-xs font-medium">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:underline underline-offset-4 ml-1 font-bold"
                >
                  {isLogin ? "Register" : "Login"}
                </button>
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center opacity-20 select-none pointer-events-none">
            <div className="h-24 w-px bg-gradient-to-b from-primary-container to-transparent"></div>
          </div>
        </div>
      </main>

      <footer className="bg-[#131313] py-12 flex flex-col items-center gap-6 w-full mt-auto border-t border-white/5">
        <div className="flex gap-8">
          <a
            className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#e0bfbd] hover:text-[#ffb3b0] transition-opacity opacity-60 hover:opacity-100"
            href="#"
          >
            Support
          </a>
          <a
            className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#e0bfbd] hover:text-[#ffb3b0] transition-opacity opacity-60 hover:opacity-100"
            href="#"
          >
            Privacy
          </a>
          <a
            className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#e0bfbd] hover:text-[#ffb3b0] transition-opacity opacity-60 hover:opacity-100"
            href="#"
          >
            Terms
          </a>
        </div>
        <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#e0bfbd]/40">
          v1.0.4 COLOURED
        </div>
      </footer>
    </div>
  );
}
