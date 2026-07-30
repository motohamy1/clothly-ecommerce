'use client'

import React, { useState } from 'react'
import { Mail, Phone, MapPin, Clock, ArrowRight, Check, Send } from 'lucide-react'
import Reveal from './Reveal'

const HEMP_TEXTURE = '/images/textures/hemp-weave.jpg'
const INK = 'oklch(0.2 0.03 98)'
const INK_LIGHT = 'oklch(0.15 0.02 98)'
const MUTED_INK = 'oklch(0.48 0.03 98)'
const WHATSAPP_NUMBER = '201011111111'

const CATEGORIES = [
  'General Inquiry',
  'Order Support',
  'Sourcing & Craft',
  'Wholesale & Press',
] as const

type InquiryCategory = (typeof CATEGORIES)[number]

export default function ContactSection() {
  const [selectedCategory, setSelectedCategory] = useState<InquiryCategory>('General Inquiry')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !email.trim() || !message.trim()) return

    setIsSubmitting(true)

    const whatsappMessage = [
      `Inquiry Type: ${selectedCategory}`,
      `Name: ${fullName.trim()}`,
      `Email: ${email.trim()}`,
      '',
      message.trim(),
    ].join('\n')

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')

    setTimeout(() => {
      setIsSubmitting(false)
    }, 400)
  }

  return (
    <section
      id='contact'
      className='font-sans w-full min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-7rem)] flex flex-col justify-center px-4 md:px-6 lg:px-10 py-12 md:py-16 scroll-mt-24'
    >
      {/* Header */}
      <header className='max-w-2xl flex flex-col gap-1.5 mb-8 md:mb-12'>
        <Reveal>
          <h1
            className='font-extrabold tracking-tight text-balance'
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: INK_LIGHT,
            }}
          >
            Get in Touch
          </h1>
        </Reveal>
        <Reveal delay={140}>
          <p
            className='text-sm md:text-base text-pretty max-w-xl'
            style={{
              lineHeight: 1.5,
              color: MUTED_INK,
            }}
          >
            Have a question about our sourcing, your order, or custom inquiry? Reach out to our momo studio team.
          </p>
        </Reveal>
      </header>

      {/* Main Content Container with Tray Styling */}
      <Reveal delay={280} duration={1000}>
        <div
          className='w-full rounded-[2rem] border border-[oklch(0.2_0.03_98_/_0.12)] p-6 sm:p-8 md:p-12 transition-all duration-500 overflow-hidden relative'
          style={{
            backgroundImage: `url(${HEMP_TEXTURE})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: 'oklch(0.943 0.051 98.2)',
            boxShadow:
              'inset 0 1px 1px rgba(255, 255, 255, 0.6), 0 30px 60px -20px rgba(60, 40, 20, 0.12), 0 8px 24px -8px rgba(60, 40, 20, 0.06)',
          }}
        >
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start relative z-10'>
            {/* Left Column: Direct Info & Location */}
            <div className='lg:col-span-5 flex flex-col gap-8'>
              <div className='flex flex-col gap-2'>
                <span className='text-xs font-semibold tracking-wider uppercase opacity-70' style={{ color: INK }}>
                  Momo Studio 
                </span>
                <h2 className='text-xl md:text-2xl font-bold tracking-tight' style={{ color: INK_LIGHT }}>
                  Visit us in alezawy, senbellawein, Mansoura
                </h2>
                <p className='text-sm leading-relaxed opacity-85 mt-1' style={{ color: INK }}>
                  Our flagship space is open for fitting appointments, fabric consultations, and order pickups.
                </p>
              </div>

              {/* Info Cards List */}
              <div className='flex flex-col gap-5'>
                {/* Location */}
                <div className='flex items-start gap-4 p-4 rounded-xl border border-[oklch(0.2_0.03_98_/_0.1)] bg-[oklch(0.96_0.02_90_/_0.7)] backdrop-blur-sm'>
                  <div className='p-2.5 rounded-lg bg-[oklch(0.2_0.03_98_/_0.06)] text-[oklch(0.2_0.03_98)] shrink-0'>
                    <MapPin className='w-5 h-5' />
                  </div>
                  <div className='flex flex-col gap-0.5'>
                    <span className='text-xs font-medium uppercase tracking-wide opacity-60' style={{ color: INK }}>
                      Address
                    </span>
                    <span className='text-sm font-semibold' style={{ color: INK }}>
                      Great mosque St, Alezawy, Senbellawein, Mansoura
                    </span>
                  </div>
                </div>

                {/* Direct Contact */}
                <div className='flex items-start gap-4 p-4 rounded-xl border border-[oklch(0.2_0.03_98_/_0.1)] bg-[oklch(0.96_0.02_90_/_0.7)] backdrop-blur-sm'>
                  <div className='p-2.5 rounded-lg bg-[oklch(0.2_0.03_98_/_0.06)] text-[oklch(0.2_0.03_98)] shrink-0'>
                    <Mail className='w-5 h-5' />
                  </div>
                  <div className='flex flex-col gap-0.5'>
                    <span className='text-xs font-medium uppercase tracking-wide opacity-60' style={{ color: INK }}>
                      Direct Email & Phone
                    </span>
                    <a
                      href='mailto:concierge@clothly.com'
                      className='text-sm font-semibold hover:underline'
                      style={{ color: INK }}
                    >
                      eltohamym660@gmail.com
                    </a>
                    <a href='tel:+12125550192' className='text-xs opacity-80 hover:underline mt-0.5' style={{ color: INK }}>
                      +20 1011111111
                    </a>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className='flex items-start gap-4 p-4 rounded-xl border border-[oklch(0.2_0.03_98_/_0.1)] bg-[oklch(0.96_0.02_90_/_0.7)] backdrop-blur-sm'>
                  <div className='p-2.5 rounded-lg bg-[oklch(0.2_0.03_98_/_0.06)] text-[oklch(0.2_0.03_98)] shrink-0'>
                    <Clock className='w-5 h-5' />
                  </div>
                  <div className='flex flex-col gap-0.5'>
                    <span className='text-xs font-medium uppercase tracking-wide opacity-60' style={{ color: INK }}>
                      Studio Hours
                    </span>
                    <span className='text-sm font-semibold' style={{ color: INK }}>
                      Mon – Sat: 11:00 AM – 7:00 PM EST
                    </span>
                    <span className='text-xs opacity-75' style={{ color: INK }}>
                      Sunday by private appointment
                    </span>
                  </div>
                </div>
              </div>

              {/* Service Guarantee Card */}
              <div className='p-5 rounded-2xl border border-[oklch(0.3_0.1_60_/_0.25)] bg-[oklch(0.3_0.1_60_/_0.08)] flex flex-col gap-2'>
                <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider' style={{ color: 'oklch(0.3 0.1 60)' }}>
                  <span className='w-2 h-2 rounded-full bg-[oklch(0.3_0.1_60)] inline-block' />
                  Human Support Promise
                </div>
                <p className='text-xs md:text-sm leading-relaxed opacity-90' style={{ color: INK }}>
                  No automated triage or AI bots. Every message goes directly to our local NYC studio team, responded to within 24 hours.
                </p>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className='lg:col-span-7 bg-[oklch(0.96_0.02_90_/_0.85)] backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-[oklch(0.2_0.03_98_/_0.12)] shadow-sm flex flex-col gap-6'>
              <div>
                <h3 className='text-lg sm:text-xl font-bold tracking-tight' style={{ color: INK_LIGHT }}>
                  Send a Message
                </h3>
                <p className='text-xs sm:text-sm opacity-80 mt-1' style={{ color: MUTED_INK }}>
                  Fill in your details below and we will get back to you promptly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                {/* Category Pill Selection */}
                <div className='flex flex-col gap-2'>
                  <label className='text-xs font-semibold tracking-wide uppercase opacity-75' style={{ color: INK }}>
                    Inquiry Type
                  </label>
                  <div className='flex flex-wrap gap-2'>
                    {CATEGORIES.map((cat) => {
                      const isSelected = selectedCategory === cat
                      return (
                        <button
                          key={cat}
                          type='button'
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                            isSelected
                              ? 'bg-[oklch(0.2_0.03_98)] text-[oklch(0.943_0.051_98.2)] shadow-sm scale-[1.02]'
                              : 'bg-[oklch(0.2_0.03_98_/_0.05)] text-[oklch(0.2_0.03_98)] hover:bg-[oklch(0.2_0.03_98_/_0.1)]'
                          }`}
                        >
                          {cat}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Name & Email Row */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='flex flex-col gap-1.5'>
                    <label htmlFor='fullName' className='text-xs font-semibold uppercase tracking-wide opacity-75' style={{ color: INK }}>
                      Full Name *
                    </label>
                    <input
                      id='fullName'
                      type='text'
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder='e.g. Sarah Jenkins'
                      className='w-full px-4 py-3 rounded-xl border border-[oklch(0.2_0.03_98_/_0.15)] bg-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.3_0.1_60)] focus:border-transparent transition-all placeholder:text-black/30'
                      style={{ color: INK }}
                    />
                  </div>

                  <div className='flex flex-col gap-1.5'>
                    <label htmlFor='email' className='text-xs font-semibold uppercase tracking-wide opacity-75' style={{ color: INK }}>
                      Email Address *
                    </label>
                    <input
                      id='email'
                      type='email'
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder='e.g. ahmed@example.com'
                      className='w-full px-4 py-3 rounded-xl border border-[oklch(0.2_0.03_98_/_0.15)] bg-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.3_0.1_60)] focus:border-transparent transition-all placeholder:text-black/30'
                      style={{ color: INK }}
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div className='flex flex-col gap-1.5'>
                  <label htmlFor='message' className='text-xs font-semibold uppercase tracking-wide opacity-75' style={{ color: INK }}>
                    Your Message *
                  </label>
                  <textarea
                    id='message'
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder='How can we assist you today?'
                    className='w-full px-4 py-3 rounded-xl border border-[oklch(0.2_0.03_98_/_0.15)] bg-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.3_0.1_60)] focus:border-transparent transition-all placeholder:text-black/30 resize-none'
                    style={{ color: INK }}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full mt-2 py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-[oklch(0.2_0.03_98)] text-[oklch(0.943_0.051_98.2)] hover:bg-[oklch(0.15_0.02_98)] transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed group'
                >
                  {isSubmitting ? (
                    <span className='inline-flex items-center gap-2'>
                      <svg className='animate-spin h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
                      </svg>
                      Opening WhatsApp...
                    </span>
                  ) : (
                    <>
                      <span>Submit Inquiry</span>
                      <Send className='w-4 h-4 transition-transform duration-300 group-hover:translate-x-1' />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
