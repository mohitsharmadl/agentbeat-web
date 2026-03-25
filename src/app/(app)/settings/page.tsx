"use client";

import { useState, useCallback } from "react";
import {
  getAlertChannels,
  createAlertChannel,
  deleteAlertChannel,
  generateTelegramLink,
  createCheckout,
  getCustomerPortal,
} from "@/lib/api";
import type { AlertChannel } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useFetch } from "@/lib/hooks";
import { maskToken, cn } from "@/lib/utils";
import CopyButton from "@/components/CopyButton";
import EmptyState from "@/components/EmptyState";

const CHANNEL_TYPES = ["email", "telegram", "slack", "webhook"] as const;

const CONFIG_FIELDS: Record<string, { label: string; placeholder: string }[]> = {
  email: [{ label: "Email Address", placeholder: "alerts@company.com" }],
  telegram: [
    { label: "Bot Token", placeholder: "123456:ABC-DEF..." },
    { label: "Chat ID", placeholder: "123456789" },
  ],
  slack: [{ label: "Webhook URL", placeholder: "https://hooks.slack.com/..." }],
  webhook: [
    { label: "URL", placeholder: "https://api.example.com/webhook" },
    { label: "Secret (optional)", placeholder: "whsec_..." },
  ],
};

function configKeys(type: string): string[] {
  switch (type) {
    case "email":
      return ["email"];
    case "telegram":
      return ["bot_token", "chat_id"];
    case "slack":
      return ["webhook_url"];
    case "webhook":
      return ["url", "secret"];
    default:
      return [];
  }
}

function configPreview(channel: AlertChannel): string {
  const vals = Object.values(channel.config);
  if (vals.length === 0) return "-";
  const first = vals[0];
  if (first.length > 30) return first.slice(0, 30) + "...";
  return first;
}

export default function SettingsPage() {
  const { apiKey } = useAuth();
  const {
    data: channels,
    refetch,
  } = useFetch<AlertChannel[]>(
    useCallback(() => getAlertChannels(), []),
    []
  );

  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<string>("email");
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleToggle = async (_id: string, _enabled: boolean) => {
    // Toggle not supported yet — delete and recreate instead
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this alert channel?")) return;
    try {
      await deleteAlertChannel(id);
      refetch();
    } catch {
      // silently fail
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    const keys = configKeys(formType);
    const config: Record<string, string> = {};
    keys.forEach((key, i) => {
      config[key] = formValues[`field_${i}`] || "";
    });

    try {
      await createAlertChannel({ type: formType, config });
      setShowForm(false);
      setFormValues({});
      refetch();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create channel");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage alert channels and API access
        </p>
      </div>

      {/* API Key */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8">
        <h2 className="text-sm font-medium text-gray-700 mb-3">API Key</h2>
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
          <code className="text-sm font-mono text-gray-600 flex-1 truncate">
            {apiKey ? maskToken(apiKey) : "No API key"}
          </code>
          {apiKey && <CopyButton text={apiKey} />}
        </div>
      </div>

      {/* Plan & Billing */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8">
        <h2 className="text-sm font-medium text-gray-700 mb-3">Plan</h2>
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald/10 text-emerald-700">
            FREE
          </span>
          <span className="text-sm text-gray-500">3 agents, unlimited runs</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={async () => {
              try {
                const res = await createCheckout("PRO");
                window.location.href = res.checkout_url;
              } catch {
                alert("Billing not available yet. Coming soon!");
              }
            }}
            className="px-4 py-3 border border-gray-200 rounded-lg text-left hover:border-emerald-300 transition-colors"
          >
            <div className="font-semibold text-gray-900">Pro — $19/mo</div>
            <div className="text-xs text-gray-500 mt-1">100 agents, all alert channels, 30-day retention</div>
          </button>
          <button
            onClick={async () => {
              try {
                const res = await createCheckout("BUSINESS");
                window.location.href = res.checkout_url;
              } catch {
                alert("Billing not available yet. Coming soon!");
              }
            }}
            className="px-4 py-3 border border-gray-200 rounded-lg text-left hover:border-emerald-300 transition-colors"
          >
            <div className="font-semibold text-gray-900">Business — $49/mo</div>
            <div className="text-xs text-gray-500 mt-1">500 agents, team access, 90-day retention</div>
          </button>
        </div>
      </div>

      {/* Quick Connect */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8">
        <h2 className="text-sm font-medium text-gray-700 mb-3">Quick Connect</h2>
        <p className="text-sm text-gray-500 mb-4">Connect your Telegram account to receive alerts instantly.</p>
        <button
          onClick={async () => {
            try {
              const res = await generateTelegramLink();
              window.open(res.bot_url, "_blank");
            } catch {
              alert("Failed to generate link. Please try again.");
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2AABEE] text-white rounded-lg text-sm font-medium hover:bg-[#229ED9] transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.2-.04-.28-.02-.12.02-1.98 1.26-5.59 3.7-.53.36-1.01.54-1.43.53-.47-.01-1.38-.27-2.05-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.74 3.99-1.74 6.65-2.89 7.99-3.44 3.8-1.58 4.59-1.86 5.1-1.87.11 0 .37.03.54.17.14.12.18.28.2.46-.01.06.01.24 0 .38z"/>
          </svg>
          Connect Telegram
        </button>
      </div>

      {/* Alert Channels */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-gray-700">Alert Channels</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-emerald text-white hover:bg-emerald-dark transition-colors"
          >
            {showForm ? "Cancel" : "Add Channel"}
          </button>
        </div>

        {/* Add form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Channel Type
              </label>
              <select
                value={formType}
                onChange={(e) => {
                  setFormType(e.target.value);
                  setFormValues({});
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald/50 focus:border-emerald"
              >
                {CHANNEL_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {CONFIG_FIELDS[formType]?.map((field, i) => (
              <div key={i}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <input
                  type="text"
                  required={!field.label.includes("optional")}
                  value={formValues[`field_${i}`] || ""}
                  onChange={(e) =>
                    setFormValues({ ...formValues, [`field_${i}`]: e.target.value })
                  }
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald/50 focus:border-emerald"
                />
              </div>
            ))}

            {formError && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={formLoading}
              className="px-4 py-2 bg-emerald text-white rounded-lg text-sm font-medium hover:bg-emerald-dark transition-colors disabled:opacity-50"
            >
              {formLoading ? "Creating..." : "Create Channel"}
            </button>
          </form>
        )}

        {/* Channel list */}
        {channels && channels.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {channels.map((channel) => (
              <div
                key={channel.id}
                className="flex items-center justify-between py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                      channel.type === "email"
                        ? "bg-blue-100 text-blue-700"
                        : channel.type === "telegram"
                        ? "bg-sky-100 text-sky-700"
                        : channel.type === "slack"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-700"
                    )}
                  >
                    {channel.type}
                  </span>
                  <span className="text-sm text-gray-600">
                    {configPreview(channel)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(channel.id, channel.enabled)}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      channel.enabled ? "bg-emerald" : "bg-gray-300"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        channel.enabled ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </button>
                  <button
                    onClick={() => handleDelete(channel.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No alert channels"
            description="Add an alert channel to get notified when your agents have issues."
          />
        )}
      </div>
    </div>
  );
}
