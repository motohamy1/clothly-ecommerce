'use client'

import React from 'react'
import { Users, Shirt, Baby, Heart } from 'lucide-react'
import { CategoryCard } from '@/components/ui/CategoryCard'
import CollectionCarousel from '@/components/three/CollectionCarousel'

const categories = [
  {
    title: 'Men',
    description: 'Tailored fits & modern essentials',
    icon: Shirt,
    itemCount: 240,
    href: 'MenCollection',
    gradientFrom: '#181d2a',
    gradientTo: '#2a2540',
    accentColor: '#c08b79',
  },
  {
    title: 'Women',
    description: 'Elegant styles & trending pieces',
    icon: Heart,
    itemCount: 310,
    href: '/shop/women',
    gradientFrom: '#c08b79',
    gradientTo: '#a06b59',
    accentColor: '#ffd4c4',
  },
  {
    title: 'Children',
    description: 'Playful designs & comfy wear',
    icon: Baby,
    itemCount: 180,
    href: '/shop/children',
    gradientFrom: '#768f7d',
    gradientTo: '#5a7360',
    accentColor: '#a8d4b0',
  },
  {
    title: 'Couples',
    description: 'Matching outfits & duo collections',
    icon: Users,
    itemCount: 95,
    href: '/shop/couples',
    gradientFrom: '#ffa249',
    gradientTo: '#d4832a',
    accentColor: '#ffe0b2',
  },
]

function Hero() {
  return (
    <>
      <section className="min-h-screen pt-28 pb-6 px-4 sm:px-6 lg:px-16">
        <div className="mx-auto max-w-full h-[calc(100vh-8rem)]">
          <div className="flex flex-col lg:flex-row gap-5 h-full">
            {/* ===== Left Side — 1/3 ===== */}
            <div className="w-full lg:w-1/3 flex flex-col gap-4 h-full">
              {/* Branding Header */}
              <div className="px-2 py-3">
                <p
                  className="text-[11px] font-bold uppercase tracking-[0.25em] mb-1"
                  style={{ color: "#c08b79" }}
                >
                  Explore Collections
                </p>
                <h1
                  className="text-2xl lg:text-3xl font-extrabold leading-tight tracking-tight"
                  style={{ color: "#181d2a" }}
                >
                  Shop by
                  <br />
                  Category
                </h1>
                <div
                  className="w-10 h-[3px] rounded-full mt-2"
                  style={{ backgroundColor: "#c08b79" }}
                />
              </div>

              {/* Category Cards */}
              <div className="flex-1 flex flex-col gap-3 overflow-visible">
                <div className="flex flex-col gap-3">
                  {categories.map((cat) => (
                    <CategoryCard
                      key={cat.title}
                      title={cat.title}
                      description={cat.description}
                      icon={cat.icon}
                      itemCount={cat.itemCount}
                      href={cat.href}
                      gradientFrom={cat.gradientFrom}
                      gradientTo={cat.gradientTo}
                      accentColor={cat.accentColor}
                    />
                  ))}
                </div>

                {/* Bottom CTA */}
                <a
                  href="/shop"
                  className="group flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    backgroundColor: "#181d2a",
                    color: "#ffffff",
                    boxShadow: "0 4px 16px rgba(24,29,42,0.3)",
                  }}
                >
                  View All Products
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* ===== Right Side — 2/3 ===== */}
            <div className="w-full lg:w-2/3 h-full">
              <div className="px-2 py-3">
                <p
                  className="text-[11px] font-bold uppercase tracking-[0.25em] mb-2"
                  style={{ color: "#c08b79" }}
                >
                  Explore Collections
                </p>
                <h1
                  className="text-2xl lg:text-3xl font-extrabold leading-tight tracking-tight"
                  style={{ color: "#181d2a" }}
                >
                  New define of E-commerce and Shopping
                </h1>
                <div
                  className="w-10 h-[3px] rounded-full mt-2"
                  style={{ backgroundColor: "#c08b79" }}
                />
              </div>
              <div
                className="relative w-full h-[700] rounded-3xl overflow-hidden"
                style={{
                  backgroundColor: "#e5ebd3",
                  boxShadow:
                    "0 25px 60px -12px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
                }}
              >
                <CollectionCarousel />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero
