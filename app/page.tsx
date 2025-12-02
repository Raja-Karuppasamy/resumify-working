"use client";

import React, { useState } from "react";

const API_URL = "https://resumify-api-flax.vercel.app"; // ✅ Your working API
const MAX_SIZE_MB = 10;

function formatBytes(bytes: number) {
  const mb = (bytes / 1024 / 1024).toFixed(1);
  return `${mb} MB`;
}

// Your original EditableField component (unchanged)
function EditableField({ label, value }: { label: string; value: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  
  const save = () => {
    setIsEditing(false);
    console.log(`${label} updated to:`, editValue);
  };

  return (
    <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition-all">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold text-gray-800 text-lg">{label}</h4>
      </div>
      {isEditing ? (
        <div className="flex gap-2">
          <input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100"
            autoFocus
          />
          <button 
            onClick={save}
            className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700"
          >
            ✅ Save
          </button>
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold text-gray-900 py-4 min-h-[3rem] flex items-center">
            {value || "Not found"}
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors"
          >
            ✏️ Edit Field
          </button>
        </>
      )}
    </div>
  );
}

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.size <= MAX_SIZE_MB * 1024 * 1024) {
      setFile(selected);
      setError(null);
    } else {
      setError("File too large (max 10MB) or invalid format");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log('🚀 Calling YOUR API:', `${API_URL}/parse`);

      const response = await fetch(`${API_URL}/parse`, {
        method: "POST",
        body: formData,
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText.slice(0, 100)}`);
      }

      const data = await response.json();
      console.log('✅ PARSED DATA:', data);
      
      setResult(data);
    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-600 mb-4">
              Resumify Parser
            </h1>
            <p className="text-xl text-gray-600 mb-2">Powered by YOUR Vercel API</p>
            <p className="text-green-600 font-bold text-lg">
              ✅ {API_URL} - LIVE & WORKING!
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl border p-8 md:p-12">
          {!result ? (
            /* Upload Form */
            <div className="space-y-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900">Upload Resume PDF</h2>
              <p className="text-xl text-gray-600">Sends to your Resumify API instantly</p>

              <div 
                className="border-4 border-dashed border-gray-300 hover:border-green-400 p-16 rounded-3xl hover:bg-green-50/50 group cursor-pointer transition-all mb-8"
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <svg className="mx-auto w-24 h-24 text-gray-400 group-hover:text-green-500 mb-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 mb-2">
                  Drop PDF or click here
                </h3>
                <p className="text-lg text-gray-500">Max {MAX_SIZE_MB}MB</p>
              </div>

              <input
                id="file-input"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              {file && (
                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 rounded-2xl shadow-md flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-green-500 text-white rounded-2xl flex items-center justify-center font-bold text-2xl">
                      📄
                    </div>
                    <div>
                      <p className="font-bold text-xl text-gray-900">{file.name}</p>
                      <p className="text-green-700 font-semibold">{formatBytes(file.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="px-6 py-2 bg-white border rounded-xl font-semibold text-gray-700 hover:bg-gray-50 shadow-sm"
                  >
                    Remove
                  </button>
                </div>
              )}

              {error && (
                <div className="p-6 bg-red-50 border-2 border-red-200 rounded-2xl">
                  <p className="text-red-800 font-semibold">{error}</p>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="w-full max-w-md mx-auto block bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-5 px-8 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all disabled:opacity-50 mx-auto"
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3 inline-block" />
                    Calling API...
                  </>
                ) : (
                  "🚀 Send to Resumify API"
                )}
              </button>
            </div>
          ) : (
            /* Results */
            <>
              <div className="text-center mb-12 p-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl text-white shadow-2xl">
                <h2 className="text-3xl font-black mb-2">✅ API Parsing Complete!</h2>
                <p className="text-lg">Structured data from {API_URL}</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Personal Info */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3 border-b pb-4">
                    👤 Personal Information
                  </h3>
                  
                  <EditableField label="Name" value={result.name || "N/A"} />
                  <EditableField label="Email" value={result.email || "N/A"} />
                  <EditableField label="Raw Text Preview" value={result.raw?.slice(0, 100) || result.text?.slice(0, 100) || "N/A"} />
                </div>

                {/* Debug Info */}
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">🔍 API Response</h3>
                  <pre className="text-sm bg-white p-4 rounded-xl border font-mono max-h-64 overflow-auto text-gray-800">
{JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="text-center pt-12 border-t border-gray-200 mt-12 space-x-4">
                <button
                  onClick={reset}
                  className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
                >
                  🔄 New Resume
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
