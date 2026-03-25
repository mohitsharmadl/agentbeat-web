export function relativeTime(dateStr: string | null): string {
  if (!dateStr) return "Never";

  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 10) return "just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 30) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

export function formatDuration(ms: number | null): string {
  if (ms === null) return "-";
  if (ms < 1000) return `${ms}ms`;
  const sec = ms / 1000;
  if (sec < 60) return `${sec.toFixed(1)}s`;
  const min = Math.floor(sec / 60);
  const remSec = Math.floor(sec % 60);
  return `${min}m ${remSec}s`;
}

export function formatCost(cost: number | null | undefined): string {
  if (cost === null || cost === undefined) return "-";
  return `$${cost.toFixed(4)}`;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function maskToken(token: string): string {
  if (token.length <= 8) return "****";
  return token.slice(0, 4) + "****" + token.slice(-4);
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function statusColor(status: string): {
  bg: string;
  text: string;
  dot: string;
} {
  switch (status) {
    case "healthy":
      return {
        bg: "bg-green-100",
        text: "text-green-800",
        dot: "bg-green-500",
      };
    case "degraded":
      return {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        dot: "bg-yellow-500",
      };
    case "failing":
      return { bg: "bg-red-100", text: "text-red-800", dot: "bg-red-500" };
    case "silent":
      return { bg: "bg-red-100", text: "text-red-800", dot: "bg-red-500" };
    case "new":
      return {
        bg: "bg-gray-100",
        text: "text-gray-800",
        dot: "bg-gray-400",
      };
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-600",
        dot: "bg-gray-400",
      };
  }
}

export function runStatusColor(status: string): {
  bg: string;
  text: string;
} {
  switch (status) {
    case "success":
      return { bg: "bg-green-100", text: "text-green-800" };
    case "failure":
      return { bg: "bg-red-100", text: "text-red-800" };
    case "partial":
      return { bg: "bg-yellow-100", text: "text-yellow-800" };
    case "timeout":
      return { bg: "bg-orange-100", text: "text-orange-800" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-600" };
  }
}
