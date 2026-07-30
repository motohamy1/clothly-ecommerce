'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Heart, ShoppingBag, Check } from 'lucide-react';
import type { Product, ProductVariant } from '@/lib/products';
import { useCart } from '@/lib/cart-context';

interface ProductDetailProps {
  product: Product;
}

const CREAM = 'oklch(0.943 0.051 98.2)';
const CREAM_MUTED = 'oklch(0.943 0.051 98.2 / 0.6)';
const PANEL_BG = 'oklch(0.17 0.02 98)';
const ACCENT = 'oklch(0.58 0.14 60)';
const DARK = 'oklch(0.2 0.03 98)';
const DARK_MUTED = 'oklch(0.48 0.03 98)';

// Fallback color options shown when the backend hasn't supplied real
// per-color photography yet (see `Product.variants` in lib/products.ts).
const DEMO_COLOR_OPTIONS: ProductVariant[] = [
  { colorName: 'Onyx', colorValue: 'oklch(0.15 0.02 98)' },
  { colorName: 'Cream', colorValue: 'oklch(0.943 0.051 98.2)' },
  { colorName: 'Terracotta', colorValue: 'oklch(0.3 0.1 60)' },
  { colorName: 'Olive', colorValue: 'oklch(0.32 0.08 130)' },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

// Same visual target as itemVariants, but also orchestrates its own
// children's stagger — used on the dark panel, which is itself a staggered
// child of the outer row while also being a stagger parent internally.
const panelVariants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring' as const,
      duration: 0.55,
      bounce: 0,
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring' as const, duration: 0.55, bounce: 0 },
  },
};

const iconCrossfadeVariants = {
  hidden: { opacity: 0, scale: 0.25, filter: 'blur(4px)' },
  show: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 0.25, filter: 'blur(4px)' },
};

