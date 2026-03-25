const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8092";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const apiKey =
    typeof window !== "undefined"
      ? localStorage.getItem("agentbeat_api_key")
      : null;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey || "",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new ApiError(text || res.statusText, res.status);
  }

  return res.json() as Promise<T>;
}

// Auth
export interface SyncUserResponse {
  api_key: string;
  id: string;
}

export function syncUser(email: string, name: string) {
  return apiFetch<SyncUserResponse>("/api/auth/sync", {
    method: "POST",
    body: JSON.stringify({ email, name }),
  });
}

// Agents — matches backend model.Agent
export interface Agent {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  token: string;
  description: string;
  tags: string[];
  expected_interval_secs: number | null;
  grace_secs: number;
  budget_limit_usd: number | null;
  budget_window: string;
  budget_spent_usd: number;
  budget_window_start: string | null;
  status: "healthy" | "degraded" | "failing" | "silent" | "new";
  last_run_at: string | null;
  next_expected: string | null;
  created_at: string;
}

export interface DashboardOverview {
  agents: Agent[];
  summary: {
    total: number;
    healthy: number;
    degraded: number;
    failing: number;
    silent: number;
    new: number;
  };
  total_cost: number;
}

export function getAgents() {
  return apiFetch<Agent[]>("/api/agents");
}

export function getAgent(id: string) {
  return apiFetch<Agent>(`/api/agents/${id}`);
}

export function getDashboardOverview() {
  return apiFetch<DashboardOverview>("/api/dashboard/overview");
}

// Runs — matches backend model.Run
export interface Run {
  id: string;
  agent_id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  duration_ms: number | null;
  exit_code: number | null;
  items_processed: number | null;
  items_failed: number | null;
  error_message: string | null;
  error_count: number;
  cost: number | null;
  tokens_input: number | null;
  tokens_output: number | null;
  model: string | null;
  confidence: number | null;
  metadata: Record<string, unknown> | null;
  source_ip: string;
  sdk_version: string;
}

export interface Step {
  id: string;
  run_id: string;
  agent_id: string;
  name: string;
  seq: number;
  status: string;
  started_at: string;
  completed_at: string | null;
  duration_ms: number | null;
  cost: number | null;
  tokens_input: number | null;
  tokens_output: number | null;
  model: string | null;
  error_message: string | null;
  metadata: Record<string, unknown> | null;
}

export function getAgentRuns(agentId: string, limit = 50) {
  return apiFetch<Run[]>(`/api/agents/${agentId}/runs?limit=${limit}`);
}

export function getRunSteps(runId: string) {
  return apiFetch<{ run: Run; steps: Step[] }>(`/api/agents/_/runs/${runId}`);
}

// Incidents — matches backend model.Incident
export interface Incident {
  id: string;
  agent_id: string;
  type: string;
  started_at: string;
  resolved_at: string | null;
  duration_secs: number | null;
  alert_sent: boolean;
  details: Record<string, unknown>;
  agent_name?: string;
}

export function getAgentIncidents(agentId: string) {
  return apiFetch<Incident[]>(`/api/agents/${agentId}/incidents`);
}

// Daily stats — matches backend model.DailyStat
export interface DailyStat {
  agent_id: string;
  day: string;
  total_runs: number;
  completed_runs: number;
  failed_runs: number;
  total_cost_usd: number;
  total_tokens_in: number;
  total_tokens_out: number;
  avg_duration_ms: number | null;
  p95_duration_ms: number | null;
  avg_confidence: number | null;
  items_processed: number;
  items_failed: number;
}

export function getAgentDailyStats(agentId: string, days = 30) {
  return apiFetch<DailyStat[]>(`/api/agents/${agentId}/stats?days=${days}`);
}

// Alert channels
export interface AlertChannel {
  id: string;
  user_id: string;
  type: "email" | "telegram" | "slack" | "webhook";
  config: Record<string, string>;
  enabled: boolean;
  created_at: string;
}

export function getAlertChannels() {
  return apiFetch<AlertChannel[]>("/api/alert-channels");
}

export function createAlertChannel(data: {
  type: string;
  config: Record<string, string>;
}) {
  return apiFetch<AlertChannel>("/api/alert-channels", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteAlertChannel(id: string) {
  return apiFetch<void>(`/api/alert-channels/${id}`, {
    method: "DELETE",
  });
}
