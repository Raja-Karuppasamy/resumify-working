'use client';
import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 flex flex-col items-center justify-center p-8">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl max-w-2xl w-full border border-white/20">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center drop-shadow-lg">
          Resumify Parser
        </h1>
        
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full p-4 bg-white/20 rounded-xl border-2 border-dashed border-white/40 text-white placeholder-white/70 mb-6 file:bg-white/20 file:backdrop-blur file:rounded-lg file:border-white/30 file:text-white file:px-6 file:py-3 file:cursor-pointer hover:border-white/60 transition-all"
        />
        
        <button
          onClick={async () => {
            if (!file) return alert('Upload PDF first!');
            
            const formData = new FormData();
            formData.append('file', file);
            
            try {
              const res = await fetch('/api/parse', {
                method: 'POST',
                body: formData,
              });
              
              const data = await res.json();
              setResult(data.text || data.error);
            } catch (error: any) {
              setResult('Error: ' + error.message);
            }
          }}
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
        >
          📄 Parse Resume
        </button>
        
        {result && (
          <div className="mt-6 p-6 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 max-h-96 overflow-auto">
            <pre className="text-sm text-white whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