export default function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image, product.image, product.image];

  const colorOptions =
    product.variants && product.variants.length > 0 ? product.variants : DEMO_COLOR_OPTIONS;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isPortrait, setIsPortrait] = useState<boolean | null>(null);

  const addTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (addTimeoutRef.current) clearTimeout(addTimeoutRef.current);
    };
  }, []);

  const handleAddToCart = () => {
    addItem(product, selectedSize ?? product.sizes[0], selectedColor.colorName);
    setJustAdded(true);
    if (addTimeoutRef.current) clearTimeout(addTimeoutRef.current);
    addTimeoutRef.current = setTimeout(() => setJustAdded(false), 1800);
  };

  const fallbackDescription = `Crafted with premium materials and considered detailing, the ${product.name} is designed to move with you — refined enough for everyday wear, durable enough to become a staple.`;

  const categoryLabel = product.category === 'shoe' ? 'Footwear' : 'Apparel';
  const selectedColor = colorOptions[selectedColorIndex];
  // Real variant photography wins once the backend provides it; otherwise we
  // fall back to the active gallery photo plus a live color-tint preview.
  const activeImageSrc = selectedColor.image ?? galleryImages[activeImageIndex];
  const showColorTint = !selectedColor.image;

  return (
    <section className="w-full">
      {/* Back link — s
its on the page's cream chrome, outside the dark panel */}
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-4 inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-[background-color,transform] duration-300 active:scale-[0.96]"
        style={{ color: DARK }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'oklch(0.2 0.03 98 / 0.06)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={2} />
        Back to Shop
      </button>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-5 lg:flex-row lg:items-stretch"
      >
        {/* ── Dark spotlight panel ── */}
        <motion.div
          variants={panelVariants}
          className="relative flex-1 overflow-hidden rounded-[25px] p-5 md:p-8 lg:p-10"
          style={{
            background: PANEL_BG,
            boxShadow: '0 1px 2px oklch(0 0 0 / 0.4), 0 24px 60px oklch(0 0 0 / 0.35)',
          }}
        >
          <div className="flex flex-col gap-6 lg:h-[500px] lg:flex-row lg:items-stretch lg:gap-8">
            {/* ── Rail: photo gallery thumbnails ── */}
            <motion.div
              variants={itemVariants}
              className="order-2 flex shrink-0 flex-row gap-3 overflow-x-auto lg:order-1 lg:h-full lg:w-[96px] lg:flex-col lg:overflow-visible lg:pb-6"
            >
              {galleryImages.slice(0, 3).map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImageIndex(i)}
                  aria-label={`View photo ${i + 1}`}
                  aria-pressed={activeImageIndex === i}
                  className={`relative bottom-8 h-20 w-20 shrink-0 overflow-hidden rounded-2xl transition-transform duration-300 active:scale-[0.96] lg:h-auto lg:w-full ${
                    i === 0 ? 'lg:grow-[2]' : 'lg:grow'
                  } ${i === 2 ? 'lg:mb-2' : ''}`}
                  style={{
                    outline: activeImageIndex === i ? `2px solid ${CREAM}` : '1px solid oklch(1 0 0 / 0.12)',
                    outlineOffset: activeImageIndex === i ? '2px' : '0px',
                  }}
                >
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-contain"
                    style={{ borderRadius: 'inherit' }}
                  />
                </button>
              ))}
            </motion.div>

            {/* ── Info column ── */}
            <motion.div
              variants={itemVariants}
              className="order-1 flex shrink-0 flex-col justify-between gap-6 lg:order-2 lg:h-full lg:w-[260px]"
            >
              <div>
                <span
                  className="mb-3 inline-block rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em]"
                  style={{ color: CREAM_MUTED, border: '1px solid oklch(1 0 0 / 0.15)' }}
                >
                  {categoryLabel}
                </span>
                <h1
                  className="text-3xl font-extrabold leading-[1.05] md:text-4xl text-balance"
                  style={{ color: CREAM }}
                >
                  {product.name}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs" style={{ color: CREAM_MUTED }}>
                    {product.sizes && product.sizes.length > 0 ? 'Select size' : 'Size info on the way'}
                  </span>
                  {product.sizes?.map((size) => {
                    const isActive = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        aria-pressed={isActive}
                        className="min-w-[40px] rounded-full px-3 py-1.5 text-xs font-semibold transition-[background-color,transform] duration-300 active:scale-[0.96]"
                        style={{
                          color: isActive ? DARK : CREAM,
                          background: isActive ? CREAM : 'oklch(0.943 0.051 98.2 / 0.06)',
                          outline: isActive ? 'none' : '1px solid oklch(1 0 0 / 0.18)',
                        }}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={selectedColor.colorName}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
                    className="mt-2 text-xs"
                    style={{ color: CREAM_MUTED }}
                  >
                    Color: <span style={{ color: CREAM }}>{selectedColor.colorName}</span>
                  </motion.p>
                </AnimatePresence>
              </div>

              <div>
                <div className="text-3xl font-bold tabular-nums" style={{ color: CREAM }}>
                  ${product.price.toFixed(2)}
                </div>
              </div>

              <p className="text-sm leading-relaxed max-w-prose" style={{ color: CREAM_MUTED }}>
                {product.description ?? fallbackDescription}
              </p>
            </motion.div>

            {/* ── Main image + CTA ── */}
            <motion.div
              variants={itemVariants}
              className="order-3 flex min-w-0 flex-1 flex-col gap-4"
            >
              <div className="relative flex-1 lg:min-h-0">
                {/* Wishlist toggle */}
                <button
                  type="button"
                  onClick={() => setIsWishlisted((w) => !w)}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  aria-pressed={isWishlisted}
                  className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-300 active:scale-[0.96]"
                  style={{ background: 'oklch(0.943 0.051 98.2 / 0.12)', outline: '1px solid oklch(1 0 0 / 0.12)' }}
                >
                  <span className="relative inline-flex h-5 w-5 items-center justify-center">
                    <AnimatePresence initial={false} mode="wait">
                      {isWishlisted ? (
                        <motion.span
                          key="filled"
                          variants={iconCrossfadeVariants}
                          initial="hidden"
                          animate="show"
                          exit="exit"
                          transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <Heart className="h-5 w-5" fill={ACCENT} stroke={ACCENT} />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="outline"
                          variants={iconCrossfadeVariants}
                          initial="hidden"
                          animate="show"
                          exit="exit"
                          transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <Heart className="h-5 w-5" stroke={CREAM} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </button>

                <div
                  className="h-full rounded-[32px] p-2"
                  style={{ background: 'oklch(0.943 0.051 98.2 / 0.04)' }}
                >
                  <div
                    className="relative flex h-full items-center justify-center overflow-hidden rounded-[24px]"
                    style={{ outline: '1px solid oklch(1 0 0 / 0.1)' }}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.img
                        key={activeImageSrc}
                        src={activeImageSrc}
                        alt={product.name}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
                        className={`object-contain ${isPortrait ? 'h-full w-auto' : 'h-auto w-full'}`}
                        onLoad={(e) => {
                          const img = e.currentTarget;
                          setIsPortrait(img.naturalHeight > img.naturalWidth);
                        }}
                      />
                    </AnimatePresence>
                    {/*
                      Live color preview: until the backend supplies real
                      per-color photography (Product.variants[i].image), tint
                      the active photo so picking a swatch visibly reflects
                      on the product.
                    */}
                    <AnimatePresence>
                      {showColorTint && (
                        <motion.div
                          key={selectedColor.colorName}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.22 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
                          className="pointer-events-none absolute inset-0"
                          style={{ background: selectedColor.colorValue, mixBlendMode: 'color' }}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* CTA row — evenly splits the image's full width */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-sm font-semibold transition-[background-color,transform] duration-300 active:scale-[0.96]"
                  style={{ color: CREAM, border: '1.5px solid oklch(1 0 0 / 0.25)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'oklch(1 0 0 / 0.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <span className="relative inline-flex h-4 w-4 items-center justify-center">
                    <AnimatePresence initial={false} mode="wait">
                      {justAdded ? (
                        <motion.span
                          key="check"
                          variants={iconCrossfadeVariants}
                          initial="hidden"
                          animate="show"
                          exit="exit"
                          transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <Check className="h-4 w-4" />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="bag"
                          variants={iconCrossfadeVariants}
                          initial="hidden"
                          animate="show"
                          exit="exit"
                          transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <ShoppingBag className="h-4 w-4" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                  {justAdded ? 'Added!' : 'Add to Cart'}
                </button>

                <button
                  type="button"
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-full text-sm font-semibold transition-[background-color,transform] duration-300 active:scale-[0.96]"
                  style={{ background: CREAM, color: DARK }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'oklch(0.85 0.045 98)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = CREAM; }}
                >
                  Buy Now
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Color swatches: separate from the product card, on the page's cream chrome ── */}
        <motion.div
          variants={itemVariants}
          className="flex shrink-0 flex-col items-center gap-4 lg:h-[500px] lg:w-[64px]"
        >
          <span
            className="hidden text-center text-[10px] font-medium uppercase tracking-[0.2em] lg:block"
            style={{ color: DARK_MUTED }}
          >
            Color
          </span>
          <div className="flex flex-row items-center gap-3 lg:flex-1 lg:flex-col lg:justify-around">
            {colorOptions.map((swatch, i) => (
              <button
                key={swatch.colorName}
                type="button"
                onClick={() => setSelectedColorIndex(i)}
                aria-label={`Select ${swatch.colorName} color`}
                aria-pressed={selectedColorIndex === i}
                title={swatch.colorName}
                className="h-11 w-11 shrink-0 rounded-full transition-transform duration-300 active:scale-[0.96]"
                style={{
                  background: swatch.colorValue,
                  outline: selectedColorIndex === i ? `2px solid ${DARK}` : '1px solid oklch(0 0 0 / 0.15)',
                  outlineOffset: selectedColorIndex === i ? '2px' : '0px',
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
