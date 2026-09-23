'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Product } from '@/lib/products';

export const CART_STORAGE_KEY = 'clothly-cart:v1';
export const MAX_QUANTITY_PER_ITEM = 10;

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size?: string, color?: string) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isHydrated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// A cart line is uniquely identified by product + size + color together.
// Matching on product+size alone (the previous behavior) silently merged
// same-size different-color variants into one line and dropped the new color.
function sameLine(
  item: CartItem,
  productId: string,
  size: string | undefined,
  color: string | undefined,
): boolean {
  return (
    item.product.id === productId &&
    (item.selectedSize ?? null) === (size ?? null) &&
    (item.selectedColor ?? null) === (color ?? null)
  );
}

function clampQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 0;
  return Math.min(Math.floor(quantity), MAX_QUANTITY_PER_ITEM);
}

// Storage is untrusted input: validate shape before trusting any of it.
function parseStoredItems(raw: string): CartItem[] {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];

  const lines = new Map<string, CartItem>();
  for (const entry of data) {
    if (!entry || typeof entry !== 'object') continue;
    const { product, quantity, selectedSize, selectedColor } = entry as Record<string, unknown>;
    if (!product || typeof product !== 'object') continue;
    const p = product as Record<string, unknown>;
    if (typeof p.id !== 'string' || typeof p.name !== 'string' || typeof p.price !== 'number') continue;
    const qty = clampQuantity(quantity as number);
    if (qty < 1) continue;

    const key = [
      p.id,
      typeof selectedSize === 'string' ? selectedSize : null,
      typeof selectedColor === 'string' ? selectedColor : null,
    ].join('|');

    const existing = lines.get(key);
    if (existing) {
      existing.quantity = clampQuantity(existing.quantity + qty);
      continue;
    }

    lines.set(key, {
      product: product as Product,
      quantity: qty,
      selectedSize: typeof selectedSize === 'string' ? selectedSize : undefined,
      selectedColor: typeof selectedColor === 'string' ? selectedColor : undefined,
    });
  }
  return [...lines.values()];
}

function readStorage(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    return raw ? parseStoredItems(raw) : [];
  } catch {
    return [];
  }
}

function writeStorage(items: CartItem[]): void {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage unavailable (private mode, quota) — cart stays in-memory only.
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from storage after mount so server and first client render stay
  // in sync (both render the empty cart; no mismatch, no flash of wrong data
  // beyond the hydration skeleton consumers can render via isHydrated).
  useEffect(() => {
    const stored = readStorage();
    // One-time, mount-only hydration from an external system (localStorage).
    // This is the pattern React docs prescribe for client-only stores; the
    // alternative (useSyncExternalStore) breaks Turbopack static prerender
    // in this Next.js version ("Cannot read properties of null
    // (reading 'useSyncExternalStore')").
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored.length > 0) setItems(stored);
    setIsHydrated(true);
  }, []);

  // Persist every change, but only after hydration so we never overwrite
  // stored cart data with the empty initial state.
  useEffect(() => {
    if (!isHydrated) return;
    writeStorage(items);
  }, [items, isHydrated]);

  // Keep carts in sync across browser tabs (this event never fires in the
  // tab that wrote the value, so there is no double-apply).
  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key !== CART_STORAGE_KEY) return;
      setItems(readStorage());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const addItem = useCallback((product: Product, size?: string, color?: string) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => sameLine(item, product.id, size, color));
      if (existingItem) {
        return prev.map((item) =>
          sameLine(item, product.id, size, color)
            ? { ...item, quantity: clampQuantity(item.quantity + 1) }
            : item
        );
      }
      return [...prev, { product, quantity: 1, selectedSize: size, selectedColor: color }];
    });
  }, []);

  const removeItem = useCallback((productId: string, size?: string, color?: string) => {
    setItems((prev) => prev.filter((item) => !sameLine(item, productId, size, color)));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number, size?: string, color?: string) => {
      // Non-finite input is ignored entirely (a NaN must not delete a line).
      if (!Number.isFinite(quantity)) return;
      const safeQuantity = clampQuantity(quantity);
      if (safeQuantity < 1) {
        setItems((prev) => prev.filter((item) => !sameLine(item, productId, size, color)));
        return;
      }
      setItems((prev) =>
        prev.map((item) =>
          sameLine(item, productId, size, color) ? { ...item, quantity: safeQuantity } : item
        )
      );
    },
    []
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isHydrated }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
