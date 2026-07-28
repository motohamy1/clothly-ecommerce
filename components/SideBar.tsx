'use client'

import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { getProductSection } from '@/lib/products';

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
            const section = getProductSection(sectionMatch[1]);
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
    overflow: hidden;
    cursor: pointer;
    border-radius: 15px;
    transition: flex 0.5s;
    background: oklch(0.943 0.051 98.2);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
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
    background: oklch(0.88 0.12 98);
  }

  .card div span {
    padding: 0.2em;
    text-align: center;
    transform: rotate(-0deg);
    transition: transform 0.5s;
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

  .card div::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1);
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