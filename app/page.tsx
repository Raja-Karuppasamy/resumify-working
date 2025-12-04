"use client";

import React, { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY ?? "";
const MAX_SIZE_MB = 10;

// ---------- Utils ----------

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

// ---------- Editable Field ----------

function EditableField({
  label,
  value,
  confidence,
  onCorrect,
}: {
  label: string;
  value: string;
  confidence?: number;
  onCorrect: (correctedValue: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onCorrect(editValue);
    setIsEditing(false);
  };

  const confidenceColor =
    confidence === undefined || confidence >= 0.8
      ? "bg-green-100 text-green-800"
      : confidence >= 0.6
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800";

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        {confidence !== undefined && (
          <span className={`text-xs px-2 py-1 rounded-full ${confidenceColor}`}>
            {(confidence * 100).toFixed(0)}%
          </span>
        )}
      </div>

      {isEditing ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-xs font-medium"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-xs"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between group">
          <p className="text-gray-900 font-medium break-words">
            {value || "N/A"}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-indigo-600 hover:text-indigo-800 hidden group-hover:inline-flex transition-all"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- Resume Display ----------

function ResumeDisplay({
  data,
  onFieldUpdate,
}: {
  data: any;
  onFieldUpdate: (path: string, value: string) => void;
}) {
  const getArray = (key: string) => (Array.isArray(data[key]) ? data[key] : []);

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="h-2 w-8 bg-indigo-500 rounded-full" />
          Personal Information
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <EditableField
            label="Full Name"
            value={data.name || ""}
            confidence={data.name_confidence}
            onCorrect={(val) => onFieldUpdate("name", val)}
          />
          <EditableField
            label="Email"
            value={data.email || ""}
            confidence={data.email_confidence}
            onCorrect={(val) => onFieldUpdate("email", val)}
          />
          <EditableField
            label="Phone"
            value={data.phone || ""}
            confidence={data.phone_confidence}
            onCorrect={(val) => onFieldUpdate("phone", val)}
          />
          <EditableField
            label="Location"
            value={data.location || ""}
            confidence={data.location_confidence}
            onCorrect={(val) => onFieldUpdate("location", val)}
          />
        </div>
      </div>

      {/* Developer Profile */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="h-2 w-6 bg-emerald-500 rounded-full" />
          Developer Profile
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <EditableField
            label="Role Level"
            value={data.role_level || ""}
            confidence={data.role_level_confidence ?? 0.85}
            onCorrect={(val) => onFieldUpdate("role_level", val)}
          />
          <EditableField
            label="Primary Role"
            value={data.primary_role || ""}
            confidence={data.primary_role_confidence ?? 0.9}
            onCorrect={(val) => onFieldUpdate("primary_role", val)}
          />
          <EditableField
            label="Total Experience"
            value={
              data.years_of_experience_total
                ? `${data.years_of_experience_total} years`
                : ""
            }
            confidence={data.years_of_experience_total_confidence ?? 0.8}
            onCorrect={(val) =>
              onFieldUpdate(
                "years_of_experience_total",
                val.replace(" years", "")
              )
            }
          />
          <EditableField
            label="Tech Experience"
            value={
              data.years_of_experience_in_tech
                ? `${data.years_of_experience_in_tech} years`
                : ""
            }
            confidence={data.years_of_experience_in_tech_confidence ?? 0.8}
            onCorrect={(val) =>
              onFieldUpdate(
                "years_of_experience_in_tech",
                val.replace(" years", "")
              )
            }
          />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <EditableField
            label="GitHub"
            value={data.github || ""}
            confidence={data.github_confidence ?? 0.95}
            onCorrect={(val) => onFieldUpdate("github", val)}
          />
          <EditableField
            label="Portfolio"
            value={data.portfolio || ""}
            confidence={data.portfolio_confidence ?? 0.9}
            onCorrect={(val) => onFieldUpdate("portfolio", val)}
          />
        </div>

        {/* Skills Chips */}
        <div className="mt-6 space-y-4">
          {[
            "programming_languages",
            "frameworks_and_libraries",
            "cloud_and_infra",
            "databases",
            "dev_tools",
          ].map((skillType) => {
            const skills = getArray(skillType);
            if (skills.length === 0) return null;

            const labels: Record<string, string> = {
              programming_languages: "Programming Languages",
              frameworks_and_libraries: "Frameworks & Libraries",
              cloud_and_infra: "Cloud & Infrastructure",
              databases: "Databases",
              dev_tools: "Dev Tools",
            };

            const colors: Record<string, string> = {
              programming_languages: "bg-indigo-50 text-indigo-700",
              frameworks_and_libraries: "bg-purple-50 text-purple-700",
              cloud_and_infra: "bg-sky-50 text-sky-700",
              databases: "bg-emerald-50 text-emerald-700",
              dev_tools: "bg-gray-100 text-gray-700",
            };

            return (
              <div key={skillType}>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {labels[skillType]}
                </p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${colors[skillType]}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      {data.summary && data.summary !== "N/A" && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="h-2 w-6 bg-amber-500 rounded-full" />
            Professional Summary
          </h3>
          <EditableField
            label="Summary"
            value={data.summary}
            confidence={data.summary_confidence ?? 0.85}
            onCorrect={(val) => onFieldUpdate("summary", val)}
          />
        </div>
      )}

      {/* Experience */}
      {getArray("experience").length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="h-2 w-6 bg-blue-500 rounded-full" />
            Work Experience
          </h3>
          <div className="space-y-4">
            {getArray("experience").map((exp: any, idx: number) => (
              <div
                className="border-l-4 border-indigo-400 pl-5 py-4 bg-indigo-50/50 rounded-lg"
                key={idx}
              >
                <EditableField
                  label="Job Title"
                  value={exp.job_title || "N/A"}
                  confidence={exp.job_title_confidence ?? 0.9}
                  onCorrect={(val) =>
                    onFieldUpdate(`experience[${idx}].job_title`, val)
                  }
                />
                <EditableField
                  label="Company"
                  value={exp.company || "N/A"}
                  confidence={exp.company_confidence ?? 0.9}
                  onCorrect={(val) =>
                    onFieldUpdate(`experience[${idx}].company`, val)
                  }
                />
                <div className="text-sm text-gray-600 mt-2">
                  {exp.start_date && exp.end_date
                    ? `${exp.start_date} - ${exp.end_date}`
                    : "Dates N/A"}
                </div>
                {exp.responsibilities?.length > 0 && (
                  <ul className="list-disc pl-5 mt-3 text-sm text-gray-700 space-y-1">
                    {exp.responsibilities.slice(0, 5).map(
                      (resp: string, rIdx: number) => (
                        <li key={rIdx}>{resp}</li>
                      )
                    )}
                    {exp.responsibilities.length > 5 && (
                      <li className="text-xs text-gray-500">
                        ... and {exp.responsibilities.length - 5} more
                      </li>
                    )}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {getArray("education").length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="h-2 w-6 bg-purple-500 rounded-full" />
            Education
          </h3>
          <div className="space-y-4">
            {getArray("education").map((edu: any, idx: number) => (
              <div
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg"
                key={idx}
              >
                <div className="flex-1">
                  <EditableField
                    label="Degree"
                    value={edu.degree || edu.program || "N/A"}
                    confidence={edu.degree_confidence ?? 0.95}
                    onCorrect={(val) =>
                      onFieldUpdate(`education[${idx}].degree`, val)
                    }
                  />
                  <EditableField
                    label="Institution"
                    value={edu.institution || edu.school || "N/A"}
                    confidence={edu.institution_confidence ?? 0.95}
                    onCorrect={(val) =>
                      onFieldUpdate(`education[${idx}].institution`, val)
                    }
                  />
                </div>
                <div className="text-sm font-medium text-gray-700 bg-white px-3 py-1 rounded-lg border">
                  {edu.year || edu.graduation || "N/A"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw JSON Data */}
      <details className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
        <summary className="cursor-pointer font-semibold text-gray-700 mb-3 flex items-center gap-2">
          📋 View Raw Parsed Data
        </summary>
        <div className="overflow-auto">
          <pre className="text-xs bg-white p-4 rounded-lg border font-mono max-h-96">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </details>
    </div>
  );
}

// ---------- Page Component ----------

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [editedData, setEditedData] = useState<any>(null);
 
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFile = e.target.files?.[0] || null;

  if (selectedFile && selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
    setError(`File is too large! Max size is ${MAX_SIZE_MB} MB`);
    setFile(null);
    return;
  }

  setError(null);
  setFile(selectedFile);
};


  const handleUpload = async () => {
  if (!file) {
    setError("Please select a file first.");
    return;
  }

  if (!API_URL) {
    setError("API_URL is not configured.");
    return;
  }

  setLoading(true);
  setError(null);
  setResult(null);
  setEditedData(null);

  try {
    const formData = new FormData();
    formData.append("file", file);

    const url = `${API_URL.replace(/\/$/, "")}/parse`;
    console.log("Sending to backend:", url);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        ...(API_KEY ? { "x-api-key": API_KEY } : {}),
      },
      body: formData,
    });

    if (!res.ok) {
      const contentType = res.headers.get("content-type") || "";
      let message = `Backend error (${res.status})`;

      if (contentType.includes("application/json")) {
        const errJson: any = await res.json().catch(() => null);
        if (errJson && typeof errJson.error === "string") {
          message += `: ${errJson.error}`;
        }
      } else {
        const text = await res.text().catch(() => "");
        if (text) message += `: ${text.slice(0, 200)}`;
      }

      throw new Error(message);
    }

    const parsedData = await res.json();
    setResult(parsedData);
    setEditedData(parsedData);
  } catch (e: any) {
    console.error("❌ Upload/parse error:", e);
    setError(e?.message || "Parse failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

 

  const handleFieldUpdate = (path: string, value: string) => {
    setEditedData((prev: any) => {
      if (!prev) return prev;
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let current: any = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (key.includes("[")) {
          const match = key.match(/(\w+)\[(\d+)\]/);
          if (match) {
            const [, arrayKey, index] = match;
            current[arrayKey] = current[arrayKey] || [];
            current =
              current[arrayKey][parseInt(index)] ||
              (current[arrayKey][parseInt(index)] = {});
          }
        } else {
          current[key] = current[key] || {};
          current = current[key];
        }
      }

      const finalKey = keys[keys.length - 1];
      if (finalKey.includes("[")) {
        const match = finalKey.match(/(\w+)\[(\d+)\]/);
        if (match) {
          const [, arrayKey, index] = match;
          current[arrayKey] = current[arrayKey] || [];
          current[arrayKey][parseInt(index)] = value;
        }
      } else {
        current[finalKey] = value;
      }

      return newData;
    });
  };

  const resetForm = () => {
    setFile(null);
    setResult(null);
    setEditedData(null);
    setError(null);
  };

  const currentData = editedData || result;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
              R
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Resumify Parser
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                AI-powered resume parsing with live editing
              </p>
            </div>
          </div>
          <span className="hidden md:inline-flex items-center gap-2 text-xs px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 font-medium shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Parsing
          </span>
        </header>

        <main className="max-w-4xl mx-auto">
          <section className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-200/50 border border-indigo-50/50">
            <div className="px-8 pt-8 pb-6 border-b border-indigo-100">
              <p className="text-xs font-bold tracking-wider text-indigo-600 uppercase">
                Resume Upload & Parser
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Upload PDF resumes for instant structured data extraction with
                confidence scores
              </p>
            </div>

            <div className="p-8 space-y-8">
              {!result ? (
                <>
                  {/* Upload Area */}
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      Choose Resume File (PDF)
                    </label>
                    <div className="mt-2">
                      <label
                        htmlFor="resume-upload"
                        className="flex flex-col items-center justify-center px-8 py-12 border-2 border-dashed rounded-2xl border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/60 transition-all duration-200 cursor-pointer group"
                      >
                        <svg
                          className="mx-auto h-12 w-12 text-indigo-400 group-hover:text-indigo-500 transition-colors"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="mt-4 text-lg font-semibold text-gray-700 group-hover:text-indigo-700 transition-colors">
                          Drop your resume or click to browse
                        </span>
                        <span className="mt-1 text-sm text-gray-500">
                          PDF only • Maximum {MAX_SIZE_MB} MB
                        </span>
                      </label>
                      <input
                        id="resume-upload"
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={loading}
                      />
                    </div>

                    {file && (
                      <div className="flex items-center justify-between px-6 py-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-lg">
                            📄
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-none">
                              {file.name}
                            </p>
                            <p className="text-sm text-indigo-600 font-medium">
                              {formatBytes(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setFile(null)}
                          className="px-4 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 border font-medium transition-colors"
                          disabled={loading}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200">
                      <div className="flex items-start gap-2">
                        <span className="h-5 w-5 text-red-500 mt-0.5">⚠️</span>
                        <p className="text-sm text-red-800">{error}</p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleUpload}
                    disabled={loading || !file}
                    className="w-full group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    {loading ? (
                      <>
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </span>
                        <span className="relative opacity-75">
                          Sending to parser...
                        </span>
                      </>
                    ) : (
                      <>
                        <span>🔥 Parse Resume</span>
                        <span className="ml-2 text-indigo-200 group-hover:text-white transition-colors">
                          via API
                        </span>
                      </>
                    )}
                  </button>

                  {loading && (
                    <div className="text-center py-4">
                      <p className="text-sm text-indigo-600 font-medium">
                        Talking to your backend parser...
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 p-4 bg-gradient-to-r from-emerald-50 to-indigo-50 rounded-xl border">
                    <div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                        Resume Parsed Successfully
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Review extracted data and edit any fields as needed
                      </p>
                    </div>
                    <button
                      onClick={resetForm}
                      className="px-6 py-2.5 bg-white text-indigo-700 rounded-lg border border-indigo-200 font-semibold hover:bg-indigo-50 hover:border-indigo-300 shadow-sm transition-all"
                    >
                      🔄 Parse New Resume
                    </button>
                  </div>

                  <ResumeDisplay
                    data={currentData}
                    onFieldUpdate={handleFieldUpdate}
                  />
                </>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
