'use client'

import React, { useState } from 'react'
import { LucideIcon } from 'lucide-react'

export interface CategoryCardProps {
  title: string
  description: string
  icon: LucideIcon
  itemCount?: number
  href: string
  gradientFrom: string
  gradientTo: string
  accentColor: string
  className?: string
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  description,
  icon: Icon,
  itemCount,
  href,
  gradientFrom,
  gradientTo,
  accentColor,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <a
      href={href}
      className={`group relative block overflow-visible rounded-2xl p-5 transition-all duration-500 cursor-pointer z-10 ${className}`}
      style={{
        background: isHovered
          ? `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`
          : `linear-gradient(135deg, ${gradientFrom}dd, ${gradientTo}bb)`,
        boxShadow: isHovered
          ? `0 20px 40px -12px ${accentColor}40, 0 0 0 1px ${accentColor}20`
          : `0 4px 16px -4px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.08)`,
        transform: isHovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative corner accent */}
      <div
        className="absolute top-0 right-0 w-24 h-24 opacity-20 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at top right, ${accentColor}, transparent 70%)`,
          opacity: isHovered ? 0.4 : 0.15,
        }}
      />

      {/* Icon */}
      <div
        className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-3 transition-all duration-500"
        style={{
          backgroundColor: isHovered ? `${accentColor}30` : `rgba(255,255,255,0.15)`,
          boxShadow: isHovered ? `0 0 20px ${accentColor}20` : 'none',
        }}
      >
        <Icon
          size={22}
          style={{
            color: isHovered ? '#ffffff' : 'rgba(255,255,255,0.9)',
          }}
          strokeWidth={1.8}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-1">
          <h3
            className="text-base font-semibold tracking-wide transition-colors duration-300"
            style={{ color: '#ffffff' }}
          >
            {title}
          </h3>
          {itemCount !== undefined && (
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor: isHovered ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.9)',
              }}
            >
              {itemCount}+
            </span>
          )}
        </div>
        <p
          className="text-xs leading-relaxed transition-colors duration-300"
          style={{ color: 'rgba(255,255,255,0.65)' }}
        >
          {description}
        </p>
      </div>

      {/* Arrow indicator */}
      <div
        className="absolute bottom-4 right-4 transition-all duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateX(0)' : 'translateX(-8px)',
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  )
}

export default CategoryCard
