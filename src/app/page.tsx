"use client";

import Link from "next/link";
import { getDashboardOverview } from "@/lib/api";
import type { Agent, DashboardOverview } from "@/lib/api";
import { useFetch } from "@/lib/hooks";
import { relativeTime, formatCost, cn } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { useCallback } from "react";

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className={cn("text-2xl font-bold mt-1", color || "text-gray-900")}>
        {value}
      </p>
    </div>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <Link
      href={`/agent?id=${agent.id}`}
      className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-emerald-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{agent.name}</h3>
          {agent.description && (
            <p className="text-sm text-gray-500 mt-0.5 truncate">
              {agent.description}
            </p>
          )}
        </div>
        <StatusBadge status={agent.status} />
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Last run: {agent.last_run_at ? relativeTime(agent.last_run_at) : "Never"}</span>
        {agent.expected_interval_secs && (
          <span>Every {agent.expected_interval_secs}s</span>
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

export default function DashboardPage() {
  const { data: overview, isLoading } = useFetch<DashboardOverview>(
    useCallback(() => getDashboardOverview(), []),
    [],
    { refreshInterval: 30000 }
  );

  const agents = overview?.agents || [];
  const summary = overview?.summary;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor your AI agents in real-time
        </p>
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
          <StatCard label="Total Agents" value={summary.total} />
          <StatCard label="Healthy" value={summary.healthy} color="text-green-600" />
          <StatCard label="Failing" value={summary.failing} color="text-red-600" />
          <StatCard label="Silent" value={summary.silent} color="text-red-600" />
          <StatCard label="Total Cost" value={formatCost(overview?.total_cost || 0)} />
        </div>
      ) : null}

      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Agents</h2>
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
    </div>
  );
}
