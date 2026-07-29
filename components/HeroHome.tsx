'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import BounceCards from './BounceCards'
import Stack from './Stack';

const images = [
    "/images/products/download%20(1).png",
    "/images/products/download%20(2).png",
    "/images/products/download%20(3).png",
    "/images/products/download%20(4).png",
]

const transformStyles = [
    "rotate(5deg) translate(-150px)",
    "rotate(0deg) translate(-70px)",
    "rotate(-5deg)",
    "rotate(5deg) translate(70px)",
    "rotate(-5deg) translate(150px)",
]

export default function HeroHome() {
    const eyebrowRef  = useRef<HTMLSpanElement>(null)
    const headingRef  = useRef<HTMLHeadingElement>(null)
    const subtextRef  = useRef<HTMLParagraphElement>(null)
    const btnMenRef   = useRef<HTMLAnchorElement>(null)
    const btnWomenRef = useRef<HTMLAnchorElement>(null)
    const btnKidsRef  = useRef<HTMLAnchorElement>(null)

    useEffect(() => {
        const elements = [
            { el: eyebrowRef.current,  delay: 0   },
            { el: headingRef.current,  delay: 75  },
            { el: subtextRef.current,  delay: 150 },
            { el: btnMenRef.current,   delay: 250 },
            { el: btnWomenRef.current, delay: 350 },
            { el: btnKidsRef.current,  delay: 450 },
        ]

        const raf = requestAnimationFrame(() => {
            elements.forEach(({ el, delay }) => {
                if (!el) return
                setTimeout(() => {
                    el.style.opacity    = '1'
                    el.style.transform  = 'translateY(0)'
                }, delay)
            })
        })

        return () => cancelAnimationFrame(raf)
    }, [])

    return (
        <section
            className="font-sans flex flex-col md:flex-row justify-between min-h-screen w-full px-6 md:px-16 lg:px-24 gap-6 md:gap-0 overflow-x-hidden"
            style={{ background: 'oklch(0.943 0.051 98.2)' }}
        >
            {/* ── Left: editorial copy ── */}
            <div className="flex flex-col items-start gap-4 md:w-1/2 pt-15 md:pt-10 z-10">

                {/* Eyebrow pill */}
                <span
                    ref={eyebrowRef}
                    className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium border border-[oklch(0.2_0.03_98/0.2)]"
                    style={{
                        color:      'oklch(0.48 0.03 98)',
                        opacity:    0,
                        transform:  'translateY(2rem)',
                        transition: 'opacity 700ms cubic-bezier(0.32,0.72,0,1), transform 700ms cubic-bezier(0.32,0.72,0,1)',
                    }}
                >
                    NEW COLLECTION · SS25
                </span>

                {/* Headline */}
                <h1
                    ref={headingRef}
                    className="font-extrabold whitespace-pre-line text-balance"
                    style={{
                        fontSize:   'clamp(2.5rem, 7vw, 7rem)',
                        fontWeight: 800,
                        lineHeight: 0.95,
                        color:      'oklch(0.15 0.02 98)',
                        opacity:    0,
                        transform:  'translateY(2rem)',
                        transition: 'opacity 700ms cubic-bezier(0.32,0.72,0,1), transform 700ms cubic-bezier(0.32,0.72,0,1)',
                    }}
                >
                    {`Wear What\nYou Mean.`}
                </h1>

                {/* Subtext */}
                <p
                    ref={subtextRef}
                    className="text-base md:text-lg max-w-sm text-pretty"
                    style={{
                        color:      'oklch(0.48 0.03 98)',
                        opacity:    0,
                        transform:  'translateY(2rem)',
                        transition: 'opacity 700ms cubic-bezier(0.32,0.72,0,1), transform 700ms cubic-bezier(0.32,0.72,0,1)',
                    }}
                >
                    Curated collections for men, women &amp; kids — crafted to last, styled to move.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-nowrap items-center gap-3">
                    {/* Men - Filled dark */}
                    <Link
                        ref={btnMenRef}
                        href="/men"
                        className="rounded-full px-5 py-3 text-xs font-semibold tracking-wide select-none md:px-7 md:py-3.5 md:text-sm"
                        style={{
                            background:  'oklch(0.2 0.03 98)',
                            color:       'oklch(0.943 0.051 98.2)',
                            opacity:     0,
                            transform:   'translateY(2rem)',
                            transition:  'opacity 700ms cubic-bezier(0.32,0.72,0,1), transform 700ms cubic-bezier(0.32,0.72,0,1), background 300ms cubic-bezier(0.32,0.72,0,1)',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'oklch(0.1 0.01 98)'
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'oklch(0.2 0.03 98)'
                        }}
                    >
                        Men&apos;s Shop →
                    </Link>

                    {/* Women - Outlined ghost */}
                    <Link
                        ref={btnWomenRef}
                        href="/women"
                        className="rounded-full px-5 py-3 text-xs font-semibold tracking-wide select-none md:px-7 md:py-3.5 md:text-sm"
                        style={{
                            background:  'transparent',
                            color:       'oklch(0.2 0.03 98)',
                            border:      '1.5px solid oklch(0.2 0.03 98 / 0.35)',
                            opacity:     0,
                            transform:   'translateY(2rem)',
                            transition:  'opacity 700ms cubic-bezier(0.32,0.72,0,1), transform 700ms cubic-bezier(0.32,0.72,0,1), background 300ms cubic-bezier(0.32,0.72,0,1), border-color 300ms cubic-bezier(0.32,0.72,0,1)',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'oklch(0.2 0.03 98 / 0.06)'
                            e.currentTarget.style.borderColor = 'oklch(0.2 0.03 98 / 0.5)'
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent'
                            e.currentTarget.style.borderColor = 'oklch(0.2 0.03 98 / 0.35)'
                        }}
                    >
                        Women&apos;s Shop →
                    </Link>

                    {/* Kids - Accent pill */}
                    <Link
                        ref={btnKidsRef}
                        href="/kids"
                        className="rounded-full px-5 py-3 text-xs font-semibold tracking-wide select-none md:px-7 md:py-3.5 md:text-sm"
                        style={{
                            background:  'oklch(0.58 0.14 60)',
                            color:       'oklch(0.943 0.051 98.2)',
                            opacity:     0,
                            transform:   'translateY(2rem)',
                            transition:  'opacity 700ms cubic-bezier(0.32,0.72,0,1), transform 700ms cubic-bezier(0.32,0.72,0,1), background 300ms cubic-bezier(0.32,0.72,0,1)',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'oklch(0.5 0.12 60)'
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'oklch(0.58 0.14 60)'
                        }}
                    >
                        Kids&apos; Shop →
                    </Link>
                </div>
            </div>

            {/* ── Right: BounceCards cluster with Stack below ── */}
            <div className="flex flex-col mt-8 items-center md:w-1/2 gap-8 pb-10 md:pb-0">
                <BounceCards
                    images={images}
                    containerWidth={300}
                    containerHeight={300}
                    animationDelay={0.5}
                    animationStagger={0.06}
                    easeType="elastic.out(1, 0.8)"
                    transformStyles={transformStyles}
                    enableHover={true}
                />
                <Stack width={240} height={240} />
            </div>
        </section>
    )
}
