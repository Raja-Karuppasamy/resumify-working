"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Generate or fetch API key (for now, using user ID as placeholder)
    if (user) {
      // In production, this should be a proper API key from your backend
      setApiKey(`rfy_${user.id.slice(0, 20)}`);
    }
  }, [user]);

  const handleCopy = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center">
        <div className="text-indigo-600 text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const usagePercentage = profile.subscription_tier === "free" 
    ? (profile.usage_count / 20) * 100
    : profile.subscription_tier === "pro"
    ? (profile.usage_count / 100) * 100
    : (profile.usage_count / 500) * 100;

  const maxParses = profile.subscription_tier === "free" 
    ? 20 
    : profile.subscription_tier === "pro" 
    ? 100 
    : 500;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Resumify</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium">Home</Link>
            <Link href="/pricing" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium">Pricing</Link>
            <Link href="/api-info" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium">API Docs</Link>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium"
            >
              Sign Out
            </button>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {profile.email}</p>
        </div>

        <div className="grid gap-6">
          {/* API Key Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Your API Key</h2>
              <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700">
                {profile.subscription_tier}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Use this key to authenticate your API requests. Keep it secure and never share it publicly.
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm text-gray-800 select-all">
                {apiKey}
              </code>
              <button
                onClick={handleCopy}
                className="px-4 py-3 bg-indigo-50 text-indigo-600 rounded-lg font-semibold text-sm hover:bg-indigo-100 transition"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Usage Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Usage This Month</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Parses used</span>
                  <span className="font-semibold text-gray-900">
                    {profile.usage_count} / {maxParses}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Resets on {new Date(profile.usage_reset_date).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Subscription Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900 capitalize">{profile.subscription_tier} Plan</p>
                <p className="text-sm text-gray-500 mt-1">
                  {profile.subscription_tier === "free" ? "20 parses per month" : 
                   profile.subscription_tier === "pro" ? "100 parses per month" : 
                   "500 parses per month"}
                </p>
              </div>
              {profile.subscription_tier === "free" && (
                <Link
                  href="/pricing"
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold text-sm hover:opacity-90 transition shadow-md"
                >
                  Upgrade
                </Link>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/"
                className="px-4 py-3 bg-indigo-50 text-indigo-600 rounded-lg font-medium text-sm hover:bg-indigo-100 transition text-center"
              >
                Try Parser
              </Link>
              <Link
                href="/api-info"
                className="px-4 py-3 bg-indigo-50 text-indigo-600 rounded-lg font-medium text-sm hover:bg-indigo-100 transition text-center"
              >
                API Docs
              </Link>
              <Link
                href="/pricing"
                className="px-4 py-3 bg-indigo-50 text-indigo-600 rounded-lg font-medium text-sm hover:bg-indigo-100 transition text-center"
              >
                View Pricing
              </Link>
              <a
                href="mailto:support@resumifyapi.com"
                className="px-4 py-3 bg-indigo-50 text-indigo-600 rounded-lg font-medium text-sm hover:bg-indigo-100 transition text-center"
              >
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}