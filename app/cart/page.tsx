'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Minus, Plus, Trash2, ShoppingBag, ChevronLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { useCart, MAX_QUANTITY_PER_ITEM } from '@/lib/cart-context';
import { useLastPage } from '@/components/NavigationMemory';

const DARK = 'oklch(0.2 0.03 98)';
const DARK_MUTED = 'oklch(0.48 0.03 98)';
const CREAM = 'oklch(0.943 0.051 98.2)';
const ACCENT = 'oklch(0.58 0.14 60)';

interface ConfirmedOrder {
  id: string;
  total: number;
}

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isHydrated } =
    useCart();
  // Return the shopper to the page they came from (e.g. the product they were
  // viewing); falls back to the homepage for direct cart visits.
  const lastPage = useLastPage();
  const continueShoppingHref = lastPage ?? '/';

  const [checkoutState, setCheckoutState] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [checkoutError, setCheckoutError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);

  const handleCheckout = async () => {
    setCheckoutState('submitting');
    setCheckoutError('');
    try {
      // Only ids, variants and quantities are sent. The backend recomputes
      // every line price from the catalog — client numbers are never trusted.
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            size: item.selectedSize,
            color: item.selectedColor,
            quantity: item.quantity,
          })),
        }),
      });

      if (res.status === 401) {
        router.push('/login?next=/cart');
        return;
      }

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setCheckoutError(
          typeof data.error === 'string' ? data.error : 'Checkout failed. Please try again.'
        );
        setCheckoutState('error');
        return;
      }

      clearCart();
      setConfirmedOrder({ id: String(data.order?.id ?? ''), total: Number(data.order?.total ?? 0) });
    } catch {
      setCheckoutError('Network error — please check your connection and try again.');
      setCheckoutState('error');
    }
  };

  // Avoid a flash of "empty cart" before localStorage is read.
  if (!isHydrated) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: DARK_MUTED }} />
          <p className="text-sm" style={{ color: DARK_MUTED }}>
            Loading your cart…
          </p>
        </div>
      </section>
    );
  }

  if (confirmedOrder) {
    return (
      <section className="flex min-h-[80vh] flex-col items-center justify-center gap-6 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 0.5, bounce: 0 }}
          className="flex h-24 w-24 items-center justify-center rounded-full"
          style={{ background: 'oklch(0.58 0.14 60 / 0.12)' }}
        >
          <CheckCircle2 className="h-10 w-10" style={{ color: ACCENT }} />
        </motion.div>
        <h1 className="text-2xl font-bold" style={{ color: DARK }}>
          Order placed
        </h1>
        <p className="max-w-md text-center text-sm" style={{ color: DARK_MUTED }}>
          Thank you for your purchase. Your order{' '}
          <span className="font-semibold" style={{ color: DARK }}>
            #{confirmedOrder.id}
          </span>{' '}
          for <span className="tabular-nums font-semibold" style={{ color: DARK }}>${confirmedOrder.total.toFixed(2)}</span>{' '}
          has been received and your cart has been cleared.
        </p>
        <Link
          href={continueShoppingHref}
          className="mt-4 rounded-full px-8 py-3.5 text-sm font-semibold transition-transform duration-300 active:scale-[0.96]"
          style={{ background: DARK, color: CREAM }}
        >
          Continue Shopping
        </Link>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="min-h-[80vh] flex flex-col items-center justify-center gap-6 px-4">
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full"
          style={{ background: 'oklch(0.2 0.03 98 / 0.06)' }}
        >
          <ShoppingBag className="h-10 w-10" style={{ color: DARK_MUTED }} />
        </div>
        <h1 className="text-2xl font-bold" style={{ color: DARK }}>
          Your cart is empty
        </h1>
        <p className="text-sm" style={{ color: DARK_MUTED }}>
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link
          href={continueShoppingHref}
          className="mt-4 rounded-full px-8 py-3.5 text-sm font-semibold transition-transform duration-300 active:scale-[0.96]"
          style={{ background: DARK, color: CREAM }}
        >
          Continue Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="pb-24 pt-28 md:pt-32 px-4 md:px-8 lg:px-16">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-[background-color,transform] duration-300 active:scale-[0.96]"
            style={{ color: DARK }}
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            Back
          </button>
          <h1 className="text-2xl font-extrabold md:text-3xl text-balance" style={{ color: DARK }}>
            Cart
            <span className="ml-2 text-base font-medium" style={{ color: DARK_MUTED }}>
              ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </span>
          </h1>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs font-medium underline transition-colors duration-200"
          style={{ color: DARK_MUTED }}
        >
          Clear all
        </button>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Cart Items */}
        <div className="flex-1">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={`${item.product.id}-${item.selectedSize ?? 'nosize'}-${item.selectedColor ?? 'nocolor'}`}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
                className="mb-4 flex gap-4 rounded-2xl p-4"
                style={{
                  background: 'oklch(0.2 0.03 98 / 0.03)',
                  border: '1px solid oklch(0.2 0.03 98 / 0.08)',
                }}
              >
                {/* Product Image */}
                <div
                  className="h-24 w-24 shrink-0 overflow-hidden rounded-xl relative"
                  style={{ outline: '1px solid oklch(0 0 0 / 0.1)' }}
                >
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-semibold" style={{ color: DARK }}>
                      {item.product.name}
                    </h3>
                    {item.selectedSize && (
                      <p className="mt-1 text-xs" style={{ color: DARK_MUTED }}>
                        Size: {item.selectedSize}
                      </p>
                    )}
                    {item.selectedColor && (
                      <p className="text-xs" style={{ color: DARK_MUTED }}>
                        Color: {item.selectedColor}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${item.product.name}`}
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity - 1,
                            item.selectedSize,
                            item.selectedColor
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200"
                        style={{ background: 'oklch(0.2 0.03 98 / 0.08)' }}
                      >
                        <Minus className="h-3 w-3" style={{ color: DARK }} />
                      </button>
                      <span
                        aria-live="polite"
                        className="w-8 text-center text-sm font-semibold tabular-nums"
                        style={{ color: DARK }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${item.product.name}`}
                        disabled={item.quantity >= MAX_QUANTITY_PER_ITEM}
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity + 1,
                            item.selectedSize,
                            item.selectedColor
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: 'oklch(0.2 0.03 98 / 0.08)' }}
                      >
                        <Plus className="h-3 w-3" style={{ color: DARK }} />
                      </button>
                    </div>

                    {/* Price & Remove */}
                    <div className="flex items-center gap-3">
                      <span className="font-bold tabular-nums" style={{ color: DARK }}>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        type="button"
                        aria-label={`Remove ${item.product.name} from cart`}
                        onClick={() =>
                          removeItem(item.product.id, item.selectedSize, item.selectedColor)
                        }
                        className="p-1.5 rounded-lg transition-colors duration-200 hover:bg-red-50"
                        style={{ color: DARK_MUTED }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:w-80">
          <div
            className="rounded-2xl p-6"
            style={{
              background: 'oklch(0.2 0.03 98 / 0.03)',
              border: '1px solid oklch(0.2 0.03 98 / 0.08)',
            }}
          >
            <h2 className="text-lg font-bold mb-4" style={{ color: DARK }}>
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span style={{ color: DARK_MUTED }}>Subtotal</span>
                <span className="tabular-nums" style={{ color: DARK }}>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: DARK_MUTED }}>Shipping</span>
                <span style={{ color: DARK }}>Free</span>
              </div>
              <div
                className="border-t pt-3 flex justify-between font-bold"
                style={{ borderColor: 'oklch(0.2 0.03 98 / 0.1)' }}
              >
                <span style={{ color: DARK }}>Total</span>
                <span className="tabular-nums" style={{ color: DARK }}>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Final prices are recalculated server-side at checkout. */}
            <p className="mb-4 text-xs" style={{ color: DARK_MUTED }}>
              You&apos;ll be asked to sign in before your order is placed.
            </p>

            {checkoutError && (
              <p
                role="alert"
                className="mb-4 rounded-lg px-3 py-2 text-xs"
                style={{ background: 'oklch(0.58 0.14 60 / 0.12)', color: DARK }}
              >
                {checkoutError}
              </p>
            )}

            <button
              type="button"
              onClick={handleCheckout}
              disabled={checkoutState === 'submitting' || items.length === 0}
              aria-busy={checkoutState === 'submitting'}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold transition-transform duration-300 active:scale-[0.96] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: ACCENT, color: CREAM }}
            >
              {checkoutState === 'submitting' && (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              )}
              {checkoutState === 'submitting' ? 'Placing order…' : 'Checkout'}
            </button>

            <Link
              href={continueShoppingHref}
              className="mt-3 block text-center text-xs font-medium"
              style={{ color: DARK_MUTED }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
