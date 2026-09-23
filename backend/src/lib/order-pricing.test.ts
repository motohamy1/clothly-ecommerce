import { describe, it, expect } from 'vitest';
import {
  MAX_QUANTITY_PER_ITEM,
  parseOrderItems,
  priceOrderItems,
  type RawCartItem,
} from './order-pricing';

const catalog = [
  { id: 'p1', name: 'Classic Tee', price: 19.99 },
  { id: 'p2', name: 'Hoodie', price: 50 },
];

describe('parseOrderItems', () => {
  it('accepts a valid payload and keeps optional size/color', () => {
    const result = parseOrderItems({
      items: [{ productId: 'p1', quantity: 2, size: 'M', color: 'Onyx' }],
    });

    expect(result).toEqual({
      ok: true,
      items: [{ productId: 'p1', quantity: 2, size: 'M', color: 'Onyx' }],
    });
  });

  it('omits missing or non-string size/color', () => {
    const result = parseOrderItems({
      items: [{ productId: 'p1', quantity: 1, size: 42, color: '' }],
    });

    expect(result.ok && result.items[0]).toEqual({ productId: 'p1', quantity: 1 });
  });

  it('strips client-supplied price fields (pricing is server-side only)', () => {
    const result = parseOrderItems({
      items: [{ productId: 'p1', quantity: 1, price: 0.01, total: 0.01 }],
    });

    expect(result.ok).toBe(true);
    expect(result.ok && result.items[0]).toEqual({ productId: 'p1', quantity: 1 });
  });

  it('rejects a missing or non-object body', () => {
    expect(parseOrderItems(null)).toEqual({ ok: false, error: 'Order items are required' });
    expect(parseOrderItems({ foo: 'bar' })).toEqual({ ok: false, error: 'Order items are required' });
  });

  it('rejects a missing, non-array or empty items list', () => {
    expect(parseOrderItems({ items: 'nope' }).ok).toBe(false);
    expect(parseOrderItems({ items: [] })).toEqual({
      ok: false,
      error: 'Order must contain at least one item',
    });
  });

  it('rejects more than the maximum number of lines', () => {
    const items = Array.from({ length: 51 }, (_, i) => ({ productId: `p${i}`, quantity: 1 }));
    const result = parseOrderItems({ items });

    expect(result.ok).toBe(false);
    expect(result.ok === false && result.error).toContain('50');
  });

  it('rejects a missing or blank productId', () => {
    expect(parseOrderItems({ items: [{ quantity: 1 }] }).ok).toBe(false);
    expect(parseOrderItems({ items: [{ productId: '  ', quantity: 1 }] }).ok).toBe(false);
  });

  for (const bad of [0, -1, 1.5, '2', null, undefined, NaN, Infinity] as unknown[]) {
    it(`rejects invalid quantity ${JSON.stringify(bad)}`, () => {
      const result = parseOrderItems({ items: [{ productId: 'p1', quantity: bad }] });
      expect(result.ok).toBe(false);
    });
  }

  it(`rejects a quantity above the per-line max (${MAX_QUANTITY_PER_ITEM})`, () => {
    const result = parseOrderItems({ items: [{ productId: 'p1', quantity: MAX_QUANTITY_PER_ITEM + 1 }] });
    expect(result.ok).toBe(false);
  });
});

describe('priceOrderItems', () => {
  it('prices every line from the catalog, never from the client', () => {
    const parsed = parseOrderItems({
      items: [
        { productId: 'p1', quantity: 2 },
        { productId: 'p2', quantity: 1 },
      ],
    });
    if (!parsed.ok) throw new Error('setup failed');

    const result = priceOrderItems(parsed.items, catalog);

    expect(result).toEqual({
      ok: true,
      total: 89.98,
      items: [
        { productId: 'p1', name: 'Classic Tee', price: 19.99, quantity: 2 },
        { productId: 'p2', name: 'Hoodie', price: 50, quantity: 1 },
      ],
    });
  });

  it('fails when a product is missing from the catalog', () => {
    const result = priceOrderItems([{ productId: 'gone', quantity: 1 }], catalog);

    expect(result).toEqual({ ok: false, error: 'Product is no longer available: gone' });
  });

  it('rounds the total to cents', () => {
    const result = priceOrderItems(
      [{ productId: 'p3', quantity: 3 }],
      [{ id: 'p3', name: 'Sticker', price: 0.1 }]
    );

    expect(result.ok && result.total).toBe(0.3);
  });

  it('uses the catalog price even when the client claims a different one', () => {
    // A tampered client that reaches this layer with extra fields still gets
    // repriced: only productId/quantity/size/color survive parsing.
    const tampered = [{ productId: 'p1', quantity: 1 } as RawCartItem];
    const result = priceOrderItems(tampered, [{ id: 'p1', name: 'Classic Tee', price: 5 }]);

    expect(result.ok && result.items[0].price).toBe(5);
    expect(result.ok && result.total).toBe(5);
  });
});
