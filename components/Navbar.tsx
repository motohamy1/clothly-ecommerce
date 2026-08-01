'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from "next/navigation";
import { useCart } from '@/lib/cart-context';
import { UserMenu } from '@/components/user-menu';

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
  { href: '/', label: 'Home' },
  { href: '/#about', label: 'About' },
  { href: '/#contact', label: 'Contact' },
]

const darkSections: string[] = [];

export default function Navbar({
  navLinks = defaultNavLinks,
  showShopLink = true,
  activeCategory,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOverDarkSection, setIsOverDarkSection] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const isClickScrollingRef = useRef(false);
  const pathname = usePathname();
  const { totalItems } = useCart();
  const primary = {
    main: 'oklch(0.2 0.03 98)',
    DEFAULT: 'oklch(0.3 0.1 60)',
  };

  useEffect(() => {
    const handleScroll = () => {
      const navbarHeight = 120;
      const scrollPosition = window.scrollY + navbarHeight;

      const sections = document.querySelectorAll('section[id]');
      let foundDarkSection = false;
      let currentSectionId = '';

      if (window.scrollY < 100) {
        currentSectionId = 'home';
      } else {
        sections.forEach((section) => {
          const sectionTop = (section as HTMLElement).offsetTop;
          const sectionHeight = (section as HTMLElement).offsetHeight;
          const sectionId = section.getAttribute('id') || '';

          if (scrollPosition >= sectionTop - 50 && scrollPosition < sectionTop + sectionHeight - 50) {
            currentSectionId = sectionId;
            if (darkSections.includes(sectionId)) {
              foundDarkSection = true;
            }
          }
        });
      }

      setIsOverDarkSection(foundDarkSection);

      if (pathname === '/' && !isClickScrollingRef.current) {
        const targetHash = (currentSectionId === 'home' || !currentSectionId) ? '' : `#${currentSectionId}`;
        const currentHash = window.location.hash;

        if (currentHash !== targetHash) {
          const newUrl = targetHash
            ? `${window.location.pathname}${window.location.search}${targetHash}`
            : `${window.location.pathname}${window.location.search}`;
          window.history.replaceState(null, '', newUrl);
          setActiveHash(targetHash);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Lock body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  // Track current hash for active-state highlighting of in-page links
  useEffect(() => {
    const sync = () => setActiveHash(window.location.hash);
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsMenuOpen(false);
    const hashIndex = href.indexOf('#');
    if (hashIndex !== -1) {
      const base = href.slice(0, hashIndex) || '/';
      const hash = href.slice(hashIndex);
      const targetId = hash.replace('#', '');
      const element = document.getElementById(targetId);

      if (pathname === base && element) {
        e.preventDefault();
        isClickScrollingRef.current = true;
        setActiveHash(hash);
        window.history.pushState(null, '', href);
        element.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          isClickScrollingRef.current = false;
        }, 1000);
      }
    } else if (href === '/' && pathname === '/') {
      e.preventDefault();
      isClickScrollingRef.current = true;
      setActiveHash('');
      window.history.pushState(null, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        isClickScrollingRef.current = false;
      }, 1000);
    }
  };

  const textColor = isOverDarkSection ? 'oklch(0.943 0.051 98.2)' : 'oklch(0.14 0.03 98)';
  const creamText = 'oklch(0.943 0.051 98.2)';
  const cartBadgeGradient = `linear-gradient(to bottom right, ${primary.main}, ${primary.DEFAULT})`;

  const isActive = (href: string) => {
    if (activeCategory) return href === `/shop/${activeCategory}`;
    const hashIndex = href.indexOf('#');
    if (hashIndex !== -1) {
      const base = href.slice(0, hashIndex) || '/';
      const hash = href.slice(hashIndex);
      return pathname === base && activeHash === hash;
    }
    if (href === '/') {
      return pathname === '/' && (activeHash === '' || activeHash === '#home');
    }
    return pathname === href;
  };

  const overlayLinks = [
    ...navLinks,
    ...(showShopLink
      ? [
          { href: '/men', label: 'Men' },
          { href: '/women', label: 'Women' },
          { href: '/kids', label: 'Kids' },
        ]
      : []),
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
                onClick={(e) => handleNavClick(e, link.href)}
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
        <div className="mx-auto max-w-8xl px-5 pt-4">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
            {/* Logo */}
            <div className={`justify-self-start shrink-0 bg-transparent backdrop-blur-md rounded-full shadow-[0_25px_40px_rgba(33,33,33,0.25)] ${isOverDarkSection ? 'border border-white/30' : 'border border-background/30'}`}>
              <div className="flex items-center h-14 px-6 sm:px-7">
                <Link href="/" onClick={(e) => handleNavClick(e, '/')} className="flex-shrink-0">
                  <span className="text-xl font-bold hover:opacity-80 transition-all duration-300 hover:scale-105" style={{ color: primary.DEFAULT }}>
                    Clothly
                  </span>
                </Link>
              </div>
            </div>

            {/* Nav Links pill - centered */}
            <div className={`justify-self-center bg-transparent backdrop-blur-md rounded-full shadow-[0_8px_32px_rgba(33,33,33,0.35),0_2px_8px_rgba(33,33,33,0.2)] border ${isOverDarkSection ? 'border-white/40' : 'border-black/15'}`}>
              <div className="flex items-center justify-between h-16 px-4">
                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-1 w-full justify-center">
                  {navLinks.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link.href)}
                        className="px-5 py-2.5 font-medium rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105"
                        style={{
                          color: active ? creamText : textColor,
                          backgroundColor: 'transparent',
                          backgroundImage: active ? cartBadgeGradient : 'none',
                          boxShadow: active ? '0 2px 8px rgba(33, 33, 33, 0.18)' : 'none',
                          border: active ? '1px solid transparent' : '1px solid transparent',
                        }}
                        onMouseEnter={(e) => {
                          if (!active) {
                            e.currentTarget.style.color = creamText;
                            e.currentTarget.style.backgroundImage = cartBadgeGradient;
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(33, 33, 33, 0.18)';
                            e.currentTarget.style.border = '1px solid transparent';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!active) {
                            e.currentTarget.style.color = textColor;
                            e.currentTarget.style.backgroundImage = 'none';
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
            <div className="hidden md:flex items-center gap-3 justify-self-end">
              <div className={`group/search flex items-center h-16 rounded-full bg-transparent backdrop-blur-md shadow-[0_25px_40px_rgba(33,33,33,0.25)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden ${isOverDarkSection ? 'border border-white/30' : 'border border-background/30'} w-14 hover:w-72 focus-within:w-72`}>
                <button
                  className="shrink-0 h-16 w-14 flex items-center justify-center rounded-full transition-colors duration-300 hover:bg-white/10"
                  aria-label="Search"
                  style={{ color: textColor }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>

                <input
                  type="search"
                  placeholder="Search products"
                  aria-label="Search products"
                  className="w-0 min-w-0 flex-1 bg-transparent text-sm font-medium outline-none transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] placeholder:opacity-70 group-hover/search:w-full group-focus-within/search:w-full"
                  style={{ color: textColor }}
                />
              </div>

              <div className={`bg-transparent backdrop-blur-md rounded-full shadow-[0_25px_40px_rgba(33,33,33,0.25)] ${isOverDarkSection ? 'border border-white/30' : 'border border-background/30'}`}>
                <div className="flex items-center gap-2 h-16 px-4">
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

                  {/* Account menu */}
                  <UserMenu iconColor={textColor} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
