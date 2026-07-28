'use client';

import React from 'react';
import styled from 'styled-components';
import type { Product } from '@/lib/products';

interface ShoeCardProps {
  product: Product;
}

const ShoeCard = ({ product }: ShoeCardProps) => {
  return (
    <StyledWrapper>
      <div className="card">
        <div className="circle">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="info">
          <span className="name">{product.name}</span>
          <span className="price">${product.price.toFixed(2)}</span>
        </div>
      </div>
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
  }

  .circle {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    overflow: hidden;
    background: #f5f0eb;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .card:hover .circle {
    transform: scale(1.08);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
  }

  .circle img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  .card:hover .circle img {
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
    color: #1a1a1a;
  }

  .price {
    font-size: 15px;
    font-weight: 700;
    color: #02343F;
  }
`;

export default ShoeCard;
