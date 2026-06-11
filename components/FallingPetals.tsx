'use client'

import { useEffect, useRef, useState } from 'react'

interface FallingPetalsProps {
  onPetalClick: (index: number) => void
}

type FlowerType = 'rose' | 'cherry' | 'sunflower' | 'tulip' | 'daisy'

interface Petal {
  id: number
  x: number
  y: number
  vx: number // horizontal velocity
  vy: number // vertical velocity
  ax: number // horizontal acceleration (wind)
  ay: number // vertical acceleration (gravity)
  rotation: number
  rotationSpeed: number
  size: number
  opacity: number
  delay: number
  flowerType: FlowerType
  colorVariation: number // 0-1 for color variations
  windInfluence: number // how affected by wind this petal is
  mass: number // affects gravity and wind
}

// Perlin-like noise generator for smooth wind simulation
class NoiseGenerator {
  private values: number[] = []
  
  constructor(seed: number = 0) {
    for (let i = 0; i < 256; i++) {
      this.values[i] = Math.sin(i + seed) * 10000
      this.values[i] = this.values[i] - Math.floor(this.values[i])
    }
  }

  perlin(x: number): number {
    const xi = Math.floor(x) & 255
    const xf = x - Math.floor(x)
    const u = xf * xf * (3.0 - 2.0 * xf)
    const n0 = this.values[xi]
    const n1 = this.values[(xi + 1) & 255]
    return n0 + u * (n1 - n0)
  }
}

// Color palettes for different flower types
const flowerColors = {
  rose: {
    colors: ['#d4617d', '#e8b4d1', '#f0d9e8'],
    gradientStops: [0, 0.5, 1],
    strokeColor: '#d4617d',
  },
  cherry: {
    colors: ['#f5a3c7', '#fff5d6', '#f5a3c7'],
    gradientStops: [0, 0.5, 1],
    strokeColor: '#e88bb5',
  },
  sunflower: {
    colors: ['#ffd700', '#ffeb99', '#ff9900'],
    gradientStops: [0, 0.5, 1],
    strokeColor: '#ff8c00',
  },
  tulip: {
    colors: ['#e74c3c', '#e67e22', '#c0392b'],
    gradientStops: [0, 0.5, 1],
    strokeColor: '#c0392b',
  },
  daisy: {
    colors: ['#ffffff', '#fff9e6', '#ffff99'],
    gradientStops: [0, 0.5, 1],
    strokeColor: '#ffeb3b',
  },
}

