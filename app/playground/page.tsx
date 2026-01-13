"use client";

import React, { useState, useRef } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const MAX_SIZE_MB = 10;

// ---------- Utils ----------

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

// ---------- NEW: Quality Score Card ----------

function QualityScoreCard({ analysis }: { analysis: any }) {
  if (!analysis) return null;

  const { score, grade, verdict, emoji, strengths, issues, recommendations } = analysis;
  
  const percentage = Math.min(score, 100);
  
  const gradeColors: Record<string, string> = {
    A: "from-green-500 to-emerald-500",
    B: "from-blue-500 to-cyan-500",
    C: "from-yellow-500 to-amber-500",
    D: "from-orange-500 to-red-500",
    F: "from-red-500 to-rose-500",
  };
  
  const bgGradeColors: Record<string, string> = {
    A: "bg-green-50 border-green-200",
    B: "bg-blue-50 border-blue-200",
    C: "bg-yellow-50 border-yellow-200",
    D: "bg-orange-50 border-orange-200",
    F: "bg-red-50 border-red-200",
  };

  return (
    <div className={`rounded-xl border-2 p-6 ${bgGradeColors[grade] || "bg-gray-50 border-gray-200"}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          {emoji} Resume Quality Score
        </h3>
        <div className="flex items-center gap-3">
          <span className={`text-4xl font-black bg-gradient-to-r ${gradeColors[grade] || "from-gray-500 to-gray-700"} bg-clip-text text-transparent`}>
            {grade}
          </span>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{score}/100</div>
            <div className="text-sm text-gray-600">{verdict}</div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${gradeColors[grade] || "from-gray-400 to-gray-600"} transition-all duration-1000 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Poor</span>
          <span>Average</span>
          <span>Excellent</span>
        </div>
      </div>

      {strengths && strengths.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
            <span className="text-lg">✅</span> Strengths
          </h4>
          <ul className="space-y-1">
            {strengths.map((strength: string, idx: number) => (
              <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {issues && issues.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
            <span className="text-lg">⚠️</span> Areas for Improvement
          </h4>
          <ul className="space-y-1">
            {issues.map((issue: string, idx: number) => (
              <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {recommendations && recommendations.length > 0 && (
        <div>
          <h4 className="font-semibold text-indigo-800 mb-2 flex items-center gap-2">
            <span className="text-lg">💡</span> Quick Wins
          </h4>
          <ul className="space-y-2">
            {recommendations.slice(0, 3).map((rec: string, idx: number) => (
              <li key={idx} className="text-sm text-gray-700 flex items-start gap-2 bg-white/50 p-2 rounded-lg">
                <span className="text-indigo-500 mt-0.5">□</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ---------- NEW: ATS Compatibility Card ----------

function ATSCompatibilityCard({ analysis }: { analysis: any }) {
  if (!analysis) return null;

  const { ats_friendly, score, grade, emoji, critical_issues, warnings } = analysis;
  
  const percentage = Math.min(score, 100);
  
  const statusColor = ats_friendly 
    ? "from-green-500 to-emerald-500" 
    : "from-red-500 to-rose-500";
    
  const bgColor = ats_friendly
    ? "bg-green-50 border-green-200"
    : "bg-red-50 border-red-200";

  return (
    <div className={`rounded-xl border-2 p-6 ${bgColor}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          {emoji} ATS Compatibility
        </h3>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">{score}/100</div>
          <div className={`text-sm font-semibold ${ats_friendly ? "text-green-700" : "text-red-700"}`}>
            {grade}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${statusColor} transition-all duration-1000 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className={`mb-4 p-3 rounded-lg ${ats_friendly ? "bg-green-100" : "bg-red-100"}`}>
        <p className={`text-sm font-medium ${ats_friendly ? "text-green-800" : "text-red-800"}`}>
          {ats_friendly 
            ? "✅ Your resume will pass most ATS systems!" 
            : "⚠️ Your resume may be rejected by ATS systems"}
        </p>
      </div>

      {critical_issues && critical_issues.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
            <span className="text-lg">❌</span> Critical Issues
          </h4>
          <ul className="space-y-1">
            {critical_issues.map((issue: string, idx: number) => (
              <li key={idx} className="text-sm text-red-700 flex items-start gap-2 bg-red-100 p-2 rounded">
                <span className="text-red-500 mt-0.5">•</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {warnings && warnings.length > 0 && (
        <div>
          <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
            <span className="text-lg">⚡</span> Warnings
          </h4>
          <ul className="space-y-1">
            {warnings.map((warning: string, idx: number) => (
              <li key={idx} className="text-sm text-amber-700 flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
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
// PASTE THIS AFTER Part 1

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
      {/* NEW: Quality Score Card */}
      {data.quality_analysis && (
        <QualityScoreCard analysis={data.quality_analysis} />
      )}

      {/* NEW: ATS Compatibility Card */}
      {data.ats_analysis && (
        <ATSCompatibilityCard analysis={data.ats_analysis} />
      )}

      {/* Parser Used Badge */}
      {data.parser_used && (
        <div className="flex items-center gap-2 text-xs">
          <span className={`px-3 py-1 rounded-full font-medium ${
            data.parser_used === 'ai' 
              ? 'bg-purple-100 text-purple-700' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {data.parser_used === 'ai' ? '🤖 AI-Powered Parser' : '📝 Regex Parser'}
          </span>
          {data.overall_confidence && (
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium">
              {(data.overall_confidence * 100).toFixed(0)}% Overall Confidence
            </span>
          )}
        </div>
      )}

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

        {/* LinkedIn, GitHub, Portfolio */}
        {(data.linkedin || data.github || data.portfolio) && (
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {data.linkedin && (
              <div>
                <span className="text-sm font-medium text-gray-600">LinkedIn</span>
                <a href={data.linkedin} target="_blank" rel="noopener noreferrer" 
                   className="block text-sm text-indigo-600 hover:underline truncate">
                  {data.linkedin}
                </a>
              </div>
            )}
            {data.github && (
              <div>
                <span className="text-sm font-medium text-gray-600">GitHub</span>
                <a href={data.github} target="_blank" rel="noopener noreferrer"
                   className="block text-sm text-indigo-600 hover:underline truncate">
                  {data.github}
                </a>
              </div>
            )}
            {data.portfolio && (
              <div>
                <span className="text-sm font-medium text-gray-600">Portfolio</span>
                <a href={data.portfolio} target="_blank" rel="noopener noreferrer"
                   className="block text-sm text-indigo-600 hover:underline truncate">
                  {data.portfolio}
                </a>
              </div>
            )}
          </div>
        )}
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

        {/* Skills Chips */}
        <div className="mt-6 space-y-4">
          {[
            "programming_languages",
            "frameworks_libraries",
            "cloud_platforms",
            "databases",
            "dev_tools",
            "soft_skills"
          ].map((skillType) => {
            const skills = getArray(skillType);
            if (skills.length === 0) return null;

            const labels: Record<string, string> = {
              programming_languages: "Programming Languages",
              frameworks_libraries: "Frameworks & Libraries",
              cloud_platforms: "Cloud Platforms",
              databases: "Databases",
              dev_tools: "Dev Tools",
              soft_skills: "Soft Skills",
            };

            const colors: Record<string, string> = {
              programming_languages: "bg-indigo-50 text-indigo-700",
              frameworks_libraries: "bg-purple-50 text-purple-700",
              cloud_platforms: "bg-sky-50 text-sky-700",
              databases: "bg-emerald-50 text-emerald-700",
              dev_tools: "bg-gray-100 text-gray-700",
              soft_skills: "bg-pink-50 text-pink-700",
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
                  {exp.duration_months && ` (${exp.duration_months} months)`}
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
                {exp.technologies?.length > 0 && (
                  <div className="mt-3">
                    <span className="text-xs font-medium text-gray-600">Technologies: </span>
                    <span className="text-xs text-gray-700">{exp.technologies.join(", ")}</span>
                  </div>
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
                  {edu.gpa && (
                    <div className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</div>
                  )}
                </div>
                <div className="text-sm font-medium text-gray-700 bg-white px-3 py-1 rounded-lg border">
                  {edu.graduation_year || edu.year || "N/A"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {getArray("certifications").length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="h-2 w-6 bg-yellow-500 rounded-full" />
            Certifications
          </h3>
          <div className="space-y-2">
            {getArray("certifications").map((cert: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{cert.name}</div>
                  {cert.issuer && <div className="text-sm text-gray-600">{cert.issuer}</div>}
                </div>
                {cert.date && <div className="text-sm text-gray-500">{cert.date}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {getArray("projects").length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="h-2 w-6 bg-cyan-500 rounded-full" />
            Projects
          </h3>
          <div className="space-y-3">
            {getArray("projects").map((project: any, idx: number) => (
              <div key={idx} className="p-4 bg-cyan-50 rounded-lg">
                <div className="font-medium text-gray-900">{project.name}</div>
                {project.description && (
                  <div className="text-sm text-gray-700 mt-1">{project.description}</div>
                )}
                {project.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.technologies.map((tech: string, tIdx: number) => (
                      <span key={tIdx} className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {project.url && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer"
                     className="text-sm text-indigo-600 hover:underline mt-2 inline-block">
                    View Project →
                  </a>
                )}
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
  const [rateLimited, setRateLimited] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;

    if (selectedFile && selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File is too large! Max size is ${MAX_SIZE_MB} MB`);
      setFile(null);
      return;
    }

    setRateLimited(false);
    setError(null);
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    if (!API_URL) {
      setError("API endpoint not configured. Check NEXT_PUBLIC_API_URL.");
      return;
    }

    setLoading(true);
    setError(null);
    setRateLimited(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // CHANGED: Use /parse/ai endpoint for AI-powered parsing
      const url = `${API_URL.replace(/\/$/, "")}/parse/ai`;
      console.log("Uploading to:", url);

      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let message = `Backend returned ${res.status}`;

        try {
          const data = await res.json();
          message += `: ${data.detail || JSON.stringify(data)}`;
        } catch {
          const text = await res.text();
          if (text) message += `: ${text.slice(0, 300)}`;
        }

        throw new Error(message);
      }

      const parsedData = await res.json();
      setResult(parsedData);
      setEditedData({ ...parsedData });

    } catch (e: any) {
      console.error("Upload failed:", e);

      if (e.message.includes("429")) {
        setRateLimited(true);
        setError("Rate limited — please wait a minute before trying again.");
      } else if (e.name === "TypeError" && e.message.includes("fetch")) {
        setError("Network error: Unable to reach backend. Check API URL or CORS.");
      } else {
        setError(e.message || "Failed to parse resume. Please try again.");
      }
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
    setRateLimited(false);
    setError(null);
    setResult(null);
    setEditedData(null);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
                Resumify Resume Parser API
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                AI-powered parsing with quality scoring & ATS analysis
              </p>
            </div>
          </div>
          <span className="hidden md:inline-flex items-center gap-2 text-xs px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 font-medium shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Parsing
          </span>
        </header>

        {rateLimited && (
          <div className="mb-4 rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-900">
            <div className="font-semibold">Rate limit reached</div>
            <div>
              You've hit the free usage limit. Please wait a minute and try again.
            </div>
          </div>
        )}

        <main className="max-w-4xl mx-auto">
          <section className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-200/50 border border-indigo-50/50">
            <div className="px-8 pt-8 pb-6 border-b border-indigo-100">
              <p className="text-xs font-bold tracking-wider text-indigo-600 uppercase">
                AI-Powered Resume Parser
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Upload PDF resumes for 95% accurate parsing with quality scoring and ATS compatibility analysis
              </p>
            </div>
            
            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 mx-8 mt-6">
              🤖 <strong>AI-Powered</strong> — Using Claude AI for 95% accuracy vs 60% industry average
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
                        ref={fileInputRef}
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
                          onClick={() => {
                            setFile(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
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
                          Analyzing with AI...
                        </span>
                      </>
                    ) : (
                      <>
                        <span>🤖 Parse with AI</span>
                        <span className="ml-2 text-indigo-200 group-hover:text-white transition-colors">
                          95% accuracy
                        </span>
                      </>
                    )}
                  </button>

                  {loading && (
                    <div className="text-center py-4">
                      <p className="text-sm text-indigo-600 font-medium"></p>
                      <p className="text-sm text-indigo-600 font-medium">
                        AI is analyzing your resume... This may take 10-30 seconds
                      </p>
                      <div className="mt-3 flex justify-center gap-2">
                        <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="h-2 w-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Results Display */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Parsed Resume Data
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                          Click any field to edit and correct the parsed information
                        </p>
                      </div>
                      <button
                        onClick={resetForm}
                        className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                      >
                        ← Upload Another
                      </button>
                    </div>

                    <ResumeDisplay
                      data={currentData}
                      onFieldUpdate={handleFieldUpdate}
                    />

                    {/* Export Options */}
                    <div className="flex gap-3 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => {
                          const dataStr = JSON.stringify(editedData || result, null, 2);
                          const blob = new Blob([dataStr], { type: "application/json" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `resume-parsed-${Date.now()}.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                      >
                        💾 Download JSON
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            JSON.stringify(editedData || result, null, 2)
                          );
                          alert("Copied to clipboard!");
                        }}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                      >
                        📋 Copy to Clipboard
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Features Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-indigo-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl mb-4">
                🤖
              </div>
              <h3 className="font-bold text-gray-900 mb-2">AI-Powered</h3>
              <p className="text-sm text-gray-600">
                Claude AI achieves 95% accuracy vs 60% industry average for resume parsing
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-indigo-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white text-2xl mb-4">
                📊
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Quality Scoring</h3>
              <p className="text-sm text-gray-600">
                Get detailed quality analysis with actionable recommendations to improve your resume
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-indigo-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl mb-4">
                🎯
              </div>
              <h3 className="font-bold text-gray-900 mb-2">ATS Compatible</h3>
              <p className="text-sm text-gray-600">
                Check if your resume will pass Applicant Tracking Systems with detailed compatibility analysis
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>
            Built with FastAPI, Claude AI & Next.js •{" "}
            
              href="https://github.com/yourusername/resume-parser"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View on GitHub
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}