import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import ClothingCard from '@/components/ClothingCard';
import ShoeCard from '@/components/ShoeCard';
import GsapCarousel from '@/components/GsapCarousel';
import Reveal from '@/components/Reveal';
import { backendFetch } from '@/lib/backend';
import { collectionMeta } from '@/lib/collection-meta';
import { catalog } from '@/lib/product-seeds';
import type { ProductCollection, ProductSection } from '@/lib/products';

interface CategoryPageProps {
  section: ProductSection;
}

async function CategoryPage({ section }: CategoryPageProps) {
  let collection: ProductCollection | undefined;
  let backendError: string | null = null;

  try {
    const data = await backendFetch('/shop/' + section) as { collection?: ProductCollection };
    collection = data.collection;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown backend error';
    console.error(`[clothly] backend unreachable for /shop/${section}:`, message);
    backendError = `Backend unreachable. Showing fallback catalog. (${message})`;
    collection = catalog[section];
  }
  const meta = collectionMeta[section];

  if (!collection) return null;

  // Every photo across the section's products, deduplicated in catalog order.
  // Guarantees all images from the section appear on its page, not just the
  // one photo each product card shows.
  const everyPhoto: { src: string; productId: string; productName: string }[] = [];
  {
    const seen = new Set<string>();
    for (const product of [
      ...collection.groups.clothing,
      ...collection.groups.outerwear,
      ...collection.groups.shoes,
    ]) {
      const gallery = product.images && product.images.length > 0 ? product.images : [product.image];
      for (const src of gallery) {
        if (seen.has(src)) continue;
        seen.add(src);
        everyPhoto.push({ src, productId: product.id, productName: product.name });
      }
    }
  }

  return (
    <StyledWrapper>
      {backendError && <div className="backend-error">{backendError}</div>}
      <div id={`${section}-collection`}>
        <span className="eyebrow">{meta.label}</span>
        <h1 className="page-title">
          {meta.headline.split('\n').map((line, index) => (
            <React.Fragment key={line}>
              {index > 0 && <br />}
              {line}
            </React.Fragment>
          ))}
        </h1>

        <Reveal y={18} blur={3} duration={700}>
          <section className="section">
            <h2 className="section-title">Clothing</h2>
            <GsapCarousel itemWidth={260} gap={20}>
              {collection.groups.clothing.map((p) => (
                <ClothingCard key={p.id} product={p} />
              ))}
            </GsapCarousel>
          </section>
        </Reveal>

        <Reveal y={18} blur={3} duration={700}>
          <section className="section">
            <h2 className="section-title">Outerwear</h2>
            <GsapCarousel itemWidth={260} gap={20}>
              {collection.groups.outerwear.map((p) => (
                <ClothingCard key={p.id} product={p} />
              ))}
            </GsapCarousel>
          </section>
        </Reveal>

        <Reveal y={18} blur={3} duration={700}>
          <section className="section">
            <h2 className="section-title">Shoes</h2>
            <GsapCarousel itemWidth={180} gap={24}>
              {collection.groups.shoes.map((p) => (
                <ShoeCard key={p.id} product={p} />
              ))}
            </GsapCarousel>
          </section>
        </Reveal>

        <Reveal y={18} blur={3} duration={700}>
          <section className="section">
            <h2 className="section-title">Complete Collection</h2>
            <div className="photo-grid">
              {everyPhoto.map((tile) => (
                <Link
                  key={tile.src}
                  href={`/product/${tile.productId}`}
                  className="photo-tile"
                  aria-label={`View ${tile.productName}`}
                  title={tile.productName}
                >
                  <Image
                    src={tile.src}
                    alt={tile.productName}
                    fill
                    sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 200px"
                    className="photo-img"
                  />
                </Link>
              ))}
            </div>
          </section>
        </Reveal>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .backend-error {
    background: oklch(0.35 0.12 28);
    color: oklch(0.92 0.06 75);
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 0.8rem;
    margin-bottom: 1.5rem;
    border: 1px solid oklch(0.45 0.12 28 / 0.4);
  }

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

  .photo-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
  }

  @media (min-width: 640px) {
    .photo-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .photo-grid {
      grid-template-columns: repeat(6, 1fr);
    }
  }

  @media (min-width: 1280px) {
    .photo-grid {
      grid-template-columns: repeat(8, 1fr);
    }
  }

  .photo-tile {
    position: relative;
    display: block;
    aspect-ratio: 4 / 5;
    overflow: hidden;
    border-radius: 18px;
    outline: 1px solid oklch(0.2 0.03 98 / 0.12);
    transition: transform 300ms cubic-bezier(0.32, 0.72, 0, 1);
  }

  .photo-tile:hover {
    transform: translateY(-3px);
  }

  .photo-img {
    object-fit: cover;
  }
`;

export default CategoryPage;
