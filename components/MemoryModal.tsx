'use client'

import { useEffect } from 'react'

interface Memory {
  id: number
  title: string
  description: string
  emoji: string
}

interface MemoryModalProps {
  memory: Memory
  onClose: () => void
}

export default function MemoryModal({ memory, onClose }: MemoryModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Emoji */}
          <div className="text-6xl mb-4 animate-bounce" style={{ animationDelay: '0s' }}>
            {memory.emoji}
          </div>

          {/* Title */}
          <h3 className="text-2xl font-serif text-rose-700 mb-3">
            {memory.title}
          </h3>

          {/* Divider */}
          <div className="h-1 w-16 bg-gradient-to-r from-rose-300 to-pink-300 mx-auto rounded-full mb-4" />

          {/* Description */}
          <p className="text-slate-700 text-lg leading-relaxed mb-6">
            {memory.description}
          </p>

          {/* Action button */}
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-lg"
          >
            Close & Continue
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-2 left-2 w-2 h-2 bg-rose-400 rounded-full opacity-30" />
        <div className="absolute bottom-2 right-2 w-2 h-2 bg-pink-400 rounded-full opacity-30" />
      </div>
    </div>
  )
}
