'use client'

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react'

interface RevealProps {
  children: ReactNode
  delay?: number
  y?: number
  blur?: number
  duration?: number
  className?: string
}

const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)'

export default function Reveal({
  children,
  delay = 0,
  y = 24,
  blur = 8,
  duration = 900,
  className = '',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.92) return
    el.style.transition = 'none'
    el.style.opacity = '0'
    el.style.transform = `translateY(${y}px)`
    el.style.filter = `blur(${blur}px)`
    void el.offsetHeight
    el.style.transition = ''
    queueMicrotask(() => setVisible(false))
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setTimeout(() => setVisible(true), delay)
            io.unobserve(entry.target)
            break
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [delay, y, blur])

  const style: CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : `translateY(${y}px)`,
    filter: visible ? 'blur(0px)' : `blur(${blur}px)`,
    transition: `opacity ${duration}ms ${EASE}, transform ${duration}ms ${EASE}, filter ${duration}ms ${EASE}`,
    willChange: visible ? undefined : 'transform, opacity, filter',
  }

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
