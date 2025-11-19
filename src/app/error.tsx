'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8f5] px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <span className="text-6xl">⚠️</span>
        </div>
        <h2 className="text-2xl font-bold text-[#926829] mb-4">
          Something went wrong!
        </h2>
        <p className="text-gray-600 mb-6">
          We encountered an unexpected error. Don't worry, we're on it!
        </p>
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full px-6 py-3 bg-[#926829] text-white rounded-lg hover:bg-[#7a5621] transition-colors font-medium"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full px-6 py-3 border-2 border-[#926829] text-[#926829] rounded-lg hover:bg-[#926829] hover:text-white transition-colors font-medium"
          >
            Go to Homepage
          </button>
        </div>
        {process.env.NODE_ENV === 'development' && error.message && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Error Details (Dev Only)
            </summary>
            <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}
