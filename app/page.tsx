"use client";
import React, { useState } from "react";

const MAX_SIZE_MB = 10;

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

// [KEEP ALL YOUR EditableField + ResumeDisplay EXACTLY AS-IS]
function EditableField({ label, value, confidence, onCorrect }: any) {
  // ... YOUR EXACT COMPONENT (unchanged)
}

function ResumeDisplay({ data, resumeId }: any) {
  // ... YOUR EXACT COMPONENT (unchanged) 
}

// [YOUR EXACT MAIN COMPONENT - ONLY CHANGE API CALL]
export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [resumeId, setResumeId] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files[0]) return;
    const selectedFile = files[0];
    if (selectedFile.type !== "application/pdf") {
      setError("Please select a valid PDF file.");
      return;
    }
    if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Max size is ${MAX_SIZE_MB} MB.`);
      return;
    }
    setFile(selectedFile);
    setError(null);
  };

  // 🔥 CHANGED: LOCAL API CALL (no env vars needed)
  const handleUpload = async () => {
    if (!file) {
      setError("Missing file.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await fetch('/api/parse', {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      console.log("✅ PARSED:", data);
      
      // Mock AI structure (replace with real AI later)
      const parsedData = {
        name: data.name || "John Doe",
        email: data.email || "john@example.com",
        phone: data.phone || "(555) 123-4567",
        location: data.location || "San Francisco, CA",
        // ... add more fields from your raw text parsing
        summary: data.summary || "Experienced developer seeking opportunities.",
        skills: data.skills || ["React", "Node.js", "TypeScript"],
        experience: data.experience || [],
        education: data.education || []
      };
      
      setResult(parsedData);
      setResumeId(Date.now().toString());
    } catch (e: any) {
      console.error('ERROR:', e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  // [YOUR EXACT JSX - 100% UNCHANGED]
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8">
      {/* YOUR EXACT UI JSX HERE - NO CHANGES */}
      {/* ... paste your entire JSX from line 400+ ... */}
    </div>
  );
}
