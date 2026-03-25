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

export default function LandingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="bg-navy-dark border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald flex items-center justify-center">
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
            <span className="text-lg font-bold text-white">AgentBeat</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald text-white hover:bg-emerald-dark transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-navy-dark via-navy to-navy-light text-white">
        <div className="max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Production monitoring
            <br />
            for AI agents
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Know when your agents fail, overspend, or go silent. Heartbeat
            monitoring, cost tracking, and failure detection — in 3 lines of
            code.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="px-8 py-3 text-base font-semibold rounded-lg bg-emerald text-white hover:bg-emerald-dark transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-3 text-base font-semibold rounded-lg border border-white/20 text-white hover:bg-white/5 transition-colors"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              How it works
            </h2>
            <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">
              Three primitives. Full visibility into your AI agent fleet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald/10 text-emerald mb-5">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Heartbeat</h3>
              <p className="text-gray-500 leading-relaxed">
                Your agents ping AgentBeat on every run. If they go silent, you
                get alerted.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald/10 text-emerald mb-5">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Cost Tracking</h3>
              <p className="text-gray-500 leading-relaxed">
                Track LLM spend per agent, per run. Set budgets. Get alerts
                before you blow them.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald/10 text-emerald mb-5">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Failure Detection</h3>
              <p className="text-gray-500 leading-relaxed">
                3 failures in 5 runs? AgentBeat catches it and alerts you via
                Telegram, Slack, email, or webhook.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Code snippet */}
      <section className="bg-gray-50 py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Integrate in minutes
            </h2>
            <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">
              Use the Python SDK or the HTTP API. Your agents start reporting in
              under 5 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Python SDK */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold text-gray-700">
                  Python SDK
                </span>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald/10 text-emerald">
                  Recommended
                </span>
              </div>
              <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl">
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
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold text-gray-700">
                  HTTP API
                </span>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-200 text-gray-600">
                  Any language
                </span>
              </div>
              <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl">
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
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Everything you need
            </h2>
            <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">
              Built for engineers who ship AI agents to production and need to
              sleep at night.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-gray-200 p-6 hover:border-emerald/30 hover:shadow-sm transition-all"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-emerald/10 text-emerald mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
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
      <section className="bg-gray-50 py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Simple pricing
            </h2>
            <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">
              Start free. Scale when you need to.
            </p>
            <div className="mt-8 inline-flex items-center gap-3 bg-white rounded-full border border-gray-200 p-1">
              <button
                onClick={() => setAnnual(false)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  !annual ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  annual ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Annual <span className="text-emerald-600 font-semibold">-20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl p-6 ${
                  plan.highlighted
                    ? "bg-white border-2 border-emerald shadow-lg ring-1 ring-emerald/20"
                    : "bg-white border border-gray-200"
                }`}
              >
                {plan.highlighted && (
                  <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-emerald/10 text-emerald mb-4">
                    Most popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">
                    {annual ? plan.priceAnnual : plan.priceMonthly}
                  </span>
                  <span className="text-gray-500 text-sm">{plan.period}</span>
                  {annual && plan.priceMonthly !== "$0" && (
                    <span className="text-xs text-gray-400 line-through ml-1">{plan.priceMonthly}</span>
                  )}
                </div>
                <p className="mt-3 text-sm text-gray-500">{plan.description}</p>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
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
                  className={`mt-8 block w-full py-2.5 text-center text-sm font-medium rounded-lg transition-colors ${
                    plan.highlighted
                      ? "bg-emerald text-white hover:bg-emerald-dark"
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

      {/* Footer */}
      <footer className="bg-navy-dark text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald flex items-center justify-center">
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
              <span className="text-sm font-semibold text-white">
                AgentBeat
              </span>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/dashboard"
                className="hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/login"
                className="hover:text-white transition-colors"
              >
                Login
              </Link>
              <a
                href="https://github.com/mohitsharmadl"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                GitHub
              </a>
            </div>

            <p className="text-sm">Built by Mohit Sharma</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
