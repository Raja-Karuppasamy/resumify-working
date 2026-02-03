"use client";

export default function CTAHeader() {
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-semibold text-lg">Resumify</span>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center gap-6">
            <a 
              href="/api-info" 
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              API Docs
            </a>
            <a 
              href="/pricing" 
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              Pricing
            </a>
            <button 
              onClick={() => window.location.href = '/sign-up'}
              className="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Get API Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
