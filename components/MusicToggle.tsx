'use client'

interface MusicToggleProps {
  enabled: boolean
  onToggle: (enabled: boolean) => void
}

export default function MusicToggle({ enabled, onToggle }: MusicToggleProps) {
  return (
    <button
      onClick={() => onToggle(!enabled)}
      className="fixed top-8 right-8 z-30 group relative"
      aria-label="Toggle background music"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-20 blur transition-opacity" />
      <div className="relative bg-white/80 backdrop-blur hover:bg-white shadow-lg rounded-full p-4 transition-all duration-300 group-hover:shadow-xl">
        {enabled ? (
          <svg
            className="w-6 h-6 text-rose-500 animate-pulse"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 3v9.28c-.47-.46-1.12-.72-1.84-.72-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V7h4V3h-5z" />
            <path d="M15.5 2.5c1.38 0 2.5 1.12 2.5 2.5v6.5c0 1.38-1.12 2.5-2.5 2.5S13 12.88 13 11.5V5c0-1.38 1.12-2.5 2.5-2.5zm0 1c-.83 0-1.5.67-1.5 1.5v6.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V5c0-.83-.67-1.5-1.5-1.5z" />
          </svg>
        ) : (
          <svg
            className="w-6 h-6 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6.827 6.175A2.31 2.31 0 015.186 8.75c0 2.599 2.576 4.721 5.961 6.348.503.28 1.071.557 1.653.82.582.263 1.15.54 1.653.82 3.385-1.627 5.961-3.75 5.961-6.348a2.31 2.31 0 00-1.641-2.575m-5.911 7.05H9m6 0h.008v.008H15v-.008z"
            />
          </svg>
        )}
      </div>
      <div className="absolute top-full right-0 mt-2 bg-slate-900/90 backdrop-blur text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {enabled ? 'Music On' : 'Music Off'}
      </div>
    </button>
  )
}
