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
        <h1 className="page-title">Men&rsquo;s Collection</h1>

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
  .page-title {
    font-size: 2rem;
    font-weight: 800;
    color: #02343F;
    margin-bottom: 2.5rem;
  }

  .section {
    margin-bottom: 3rem;
  }

  .section-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 1rem;
  }
`;

export default MenPage;
