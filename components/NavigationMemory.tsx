'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// Remembers the last shop page you visited (per browser tab) so
// "Continue Shopping" on the cart page can take you back there
// instead of always sending you to the homepage.
const LAST_PAGE_KEY = 'clothly-last-page';
const CART_PATH = '/cart';

export function readLastPage(): string | null {
  try {
    return window.sessionStorage.getItem(LAST_PAGE_KEY);
  } catch {
    return null;
  }
}

export function useLastPage(): string | null {
  const [lastPage, setLastPage] = useState<string | null>(null);

  useEffect(() => {
    // One-time, mount-only read of client-only storage. Reading during render
    // would mismatch SSR; reading here keeps the first paint identical.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLastPage(readLastPage());
  }, []);

  return lastPage;
}

export default function NavigationMemory() {
  const pathname = usePathname();

  useEffect(() => {
    // Never remember the cart itself, otherwise "continue" would loop back.
    if (pathname && pathname !== CART_PATH) {
      try {
        window.sessionStorage.setItem(LAST_PAGE_KEY, pathname);
      } catch {
        // Storage unavailable — navigation falls back to the homepage.
      }
    }
  }, [pathname]);

  return null;
}
