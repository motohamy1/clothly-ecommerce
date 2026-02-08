import React from 'react'

export interface PixelArtCardProps {
  title: string
  category: string
  image?: string
  imageAlt?: string
  backgroundColor?: string
  textColor?: string
  categoryBgColor?: string
  categoryTextColor?: string
  borderColor?: string
  className?: string
}

export const PixelArtCard: React.FC<PixelArtCardProps> = ({
  title,
  image,
  imageAlt = title,
  backgroundColor = '#ffa54d',
  textColor = '#FFFFFF',
  categoryBgColor = 'transparent',
  categoryTextColor = '#FFFFFF',
  borderColor = '#000000',
  className = ''
}) => {
  return (
    <div
      className={`relative flex flex-col p-8 shadow-2xl rounded-4xl hover:scale-105 hover:shadow-3xl transition-all duration-300 cursor-pointer max-h-[48vh] ${className}`}
      style={{
        backgroundColor,
        color: textColor,
        border: `1px solid ${borderColor}`
      }}
    >
      {/* Header with Title and Category Badge */}
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-wider" style={{ fontFamily: 'monospace, sans-serif' }}>
          {title}
        </h2>
        <span
          className="px-3 py-1 text-xs font-bold border text-center"
          style={{
            borderColor: categoryTextColor,
            backgroundColor: categoryBgColor,
            color: categoryTextColor
          }}
        >
        </span>
      </div>

      {/* Main Content - Pixel Art / Image */}
      <div className="flex-1 flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={imageAlt}
            className="w-full h-auto object-cover border"
            style={{ borderColor }}
          />
        ) : (
          <div className="text-4xl opacity-50">
            🎨
          </div>
        )}
      </div>
    </div>
  )
}

export default PixelArtCard
