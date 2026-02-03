"use client";

import Link from "next/link";
import CTAHeader from "../components/CTAHeader";

const endpoints = [
  {
    method: "POST",
    path: "/parse/ai",
    description: "Parse a resume PDF using AI-powered analysis",
    details: "Upload a PDF resume and get structured JSON with quality scoring and ATS compatibility analysis. Achieves 95% accuracy using Claude AI.",
  },
  {
    method: "GET",
    path: "/rate-limit/check",
    description: "Check your current rate limit status",
    details: "Returns your remaining parses for the current hour and month, along with your rate limit window.",
  },
  {
    method: "GET",
    path: "/usage/public",
    description: "Get public usage statistics",
    details: "Returns general usage stats for the API without requiring authentication.",
  },
];

export default function ApiInfoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <CTAHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 mb-6">
            <span className="text-indigo-600 text-sm font-semibold">📄 API Documentation</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900">
            Resumify <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">API</span>
          </h1>
          <p className="text-gray-500 text-lg mt-3 max-w-2xl mx-auto">
            A powerful, AI-driven resume parsing API. Integrate resume parsing into your app in minutes.
          </p>
        </div>

        {/* Base URL */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-10">
          <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-2">Base URL</p>
          <code className="text-indigo-600 font-mono text-base">https://api.resumifyapi.com</code>
        </div>

        {/* Endpoints */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Endpoints</h2>
        <div className="space-y-4 mb-14">
          {endpoints.map((ep, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${ep.method === "POST" ? "bg-indigo-100 text-indigo-700" : "bg-emerald-100 text-emerald-700"}`}>
                  {ep.method}
                </span>
                <code className="font-mono text-sm text-gray-800">{ep.path}</code>
              </div>
              <div className="px-6 py-4">
                <p className="text-sm font-semibold text-gray-800">{ep.description}</p>
                <p className="text-sm text-gray-500 mt-1">{ep.details}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Auth */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-10">
          <h3 className="text-sm font-bold text-amber-800 mb-2">🔐 Authentication</h3>
          <p className="text-sm text-amber-700">
            Paid plans require an API key passed via the <code className="bg-amber-100 px-1.5 py-0.5 rounded text-amber-800">Authorization</code> header:
          </p>
          <code className="block mt-3 bg-amber-100 text-amber-800 text-sm font-mono px-4 py-2 rounded-lg">
            Authorization: Bearer your_api_key_here
          </code>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-gray-500 mb-4">Ready to start building?</p>
          <div className="flex justify-center gap-4">
            <Link href="/" className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold text-sm hover:opacity-90 transition shadow-md">
              Try it Free
            </Link>
            <Link href="/pricing" className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition shadow-sm">
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}