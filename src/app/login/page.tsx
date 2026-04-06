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

  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  const handleOAuth = async (provider: "google" | "github") => {
    setError("");
    setOauthLoading(provider);
    const { error: err } = await signInWithOAuth(provider);
    if (err) {
      setError(err);
      setOauthLoading(null);
    }
  };

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
                    onClick={() => handleOAuth("google")}
                    disabled={oauthLoading === "google"}
                    className="flex items-center justify-center gap-2 py-3.5 bg-surface-container-lowest rounded-xl text-[11px] font-bold tracking-widest uppercase border border-white/10 hover:bg-surface-container-high hover:border-white/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {oauthLoading === "google" ? (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                    )}
                    {oauthLoading === "google" ? "Connecting..." : "Google"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOAuth("github")}
                    disabled={oauthLoading === "github"}
                    className="flex items-center justify-center gap-2 py-3.5 bg-surface-container-lowest rounded-xl text-[11px] font-bold tracking-widest uppercase border border-white/10 hover:bg-surface-container-high hover:border-white/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {oauthLoading === "github" ? (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    )}
                    {oauthLoading === "github" ? "Connecting..." : "GitHub"}
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
