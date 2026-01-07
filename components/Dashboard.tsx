"use client";

import React, { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY ?? "";

type UsageInfo = {
  api_key: string;
  plan: string;
  plan_display_name: string;
  limit_per_minute: number;
  limit_per_month: number;
  used_minute: number;
  used_month: number;
  remaining_minute: number;
  remaining_month: number;
};

export default function Dashboard() {
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetchUsage();
    // refresh every 15s while dashboard open
    const id = setInterval(fetchUsage, 15000);
    return () => clearInterval(id);
  }, []);

  async function fetchUsage() {
    if (!API_URL) {
      setErr("Frontend not configured with NEXT_PUBLIC_API_URL");
      return;
    }
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`${API_URL.replace(/\/$/, "")}/usage/public`, {
        headers: {
          ...(API_KEY ? { "x-api-key": API_KEY } : {}),
        },
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setUsage(data);
    } catch (e: any) {
      console.error(e);
      setErr(e?.message || "Failed to fetch usage");
    } finally {
      setLoading(false);
    }
  }

  if (!API_URL) {
    return (
      <div className="p-4 bg-yellow-50 border rounded">
        No API URL configured (set NEXT_PUBLIC_API_URL in Vercel)
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded shadow">
      <h3 className="text-lg font-bold mb-3">Account & Usage</h3>

      {loading && <div className="text-sm text-gray-500">Loading…</div>}

      {err && (
        <div className="p-2 bg-red-50 text-red-700 rounded mb-4">{err}</div>
      )}

      {!usage && !loading && (
        <div className="text-sm text-gray-600">No usage data yet.</div>
      )}

      {usage && (
        <>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-gray-500">Plan</div>
              <div className="text-lg font-semibold">{usage.plan_display_name}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">API Key</div>
              <div className="font-mono text-xs">{usage.api_key}</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">Minute window</div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full bg-indigo-500"
                style={{
                  width: `${Math.min(
                    (usage.used_minute / usage.limit_per_minute) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {usage.used_minute} / {usage.limit_per_minute} calls this minute
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">Monthly</div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full bg-emerald-500"
                style={{
                  width: `${Math.min(
                    (usage.used_month / usage.limit_per_month) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {usage.used_month} / {usage.limit_per_month} calls this month
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1 rounded bg-indigo-600 text-white text-sm"
            >
              Refresh
            </button>

            <button
              onClick={() =>
                alert("Upgrade flow coming soon — Stripe integration pending.")
              }
              className="px-3 py-1 rounded bg-amber-50 border border-amber-200 text-amber-800 text-sm"
            >
              Upgrade plan
            </button>
          </div>
        </>
      )}
    </div>
  );
}
