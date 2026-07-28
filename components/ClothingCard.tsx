'use client';

import React from 'react';
import styled from 'styled-components';
import type { Product } from '@/lib/products';

interface ClothingCardProps {
    product: Product;
}

const StarRating = ({ rating }: { rating: number }) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return (
        <span>
            {'★'.repeat(full)}
            {half ? '½' : ''}
            {'☆'.repeat(empty)}
        </span>
    );
};

const ClothingCard = ({ product }: ClothingCardProps) => {
    return (
        <StyledWrapper>
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
                    <span className="box-label rating-stars"><StarRating rating={product.rating} /></span>
                </div>
                <button type="button" className="add-to-cart">
                    Add to Cart
                </button>
            </div>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
  .card {
    position: relative;
    width: 260px;
    height: 260px;
    background: lightgrey;
    border-radius: 30px;
    overflow: hidden;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    transition: all 1s ease-in-out;
    border: 2px solid rgb(255, 255, 255);
    flex-shrink: 0;
    cursor: pointer;
  }

  .background {
    position: absolute;
    inset: 0;
    background-color: #4158D0;
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
    transition: all 0.6s ease-in-out;
    font-size: 0.9em;
    font-weight: 600;
    color: #ffffff;
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
    background: rgba(255, 255, 255, 0.389);
    border-top: 2px solid rgb(255, 255, 255);
    border-right: 1px solid white;
    border-radius: 10% 13% 42% 0%/10% 12% 75% 0%;
    box-shadow: rgba(100, 100, 111, 0.364) -7px 7px 29px 0px;
    transform-origin: bottom left;
    transition: all 1s ease-in-out;
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
    transition: all 0.5s ease-in-out;
  }

  .box-label {
    font-size: 0.75em;
    font-weight: 700;
    color: #fff;
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
    top: -30%;
    left: -30%;
    z-index: 1;
    transition-delay: 0.2s;
  }

  .rating-stars {
    font-size: 0.85em;
    letter-spacing: 0px;
  }

  .add-to-cart {
    position: absolute;
    bottom: 14px;
    right: 14px;
    padding: 10px 18px;
    background: #111;
    color: #fff;
    border: none;
    border-radius: 999px;
    font-size: 0.82em;
    font-weight: 600;
    letter-spacing: 0.3px;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
    transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
    z-index: 2;
  }

  .add-to-cart:hover {
    background: #000;
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
  }

  .add-to-cart:active {
    transform: translateY(0);
  }

  .card:hover {
    transform: scale(1.05);
  }

  .card:hover .box1 {
    top: 0;
    left: 0;
  }

  .card:hover .box2 {
    width: 70%;
    height: 30%;
    top: 0;
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
