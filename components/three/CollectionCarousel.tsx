'use client'

import React, { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const ModelViewer = dynamic(() => import('./ModelViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-2 border-[#c08b79] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-[#c08b79]/70 font-medium tracking-wide">Loading 3D Scene...</span>
      </div>
    </div>
  ),
})

export interface Collection {
  id: string
  title: string
  subtitle: string
  description: string
  clothingColor: string
  accentColor: string
  particleColor: string
  backdropColor: string
  tagColor: string
}

const collections: Collection[] = [
  {
    id: 'new-arrivals',
    title: 'New Arrivals',
    subtitle: 'Spring/Summer 2025',
    description: 'Discover the latest trends in contemporary fashion',
    clothingColor: '#c08b79',
    accentColor: '#d4a088',
    particleColor: '#c08b79',
    backdropColor: '#c08b79',
    tagColor: '#c08b79',
  },
  {
    id: 'summer',
    title: 'Summer Vibes',
    subtitle: 'Breezy Collection',
    description: 'Light fabrics and vibrant colors for warm days',
    clothingColor: '#768f7d',
    accentColor: '#8aab93',
    particleColor: '#768f7d',
    backdropColor: '#768f7d',
    tagColor: '#768f7d',
  },
  {
    id: 'winter',
    title: 'Winter Elegance',
    subtitle: 'Cozy & Refined',
    description: 'Premium layers and textures for the cold season',
    clothingColor: '#181d2a',
    accentColor: '#c08b79',
    particleColor: '#4a5568',
    backdropColor: '#2d3748',
    tagColor: '#4a5568',
  },
  {
    id: 'streetwear',
    title: 'Streetwear',
    subtitle: 'Urban Edge',
    description: 'Bold statements for the modern urbanite',
    clothingColor: '#2d2d2d',
    accentColor: '#ffa249',
    particleColor: '#ffa249',
    backdropColor: '#ffa249',
    tagColor: '#ffa249',
  },
]

export default function CollectionCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning || index === activeIndex) return
      setIsTransitioning(true)
      setTimeout(() => {
        setActiveIndex(index)
        setTimeout(() => setIsTransitioning(false), 400)
      }, 200)
    },
    [activeIndex, isTransitioning]
  )

  const goNext = useCallback(() => {
    goTo((activeIndex + 1) % collections.length)
  }, [activeIndex, goTo])

  const goPrev = useCallback(() => {
    goTo((activeIndex - 1 + collections.length) % collections.length)
  }, [activeIndex, goTo])

  const current = collections[activeIndex]

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Collection Info Overlay - Top */}
      <div
        className="absolute top-4 left-6 right-6 z-10 transition-all duration-500 "
        style={{
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? 'translateY(-10px)' : 'translateY(0)',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span
            className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full"
            style={{
              backgroundColor: `${current.tagColor}20`,
              color: current.tagColor,
              border: `1px solid ${current.tagColor}30`,
            }}
          >
            {current.subtitle}
          </span>
        </div>
        <h2
          className="text-3xl lg:text-4xl font-bold tracking-tight"
          style={{ color: '#181d2a' }}
        >
          {current.title}
        </h2>
        <p className="text-sm mt-1 max-w-md line-clamp-2" style={{ color: '#181d2a99' }}>
          {current.description}
        </p>
      </div>

      {/* 3D Canvas */}
      <div
        className="flex-1 transition-opacity duration-500"
        style={{ opacity: isTransitioning ? 0.3 : 1, backgroundColor: 'var(--background)' }}
      >
        <ModelViewer
          clothingColor={current.clothingColor}
          accentColor={current.accentColor}
          particleColor={current.particleColor}
          backdropColor={current.backdropColor}
        />
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-4 left-6 right-6 z-10 flex items-center justify-between">
        {/* Arrow Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
              backgroundColor: 'var(--mencolor)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
            aria-label="Previous collection"
          >
            <ChevronLeft size={18} color="#181d2a" />
          </button>
          <button
            onClick={goNext}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
              backgroundColor: 'var(--mencolor)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
            aria-label="Next collection"
          >
            <ChevronRight size={18} color="#181d2a" />
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex items-center gap-2">
          {collections.map((col, i) => (
            <button
              key={col.id}
              onClick={() => goTo(i)}
              className="transition-all duration-400 rounded-full"
              style={{
                width: i === activeIndex ? 28 : 8,
                height: 8,
                backgroundColor:
                  i === activeIndex ? current.tagColor : 'rgba(0,0,0,0.15)',
                boxShadow:
                  i === activeIndex ? `0 0 12px ${current.tagColor}50` : 'none',
              }}
              aria-label={`Go to ${col.title}`}
            />
          ))}
        </div>

        {/* Collection Counter */}
        <span
          className="text-xs font-mono font-medium tracking-wider"
          style={{ color: '#181d2a80' }}
        >
          {String(activeIndex + 1).padStart(2, '0')} / {String(collections.length).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
