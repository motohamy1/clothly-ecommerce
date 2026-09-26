'use client'

import type { ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { usePathname } from 'next/navigation'

export default function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={reduceMotion ? false : { opacity: 0, y: 14, filter: 'blur(5px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={reduceMotion ? undefined : { opacity: 0, y: -8, filter: 'blur(3px)' }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.48, ease: 'easeOut' }}
        className="min-h-[60vh] bg-[#f5edc7]"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
