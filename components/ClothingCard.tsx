'use client';

import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import type { Product } from '@/lib/products';

interface ClothingCardProps {
    product: Product;
}

const ClothingCard = ({ product }: ClothingCardProps) => {
    return (
        <StyledWrapper>
            <Link href={`/product/${product.id}`} className="card-shell" aria-label={`View details for ${product.name}`}>
                <div className="card">
                    <div className="background">
                        <img src={product.image} alt={product.name} className="product-img" />
                    </div>
                    <div className="logo">
                        <span className="product-name">{product.name}</span>
                    </div>
                    <div className="box box1">
                        <span className="box-label">${product.price.toFixed(2)}</span>
                    </div>
                    <div className="box box2">
                        <span className="box-label size-label">{product.sizes?.[1] ?? 'M'}</span>
                    </div>
                    {/*<button
                        type="button"
                        className="add-to-cart"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        Add to Cart
                    </button>*/}
                </div>
            </Link>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
  .card-shell {
    display: block;
    background: oklch(0.2 0.03 98 / 0.04);
    border: 1px solid oklch(0.2 0.03 98 / 0.08);
    border-radius: 34px;
    padding: 5px;
    flex-shrink: 0;
    text-decoration: none;
    color: inherit;
    transition: transform 0.7s cubic-bezier(0.32, 0.72, 0, 1), box-shadow 0.7s cubic-bezier(0.32, 0.72, 0, 1);
  }

  .card-shell:hover {
    transform: scale(1.03);
    box-shadow: 0 20px 60px oklch(0.2 0.03 98 / 0.12);
  }

  .card {
    position: relative;
    width: 260px;
    height: 260px;
    background: lightgrey;
    border-radius: 28px;
    overflow: hidden;
    box-shadow: rgba(100, 100, 111, 0.15) 0px 4px 16px 0px;
    flex-shrink: 0;
    cursor: pointer;
  }

  .background {
    position: absolute;
    inset: 0;
    background-color: oklch(0.32 0.08 130);
  }

  .product-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .logo {
    position: absolute;
    right: 50%;
    bottom: 50%;
    transform: translate(50%, 50%);
    transition: all 0.6s cubic-bezier(0.32, 0.72, 0, 1);
    font-size: 0.9em;
    font-weight: 600;
    color: oklch(0.943 0.051 98.2);
    letter-spacing: 2px;
    text-align: center;
    max-width: 180px;
    text-shadow: 0 2px 8px rgba(0,0,0,0.4);
  }

  .product-name {
    display: block;
  }

  .box {
    position: absolute;
    padding: 10px;
    background: oklch(0.943 0.051 98.2 / 0.389);
    border-top: 2px solid oklch(0.943 0.051 98.2);
    border-right: 1px solid oklch(0.943 0.051 98.2);
    border-radius: 10% 13% 42% 0%/10% 12% 75% 0%;
    box-shadow: rgba(100, 100, 111, 0.364) -7px 7px 29px 0px;
    transform-origin: bottom left;
    transition: all 1s cubic-bezier(0.32, 0.72, 0, 1);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .box::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    opacity: 0;
    transition: all 0.5s cubic-bezier(0.32, 0.72, 0, 1);
  }

  .box-label {
    font-size: 0.75em;
    font-weight: 700;
    color: oklch(0.943 0.051 98.2);
    text-shadow: 0 1px 4px rgba(0,0,0,0.3);
    text-align: center;
    line-height: 1.2;
    z-index: 10;
  }

  .box1 {
    width: 50%;
    height: 50%;
    bottom: -50%;
    left: -50%;
    z-index: 3;
    align-items: flex-start;
    justify-content: flex-end;
    padding-top: 14px;
    padding-right: 14px;
  }

  .box2 {
    width: 30%;
    height: 30%;
    bottom: -30%;
    left: -30%;
    z-index: 1;
    transition-delay: 0.2s;
  }

  .size-label {
    font-size: 0.85em;
    font-weight: 700;
    letter-spacing: 0px;
  }


  .add-to-cart {
    position: absolute;
    bottom: 14px;
    right: 14px;
    padding: 10px 18px;
    background: oklch(0.15 0.02 98);
    color: oklch(0.943 0.051 98.2);
    border: none;
    border-radius: 999px;
    font-size: 0.82em;
    font-weight: 600;
    letter-spacing: 0.3px;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
    transition: background 0.5s cubic-bezier(0.32, 0.72, 0, 1), transform 0.5s cubic-bezier(0.32, 0.72, 0, 1), box-shadow 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    z-index: 2;
  }

  .add-to-cart:hover {
    background: oklch(0.1 0.01 98);
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
  }

  .add-to-cart:active {
    transform: translateY(0) scale(0.98);
  }

  .card:hover .box1 {
    bottom: 0;
    left: 0;
  }

  .card:hover .box2 {
    width: 30%;
    height: 30%;
    bottom: 0;
    left: 0;
    z-index: 3;
  }

  .card:hover .logo {
    transform: translate(60px, -40px);
    letter-spacing: 0px;
    font-size: 0.75em;
  }
`;

export default ClothingCard;
