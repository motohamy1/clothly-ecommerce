'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from "next/navigation";
import { useCart } from '@/lib/cart-context';

interface NavLink {
  href: string;
  label: string;
}

interface NavbarProps {
  navLinks?: NavLink[];
  showShopLink?: boolean;
  activeCategory?: string;
}

const defaultNavLinks: NavLink[] = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

const darkSections = ['about', 'contact'];

export default function Navbar({
  navLinks = defaultNavLinks,
  showShopLink = true,
  activeCategory,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOverDarkSection, setIsOverDarkSection] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCart();
  const primary = {
    main: 'oklch(0.2 0.03 98)',
    DEFAULT: 'oklch(0.3 0.1 60)',
  };

  useEffect(() => {
    const handleScroll = () => {
      const navbarHeight = 100;
      const scrollPosition = window.scrollY + navbarHeight;

      const sections = document.querySelectorAll('section[id]');
      let foundDarkSection = false;

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        const sectionId = section.getAttribute('id') || '';

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          foundDarkSection = darkSections.includes(sectionId);
        }
      });

      setIsOverDarkSection(foundDarkSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const textColor = isOverDarkSection ? 'oklch(0.943 0.051 98.2)' : primary.main;

  const isActive = (href: string) => {
    if (activeCategory) return href === `/shop/${activeCategory}`;
    return pathname === href;
  };

  const overlayLinks = [
    ...navLinks,
    ...(showShopLink ? [{ href: '/shop', label: 'Shop' }] : []),
  ];

  return (
    <>
      {/* ── Fullscreen mobile overlay ── */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col items-center justify-center
          backdrop-blur-3xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'oklch(0.943 0.051 98.2 / 0.92)' }}
        aria-hidden={!isMenuOpen}
      >
        {/* Close button */}
        <button
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close menu"
          className="absolute top-6 right-6 w-10 h-10 flex flex-col items-center justify-center gap-[5px] rounded-full hover:bg-black/5 transition-colors duration-200"
        >
          <span
            className="block w-6 h-[1.5px] origin-center translate-y-[3.25px] rotate-45"
            style={{ background: primary.main }}
          />
          <span
            className="block w-6 h-[1.5px] origin-center -translate-y-[3.25px] -rotate-45"
            style={{ background: primary.main }}
          />
        </button>

        {/* Staggered nav links */}
        <nav className="flex flex-col items-center gap-6">
          {overlayLinks.map((link, index) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`text-4xl font-bold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
                  ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                style={{
                  color: active ? primary.DEFAULT : primary.main,
                  transitionDelay: `${index * 75}ms`,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = primary.DEFAULT; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = active ? primary.DEFAULT : primary.main; }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 mt-6">
            {/* Logo */}
            <div className={`shrink-0 bg-transparent backdrop-blur-md rounded-full shadow-[0_25px_40px_rgba(33,33,33,0.25)] ${isOverDarkSection ? 'border border-white/30' : 'border border-background/30'}`}>
              <div className="flex items-center h-16 px-6">
                <Link href="/" className="flex-shrink-0">
                  <span className="text-2xl font-bold hover:opacity-80 transition-all duration-300 hover:scale-105" style={{ color: primary.DEFAULT }}>
                    Clothly
                  </span>
                </Link>
              </div>
            </div>

            {/* Nav Links pill - centered */}
            <div className={`absolute left-1/2 -translate-x-1/2 bg-transparent backdrop-blur-md rounded-full shadow-[0_8px_32px_rgba(33,33,33,0.35),0_2px_8px_rgba(33,33,33,0.2)] border ${isOverDarkSection ? 'border-white/40' : 'border-black/15'}`}>
              <div className="flex items-center justify-between h-16 px-4">
                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-1 w-full justify-center">
                  {navLinks.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="px-5 py-2.5 font-medium rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105"
                        style={{
                          color: active ? primary.DEFAULT : textColor,
                          backgroundColor: active ? "oklch(0.3 0.1 60 / 0.15)" : "transparent",
                          boxShadow: active ? '0 2px 8px oklch(0.3 0.1 60 / 0.15)' : 'none',
                          border: active ? '1px solid oklch(0.3 0.1 60 / 0.3)' : '1px solid transparent',
                        }}
                        onMouseEnter={(e) => {
                          if (!active) {
                            e.currentTarget.style.color = primary.DEFAULT;
                            e.currentTarget.style.backgroundColor = "oklch(0.3 0.1 60 / 0.08)";
                            e.currentTarget.style.boxShadow = '0 2px 8px oklch(0.3 0.1 60 / 0.1)';
                            e.currentTarget.style.border = '1px solid oklch(0.3 0.1 60 / 0.2)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!active) {
                            e.currentTarget.style.color = textColor;
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.border = '1px solid transparent';
                          }
                        }}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>

                {/* Hamburger → X morph (mobile only) */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="Toggle menu"
                  aria-expanded={isMenuOpen}
                  className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-[5px] mx-auto rounded-lg hover:bg-white/10 transition-colors duration-200"
                >
                  <span
                    className={`block w-6 h-[1.5px] origin-center transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
                      ${isMenuOpen ? 'translate-y-[6.5px] rotate-45' : ''}`}
                    style={{ background: textColor }}
                  />
                  <span
                    className={`block w-6 h-[1.5px] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
                      ${isMenuOpen ? 'opacity-0 scale-x-0' : ''}`}
                    style={{ background: textColor }}
                  />
                  <span
                    className={`block w-6 h-[1.5px] origin-center transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
                      ${isMenuOpen ? '-translate-y-[6.5px] -rotate-45' : ''}`}
                    style={{ background: textColor }}
                  />
                </button>
              </div>
            </div>


            {/* Icons */}
            <div className={`hidden md:flex bg-transparent backdrop-blur-md rounded-full shadow-[0_25px_40px_rgba(33,33,33,0.25)] ${isOverDarkSection ? 'border border-white/30' : 'border border-background/30'}`}>
              <div className="flex items-center gap-2 h-16 px-4">
                {/* Search */}
                <button
                  className="p-2 rounded-lg transition-all duration-300 hover:bg-white/10"
                  aria-label="Search"
                  style={{ color: textColor }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>

                {/* Cart */}
                <Link
                  href="/cart"
                  className="p-2 rounded-lg transition-all duration-300 hover:bg-white/10 relative"
                  aria-label="Cart"
                  style={{ color: textColor }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {totalItems > 0 && (
                    <span
                      className="absolute top-1 right-1 text-[10px] font-semibold min-w-4 h-4 flex items-center justify-center rounded-lg px-1"
                      style={{
                        background: `linear-gradient(to bottom right, ${primary.main}, ${primary.DEFAULT})`,
                        color: 'oklch(0.943 0.051 98.2)',
                      }}
                    >
                      {totalItems}
                    </span>
                  )}
                </Link>

                {/* Account */}
                <button
                  className="p-2 rounded-lg transition-all duration-300 hover:bg-white/10"
                  aria-label="Account"
                  style={{ color: textColor }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
