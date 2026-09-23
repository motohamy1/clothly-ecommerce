'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

const WISHLIST_STORAGE_KEY = 'clothly-wishlist:v1';

interface WishlistContextType {
  ids: string[];
  has: (productId: string) => boolean;
  toggle: (productId: string) => void;
  isHydrated: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

function parseStoredIds(raw: string): string[] {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];
  return data.filter((id): id is string => typeof id === 'string' && id.length > 0);
}

function readStorage(): string[] {
  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    return raw ? parseStoredIds(raw) : [];
  } catch {
    return [];
  }
}

function writeStorage(ids: string[]): void {
  try {
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage unavailable (private mode, quota) — wishlist stays in-memory only.
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = readStorage();
    // One-time, mount-only hydration from an external system (localStorage).
    // See the note in lib/cart-context.tsx for why this pattern is used
    // instead of useSyncExternalStore here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored.length > 0) setIds(stored);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    writeStorage(ids);
  }, [ids, isHydrated]);

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key !== WISHLIST_STORAGE_KEY) return;
      setIds(readStorage());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggle = useCallback((productId: string) => {
    setIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  }, []);

  const has = useCallback((productId: string) => ids.includes(productId), [ids]);

  return (
    <WishlistContext.Provider value={{ ids, has, toggle, isHydrated }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
