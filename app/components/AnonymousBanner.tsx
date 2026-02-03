"use client";

interface AnonymousBannerProps {
  remainingParses?: number;
  maxParses?: number;
}

export default function AnonymousBanner({ 
  remainingParses = 5, 
  maxParses = 5 
}: AnonymousBannerProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="text-2xl">🎉</div>
        <div className="flex-1">
          <p className="text-sm text-gray-800">
            <strong className="font-semibold">Free tier:</strong> You have{' '}
            <span className="font-bold text-blue-600">{remainingParses}/{maxParses}</span>{' '}
            parses remaining this hour.{' '}
            <a 
              href="/sign-up" 
              className="underline font-medium text-blue-700 hover:text-blue-800 transition-colors"
            >
              Sign up for unlimited parsing →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
