'use client'

import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation';
import styled from 'styled-components';
// Slug-prefix based: the seeded catalog and the admin form's slug validator both require a section prefix.
// If a future product has a different prefix, the sidebar will simply not highlight a section for it (fail-soft).
function getSectionFromSlug(slug: string): 'men' | 'women' | 'kids' | null {
  if (slug.startsWith('men-')) return 'men';
  if (slug.startsWith('women-')) return 'women';
  if (slug.startsWith('kids-')) return 'kids';
  return null;
}

const items = [
    { label: 'Men Shop', id: 'men-collection', href: '/men' },
    { label: 'Women Shop', id: 'women-collection', href: '/women' },
    { label: 'Kids Shop', id: 'kids-collection', href: '/kids' },
];

const PRODUCT_ROUTE_RE = /^\/product\/([^/]+)/;

function SideBar() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const router = useRouter();
    const pathname = usePathname();
    const [prevPathname, setPrevPathname] = useState(pathname);

    if (pathname !== prevPathname) {
        setPrevPathname(pathname);
        setActiveIndex(null);
        setHoveredIndex(null);
    }

    const routeActiveIndex = (() => {
        if (!pathname) return -1;
        const sectionMatch = pathname.match(PRODUCT_ROUTE_RE);
        if (sectionMatch) {
            const section = getSectionFromSlug(sectionMatch[1]);
            if (section) {
                return items.findIndex((item) => item.href === `/${section}`);
            }
        }
        return items.findIndex((item) => item.href && pathname.startsWith(item.href));
    })();
    const displayedActiveIndex = routeActiveIndex !== -1 ? routeActiveIndex : activeIndex;

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleCardClick = (index: number, id: string, href?: string) => {
        if (href) {
            router.push(href);
        } else if ((pathname ?? '') === '/') {
            setActiveIndex(index);
            scrollTo(id);
        } else {
            router.push(`/#${id}`);
        }
    };

    const handleMouseEnter = (index: number) => {
        setHoveredIndex(index);
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
    };

    useEffect(() => {
        const visibility = new Map<string, number>();

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        visibility.set(entry.target.id, entry.intersectionRatio);
                    } else {
                        visibility.delete(entry.target.id);
                    }
                }

                let activeId: string | null = null;
                let highestRatio = -1;
                for (const [id, ratio] of visibility) {
                    if (ratio > highestRatio) {
                        highestRatio = ratio;
                        activeId = id;
                    }
                }

                if (activeId !== null) {
                    const index = items.findIndex((item) => item.id === activeId);
                    setActiveIndex(index !== -1 ? index : null);
                } else {
                    setActiveIndex(null);
                }
            },
            {
                rootMargin: '-136px 0px 0px 0px',
                threshold: [0, 0.25, 0.5, 0.75, 1],
            }
        );

        items.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [pathname ?? '']);

    return (
        <StyledWrapper>
            <div className="card fixed top-[8.5rem] left-3 z-40">
                {items.map((item, index) => {
                    const isActive = displayedActiveIndex === index;
                    return (
                        <div
                            key={item.id}
                            className={isActive ? 'active' : ''}
                            onClick={() => handleCardClick(index, item.id, item.href)}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleCardClick(index, item.id, item.href);
                                }
                            }}
                        >
                            <span>{item.label}</span>
                        </div>
                    );
                })}
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  .card {
    width: 210px;
    height: calc(100vh - 9rem);
    border-radius: 20px;
    background: transparent;
    display: flex;
    flex-direction: column;
    padding: 0.4em;
    box-shadow: 0 25px 40px rgba(33,33,33,0.25);
    overflow: hidden;
  }

  .card div {
    flex: 1;
        position: relative;
    overflow: hidden;
    cursor: pointer;
    border-radius: 15px;
    transition: flex 0.5s;
        background-color: oklch(0.93 0.035 88);
        background-image:
            repeating-linear-gradient(0deg, oklch(0.78 0.04 78 / 0.08) 0 1px, transparent 1px 4px),
            repeating-linear-gradient(90deg, oklch(1 0 0 / 0.08) 0 1px, oklch(0.74 0.05 82 / 0.03) 1px 2px, transparent 2px 6px),
            linear-gradient(135deg, oklch(0.98 0.01 95 / 0.34) 0%, transparent 28%, oklch(0.74 0.04 80 / 0.12) 100%),
            linear-gradient(180deg, oklch(0.97 0.02 90 / 0.42), oklch(0.88 0.03 84 / 0.24));
    background-blend-mode: soft-light, multiply, screen, normal;
    box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.38),
        inset 0 -1px 0 rgba(124, 96, 55, 0.08),
        0 4px 12px rgba(0,0,0,0.14);
    margin-bottom: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
  }

  .card div:last-child {
    margin-bottom: 0;
  }

  .card div:hover,
  .card div.active {
    flex: 4;
  }

  .card div.active {
        background-color: oklch(0.19 0.09 18);
        background-image:
            radial-gradient(ellipse at 22% 16%, oklch(0.36 0.12 18 / 0.34) 0 14%, transparent 42%),
            radial-gradient(ellipse at 78% 24%, oklch(0.14 0.06 18 / 0.42) 0 18%, transparent 48%),
            radial-gradient(ellipse at 48% 72%, oklch(0.31 0.11 18 / 0.26) 0 16%, transparent 44%),
            radial-gradient(circle at 50% 48%, oklch(1 0 0 / 0.04) 0 2%, transparent 18%),
            repeating-linear-gradient(90deg, oklch(1 0 0 / 0.022) 0 1px, oklch(0 0 0 / 0.028) 1px 3px, transparent 3px 6px),
            repeating-linear-gradient(0deg, oklch(1 0 0 / 0.018) 0 1px, transparent 1px 4px),
            linear-gradient(135deg, oklch(0.23 0.11 18) 0%, oklch(0.31 0.13 18) 30%, oklch(0.18 0.08 18) 100%);
        background-blend-mode: screen, multiply, screen, screen, overlay, soft-light, normal;
        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            inset 0 -10px 24px rgba(0, 0, 0, 0.2),
            0 8px 24px rgba(33, 33, 33, 0.28);
  }

  .card div span {
    padding: 0.2em;
    text-align: center;
    transform: rotate(-0deg);
    transition: transform 0.5s;
        transition-property: transform, color;
    text-transform: uppercase;
    color: oklch(0.15 0.02 98);
    font-weight: 700;
    position: relative;
    z-index: 1;
  }

  .card div:hover span,
  .card div.active span {
    transform: rotate(0);
  }

    .card div.active span {
        color: oklch(0.943 0.051 98.2);
    }

  .card div::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
        background:
                        repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.035) 0 1px, transparent 1px 5px),
                        repeating-linear-gradient(0deg, rgba(107, 78, 37, 0.05) 0 1px, transparent 1px 5px),
                        linear-gradient(160deg, rgba(255, 255, 255, 0.12), transparent 38%, rgba(0, 0, 0, 0.08));
    z-index: 0;
    transition: opacity 0.5s;
    pointer-events: none;
    opacity: 0;
  }

  .card div:hover::before,
  .card div.active::before {
    opacity: 1;
  }`;


export default SideBar