'use client';

import { CartProvider } from '@/lib/cart-context';
import { WishlistProvider } from '@/lib/wishlist-context';
import NavigationMemory from '@/components/NavigationMemory';
import { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        <NavigationMemory />
        {children}
      </WishlistProvider>
    </CartProvider>
  );
}
