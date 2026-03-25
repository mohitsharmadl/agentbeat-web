"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { getDashboardOverview, createAgent } from "@/lib/api";
import type { Agent, DashboardOverview } from "@/lib/api";
import { useFetch } from "@/lib/hooks";
import { relativeTime, formatCost, cn } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import CopyButton from "@/components/CopyButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8092";

function StatCard({
  label,
  value,
  color,
  borderClass,
  icon,
}: {
  label: string;
  value: string | number;
  color?: string;
  borderClass?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className={cn(
      "bg-white rounded-xl border border-gray-200 p-5 card-hover",
      borderClass
    )}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
            {icon}
          </div>
        )}
      </div>
      <p className={cn("text-2xl font-bold", color || "text-gray-900")}>
        {value}
      </p>
    </div>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <Link
      href={`/agent?id=${agent.id}`}
      className="block bg-white rounded-xl border border-gray-200 p-5 card-hover hover:border-emerald/30 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate group-hover:text-emerald-700">{agent.name}</h3>
          {agent.description && (
            <p className="text-sm text-gray-500 mt-0.5 truncate">
              {agent.description}
            </p>
          )}
        </div>
        <StatusBadge status={agent.status} />
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 mt-4 pt-3 border-t border-gray-100">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {agent.last_run_at ? relativeTime(agent.last_run_at) : "Never"}
        </span>
        {agent.expected_interval_secs && (
          <span className="text-gray-400">Every {agent.expected_interval_secs}s</span>
        )}
      </div>

      {agent.tags && agent.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {agent.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

function CreateAgentModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [step, setStep] = useState<"form" | "setup">("form");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [interval, setInterval] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdAgent, setCreatedAgent] = useState<Agent | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    // Auto-generate slug from name
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const agent = await createAgent({
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description,
        expected_interval_secs: interval ? parseInt(interval) : undefined,
        grace_secs: 300,
      });
      setCreatedAgent(agent);
      setStep("setup");
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create agent");
    } finally {
      setLoading(false);
    }
  };

  if (step === "setup" && createdAgent) {
    const pythonCode = `from agentbeat import AgentBeat

ab = AgentBeat(
    "${API_URL}",
    "${createdAgent.slug}",
    "${createdAgent.token}"
)

# Option 1: Context manager (auto-completes/fails)
with ab.run() as ctx:
    # your agent code here
    ctx.items_processed = 50
    ctx.add_cost(0.12)
    ctx.model = "gpt-4o"

# Option 2: Simple heartbeat
ab.heartbeat()`;

    const curlCode = `# Start a run
curl -X POST ${API_URL}/a/${createdAgent.slug}/start \\
  -H "X-Agent-Token: ${createdAgent.token}"

# Complete a run
curl -X POST ${API_URL}/a/${createdAgent.slug}/complete \\
  -H "X-Agent-Token: ${createdAgent.token}" \\
  -H "Content-Type: application/json" \\
  -d '{"items_processed": 42, "cost_usd": 0.12}'

# Simple heartbeat
curl ${API_URL}/a/${createdAgent.slug}/heartbeat \\
  -H "X-Agent-Token: ${createdAgent.token}"`;

    const bashCode = `# Add to your cron job or shell script
curl -s ${API_URL}/a/${createdAgent.slug}/heartbeat \\
  -H "X-Agent-Token: ${createdAgent.token}" > /dev/null`;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Agent Created</h2>
            </div>
            <p className="text-sm text-gray-500 mt-1 mb-6">
              <strong>{createdAgent.name}</strong> is ready. Add the integration code to your agent.
            </p>

            {/* Token */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Agent Token</label>
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <code className="text-sm font-mono text-gray-600 flex-1 truncate">
                  {createdAgent.token}
                </code>
                <CopyButton text={createdAgent.token} />
              </div>
              <p className="text-xs text-gray-400 mt-1">Save this token — it won't be shown again in full.</p>
            </div>

            {/* Python SDK */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-gray-700">Python SDK</span>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald/10 text-emerald-700">Recommended</span>
              </div>
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs font-mono overflow-x-auto">
                  {pythonCode}
                </pre>
                <div className="absolute top-2 right-2">
                  <CopyButton text={pythonCode} />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">Install: pip install agentbeat</p>
            </div>

            {/* cURL */}
            <div className="mb-4">
              <span className="text-sm font-semibold text-gray-700 block mb-2">HTTP API</span>
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs font-mono overflow-x-auto">
                  {curlCode}
                </pre>
                <div className="absolute top-2 right-2">
                  <CopyButton text={curlCode} />
                </div>
              </div>
            </div>

            {/* Bash one-liner */}
            <div className="mb-6">
              <span className="text-sm font-semibold text-gray-700 block mb-2">Cron Job / Shell Script</span>
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs font-mono overflow-x-auto">
                  {bashCode}
                </pre>
                <div className="absolute top-2 right-2">
                  <CopyButton text={bashCode} />
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-emerald hover:bg-emerald-dark text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald/20"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Create Agent</h2>
          <p className="text-sm text-gray-500 mb-6">
            Register a new agent to start monitoring.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="My Trading Bot"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald/50 focus:border-emerald"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="my-trading-bot"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald/50 focus:border-emerald"
              />
              <p className="text-xs text-gray-400 mt-1">Used in API endpoints: /a/{slug}/heartbeat</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Trades NIFTY futures using RL"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald/50 focus:border-emerald"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expected interval <span className="text-gray-400">(seconds, optional)</span>
              </label>
              <input
                type="number"
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                placeholder="60"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald/50 focus:border-emerald"
              />
              <p className="text-xs text-gray-400 mt-1">Alert if no heartbeat within this interval + grace period (5min default)</p>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 px-4 bg-emerald hover:bg-emerald-dark text-white rounded-xl text-sm font-semibold disabled:opacity-50 shadow-lg shadow-emerald/20"
              >
                {loading ? "Creating..." : "Create Agent"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [showCreate, setShowCreate] = useState(false);
  const { data: overview, isLoading, refetch } = useFetch<DashboardOverview>(
    useCallback(() => getDashboardOverview(), []),
    [],
    { refreshInterval: 30000 }
  );

  const agents = overview?.agents || [];
  const summary = overview?.summary;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Welcome header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor your AI agents in real-time
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-5 py-2.5 bg-emerald hover:bg-emerald-dark text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-emerald/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Agent
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
              <div className="h-8 bg-gray-200 rounded w-12" />
            </div>
          ))}
        </div>
      ) : summary ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard
            label="Total Agents"
            value={summary.total}
            borderClass="stat-card-blue"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
          />
          <StatCard
            label="Healthy"
            value={summary.healthy}
            color="text-green-600"
            borderClass="stat-card-green"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            }
          />
          <StatCard
            label="Failing"
            value={summary.failing}
            color="text-red-600"
            borderClass="stat-card-red"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
          />
          <StatCard
            label="Silent"
            value={summary.silent}
            color="text-amber-600"
            borderClass="stat-card-amber"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            }
          />
          <StatCard
            label="Total Cost"
            value={formatCost(overview?.total_cost || 0)}
            borderClass="stat-card-purple"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>
      ) : null}

      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Agents</h2>
        <span className="text-sm text-gray-400">{agents.length} total</span>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse"
            >
              <div className="h-5 bg-gray-200 rounded w-32 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-48 mb-4" />
              <div className="h-3 bg-gray-200 rounded w-24" />
            </div>
          ))}
        </div>
      ) : agents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No agents yet"
          description="Create your first agent to start monitoring."
        />
      )}

      {showCreate && (
        <CreateAgentModal
          onClose={() => setShowCreate(false)}
          onCreated={() => refetch()}
        />
      )}
    </div>
  );
}
