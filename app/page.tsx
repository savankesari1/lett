'use client'

import { useState, useEffect, useRef } from 'react'
import FallingPetals from '@/components/FallingPetals'
import LoveLetterCard from '@/components/LoveLetterCard'
import MusicToggle from '@/components/MusicToggle'
import MemoryModal from '@/components/MemoryModal'

const memories = [
  {
    id: 1,
    title: "First Meeting",
    description: "The day we met and everything changed",
    emoji: "💫"
  },
  {
    id: 2,
    title: "Late Night Talks",
    description: "Hours of conversation under the stars",
    emoji: "🌙"
  },
  {
    id: 3,
    title: "Your Laughter",
    description: "The most beautiful sound I know",
    emoji: "😄"
  },
  {
    id: 4,
    title: "Quiet Moments",
    description: "Sitting in silence, holding your hand",
    emoji: "🤝"
  },
  {
    id: 5,
    title: "Your Dreams",
    description: "Supporting you every step of the way",
    emoji: "🌟"
  },
]

export default function Page() {
  const [selectedMemory, setSelectedMemory] = useState<typeof memories[0] | null>(null)
  const [musicEnabled, setMusicEnabled] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (musicEnabled && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Audio autoplay blocked by browser
      })
    } else if (!musicEnabled && audioRef.current) {
      audioRef.current.pause()
    }
  }, [musicEnabled])

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50" />
      </div>

      {/* Falling Petals */}
      <FallingPetals onPetalClick={(index) => {
        if (memories[index % memories.length]) {
          setSelectedMemory(memories[index % memories.length])
        }
      }} />

      {/* Music Audio */}
      <audio
        ref={audioRef}
        loop
        className="hidden"
      >
        <source src="data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==" type="audio/wav" />
      </audio>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Music Toggle */}
        <MusicToggle 
          enabled={musicEnabled}
          onToggle={setMusicEnabled}
        />

        {/* Love Letter */}
        <LoveLetterCard 
          onPetalClick={(index) => {
            if (memories[index % memories.length]) {
              setSelectedMemory(memories[index % memories.length])
            }
          }}
        />
      </div>

      {/* Memory Modal */}
      {selectedMemory && (
        <MemoryModal 
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
        />
      )}
    </div>
  )
}
