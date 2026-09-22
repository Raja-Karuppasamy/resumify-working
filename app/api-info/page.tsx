"use client";

import Link from "next/link";
import CTAHeader from "../components/CTAHeader";

const endpoints = [
  {
    method: "POST",
    path: "/api/v1/parse",
    badge: "Core",
    description: "Parse a single resume (PDF / DOCX / TXT)",
    details: "Upload a resume file and receive 56-field structured JSON with ATS compatibility score, quality grade (A–F), per-field confidence scores, and full skills taxonomy. Powered by Claude AI — 92% overall confidence.",
  },
  {
    method: "POST",
    path: "/api/v1/parse/batch",
    badge: "Growth+",
    description: "Batch parse — upload a ZIP of resumes",
    details: "Upload a ZIP containing up to 50 PDFs or DOCXs. Returns a job_id immediately. Results delivered via webhook or polled via the batch status endpoint. Ideal for staffing agencies processing bulk applicant pools.",
  },
  {
    method: "GET",
    path: "/api/v1/batch/{job_id}/status",
    badge: "Growth+",
    description: "Poll batch job status",
    details: "Returns { job_id, status, total, completed, results[] } for a running or completed batch parse job.",
  },
  {
    method: "POST",
    path: "/api/v1/match",
    badge: "Startup+",
    description: "Match a resume against a Job Description",
    details: "Send a resume file + plain-text JD. Returns match_score (0–100), matched_skills[], missing_skills[], and a hire/no-hire recommendation. Critical for ATS platforms and agency screening workflows.",
  },
  {
    method: "POST",
    path: "/api/v1/webhooks",
    badge: "Startup+",
    description: "Register a webhook URL",
    details: "Register a URL to receive parsed JSON automatically after each parse completes. Events: parse.complete | batch.complete | parse.failed. Retries 3x with exponential backoff (5s → 30s → 5min).",
  },
  {
    method: "GET",
    path: "/api/v1/usage",
    badge: "All Plans",
    description: "Get current billing period usage",
    details: "Returns { parses_used, parses_limit, batch_jobs, reset_date, plan } for the authenticated API key.",
  },
  {
    method: "GET",
    path: "/rate-limit/check",
    badge: "All Plans",
    description: "Check your current rate limit status",
    details: "Returns remaining parses for the current window along with reset time. Use this to implement graceful backoff in your integration.",
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
            Resumify{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              API
            </span>
          </h1>
          <p className="text-gray-500 text-lg mt-3 max-w-2xl mx-auto">
            Resume Intelligence API — structured hiring data from any CV in under 200ms.
            Drop into your stack with a single API call.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {["⚡ <200ms", "🎯 92% Confidence", "✅ 56-field JSON", "🔒 GDPR-Ready"].map((b) => (
              <span
                key={b}
                className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100"
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Base URL */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-10">
          <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-2">Base URL</p>
          <code className="text-indigo-600 font-mono text-base">https://api.resumifyapi.com</code>
        </div>

        {/* Quickstart */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quickstart</h2>
          <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg">
            <div className="flex border-b border-gray-700 px-4 pt-3 gap-4">
              {["cURL", "Python", "Node.js"].map((tab) => (
                <span
                  key={tab}
                  className="text-xs font-semibold text-gray-400 pb-2 border-b-2 border-transparent first:text-indigo-400 first:border-indigo-400 cursor-pointer"
                >
                  {tab}
                </span>
              ))}
            </div>
            <pre className="text-sm text-green-300 font-mono p-6 overflow-x-auto leading-relaxed">
{`curl -X POST https://api.resumifyapi.com/api/v1/parse \\
  -H "Authorization: Bearer rfy_live_xxxxxxxxxxxx" \\
  -F "file=@resume.pdf"

# Response
{
  "success": true,
  "processing_ms": 187,
  "data": {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role_level": "Senior",
    "years_of_experience_total": 8,
    "skills": {
      "programming_languages": [
        { "raw_text": "TypeScript", "skill_id": "skill_typescript_v1", "confidence": 0.96 },
        { "raw_text": "NodeJS", "skill_id": "skill_nodejs_v1", "confidence": 0.94 }
      ]
    }
  },
  "ats_compatibility": { "score": 95, "verdict": "Excellent" },
  "quality_analysis": { "score": 82, "grade": "B" },
  "confidence": { "overall": 0.92 }
}`}
            </pre>
          </div>
        </div>

        {/* Skill Taxonomy */}
        <div className="mb-14">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Skill Taxonomy</h2>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <p className="text-sm text-gray-600 leading-relaxed">
              Every resume Resumify parses is mapped to a normalized skill taxonomy. Instead of returning raw
              extracted strings ("Node.js", "NodeJS", "Node" — all different text, same skill), every match
              resolves to a single stable <code className="bg-gray-100 px-1.5 py-0.5 rounded text-indigo-700 font-mono text-xs">skill_id</code>.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>
                <strong className="text-gray-800">Search stays consistent.</strong> Query by{" "}
                <code className="bg-gray-100 px-1 rounded text-xs font-mono">skill_id</code>, not fuzzy text
                matching, and get every candidate who has that skill — regardless of how they phrased it.
              </li>
              <li>
                <strong className="text-gray-800">Re-parses don't drift.</strong> If you re-parse a candidate's
                updated resume next year, the same skill still resolves to the same{" "}
                <code className="bg-gray-100 px-1 rounded text-xs font-mono">skill_id</code>. Your downstream
                tags, saved searches, and reports don't silently break.
              </li>
              <li>
                <strong className="text-gray-800">Versioned, not static.</strong> As the taxonomy evolves, IDs
                are versioned (<code className="bg-gray-100 px-1 rounded text-xs font-mono">_v1</code>,{" "}
                <code className="bg-gray-100 px-1 rounded text-xs font-mono">_v2</code>) so existing
                integrations aren't broken by taxonomy changes.
              </li>
              <li>
                <strong className="text-gray-800">Build on top of it.</strong> Key your own database, matching
                logic, and analytics directly to <code className="bg-gray-100 px-1 rounded text-xs font-mono">skill_id</code>{" "}
                instead of re-normalizing text on your end.
              </li>
            </ul>
            <p className="mt-4 text-xs text-gray-400">Included on all plans (Developer, Starter, Growth, Enterprise).</p>
          </div>
        </div>

        {/* Endpoints */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Endpoints</h2>
        <div className="space-y-4 mb-14">
          {endpoints.map((ep, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                    ep.method === "POST"
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {ep.method}
                </span>
                <code className="font-mono text-sm text-gray-800 flex-1">{ep.path}</code>
                {ep.badge && (
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      ep.badge === "Growth+"
                        ? "bg-purple-50 text-purple-700 border border-purple-100"
                        : ep.badge === "Startup+"
                        ? "bg-blue-50 text-blue-700 border border-blue-100"
                        : ep.badge === "Core"
                        ? "bg-green-50 text-green-700 border border-green-100"
                        : "bg-gray-50 text-gray-500 border border-gray-100"
                    }`}
                  >
                    {ep.badge}
                  </span>
                )}
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
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1">
              <h3 className="text-sm font-bold text-amber-800 mb-2">🔐 Authentication</h3>
              <p className="text-sm text-amber-700">
                Pass your API key via the{" "}
                <code className="bg-amber-100 px-1.5 py-0.5 rounded text-amber-800">
                  Authorization
                </code>{" "}
                header on every request. Free plan included — no card required.
              </p>
              <code className="block mt-3 bg-amber-100 text-amber-800 text-sm font-mono px-4 py-2 rounded-lg">
                Authorization: Bearer rfy_live_xxxxxxxxxxxx
              </code>
            </div>
            <Link
              href="/dashboard"
              className="flex-shrink-0 self-center px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700 transition"
            >
              Get API Key →
            </Link>
          </div>
        </div>

        {/* Error Codes */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-10">
          <h3 className="text-sm font-bold text-gray-800 mb-4">⚠️ Error Codes</h3>
          <div className="space-y-2">
            {[
              { code: "401", label: "INVALID_API_KEY",   desc: "Missing or invalid Authorization header" },
              { code: "413", label: "FILE_TOO_LARGE",    desc: "File exceeds 10MB limit" },
              { code: "422", label: "INVALID_FILE_TYPE", desc: "Only PDF, DOCX, TXT supported" },
              { code: "422", label: "BATCH_TOO_LARGE",   desc: "ZIP contains more than 50 files" },
              { code: "429", label: "QUOTA_EXCEEDED",    desc: "Monthly parse limit reached — upgrade plan" },
              { code: "500", label: "PARSE_FAILED",      desc: "Internal error — retry or contact support" },
            ].map((e) => (
              <div
                key={e.label}
                className="flex items-center gap-3 text-sm py-2 border-b border-gray-50 last:border-0"
              >
                <span className="font-mono font-bold text-red-500 w-8">{e.code}</span>
                <span className="font-mono text-gray-700 w-44">{e.label}</span>
                <span className="text-gray-500">{e.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-gray-500 mb-4">Ready to start building?</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold text-sm hover:opacity-90 transition shadow-md"
            >
              Get Free API Key →
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition shadow-sm"
            >
              View Pricing
            </Link>
            <a
              href="mailto:sales@resumifyapi.com"
              className="px-6 py-3 bg-white border border-indigo-200 text-indigo-600 rounded-xl font-semibold text-sm hover:bg-indigo-50 transition shadow-sm"
            >
              Talk to Sales
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
