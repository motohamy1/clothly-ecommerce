'use client';

import React from 'react';
import styled from 'styled-components';
import ClothingCard from '@/components/ClothingCard';
import ShoeCard from '@/components/ShoeCard';
import GsapCarousel from '@/components/GsapCarousel';
import { menClothing, menOuterwear, menShoes } from '@/lib/products';

function MenPage() {
  return (
    <StyledWrapper>
      <div id="men-collection">
        <span className="eyebrow">Men&rsquo;s Collection</span>
        <h1 className="page-title">Dress Well,<br/>Live Well.</h1>

        <section className="section">
          <h2 className="section-title">Clothing</h2>
          <GsapCarousel itemWidth={260} gap={20}>
            {menClothing.map((p) => (
              <ClothingCard key={p.id} product={p} />
            ))}
          </GsapCarousel>
        </section>

        <section className="section">
          <h2 className="section-title">Outerwear</h2>
          <GsapCarousel itemWidth={260} gap={20}>
            {menOuterwear.map((p) => (
              <ClothingCard key={p.id} product={p} />
            ))}
          </GsapCarousel>
        </section>

        <section className="section">
          <h2 className="section-title">Shoes</h2>
          <GsapCarousel itemWidth={180} gap={24}>
            {menShoes.map((p) => (
              <ShoeCard key={p.id} product={p} />
            ))}
          </GsapCarousel>
        </section>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .eyebrow {
    display: inline-block;
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: oklch(0.48 0.03 98);
    border: 1px solid oklch(0.2 0.03 98 / 0.2);
    border-radius: 999px;
    padding: 0.25rem 0.75rem;
    margin-bottom: 1rem;
  }

  .page-title {
    font-size: clamp(2.5rem, 5vw, 4rem);
    line-height: 0.95;
    letter-spacing: -0.02em;
    font-weight: 800;
    color: oklch(0.2 0.03 98);
    margin-bottom: 2.5rem;
  }

  .section {
    margin-bottom: 5rem;
    padding-top: 1rem;
  }

  .section-title {
    font-size: 1.5rem;
    letter-spacing: -0.01em;
    font-weight: 700;
    color: oklch(0.15 0.02 98);
    margin-bottom: 1rem;
  }
`;

export default MenPage;
