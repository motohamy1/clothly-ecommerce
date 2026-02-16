'use client'

import { useState } from 'react'
import Link from 'next/link'
import { brandColors } from "@/constant/theme";

interface NavLink {
  href: string;
  label: string;
}

interface NavbarProps {
  navLinks?: NavLink[];
  showShopLink?: boolean;
}

const defaultNavLinks: NavLink[] = [
  { href: '#home', label: 'Home' },
  { href: '#categories', label: 'Categories' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar({ navLinks = defaultNavLinks, showShopLink = true }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { primary, accent } = brandColors;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mt-6">
          {/* Logo Section */}
          <div className="bg-transparent backdrop-blur-md border border-background/30 rounded-full shadow-[0_25px_40px_rgba(33,33,33,0.25)]">
            <div className="flex items-center h-16 px-6">
              <Link href="/" className="flex-shrink-0">
                <span className="text-2xl font-bold bg-clip-text text-[#c08b79] hover:text-background transition-all duration-300 hover:scale-105">
                  Clothly
                </span>
              </Link>
            </div>
          </div>

          {/* Navigation Links Section */}
          <div className="flex-1 bg-transparent backdrop-blur-md border border-background/30 rounded-full shadow-[0_25px_40px_rgba(33,33,33,0.25)]">
            <div className="flex items-center justify-between h-16 px-4">
              {/* Desktop Navigation Links */}
              <div className="hidden md:flex items-center gap-1 w-full justify-center">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 font-medium rounded-full transition-all duration-300 hover:scale-105"
                    style={{ color: primary.main }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#c08b79";
                      e.currentTarget.style.backgroundColor =
                        "rgba(192, 139, 121, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = primary.main;
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 text-gray-500 rounded-lg transition-all duration-300 hover:bg-white/10 mx-auto"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
                style={{ color: primary.main }}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <div className="md:hidden py-4 space-y-1 border-t border-white/10 px-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-gray-700 hover:bg-white/50 rounded-lg transition-all duration-300"
                    style={{ color: primary.main }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Shop Link Section */}
          {showShopLink && (
            <div className="bg-transparent backdrop-blur-md border border-background/30 rounded-full shadow-[0_25px_40px_rgba(33,33,33,0.25)]">
              <div className="flex items-center h-16 px-6">
                <Link
                  href="/shop"
                  className="text-xl font-bold transition-all duration-300 hover:scale-105"
                  style={{ color: primary.main }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#c08b79";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = primary.main;
                  }}
                >
                  Shop
                </Link>
              </div>
            </div>
          )}

          {/* Right Navbar - Search, Cart, Profile */}
          <div className="hidden md:flex bg-transparent backdrop-blur-md border border-background/30 rounded-full shadow-[0_25px_40px_rgba(33,33,33,0.25)]">
            <div className="flex items-center gap-2 h-16 px-4">
              {/* Search Icon */}
              <button
                className="p-2 text-gray-500 rounded-lg transition-all duration-300 hover:bg-white/10"
                aria-label="Search"
                style={{ color: primary.main }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              {/* Cart Icon */}
              <button
                className="p-2 text-gray-500 rounded-lg transition-all duration-300 hover:bg-white/10 relative"
                aria-label="Cart"
                style={{ color: primary.main }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span
                  className="absolute top-1 right-1 text-white text-[10px] font-semibold min-w-4 h-4 flex items-center justify-center rounded-lg px-1"
                  style={{
                    background: `linear-gradient(to bottom right, ${primary.main}, ${primary.DEFAULT})`,
                  }}
                >
                  0
                </span>
              </button>

              {/* User Icon */}
              <button
                className="p-2 text-gray-500 rounded-lg transition-all duration-300 hover:bg-white/10"
                aria-label="Account"
                style={{ color: primary.main }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

