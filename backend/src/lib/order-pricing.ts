// Pure order validation + server-side pricing. No DB access here so the
// rules (and the security-critical "trust the catalog, never the client"
// recomputation) stay unit-testable.

export const MAX_QUANTITY_PER_ITEM = 10;
export const MAX_ORDER_ITEMS = 50;

/** Minimal catalog shape needed to price an order. */
export interface OrderCatalogProduct {
  id: string;
  name: string;
  price: number;
}

export interface RawCartItem {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface PricedOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

type ParseResult = { ok: true; items: RawCartItem[] } | { ok: false; error: string };

export function parseOrderItems(body: unknown): ParseResult {
  if (!body || typeof body !== 'object' || !('items' in body)) {
    return { ok: false, error: 'Order items are required' };
  }

  const rawItems = (body as { items: unknown }).items;
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return { ok: false, error: 'Order must contain at least one item' };
  }
  if (rawItems.length > MAX_ORDER_ITEMS) {
    return { ok: false, error: `Order cannot contain more than ${MAX_ORDER_ITEMS} lines` };
  }

  const items: RawCartItem[] = [];
  for (const raw of rawItems) {
    if (!raw || typeof raw !== 'object') {
      return { ok: false, error: 'Invalid order item' };
    }
    const { productId, quantity, size, color } = raw as Record<string, unknown>;

    if (typeof productId !== 'string' || productId.trim().length === 0) {
      return { ok: false, error: 'Each item needs a valid productId' };
    }
    if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1) {
      return { ok: false, error: `Quantity for ${productId} must be a positive integer` };
    }
    if (quantity > MAX_QUANTITY_PER_ITEM) {
      return { ok: false, error: `Quantity for ${productId} cannot exceed ${MAX_QUANTITY_PER_ITEM}` };
    }

    items.push({
      productId,
      quantity,
      ...(typeof size === 'string' && size ? { size } : {}),
      ...(typeof color === 'string' && color ? { color } : {}),
    });
  }
  return { ok: true, items };
}

type PriceResult =
  | { ok: true; items: PricedOrderItem[]; total: number }
  | { ok: false; error: string };

// Every line's price and name come from the catalog — never from the
// request payload. A tampered client total is simply ignored.
export function priceOrderItems(items: RawCartItem[], catalog: OrderCatalogProduct[]): PriceResult {
  const byId = new Map(catalog.map((product) => [product.id, product]));
  const priced: PricedOrderItem[] = [];
  let total = 0;

  for (const item of items) {
    const product = byId.get(item.productId);
    if (!product) {
      return { ok: false, error: `Product is no longer available: ${item.productId}` };
    }
    total += product.price * item.quantity;
    priced.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      ...(item.size ? { size: item.size } : {}),
      ...(item.color ? { color: item.color } : {}),
    });
  }

  total = Math.round(total * 100) / 100;
  return { ok: true, items: priced, total };
}
