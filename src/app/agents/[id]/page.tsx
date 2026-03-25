"use client";

import { use, useState, useCallback } from "react";
import Link from "next/link";
import {
  getAgent,
  getAgentRuns,
  getAgentDailyStats,
  getAgentIncidents,
  getRunSteps,
} from "@/lib/api";
import type { Agent, Run, Step, DailyStat, Incident } from "@/lib/api";
import { useFetch } from "@/lib/hooks";
import {
  relativeTime,
  formatDuration,
  formatCost,
  maskToken,
  cn,
} from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";
import CopyButton from "@/components/CopyButton";
import EmptyState from "@/components/EmptyState";

type Tab = "runs" | "stats" | "incidents";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8092";

function RunRow({ run }: { run: Run }) {
  const [expanded, setExpanded] = useState(false);
  const [steps, setSteps] = useState<Step[] | null>(null);
  const [stepsLoading, setStepsLoading] = useState(false);

  const toggleExpand = async () => {
    if (expanded) {
      setExpanded(false);
      return;
    }
    setExpanded(true);
    if (!steps) {
      setStepsLoading(true);
      try {
        const data = await getRunSteps(run.id);
        setSteps(data);
      } catch {
        setSteps([]);
      } finally {
        setStepsLoading(false);
      }
    }
  };

  const statusColors: Record<string, string> = {
    success: "bg-green-100 text-green-800",
    failure: "bg-red-100 text-red-800",
    partial: "bg-yellow-100 text-yellow-800",
    timeout: "bg-orange-100 text-orange-800",
  };

  return (
    <>
      <tr
        onClick={toggleExpand}
        className="hover:bg-gray-50 cursor-pointer transition-colors"
      >
        <td className="px-4 py-3 text-sm">
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
              statusColors[run.status] || "bg-gray-100 text-gray-600"
            )}
          >
            {run.status}
          </span>
        </td>
        <td className="px-4 py-3 text-sm text-gray-600">
          {relativeTime(run.started_at)}
        </td>
        <td className="px-4 py-3 text-sm text-gray-600">
          {formatDuration(run.duration_ms)}
        </td>
        <td className="px-4 py-3 text-sm text-gray-600">
          {run.items_processed ?? "-"}
        </td>
        <td className="px-4 py-3 text-sm text-gray-600">
          {formatCost(run.cost)}
        </td>
        <td className="px-4 py-3 text-sm text-gray-600 font-mono text-xs">
          {run.model || "-"}
        </td>
        <td className="px-4 py-3 text-sm text-gray-600">
          {run.confidence !== null ? `${(run.confidence * 100).toFixed(0)}%` : "-"}
        </td>
        <td className="px-4 py-3 text-sm text-gray-400">
          <svg
            className={cn(
              "w-4 h-4 transition-transform",
              expanded && "rotate-180"
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={8} className="px-4 py-3 bg-gray-50">
            {stepsLoading ? (
              <div className="text-sm text-gray-500 py-2">Loading steps...</div>
            ) : steps && steps.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Steps
                </p>
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-4 text-sm bg-white rounded-lg px-4 py-2 border border-gray-100"
                  >
                    <span className="text-gray-400 font-mono text-xs w-6">
                      #{step.step_number}
                    </span>
                    <span className="font-medium text-gray-700 flex-1">
                      {step.name}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs capitalize",
                        step.status === "success"
                          ? "bg-green-100 text-green-700"
                          : step.status === "failure"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-600"
                      )}
                    >
                      {step.status}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {formatDuration(step.duration_ms)}
                    </span>
                    {step.cost !== null && (
                      <span className="text-gray-500 text-xs">
                        {formatCost(step.cost)}
                      </span>
                    )}
                    {step.model && (
                      <span className="text-gray-400 font-mono text-xs">
                        {step.model}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 py-2">No steps recorded</p>
            )}
            {run.error_message && (
              <div className="mt-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                <p className="text-xs font-medium text-red-700 mb-1">Error</p>
                <p className="text-sm text-red-600 font-mono">
                  {run.error_message}
                </p>
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

function BarChart({
  data,
  dataKey,
  label,
  color,
}: {
  data: DailyStat[];
  dataKey: "runs" | "cost" | "failures";
  label: string;
  color: string;
}) {
  if (data.length === 0) return null;

  const values = data.map((d) => d[dataKey]);
  const max = Math.max(...values, 1);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-medium text-gray-700 mb-4">{label}</h3>
      <div className="flex items-end gap-1 h-32">
        {data.map((d) => {
          const height = (d[dataKey] / max) * 100;
          return (
            <div
              key={d.date}
              className="flex-1 flex flex-col items-center gap-1 group relative"
            >
              <div
                className="w-full rounded-t transition-all"
                style={{
                  height: `${Math.max(height, 2)}%`,
                  backgroundColor: color,
                  opacity: 0.8,
                }}
              />
              <div className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                {d.date}: {dataKey === "cost" ? formatCost(d[dataKey]) : d[dataKey]}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <span>{data[0]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
}

export default function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [tab, setTab] = useState<Tab>("runs");

  const { data: agent, isLoading: agentLoading } = useFetch<Agent>(
    useCallback(() => getAgent(id), [id]),
    [id]
  );
  const { data: runs } = useFetch<Run[]>(
    useCallback(() => getAgentRuns(id), [id]),
    [id]
  );
  const { data: dailyStats } = useFetch<DailyStat[]>(
    useCallback(() => getAgentDailyStats(id), [id]),
    [id]
  );
  const { data: incidents } = useFetch<Incident[]>(
    useCallback(() => getAgentIncidents(id), [id]),
    [id]
  );

  if (agentLoading) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-96 mb-8" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <EmptyState title="Agent not found" description="This agent does not exist or you don't have access." />
      </div>
    );
  }

  const curlSnippet = `curl -X POST ${API_URL}/api/agents/${agent.slug}/runs \\
  -H "Authorization: Bearer ${agent.token}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "status": "success",
    "duration_ms": 1500,
    "items_processed": 42,
    "cost": 0.0023,
    "model": "gpt-4o",
    "confidence": 0.95
  }'`;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-emerald transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-gray-900">{agent.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{agent.name}</h1>
            <StatusBadge status={agent.status} size="md" />
          </div>
          {agent.description && (
            <p className="text-gray-500">{agent.description}</p>
          )}
        </div>
      </div>

      {/* Config + Token */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Configuration</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Expected Interval</dt>
              <dd className="font-medium">{agent.expected_interval_minutes} min</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Grace Period</dt>
              <dd className="font-medium">{agent.grace_period_minutes} min</dd>
            </div>
            {agent.budget_limit && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Budget Limit</dt>
                <dd className="font-medium">
                  {formatCost(agent.budget_limit)} / {agent.budget_window}
                </dd>
              </div>
            )}
            {agent.max_cost_per_run && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Max Cost/Run</dt>
                <dd className="font-medium">{formatCost(agent.max_cost_per_run)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-gray-500">Last Run</dt>
              <dd className="font-medium">{relativeTime(agent.last_run_at)}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Agent Token</h3>
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 mb-4">
            <code className="text-sm font-mono text-gray-600 flex-1 truncate">
              {maskToken(agent.token)}
            </code>
            <CopyButton text={agent.token} />
          </div>

          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Integration
          </h3>
          <div className="relative">
            <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs font-mono overflow-x-auto">
              {curlSnippet}
            </pre>
            <div className="absolute top-2 right-2">
              <CopyButton text={curlSnippet} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-6">
          {(["runs", "stats", "incidents"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "pb-3 text-sm font-medium capitalize transition-colors border-b-2",
                tab === t
                  ? "border-emerald text-emerald"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              {t}
              {t === "incidents" && incidents && incidents.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-red-100 text-red-700">
                  {incidents.filter((i) => !i.resolved_at).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {tab === "runs" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {runs && runs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Started
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Duration
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Items
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Cost
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Model
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Confidence
                    </th>
                    <th className="px-4 py-3 w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {runs.map((run) => (
                    <RunRow key={run.id} run={run} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No runs yet"
              description="This agent hasn't reported any runs. Use the integration code above to send your first run."
            />
          )}
        </div>
      )}

      {tab === "stats" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dailyStats && dailyStats.length > 0 ? (
            <>
              <BarChart
                data={dailyStats}
                dataKey="runs"
                label="Runs per Day"
                color="#10b981"
              />
              <BarChart
                data={dailyStats}
                dataKey="cost"
                label="Cost per Day"
                color="#6366f1"
              />
              <BarChart
                data={dailyStats}
                dataKey="failures"
                label="Failures per Day"
                color="#ef4444"
              />
            </>
          ) : (
            <div className="col-span-2">
              <EmptyState
                title="No stats yet"
                description="Stats will appear once the agent has been running for at least a day."
              />
            </div>
          )}
        </div>
      )}

      {tab === "incidents" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {incidents && incidents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Started
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Resolved
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {incidents.map((incident) => (
                    <tr key={incident.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          {incident.type.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {relativeTime(incident.started_at)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {incident.resolved_at ? (
                          relativeTime(incident.resolved_at)
                        ) : (
                          <span className="text-red-600 font-medium">Ongoing</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                        {incident.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No incidents"
              description="No incidents have been recorded for this agent. That's a good thing!"
            />
          )}
        </div>
      )}
    </div>
  );
}
