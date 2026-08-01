'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Minus, Plus, Trash2, ShoppingBag, ChevronLeft } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

const DARK = 'oklch(0.2 0.03 98)';
const DARK_MUTED = 'oklch(0.48 0.03 98)';
const CREAM = 'oklch(0.943 0.051 98.2)';
const ACCENT = 'oklch(0.58 0.14 60)';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

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
          href="/"
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
                key={`${item.product.id}-${item.selectedSize}`}
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
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1, item.selectedSize)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200"
                        style={{ background: 'oklch(0.2 0.03 98 / 0.08)' }}
                      >
                        <Minus className="h-3 w-3" style={{ color: DARK }} />
                      </button>
                      <span
                        className="w-8 text-center text-sm font-semibold"
                        style={{ color: DARK }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1, item.selectedSize)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200"
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
                        onClick={() => removeItem(item.product.id, item.selectedSize)}
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

            <button
              type="button"
              className="w-full rounded-full py-3.5 text-sm font-semibold transition-transform duration-300 active:scale-[0.96]"
              style={{ background: ACCENT, color: CREAM }}
            >
              Checkout
            </button>

            <Link
              href="/"
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
