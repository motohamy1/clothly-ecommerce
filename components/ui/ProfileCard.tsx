import React from 'react'
import Image from 'next/image'

interface SocialLink {
  icon: React.ReactNode
  href: string
  label: string
}

interface ProfileCardProps {
  // Profile Image
  avatarSrc: string
  avatarAlt?: string
  
  // Text Content
  name: string
  title: string
  
  // Status
  availabilityText?: string
  isAvailable?: boolean
  
  // Social Links
  socialLinks?: SocialLink[]
  
  // Styling
  className?: string
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  avatarSrc,
  avatarAlt = 'Profile picture',
  name,
  title,
  availabilityText = 'Available for work',
  isAvailable = true,
  socialLinks = [],
  className = ''
}) => {
  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      {/* Main Card */}
      <div className="bg-white rounded-t-lg border-4 border-black p-6 md:p-8">
        <div className="flex items-center justify-between">
          {/* Left Side - Avatar and Info */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Avatar */}
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-black overflow-hidden bg-[#c08b79] flex-shrink-0">
              <Image
                src={avatarSrc}
                alt={avatarAlt}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Name and Title */}
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-1 font-mono">
                {name}
              </h2>
              <p className="text-base md:text-lg text-gray-700 font-medium">
                {title}
              </p>
            </div>
          </div>
          
          {/* Right Side - Menu Icon */}
          <button 
            className="flex flex-col gap-1.5 p-2 hover:bg-gray-100 rounded transition-colors"
            aria-label="Menu"
          >
            <span className="w-8 h-1 bg-black rounded"></span>
            <span className="w-8 h-1 bg-black rounded"></span>
            <span className="w-8 h-1 bg-black rounded"></span>
          </button>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="bg-black rounded-b-lg border-4 border-black border-t-0 px-6 md:px-8 py-4 flex items-center justify-between">
        {/* Availability Status */}
        <div className="flex items-center gap-2">
          <span 
            className={`w-3 h-3 rounded-full ${
              isAvailable ? 'bg-green-500' : 'bg-gray-500'
            }`}
          ></span>
          <span className="text-white text-sm md:text-base font-medium">
            {availabilityText}
          </span>
        </div>
        
        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="flex items-center gap-3 md:gap-4">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#c08b79] hover:bg-[#b07a69] transition-colors flex items-center justify-center text-black"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileCard
