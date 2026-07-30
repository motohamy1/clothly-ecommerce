import type { ProductCategory, ProductGroup, ProductSection, ProductVariant } from '../models/product';

export interface ProductSeed {
  id: string;
  name: string;
  price: number;
  image: string;
  category: ProductCategory;
  group: ProductGroup;
  section: ProductSection;
  description: string;
  images: string[];
  sizes: string[];
  variants: ProductVariant[];
}

const productImages = [
  '/images/products/download (1).png',
  '/images/products/download (2).png',
  '/images/products/download (3).png',
  '/images/products/download (4).png',
  '/images/products/download (5).png',
  '/images/products/download (6).png',
  '/images/products/download.png',
];

const variants: ProductVariant[] = [
  { colorName: 'Onyx', colorValue: 'oklch(0.15 0.02 98)' },
  { colorName: 'Cream', colorValue: 'oklch(0.943 0.051 98.2)' },
  { colorName: 'Terracotta', colorValue: 'oklch(0.48 0.12 48)' },
  { colorName: 'Olive', colorValue: 'oklch(0.42 0.08 130)' },
];

function gallery(primary: string, offset: number) {
  return [primary, productImages[(offset + 1) % productImages.length], productImages[(offset + 2) % productImages.length]];
}

function product(input: Omit<ProductSeed, 'image' | 'images' | 'variants'> & { imageIndex: number }): ProductSeed {
  const { imageIndex, ...rest } = input;
  const image = productImages[imageIndex % productImages.length];
  return { ...rest, image, images: gallery(image, imageIndex), variants };
}

const mensSizes = ['S', 'M', 'L', 'XL', 'XXL'];
const apparelSizes = ['XS', 'S', 'M', 'L', 'XL'];
const kidsSizes = ['4Y', '6Y', '8Y', '10Y', '12Y'];
const adultShoeSizes = ['40', '41', '42', '43', '44', '45'];
const womensShoeSizes = ['36', '37', '38', '39', '40', '41'];
const kidsShoeSizes = ['28', '29', '30', '31', '32', '33'];

export const productSeeds: ProductSeed[] = [
  product({ id: 'men-classic-linen-shirt', section: 'men', group: 'clothing', category: 'clothing', name: 'Classic Linen Shirt', price: 49.99, imageIndex: 0, sizes: mensSizes, description: 'Breathable European linen cut for warm days, relaxed through the shoulder and tapered at the waist.' }),
  product({ id: 'men-slim-fit-chinos', section: 'men', group: 'clothing', category: 'clothing', name: 'Slim Fit Chinos', price: 59.99, imageIndex: 1, sizes: mensSizes, description: 'Brushed cotton twill with a touch of stretch, tailored for days that move from desk to dinner.' }),
  product({ id: 'men-denim-jacket', section: 'men', group: 'outerwear', category: 'clothing', name: 'Denim Jacket', price: 89.99, imageIndex: 3, sizes: mensSizes, description: 'Rigid denim built to soften and fade with wear in a timeless layer-friendly silhouette.' }),
  product({ id: 'men-canvas-sneakers', section: 'men', group: 'shoes', category: 'shoe', name: 'Canvas Sneakers', price: 64.99, imageIndex: 4, sizes: adultShoeSizes, description: 'A low-profile canvas sneaker on a cushioned rubber sole, built for everyday rotation.' }),
  product({ id: 'women-silk-camp-shirt', section: 'women', group: 'clothing', category: 'clothing', name: 'Silk Camp Shirt', price: 69.99, imageIndex: 2, sizes: apparelSizes, description: 'Washed silk with a fluid drape, open collar, and polished finish that dresses up or down.' }),
  product({ id: 'women-tailored-wide-leg-trouser', section: 'women', group: 'clothing', category: 'clothing', name: 'Wide-Leg Trouser', price: 79.99, imageIndex: 1, sizes: apparelSizes, description: 'High-rise tailored trousers with an easy wide leg and a clean pressed front.' }),
  product({ id: 'women-cropped-trench', section: 'women', group: 'outerwear', category: 'clothing', name: 'Cropped Trench', price: 129.99, imageIndex: 4, sizes: apparelSizes, description: 'A modern cropped trench in water-resistant cotton with storm flaps and horn buttons.' }),
  product({ id: 'women-minimal-sneaker', section: 'women', group: 'shoes', category: 'shoe', name: 'Minimal Sneaker', price: 74.99, imageIndex: 0, sizes: womensShoeSizes, description: 'Clean leather sneakers with a low cupsole and softly padded collar.' }),
  product({ id: 'kids-organic-pocket-tee', section: 'kids', group: 'clothing', category: 'clothing', name: 'Organic Pocket Tee', price: 19.99, imageIndex: 5, sizes: kidsSizes, description: 'Soft organic cotton jersey with a sturdy pocket and playground-ready seams.' }),
  product({ id: 'kids-pull-on-chinos', section: 'kids', group: 'clothing', category: 'clothing', name: 'Pull-On Chinos', price: 29.99, imageIndex: 1, sizes: kidsSizes, description: 'Easy elastic-waist chinos in durable stretch twill for school days and weekend play.' }),
  product({ id: 'kids-packable-raincoat', section: 'kids', group: 'outerwear', category: 'clothing', name: 'Packable Raincoat', price: 44.99, imageIndex: 3, sizes: kidsSizes, description: 'A lightweight water-resistant raincoat that packs into its pocket for backpack backup.' }),
  product({ id: 'kids-canvas-slip-on', section: 'kids', group: 'shoes', category: 'shoe', name: 'Canvas Slip-On', price: 29.99, imageIndex: 6, sizes: kidsShoeSizes, description: 'No-fuss canvas slip-ons with elastic gores and grippy rubber outsoles.' }),
];
