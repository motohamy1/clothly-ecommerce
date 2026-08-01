'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import type { Product } from '@/lib/products';

interface ShoeCardProps {
  product: Product;
}

const ShoeCard = ({ product }: ShoeCardProps) => {
  return (
    <StyledWrapper>
      <Link href={`/product/${product.id}`} className="card" aria-label={`View details for ${product.name}`}>
        <div className="circle">
          <Image src={product.image} alt={product.name} fill sizes="160px" className="shoe-img" loading="lazy" />
        </div>
        <div className="info">
          <span className="name">{product.name}</span>
          <span className="price">${product.price.toFixed(2)}</span>
        </div>
      </Link>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
  }

  .circle {
    position: relative;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    overflow: hidden;
    background: oklch(0.96 0.02 90);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .card:hover .circle {
    transform: scale(1.08);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
  }

  .shoe-img {
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  .card:hover .shoe-img {
    transform: scale(1.1);
  }

  .info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .name {
    font-size: 14px;
    font-weight: 600;
    color: oklch(0.2 0.03 98);
  }

  .price {
    font-size: 15px;
    font-weight: 700;
    color: oklch(0.2 0.03 98);
  }
`;

export default ShoeCard;