function drawFlowerPetal(
  ctx: CanvasRenderingContext2D,
  size: number,
  flowerType: FlowerType,
  colorVariation: number
) {
  const config = flowerColors[flowerType]
  
  // Create gradient with slight variation
  const gradient = ctx.createLinearGradient(0, -size, 0, size)
  
  // Apply color variation
  const variation = colorVariation * 0.2
  config.gradientStops.forEach((stop, i) => {
    const baseColor = config.colors[i]
    const adjustedStop = Math.max(0, Math.min(1, stop + variation))
    gradient.addColorStop(adjustedStop, baseColor)
  })

  ctx.fillStyle = gradient
  ctx.strokeStyle = config.strokeColor
  ctx.lineWidth = 0.5

  // Draw different petal shapes based on flower type
  switch (flowerType) {
    case 'rose':
      // Rose petal: elongated ellipse with slight waves
      ctx.beginPath()
      ctx.ellipse(0, 0, size * 0.5, size * 1.2, 0.1, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      break

    case 'cherry':
      // Cherry blossom: rounded petals (draw 5 petals in a flower)
      drawCherryBlossom(ctx, size, config)
      break

    case 'sunflower':
      // Sunflower: wide, pointed petal
      ctx.beginPath()
      ctx.moveTo(0, -size * 1.3)
      ctx.quadraticCurveTo(size * 0.7, -size * 0.3, size * 0.5, size * 0.8)
      ctx.quadraticCurveTo(0, size * 0.5, -size * 0.5, size * 0.8)
      ctx.quadraticCurveTo(-size * 0.7, -size * 0.3, 0, -size * 1.3)
      ctx.fill()
      ctx.stroke()
      break

    case 'tulip':
      // Tulip: cup-like petal shape
      ctx.beginPath()
      ctx.moveTo(-size * 0.4, size * 1.2)
      ctx.quadraticCurveTo(-size * 0.8, size * 0.3, -size * 0.6, -size * 0.8)
      ctx.quadraticCurveTo(0, -size * 1.3, size * 0.6, -size * 0.8)
      ctx.quadraticCurveTo(size * 0.8, size * 0.3, size * 0.4, size * 1.2)
      ctx.fill()
      ctx.stroke()
      break

    case 'daisy':
      // Daisy: simple pointed petal
      ctx.beginPath()
      ctx.moveTo(0, -size * 1.2)
      ctx.lineTo(size * 0.4, -size * 0.1)
      ctx.quadraticCurveTo(size * 0.5, size * 0.6, 0, size * 1.0)
      ctx.quadraticCurveTo(-size * 0.5, size * 0.6, -size * 0.4, -size * 0.1)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      break
  }
}

function drawCherryBlossom(
  ctx: CanvasRenderingContext2D,
  size: number,
  config: typeof flowerColors['cherry']
) {
  const petalCount = 5
  const petalSize = size * 0.7

  for (let i = 0; i < petalCount; i++) {
    const angle = (i / petalCount) * Math.PI * 2
    ctx.save()
    ctx.rotate(angle)

    ctx.beginPath()
    ctx.ellipse(0, -petalSize * 0.8, petalSize * 0.5, petalSize, 0, 0, Math.PI * 2)
    ctx.fillStyle = config.colors[i % 3]
    ctx.fill()
    ctx.strokeStyle = config.strokeColor
    ctx.lineWidth = 0.3
    ctx.stroke()

    ctx.restore()
  }

  // Center of flower
  ctx.beginPath()
  ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2)
  ctx.fillStyle = '#ffeb3b'
  ctx.fill()
}

