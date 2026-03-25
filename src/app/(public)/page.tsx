"use client";

import Link from "next/link";
import { useState } from "react";

const features = [
  {
    title: "Heartbeat Monitoring",
    description:
      "Your agents ping AgentBeat on every run. If they go silent, you get alerted instantly.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    title: "Cost & Budget Tracking",
    description:
      "Track LLM spend per agent, per run. Set budgets and get alerts before you blow them.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Multi-step Workflow Tracking",
    description:
      "Track individual steps within a run. See exactly where your multi-step agent pipeline broke.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Failure Detection",
    description:
      "3 failures in 5 runs? AgentBeat catches it and opens an incident automatically.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  {
    title: "Multi-channel Alerts",
    description:
      "Get notified via Email, Telegram, Slack, or Webhook. Never miss a critical failure.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
  {
    title: "Python SDK + HTTP API",
    description:
      "First-class Python SDK with context managers. Or use the simple HTTP API from any language.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
];

const pricingPlans = [
  {
    name: "Free",
    priceMonthly: "$0",
    priceAnnual: "$0",
    period: "forever",
    description: "For side projects and solo developers.",
    features: ["3 agents", "Unlimited runs", "Email alerts", "7-day retention"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    priceMonthly: "$49",
    priceAnnual: "$39",
    period: "/mo",
    description: "For developers running production agents.",
    features: [
      "10 agents",
      "Unlimited runs",
      "Cost tracking & budgets",
      "Telegram, Slack, Webhook alerts",
      "30-day retention",
      "3 team members",
    ],
    cta: "Get Started",
    highlighted: true,
  },
  {
    name: "Team",
    priceMonthly: "$149",
    priceAnnual: "$119",
    period: "/mo",
    description: "For teams with critical agent infrastructure.",
    features: [
      "50 agents",
      "Unlimited runs",
      "Advanced analytics",
      "All alert channels",
      "90-day retention",
      "10 team members",
      "Priority support",
    ],
    cta: "Get Started",
    highlighted: false,
  },
];

const socialProofLogos = [
  "YC Startups",
  "Series A Teams",
  "Solo Founders",
  "DevOps Engineers",
  "ML Engineers",
];

export default function LandingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="bg-navy-dark/95 backdrop-blur-sm border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald to-emerald-dark flex items-center justify-center shadow-lg shadow-emerald/20">
              <svg
                className="w-5 h-5 text-white"
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
            <span className="text-lg font-bold text-white tracking-tight">AgentBeat</span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#features"
              className="hidden sm:inline text-sm text-gray-400 hover:text-white"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="hidden sm:inline text-sm text-gray-400 hover:text-white"
            >
              Pricing
            </a>
            <Link
              href="/dashboard"
              className="text-sm text-gray-400 hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald text-white hover:bg-emerald-dark shadow-lg shadow-emerald/20"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-dark via-navy to-navy-light text-white">
        {/* Dot pattern overlay */}
        <div className="absolute inset-0 dot-pattern" />
        {/* Gradient orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald/5 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-6 pt-24 md:pt-32 pb-16 md:pb-20 text-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald/30 bg-emerald/10 text-emerald text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
              Now in public beta
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              Production monitoring
              <br />
              <span className="gradient-text">for AI agents</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Know when your agents fail, overspend, or go silent. Heartbeat
              monitoring, cost tracking, and failure detection — in 3 lines of
              code.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="px-8 py-3.5 text-base font-semibold rounded-xl bg-emerald text-white hover:bg-emerald-dark shadow-xl shadow-emerald/25 hover:shadow-emerald/40"
              >
                Start Free
              </Link>
              <Link
                href="#how-it-works"
                className="px-8 py-3.5 text-base font-semibold rounded-xl border border-white/20 text-white hover:bg-white/5 hover:border-white/30"
              >
                See how it works
              </Link>
            </div>
          </div>

          {/* Floating dashboard mockup */}
          <div className="mt-16 md:mt-20 animate-fade-in-up delay-300">
            <div className="relative mx-auto max-w-4xl">
              {/* Browser chrome */}
              <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10 animate-float">
                <div className="bg-gray-800/80 backdrop-blur px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  <div className="ml-3 flex-1 bg-gray-700/50 rounded-md px-3 py-1 text-xs text-gray-400 font-mono">
                    app.agentbeat.dev/dashboard
                  </div>
                </div>
                {/* Mock dashboard content */}
                <div className="bg-gray-900/95 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <div className="h-5 w-28 bg-white/10 rounded mb-1.5" />
                      <div className="h-3 w-40 bg-white/5 rounded" />
                    </div>
                    <div className="h-8 w-28 bg-emerald/30 rounded-lg" />
                  </div>
                  {/* Stat cards row */}
                  <div className="grid grid-cols-4 gap-3 mb-5">
                    <div className="bg-white/5 rounded-lg p-3 border-l-2 border-emerald">
                      <div className="h-3 w-12 bg-white/10 rounded mb-2" />
                      <div className="h-5 w-8 bg-emerald/40 rounded" />
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border-l-2 border-green-400">
                      <div className="h-3 w-16 bg-white/10 rounded mb-2" />
                      <div className="h-5 w-6 bg-green-400/40 rounded" />
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border-l-2 border-red-400">
                      <div className="h-3 w-14 bg-white/10 rounded mb-2" />
                      <div className="h-5 w-4 bg-red-400/40 rounded" />
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border-l-2 border-violet-400">
                      <div className="h-3 w-16 bg-white/10 rounded mb-2" />
                      <div className="h-5 w-14 bg-violet-400/40 rounded" />
                    </div>
                  </div>
                  {/* Agent cards */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { name: "data-pipeline", status: "bg-green-400" },
                      { name: "rag-assistant", status: "bg-green-400" },
                      { name: "email-classifier", status: "bg-red-400" },
                    ].map((a) => (
                      <div key={a.name} className="bg-white/5 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="h-3.5 w-24 bg-white/15 rounded" />
                          <div className={`w-2 h-2 rounded-full ${a.status}`} />
                        </div>
                        <div className="h-2.5 w-full bg-white/5 rounded mb-1.5" />
                        <div className="h-2.5 w-2/3 bg-white/5 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Glow behind mockup */}
              <div className="absolute -inset-4 bg-gradient-to-t from-emerald/10 via-transparent to-transparent rounded-2xl blur-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-sm text-gray-400 font-medium uppercase tracking-wider mb-6">
            Trusted by developers and teams at
          </p>
          <div className="flex items-center justify-center gap-8 md:gap-14 flex-wrap">
            {socialProofLogos.map((name) => (
              <span key={name} className="text-gray-300 font-semibold text-lg tracking-tight">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white py-24 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20 animate-fade-in-up">
            <p className="text-sm font-semibold text-emerald uppercase tracking-wider mb-3">How it works</p>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Three primitives. Full visibility.
            </h2>
            <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">
              Everything you need to monitor your AI agent fleet in production.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14">
            {[
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                title: "Heartbeat",
                desc: "Your agents ping AgentBeat on every run. If they go silent, you get alerted.",
                num: "01",
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Cost Tracking",
                desc: "Track LLM spend per agent, per run. Set budgets. Get alerts before you blow them.",
                num: "02",
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                ),
                title: "Failure Detection",
                desc: "3 failures in 5 runs? AgentBeat catches it and alerts you via Telegram, Slack, email, or webhook.",
                num: "03",
              },
            ].map((item, i) => (
              <div key={item.title} className={`text-center animate-fade-in-up delay-${(i + 1) * 200}`}>
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald/10 to-emerald/5 text-emerald mb-6">
                  {item.icon}
                  <span className="absolute -top-2 -right-2 text-[10px] font-bold text-emerald/40 font-mono">{item.num}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code snippet */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-24 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in-up">
            <p className="text-sm font-semibold text-emerald uppercase tracking-wider mb-3">Integration</p>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Integrate in minutes
            </h2>
            <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">
              Use the Python SDK or the HTTP API. Your agents start reporting in
              under 5 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Python SDK */}
            <div className="animate-fade-in-up delay-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold text-gray-700">
                  Python SDK
                </span>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald/10 text-emerald">
                  Recommended
                </span>
              </div>
              <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl shadow-gray-900/20 ring-1 ring-white/10">
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 border-b border-white/5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  <span className="ml-2 text-xs text-gray-500 font-mono">
                    agent.py
                  </span>
                </div>
                <pre className="p-5 text-sm font-mono leading-relaxed overflow-x-auto">
                  <code>
                    <span className="text-purple-400">from</span>
                    <span className="text-gray-300"> agentbeat </span>
                    <span className="text-purple-400">import</span>
                    <span className="text-emerald"> AgentBeat</span>
                    {"\n\n"}
                    <span className="text-gray-300">ab = </span>
                    <span className="text-emerald">AgentBeat</span>
                    <span className="text-gray-400">(</span>
                    {"\n"}
                    <span className="text-gray-300">{"    "}</span>
                    <span className="text-amber-300">{'"https://api.agentbeat.dev"'}</span>
                    <span className="text-gray-400">,</span>
                    {"\n"}
                    <span className="text-gray-300">{"    "}</span>
                    <span className="text-amber-300">{'"my-agent"'}</span>
                    <span className="text-gray-400">,</span>
                    {"\n"}
                    <span className="text-gray-300">{"    "}</span>
                    <span className="text-amber-300">{'"token"'}</span>
                    {"\n"}
                    <span className="text-gray-400">)</span>
                    {"\n\n"}
                    <span className="text-purple-400">with</span>
                    <span className="text-gray-300"> ab.</span>
                    <span className="text-blue-400">run</span>
                    <span className="text-gray-400">()</span>
                    <span className="text-purple-400"> as</span>
                    <span className="text-gray-300"> ctx:</span>
                    {"\n"}
                    <span className="text-gray-300">{"    "}ctx.items_processed = </span>
                    <span className="text-orange-400">50</span>
                    {"\n"}
                    <span className="text-gray-300">{"    "}ctx.</span>
                    <span className="text-blue-400">add_cost</span>
                    <span className="text-gray-400">(</span>
                    <span className="text-orange-400">0.12</span>
                    <span className="text-gray-400">)</span>
                    {"\n"}
                    <span className="text-gray-300">{"    "}ctx.model = </span>
                    <span className="text-amber-300">{'"gpt-4o"'}</span>
                  </code>
                </pre>
              </div>
            </div>

            {/* curl */}
            <div className="animate-fade-in-up delay-300">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold text-gray-700">
                  HTTP API
                </span>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                  Any language
                </span>
              </div>
              <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl shadow-gray-900/20 ring-1 ring-white/10">
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 border-b border-white/5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  <span className="ml-2 text-xs text-gray-500 font-mono">
                    terminal
                  </span>
                </div>
                <pre className="p-5 text-sm font-mono leading-relaxed overflow-x-auto">
                  <code>
                    <span className="text-gray-500"># Start a run</span>
                    {"\n"}
                    <span className="text-emerald">curl</span>
                    <span className="text-gray-300"> -X POST </span>
                    <span className="text-amber-300">
                      {"https://api.agentbeat.dev/a/my-agent/start"}
                    </span>
                    <span className="text-gray-300"> \</span>
                    {"\n"}
                    <span className="text-gray-300">{"  "}-H </span>
                    <span className="text-amber-300">
                      {'"X-Agent-Token: your-token"'}
                    </span>
                    {"\n\n"}
                    <span className="text-gray-500"># Complete with metadata</span>
                    {"\n"}
                    <span className="text-emerald">curl</span>
                    <span className="text-gray-300"> -X POST </span>
                    <span className="text-amber-300">
                      {"https://api.agentbeat.dev/a/my-agent/complete"}
                    </span>
                    <span className="text-gray-300"> \</span>
                    {"\n"}
                    <span className="text-gray-300">{"  "}-H </span>
                    <span className="text-amber-300">
                      {'"X-Agent-Token: your-token"'}
                    </span>
                    <span className="text-gray-300"> \</span>
                    {"\n"}
                    <span className="text-gray-300">{"  "}-H </span>
                    <span className="text-amber-300">
                      {'"Content-Type: application/json"'}
                    </span>
                    <span className="text-gray-300"> \</span>
                    {"\n"}
                    <span className="text-gray-300">{"  "}-d </span>
                    <span className="text-amber-300">
                      {"'{\"items_processed\": 42, \"cost_usd\": 0.12}'"}
                    </span>
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section id="features" className="bg-white py-24 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in-up">
            <p className="text-sm font-semibold text-emerald uppercase tracking-wider mb-3">Features</p>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Everything you need
            </h2>
            <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">
              Built for engineers who ship AI agents to production and need to
              sleep at night.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`rounded-xl border border-gray-200 p-6 card-hover hover:border-emerald/30 bg-gradient-to-b from-white to-gray-50/50 animate-fade-in-up delay-${(i % 3 + 1) * 100}`}
              >
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald/10 to-emerald/5 text-emerald mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gradient-to-b from-gray-50 to-white py-24 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in-up">
            <p className="text-sm font-semibold text-emerald uppercase tracking-wider mb-3">Pricing</p>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">
              Start free. Scale when you need to.
            </p>
            <div className="mt-8 inline-flex items-center gap-1 bg-white rounded-full border border-gray-200 p-1 shadow-sm">
              <button
                onClick={() => setAnnual(false)}
                className={`px-5 py-2 text-sm font-medium rounded-full ${
                  !annual ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-5 py-2 text-sm font-medium rounded-full ${
                  annual ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Annual <span className="text-emerald font-bold">-20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-7 relative animate-fade-in-up delay-${(i + 1) * 200} ${
                  plan.highlighted
                    ? "bg-white border-2 border-emerald pricing-glow scale-[1.02]"
                    : "bg-white border border-gray-200 hover:border-gray-300 shadow-sm"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold rounded-full bg-emerald text-white shadow-lg shadow-emerald/30">
                    Most popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-gray-900 tracking-tight">
                    {annual ? plan.priceAnnual : plan.priceMonthly}
                  </span>
                  <span className="text-gray-500 text-sm font-medium">{plan.period}</span>
                  {annual && plan.priceMonthly !== "$0" && (
                    <span className="text-xs text-gray-400 line-through ml-1">{plan.priceMonthly}</span>
                  )}
                </div>
                <p className="mt-3 text-sm text-gray-500">{plan.description}</p>

                <ul className="mt-7 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <svg
                        className="w-5 h-5 text-emerald shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/login"
                  className={`mt-8 block w-full py-3 text-center text-sm font-semibold rounded-xl ${
                    plan.highlighted
                      ? "bg-emerald text-white hover:bg-emerald-dark shadow-lg shadow-emerald/20"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-dark py-24 relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern" />
        <div className="absolute top-10 left-1/3 w-72 h-72 bg-emerald/10 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Start monitoring your agents today
          </h2>
          <p className="mt-4 text-gray-400 text-lg">
            Free to start. No credit card required. Set up in under 5 minutes.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/login"
              className="px-8 py-3.5 text-base font-semibold rounded-xl bg-emerald text-white hover:bg-emerald-dark shadow-xl shadow-emerald/25"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-dark text-gray-400 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald to-emerald-dark flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
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
                <span className="text-sm font-bold text-white">
                  AgentBeat
                </span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Production monitoring for AI agents and automated workflows.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
                <li><span className="text-gray-600">Docs (coming soon)</span></li>
              </ul>
            </div>

            {/* Developers */}
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Developers</h4>
              <ul className="space-y-3 text-sm">
                <li><span className="text-gray-600">Python SDK</span></li>
                <li><span className="text-gray-600">HTTP API</span></li>
                <li>
                  <a href="https://github.com/mohitsharmadl" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    GitHub
                  </a>
                </li>
                <li><span className="text-gray-600">Changelog</span></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/login" className="hover:text-white">Sign in</Link></li>
                <li><span className="text-gray-600">Privacy</span></li>
                <li><span className="text-gray-600">Terms</span></li>
                <li><span className="text-gray-600">Status</span></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Built by Mohit Sharma
            </p>
            <p className="text-xs text-gray-600">
              AgentBeat &copy; {new Date().getFullYear()}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
