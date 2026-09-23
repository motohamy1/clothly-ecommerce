import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';

let mockPathname: string | null = '/shop/men';

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}));

import NavigationMemory, { readLastPage } from './NavigationMemory';

const KEY = 'clothly-last-page';

beforeEach(() => {
  window.sessionStorage.clear();
  mockPathname = '/shop/men';
});

describe('NavigationMemory', () => {
  it('records the current page so the cart can return to it', () => {
    render(<NavigationMemory />);

    expect(window.sessionStorage.getItem(KEY)).toBe('/shop/men');
    expect(readLastPage()).toBe('/shop/men');
  });

  it('records product pages too', () => {
    mockPathname = '/product/classic-tee';

    render(<NavigationMemory />);

    expect(readLastPage()).toBe('/product/classic-tee');
  });

  it('never records the cart page itself', () => {
    mockPathname = '/cart';

    render(<NavigationMemory />);

    expect(window.sessionStorage.getItem(KEY)).toBeNull();
    expect(readLastPage()).toBeNull();
  });

  it('keeps the previous page when landing directly on the cart', () => {
    // Visit a shop page first…
    render(<NavigationMemory />);
    expect(readLastPage()).toBe('/shop/men');

    // …then navigate to the cart: the memory must survive.
    mockPathname = '/cart';
    render(<NavigationMemory />);

    expect(readLastPage()).toBe('/shop/men');
  });

  it('readLastPage returns null when storage is unavailable', () => {
    const original = window.sessionStorage.getItem.bind(window.sessionStorage);
    window.sessionStorage.getItem = () => {
      throw new Error('blocked');
    };

    try {
      expect(readLastPage()).toBeNull();
    } finally {
      window.sessionStorage.getItem = original;
    }
  });
});
