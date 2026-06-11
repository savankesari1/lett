'use client'

import { useEffect, useState } from 'react'

interface LoveLetterCardProps {
  onPetalClick: (index: number) => void
}

const letterContent = `My Dearest Meg,

As I write these words, my heart overflows with
feelings I struggle to express. You are the 
most beautiful part of my life.

Im sorry for everything i did, Im constantly 
trying to improve myself, ill be the best version
of me for youu, wish me the best my dear

Every moment with you feels like a precious 
gift. Your smile brightens my darkest days, 
and your laughter is the sweetest melody.

I want to spend forever building memories 
with you, holding your hand through every 
chapter of our story.

You are my greatest love, my deepest wish, 
and my forever dream come true.

With all my love,
Forever Yours Shashi`

export default function LoveLetterCard({ onPetalClick }: LoveLetterCardProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [cursorVisible, setCursorVisible] = useState(true)
  const [isComplete, setIsComplete] = useState(false)

  // Typewriter effect
  useEffect(() => {
    let currentIndex = 0
    let timeoutId: NodeJS.Timeout

    const typeNextCharacter = () => {
      if (currentIndex < letterContent.length) {
        setDisplayedText(letterContent.slice(0, currentIndex + 1))
        currentIndex++
        timeoutId = setTimeout(typeNextCharacter, 30)
      } else {
        setIsComplete(true)
      }
    }

    timeoutId = setTimeout(typeNextCharacter, 500)

    return () => clearTimeout(timeoutId)
  }, [])

  // Cursor blink effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 500)

    return () => clearInterval(blinkInterval)
  }, [])

  return (
    <div className="relative w-full max-w-2xl">
      {/* Heart shape outline made of petals suggestion */}
      <div className="absolute -inset-12 pointer-events-none">
        {/* Decorative petal elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 w-8 h-8 rounded-full opacity-20 bg-rose-400" />
        <div className="absolute bottom-0 left-0 -translate-x-8 w-6 h-6 rounded-full opacity-20 bg-rose-400" />
        <div className="absolute bottom-0 right-0 translate-x-8 w-6 h-6 rounded-full opacity-20 bg-rose-400" />
      </div>

      {/* Letter background */}
      <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8 md:p-12 border border-rose-200/50">
        {/* Letter header */}
        <div className="text-center mb-8">
          <svg
            className="w-12 h-12 mx-auto text-rose-400 mb-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <h2 className="text-2xl md:text-3xl font-serif text-rose-700 mb-2">
            A Love Letter
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-rose-300 to-pink-300 mx-auto rounded-full" />
        </div>

        {/* Letter content with typewriter effect */}
        <div className="font-serif text-base md:text-lg text-slate-800 leading-relaxed whitespace-pre-wrap">
          {displayedText}
          {!isComplete && (
            <span
              className={`inline-block w-2 h-6 bg-rose-400 ml-1 transition-opacity ${
                cursorVisible ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </div>

        {/* Decorative line at bottom */}
        {isComplete && (
          <div className="mt-8 flex justify-center">
            <div className="h-1 w-24 bg-gradient-to-r from-rose-300 via-pink-300 to-transparent rounded-full" />
          </div>
        )}
      </div>

      {/* Interactive hint */}
      {isComplete && (
        <div className="text-center mt-6 animate-pulse">
          <p className="text-rose-400 text-sm font-light">
            Click on falling petals to reveal sweet memories
          </p>
        </div>
      )}
    </div>
  )
}
