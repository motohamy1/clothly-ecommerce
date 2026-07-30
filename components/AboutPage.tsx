import React from 'react'
import MagicBento, { type BentoCardProps } from './MagicBento'
import Reveal from './Reveal'

const HEMP_TEXTURE = '/images/textures/hemp-weave.jpg'
const INK = 'oklch(0.2 0.03 98)'

const clothlyValues: BentoCardProps[] = [
  {
    backgroundImage: HEMP_TEXTURE,
    textColor: INK,
    title: 'Sourced with care',
    description: 'Fabrics and makers we trust, named where we can.',
    label: 'Sourcing',
  },
  {
    backgroundImage: HEMP_TEXTURE,
    textColor: INK,
    title: 'Considered curation',
    description: 'A small list, chosen on purpose, not trend-chasing.',
    label: 'Curation',
  },
  {
    backgroundImage: HEMP_TEXTURE,
    textColor: INK,
    title: 'Crafted to last',
    description: 'Built for the long run, not the season.',
    label: 'Quality',
  },
  {
    backgroundImage: HEMP_TEXTURE,
    textColor: INK,
    title: 'Honest pricing',
    description: 'No drop games, no countdown timers, no fine print.',
    label: 'Pricing',
  },
  {
    backgroundImage: HEMP_TEXTURE,
    textColor: INK,
    title: 'Easy returns',
    description: 'Thirty days, no questions.',
    label: 'Returns',
  },
  {
    backgroundImage: HEMP_TEXTURE,
    textColor: INK,
    title: 'Made to move',
    description: 'Cloth that lives with you, all day.',
    label: 'Movement',
  },
]

const WARM_AMBER_GLOW = '206, 158, 80'

function AboutPage() {
  return (
    <section
      id='about'
      className='font-sans w-full min-h-[calc(100vh-5rem)] md:min-h-[calc(100vh-6rem)] flex flex-col justify-center px-4 md:px-6 lg:px-10 pt-4 md:pt-6 pb-4 md:pb-6 scroll-mt-24'
    >
      <header className='max-w-2xl flex flex-col gap-1.5 mb-3 md:mb-5'>
        <Reveal>
          <h1
            className='font-extrabold tracking-tight text-balance'
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: 'oklch(0.15 0.02 98)',
            }}
          >
            About Us
          </h1>
        </Reveal>
        <Reveal delay={140}>
          <p
            className='text-sm md:text-base text-pretty max-w-xl'
            style={{
              lineHeight: 1.5,
              color: 'oklch(0.48 0.03 98)',
            }}
          >
            Six promises we make on every piece — and the reasons we can keep them.
          </p>
        </Reveal>
      </header>
      <Reveal delay={280} duration={1000}>
        <MagicBento fullWidth tray cards={clothlyValues} glowColor={WARM_AMBER_GLOW} />
      </Reveal>
    </section>
  )
}

export default AboutPage
