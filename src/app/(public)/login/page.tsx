"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { syncUser, googleLogin } from "@/lib/api";
import { useAuth } from "@/lib/auth";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (element: HTMLElement, config: Record<string, unknown>) => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "475630045235-e5vikjc671ie90bilar9kjjesus7uve0.apps.googleusercontent.com";

const featureHighlights = [
  {
    title: "Heartbeat Monitoring",
    desc: "Know instantly when your agents go silent",
  },
  {
    title: "Cost & Budget Tracking",
    desc: "Track LLM spend per agent, per run",
  },
  {
    title: "Failure Detection",
    desc: "Automatic incident creation on repeated failures",
  },
  {
    title: "Multi-channel Alerts",
    desc: "Email, Telegram, Slack, and Webhook",
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const handleGoogleResponse = useCallback(
    async (response: { credential: string }) => {
      setError("");
      setLoading(true);
      try {
        const res = await googleLogin(response.credential);
        login(res.api_key);
        router.replace("/dashboard");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Google login failed");
      } finally {
        setLoading(false);
      }
    },
    [login, router]
  );

  useEffect(() => {
    const initGoogle = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          width: 360,
          text: "signin_with",
        });
      }
    };

    if (window.google) {
      initGoogle();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval);
          initGoogle();
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [handleGoogleResponse]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await syncUser(email, name);
      login(res.api_key);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-navy-dark via-navy to-navy-light relative overflow-hidden">
        {/* Dot pattern */}
        <div className="absolute inset-0 dot-pattern" />
        {/* Gradient orbs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-emerald/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-56 h-56 bg-emerald/5 rounded-full blur-3xl" />

        <div className="relative flex flex-col justify-center px-16 py-12 text-white">
          <div className="flex items-center gap-2.5 mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald to-emerald-dark flex items-center justify-center shadow-lg shadow-emerald/20">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">AgentBeat</span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight leading-tight mb-3">
            Production monitoring
            <br />
            <span className="gradient-text">for AI agents</span>
          </h2>
          <p className="text-gray-400 text-base leading-relaxed mb-10 max-w-md">
            Know when your agents fail, overspend, or go silent. Set up in under 5 minutes.
          </p>

          <div className="space-y-5">
            {featureHighlights.map((f, i) => (
              <div key={f.title} className={`flex items-start gap-3 animate-fade-in-up delay-${(i + 1) * 100}`}>
                <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald/20 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{f.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-12">
            <p className="text-xs text-gray-500">
              Free to start. No credit card required.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-4 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #e5e7eb 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }} />

        <div className="w-full max-w-md relative animate-fade-in-up">
          {/* Mobile logo */}
          <div className="text-center mb-8 lg:hidden">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald to-emerald-dark mb-4 shadow-lg shadow-emerald/20">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">AgentBeat</h1>
            <p className="text-sm text-gray-500 mt-1">
              Monitor your AI agents in production
            </p>
          </div>

          {/* Desktop heading */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-sm text-gray-500 mt-1">
              Sign in to your AgentBeat account
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-200/80 p-7 space-y-5">
            {/* Google Sign-In */}
            <div ref={googleButtonRef} className="flex justify-center" />

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-3 text-gray-400">or</span>
              </div>
            </div>

            {/* Email fallback */}
            {!showEmailForm ? (
              <button
                onClick={() => setShowEmailForm(true)}
                className="w-full py-2.5 px-4 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-gray-400"
              >
                Sign in with email
              </button>
            ) : (
              <form onSubmit={handleEmailSubmit} className="space-y-4 animate-fade-in">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald/50 focus:border-emerald"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald/50 focus:border-emerald"
                    placeholder="you@company.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-emerald hover:bg-emerald-dark text-white rounded-xl text-sm font-semibold disabled:opacity-50 shadow-lg shadow-emerald/20"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </form>
            )}

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">
                {error}
              </p>
            )}
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
