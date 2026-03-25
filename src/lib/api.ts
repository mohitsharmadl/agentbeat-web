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
  user_id: string;
}

export function syncUser(email: string, name: string) {
  return apiFetch<SyncUserResponse>("/api/auth/sync", {
    method: "POST",
    body: JSON.stringify({ email, name }),
  });
}

// Agents
export interface Agent {
  id: string;
  user_id: string;
  name: string;
  description: string;
  slug: string;
  token: string;
  status: "healthy" | "degraded" | "failing" | "silent" | "new";
  expected_interval_minutes: number;
  grace_period_minutes: number;
  max_cost_per_run: number | null;
  budget_limit: number | null;
  budget_window: string | null;
  tags: string[];
  last_run_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AgentStats {
  total: number;
  healthy: number;
  failing: number;
  silent: number;
  degraded: number;
  new_count: number;
  total_cost: number;
}

export function getAgents() {
  return apiFetch<Agent[]>("/api/agents");
}

export function getAgent(id: string) {
  return apiFetch<Agent>(`/api/agents/${id}`);
}

export function getAgentStats() {
  return apiFetch<AgentStats>("/api/agents/stats");
}

// Runs
export interface Run {
  id: string;
  agent_id: string;
  status: "success" | "failure" | "partial" | "timeout";
  started_at: string;
  ended_at: string | null;
  duration_ms: number | null;
  items_processed: number | null;
  cost: number | null;
  model: string | null;
  confidence: number | null;
  error_message: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface Step {
  id: string;
  run_id: string;
  step_number: number;
  name: string;
  status: "success" | "failure" | "skipped";
  started_at: string;
  ended_at: string | null;
  duration_ms: number | null;
  input_tokens: number | null;
  output_tokens: number | null;
  cost: number | null;
  model: string | null;
  error_message: string | null;
  created_at: string;
}

export function getAgentRuns(agentId: string, limit = 50) {
  return apiFetch<Run[]>(`/api/agents/${agentId}/runs?limit=${limit}`);
}

export function getRunSteps(runId: string) {
  return apiFetch<Step[]>(`/api/runs/${runId}/steps`);
}

// Incidents
export interface Incident {
  id: string;
  agent_id: string;
  type: "missing_run" | "budget_exceeded" | "consecutive_failures" | "low_confidence";
  started_at: string;
  resolved_at: string | null;
  details: string;
  created_at: string;
}

export function getAgentIncidents(agentId: string) {
  return apiFetch<Incident[]>(`/api/agents/${agentId}/incidents`);
}

// Daily stats
export interface DailyStat {
  date: string;
  runs: number;
  cost: number;
  failures: number;
}

export function getAgentDailyStats(agentId: string, days = 30) {
  return apiFetch<DailyStat[]>(
    `/api/agents/${agentId}/stats/daily?days=${days}`
  );
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

export function toggleAlertChannel(id: string, enabled: boolean) {
  return apiFetch<AlertChannel>(`/api/alert-channels/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ enabled }),
  });
}

export function deleteAlertChannel(id: string) {
  return apiFetch<void>(`/api/alert-channels/${id}`, {
    method: "DELETE",
  });
}
