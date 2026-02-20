'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

// Category order for determining slide direction
const CATEGORY_ORDER = ['men', 'women', 'kids', 'couples'] as const

interface PageTransitionProps {
  children: ReactNode
}

// Variants for carousel slide animation
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
}

// Get category from pathname
const getCategoryFromPath = (pathname: string): string => {
  const segments = pathname.split('/')
  const lastSegment = segments[segments.length - 1]
  return CATEGORY_ORDER.includes(lastSegment as typeof CATEGORY_ORDER[number]) 
    ? lastSegment 
    : 'men'
}

// Calculate direction based on category order
const getDirection = (prevCategory: string, nextCategory: string): number => {
  const prevIndex = CATEGORY_ORDER.indexOf(prevCategory as typeof CATEGORY_ORDER[number])
  const nextIndex = CATEGORY_ORDER.indexOf(nextCategory as typeof CATEGORY_ORDER[number])
  
  if (prevIndex === -1 || nextIndex === -1) return 1
  
  // Moving forward in order = positive direction (slide left)
  // Moving backward in order = negative direction (slide right)
  return nextIndex > prevIndex ? 1 : -1
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [direction, setDirection] = useState(0)
  const [prevCategory, setPrevCategory] = useState<string>('men')

  useEffect(() => {
    const currentCategory = getCategoryFromPath(pathname)
    
    // Only calculate direction if category actually changed
    if (prevCategory !== currentCategory) {
      const newDirection = getDirection(prevCategory, currentCategory)
      setDirection(newDirection)
      setPrevCategory(currentCategory)
    }
  }, [pathname, prevCategory])

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={pathname}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: 'spring', stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}