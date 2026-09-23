import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  CartProvider,
  useCart,
  CART_STORAGE_KEY,
  MAX_QUANTITY_PER_ITEM,
} from './cart-context';
import type { Product } from '@/lib/products';

const product: Product = {
  id: 'p1',
  name: 'Classic Tee',
  price: 19.99,
  image: '/tee.jpg',
  category: 'clothing',
  group: 'clothing',
  section: 'men',
  description: 'Test product',
  sizes: ['S', 'M', 'L'],
  variants: [],
};

const otherProduct: Product = { ...product, id: 'p2', name: 'Hoodie', price: 49.5 };

function setup() {
  return renderHook(() => useCart(), { wrapper: CartProvider });
}

beforeEach(() => {
  window.localStorage.clear();
});

describe('CartContext', () => {
  it('adds a new line with size and color', () => {
    const { result } = setup();

    act(() => result.current.addItem(product, 'M', 'Onyx'));

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toMatchObject({
      quantity: 1,
      selectedSize: 'M',
      selectedColor: 'Onyx',
    });
    expect(result.current.totalItems).toBe(1);
    expect(result.current.totalPrice).toBeCloseTo(19.99);
  });

  it('merges the same product, size and color into one line', () => {
    const { result } = setup();

    act(() => result.current.addItem(product, 'M', 'Onyx'));
    act(() => result.current.addItem(product, 'M', 'Onyx'));

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
  });

  it('keeps same product + size with different colors as separate lines', () => {
    const { result } = setup();

    act(() => result.current.addItem(product, 'M', 'Onyx'));
    act(() => result.current.addItem(product, 'M', 'Cream'));

    expect(result.current.items).toHaveLength(2);
    expect(result.current.items.map((item) => item.selectedColor)).toEqual(['Onyx', 'Cream']);
    expect(result.current.items.every((item) => item.quantity === 1)).toBe(true);
  });

  it('keeps different sizes as separate lines', () => {
    const { result } = setup();

    act(() => result.current.addItem(product, 'M', 'Onyx'));
    act(() => result.current.addItem(product, 'L', 'Onyx'));

    expect(result.current.items).toHaveLength(2);
  });

  it('removeItem removes only the exact product/size/color line', () => {
    const { result } = setup();

    act(() => result.current.addItem(product, 'M', 'Onyx'));
    act(() => result.current.addItem(product, 'M', 'Cream'));
    act(() => result.current.removeItem(product.id, 'M', 'Onyx'));

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].selectedColor).toBe('Cream');
  });

  it('updateQuantity to 0 removes the line', () => {
    const { result } = setup();

    act(() => result.current.addItem(product, 'M', 'Onyx'));
    act(() => result.current.updateQuantity(product.id, 0, 'M', 'Onyx'));

    expect(result.current.items).toHaveLength(0);
  });

  it('updateQuantity clamps at the maximum per-line quantity', () => {
    const { result } = setup();

    act(() => result.current.addItem(product, 'M', 'Onyx'));
    act(() => result.current.updateQuantity(product.id, 99, 'M', 'Onyx'));

    expect(result.current.items[0].quantity).toBe(MAX_QUANTITY_PER_ITEM);
  });

  it('updateQuantity ignores non-finite quantities', () => {
    const { result } = setup();

    act(() => result.current.addItem(product, 'M', 'Onyx'));
    act(() => result.current.updateQuantity(product.id, NaN, 'M', 'Onyx'));

    expect(result.current.items[0].quantity).toBe(1);
  });

  it('addItem stops incrementing at the maximum', () => {
    const { result } = setup();

    act(() => result.current.addItem(product, 'M', 'Onyx'));
    act(() => result.current.updateQuantity(product.id, MAX_QUANTITY_PER_ITEM, 'M', 'Onyx'));
    act(() => result.current.addItem(product, 'M', 'Onyx'));

    expect(result.current.items[0].quantity).toBe(MAX_QUANTITY_PER_ITEM);
  });

  it('clearCart empties the cart', () => {
    const { result } = setup();

    act(() => result.current.addItem(product, 'M', 'Onyx'));
    act(() => result.current.clearCart());

    expect(result.current.items).toEqual([]);
    expect(result.current.totalPrice).toBe(0);
  });

  it('persists to localStorage after hydration', () => {
    const { result } = setup();

    act(() => result.current.addItem(product, 'M', 'Onyx'));

    const stored = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) ?? '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].selectedColor).toBe('Onyx');
  });

  it('re-hydrates from localStorage on remount', () => {
    const first = setup();

    act(() => first.result.current.addItem(product, 'M', 'Onyx'));
    act(() => first.result.current.addItem(otherProduct, 'L', 'Olive'));
    first.unmount();

    const second = setup();
    expect(second.result.current.items).toHaveLength(2);
  });

  it('ignores corrupted storage instead of crashing', () => {
    window.localStorage.setItem(CART_STORAGE_KEY, '{not json');

    const { result } = setup();
    expect(result.current.items).toEqual([]);
  });

  it('rejects malformed stored items', () => {
    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify([
        null,
        { product: { id: 'p1', name: 'Bad price', price: '19.99' }, quantity: 1 },
        { product: { id: 'p2', name: 'Bad quantity', price: 10 }, quantity: 'two' },
        { product: { id: 'p3', name: 'Ok', price: 10 }, quantity: 2 },
      ])
    );

    const { result } = setup();
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product.id).toBe('p3');
    expect(result.current.items[0].quantity).toBe(2);
  });

  it('syncs cart changes from other tabs', () => {
    const { result } = setup();

    // A real cross-tab change writes storage, then fires the storage event.
    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify([{ product, quantity: 2, selectedSize: 'M', selectedColor: 'Cream' }])
    );
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: CART_STORAGE_KEY }));
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
  });

  it('clears items when another tab empties storage', () => {
    const { result } = setup();

    act(() => result.current.addItem(product, 'M', 'Onyx'));
    act(() => {
      window.localStorage.removeItem(CART_STORAGE_KEY);
      window.dispatchEvent(new StorageEvent('storage', { key: CART_STORAGE_KEY, newValue: null }));
    });

    expect(result.current.items).toEqual([]);
  });

  it('ignores storage events for other keys', () => {
    const { result } = setup();

    act(() => result.current.addItem(product, 'M', 'Onyx'));
    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'some-other-key',
          newValue: JSON.stringify([{ product, quantity: 5 }]),
        })
      );
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(1);
  });
});