export default function FallingPetals({ onPetalClick }: FallingPetalsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [petals, setPetals] = useState<Petal[]>([])
  const [clickedPetalIndices, setClickedPetalIndices] = useState<Set<number>>(new Set())
  const petalCountRef = useRef(0)
  const animationFrameRef = useRef<number | null>(null)
  const noiseRef = useRef<NoiseGenerator>(new NoiseGenerator(Date.now()))
  const timeRef = useRef<number>(0)

  const flowerTypes: FlowerType[] = ['rose', 'cherry', 'sunflower', 'tulip', 'daisy']

  // Initialize petals with multiple flower types and physics properties
  useEffect(() => {
    const newPetals: Petal[] = []
    const petalCount = 200

    for (let i = 0; i < petalCount; i++) {
      const flowerType = flowerTypes[Math.floor(Math.random() * flowerTypes.length)]
      const mass = Math.random() * 0.5 + 0.5 // 0.5 to 1.0

      newPetals.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight - window.innerHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 1.5 + 1,
        ax: 0,
        ay: 0.02 * mass, // gravity (varied by mass)
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.15,
        size: Math.random() * 10 + 5,
        opacity: Math.random() * 0.6 + 0.4,
        delay: Math.random() * 3000,
        flowerType,
        colorVariation: Math.random(),
        windInfluence: Math.random() * 0.5 + 0.5,
        mass,
      })
    }

    setPetals(newPetals)
    petalCountRef.current = petalCount
  }, [])

  // Animation loop with advanced physics
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let startTime = Date.now()

    const animate = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - startTime
      timeRef.current = elapsed / 1000 // Convert to seconds

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw petals
      setPetals((prevPetals) => {
        const updatedPetals = prevPetals.map((petal, index) => {
          // Check if petal delay has passed
          if (elapsed < petal.delay) {
            return petal
          }

          let newPetal = { ...petal }
          const timeSinceStart = (elapsed - petal.delay) / 1000

          // Physics integration using Verlet-style integration
          // Wind force using noise for smooth, natural motion
          const windTime = timeRef.current + index * 0.1
          const windForce = noiseRef.current.perlin(windTime) * 0.4
          newPetal.ax = windForce * newPetal.windInfluence * (1 / newPetal.mass)

          // Damping (air resistance)
          const damping = 0.98
          newPetal.vx = (newPetal.vx + newPetal.ax) * damping
          newPetal.vy = newPetal.vy + newPetal.ay

          // Heart formation: attract petals to heart shape after some time
          const heartFormationStart = 5000
          const distanceFromCenter = Math.sqrt(
            Math.pow(newPetal.x - canvas.width / 2, 2) +
            Math.pow(newPetal.y - canvas.height / 2.5, 2)
          )

          if (timeSinceStart > heartFormationStart / 1000 && distanceFromCenter > 50) {
            // Attraction force toward center
            const dx = canvas.width / 2 - newPetal.x
            const dy = canvas.height / 2.5 - newPetal.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance > 0) {
              const attractionForce = 0.0008
              newPetal.ax += (dx / distance) * attractionForce
              newPetal.ay += (dy / distance) * attractionForce

              const angle = Math.atan2(dy, dx)
              newPetal.vx += Math.cos(angle) * 0.1
              newPetal.vy += Math.sin(angle) * 0.1
            }
          }

          // Terminal velocity constraint
          const maxVelocity = 8
          const speed = Math.sqrt(newPetal.vx * newPetal.vx + newPetal.vy * newPetal.vy)
          if (speed > maxVelocity) {
            newPetal.vx = (newPetal.vx / speed) * maxVelocity
            newPetal.vy = (newPetal.vy / speed) * maxVelocity
          }

          // Position update (Euler integration)
          newPetal.y += newPetal.vy
          newPetal.x += newPetal.vx

          // Natural swaying motion using sine wave
          const swayFrequency = 0.01
          newPetal.x += Math.sin(timeSinceStart * 2 + index) * swayFrequency

          // Update rotation with physics
          newPetal.rotation += newPetal.rotationSpeed
          newPetal.rotationSpeed *= 0.99 // Damping rotation

          // Fade effect near bottom
          if (newPetal.y > canvas.height * 0.8) {
            newPetal.opacity *= 0.95
          }

          // Wrap around
          if (newPetal.y > canvas.height + newPetal.size) {
            newPetal.y = -newPetal.size
            newPetal.x = Math.random() * canvas.width
            newPetal.vy = Math.random() * 1.5 + 1
            newPetal.opacity = Math.random() * 0.6 + 0.4
          }

          if (newPetal.x < -newPetal.size) {
            newPetal.x = canvas.width + newPetal.size
          } else if (newPetal.x > canvas.width + newPetal.size) {
            newPetal.x = -newPetal.size
          }

          return newPetal
        })

        // Draw petals
        updatedPetals.forEach((petal) => {
          const elapsed = currentTime - startTime
          if (elapsed < petal.delay) return

          ctx.save()
          ctx.globalAlpha = petal.opacity
          ctx.translate(petal.x, petal.y)
          ctx.rotate(petal.rotation)

          // Draw petal based on flower type
          drawFlowerPetal(ctx, petal.size, petal.flowerType, petal.colorVariation)

          ctx.restore()
        })

        return updatedPetals
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Handle canvas click for petals
    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const clickY = e.clientY - rect.top

      petals.forEach((petal, index) => {
        const distance = Math.sqrt(
          Math.pow(clickX - petal.x, 2) + Math.pow(clickY - petal.y, 2)
        )

        if (distance < petal.size * 2) {
          setClickedPetalIndices((prev) => new Set(prev).add(index))
          onPetalClick(index)
        }
      })
    }

    canvas.addEventListener('click', handleCanvasClick)
    animationFrameRef.current = requestAnimationFrame(animate)

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      canvas.removeEventListener('click', handleCanvasClick)
      window.removeEventListener('resize', handleResize)
    }
  }, [petals, onPetalClick])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 cursor-pointer pointer-events-auto z-10"
      style={{ background: 'transparent' }}
    />
  )
}
