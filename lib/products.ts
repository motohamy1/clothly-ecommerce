export interface ProductVariant {
  colorName: string;
  /** OKLCH swatch color shown in the color picker */
  colorValue: string;
  /** Variant-specific product photo when available. */
  image?: string;
}

export type ProductSection = 'men' | 'women' | 'kids';
export type ProductCategory = 'clothing' | 'shoe';
export type ProductGroup = 'clothing' | 'outerwear' | 'shoes';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: ProductCategory;
  group: ProductGroup;
  section: ProductSection;
  description: string;
  images?: string[];
  sizes: string[];
  variants?: ProductVariant[];
}

export interface ProductCollection {
  section: ProductSection;
  label: string;
  headline: string;
  groups: Record<ProductGroup, Product[]>;
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

const apparelSizes = ['XS', 'S', 'M', 'L', 'XL'];
const mensSizes = ['S', 'M', 'L', 'XL', 'XXL'];
const kidsSizes = ['4Y', '6Y', '8Y', '10Y', '12Y'];
const adultShoeSizes = ['40', '41', '42', '43', '44', '45'];
const womensShoeSizes = ['36', '37', '38', '39', '40', '41'];
const kidsShoeSizes = ['28', '29', '30', '31', '32', '33'];

const coreVariants: ProductVariant[] = [
  { colorName: 'Onyx', colorValue: 'oklch(0.15 0.02 98)' },
  { colorName: 'Cream', colorValue: 'oklch(0.943 0.051 98.2)' },
  { colorName: 'Terracotta', colorValue: 'oklch(0.48 0.12 48)' },
  { colorName: 'Olive', colorValue: 'oklch(0.42 0.08 130)' },
];

function gallery(primary: string, offset: number) {
  return [primary, productImages[(offset + 1) % productImages.length], productImages[(offset + 2) % productImages.length]];
}

function product(input: Omit<Product, 'image' | 'images' | 'variants'> & { imageIndex: number; variants?: ProductVariant[] }): Product {
  const { imageIndex, ...rest } = input;
  const image = productImages[imageIndex % productImages.length];

  return {
    ...rest,
    image,
    images: gallery(image, imageIndex),
    variants: input.variants ?? coreVariants,
  };
}

export const catalog: Record<ProductSection, ProductCollection> = {
  men: {
    section: 'men',
    label: "Men's Collection",
    headline: 'Dress Well,\nLive Well.',
    groups: {
      clothing: [
        product({ id: 'men-classic-linen-shirt', section: 'men', group: 'clothing', category: 'clothing', name: 'Classic Linen Shirt', price: 49.99, imageIndex: 0, sizes: mensSizes, description: 'Breathable European linen cut for warm days, relaxed through the shoulder and tapered at the waist.' }),
        product({ id: 'men-slim-fit-chinos', section: 'men', group: 'clothing', category: 'clothing', name: 'Slim Fit Chinos', price: 59.99, imageIndex: 1, sizes: mensSizes, description: 'Brushed cotton twill with a touch of stretch, tailored for days that move from desk to dinner.' }),
        product({ id: 'men-cotton-polo-tee', section: 'men', group: 'clothing', category: 'clothing', name: 'Cotton Polo Tee', price: 34.99, imageIndex: 2, sizes: mensSizes, description: 'Heavyweight combed cotton with a ribbed collar that keeps its shape wash after wash.' }),
        product({ id: 'men-relaxed-cargo-pants', section: 'men', group: 'clothing', category: 'clothing', name: 'Relaxed Cargo Pants', price: 54.99, imageIndex: 4, sizes: mensSizes, description: 'Utility-inspired ripstop cargos with reinforced pockets and a drawstring waist for all-day comfort.' }),
      ],
      outerwear: [
        product({ id: 'men-denim-jacket', section: 'men', group: 'outerwear', category: 'clothing', name: 'Denim Jacket', price: 89.99, imageIndex: 3, sizes: mensSizes, description: 'Rigid denim built to soften and fade with wear in a timeless layer-friendly silhouette.' }),
        product({ id: 'men-puffer-vest', section: 'men', group: 'outerwear', category: 'clothing', name: 'Puffer Vest', price: 99.99, imageIndex: 6, sizes: mensSizes, description: 'Lightweight recycled-fill insulation with a packable shell built to cut wind without weight.' }),
        product({ id: 'men-wool-overcoat', section: 'men', group: 'outerwear', category: 'clothing', name: 'Wool Overcoat', price: 149.99, imageIndex: 1, sizes: mensSizes, description: 'A double-breasted overcoat in a warm wool blend with structured shoulders and a full lining.' }),
      ],
      shoes: [
        product({ id: 'men-canvas-sneakers', section: 'men', group: 'shoes', category: 'shoe', name: 'Canvas Sneakers', price: 64.99, imageIndex: 4, sizes: adultShoeSizes, description: 'A low-profile canvas sneaker on a cushioned rubber sole, built for everyday rotation.' }),
        product({ id: 'men-leather-loafers', section: 'men', group: 'shoes', category: 'shoe', name: 'Leather Loafers', price: 89.99, imageIndex: 5, sizes: adultShoeSizes, description: 'Hand-burnished full-grain leather loafers with a cushioned insole for long polished days.' }),
        product({ id: 'men-running-trainers', section: 'men', group: 'shoes', category: 'shoe', name: 'Running Trainers', price: 79.99, imageIndex: 6, sizes: adultShoeSizes, description: 'Responsive foam underfoot with a breathable knit upper, engineered for miles and styled for the street.' }),
      ],
    },
  },
  women: {
    section: 'women',
    label: "Women's Collection",
    headline: 'Soft Lines,\nSharp Presence.',
    groups: {
      clothing: [
        product({ id: 'women-silk-camp-shirt', section: 'women', group: 'clothing', category: 'clothing', name: 'Silk Camp Shirt', price: 69.99, imageIndex: 2, sizes: apparelSizes, description: 'Washed silk with a fluid drape, open collar, and polished finish that dresses up or down.' }),
        product({ id: 'women-tailored-wide-leg-trouser', section: 'women', group: 'clothing', category: 'clothing', name: 'Wide-Leg Trouser', price: 79.99, imageIndex: 1, sizes: apparelSizes, description: 'High-rise tailored trousers with an easy wide leg and a clean pressed front.' }),
        product({ id: 'women-rib-knit-tank', section: 'women', group: 'clothing', category: 'clothing', name: 'Rib Knit Tank', price: 29.99, imageIndex: 0, sizes: apparelSizes, description: 'Soft ribbed cotton-modal knit with a close fit and a neckline made for layering.' }),
        product({ id: 'women-midi-wrap-dress', section: 'women', group: 'clothing', category: 'clothing', name: 'Midi Wrap Dress', price: 94.99, imageIndex: 3, sizes: apparelSizes, description: 'A fluid wrap silhouette with adjustable waist ties and movement-ready skirt volume.' }),
      ],
      outerwear: [
        product({ id: 'women-cropped-trench', section: 'women', group: 'outerwear', category: 'clothing', name: 'Cropped Trench', price: 129.99, imageIndex: 4, sizes: apparelSizes, description: 'A modern cropped trench in water-resistant cotton with storm flaps and horn buttons.' }),
        product({ id: 'women-quilted-liner-jacket', section: 'women', group: 'outerwear', category: 'clothing', name: 'Quilted Liner Jacket', price: 99.99, imageIndex: 5, sizes: apparelSizes, description: 'Diamond-quilted warmth in a collarless shape that layers cleanly over knits.' }),
        product({ id: 'women-soft-wool-coat', section: 'women', group: 'outerwear', category: 'clothing', name: 'Soft Wool Coat', price: 159.99, imageIndex: 6, sizes: apparelSizes, description: 'Brushed wool blend coat with generous lapels and a relaxed, elegant shoulder.' }),
      ],
      shoes: [
        product({ id: 'women-minimal-sneaker', section: 'women', group: 'shoes', category: 'shoe', name: 'Minimal Sneaker', price: 74.99, imageIndex: 0, sizes: womensShoeSizes, description: 'Clean leather sneakers with a low cupsole and softly padded collar.' }),
        product({ id: 'women-block-heel-sandal', section: 'women', group: 'shoes', category: 'shoe', name: 'Block Heel Sandal', price: 84.99, imageIndex: 1, sizes: womensShoeSizes, description: 'A stable block heel and slender straps make this sandal polished but walkable.' }),
        product({ id: 'women-soft-suede-boot', section: 'women', group: 'shoes', category: 'shoe', name: 'Soft Suede Boot', price: 119.99, imageIndex: 2, sizes: womensShoeSizes, description: 'Ankle-height suede boots with a cushioned footbed and flexible stacked sole.' }),
      ],
    },
  },
  kids: {
    section: 'kids',
    label: "Kids' Collection",
    headline: 'Ready for\nEvery Adventure.',
    groups: {
      clothing: [
        product({ id: 'kids-organic-pocket-tee', section: 'kids', group: 'clothing', category: 'clothing', name: 'Organic Pocket Tee', price: 19.99, imageIndex: 5, sizes: kidsSizes, description: 'Soft organic cotton jersey with a sturdy pocket and playground-ready seams.' }),
        product({ id: 'kids-pull-on-chinos', section: 'kids', group: 'clothing', category: 'clothing', name: 'Pull-On Chinos', price: 29.99, imageIndex: 1, sizes: kidsSizes, description: 'Easy elastic-waist chinos in durable stretch twill for school days and weekend play.' }),
        product({ id: 'kids-striped-sweatshirt', section: 'kids', group: 'clothing', category: 'clothing', name: 'Striped Sweatshirt', price: 34.99, imageIndex: 2, sizes: kidsSizes, description: 'Cozy brushed fleece with cheerful stripes and rib trims that bounce back.' }),
      ],
      outerwear: [
        product({ id: 'kids-packable-raincoat', section: 'kids', group: 'outerwear', category: 'clothing', name: 'Packable Raincoat', price: 44.99, imageIndex: 3, sizes: kidsSizes, description: 'A lightweight water-resistant raincoat that packs into its pocket for backpack backup.' }),
        product({ id: 'kids-sherpa-zip-jacket', section: 'kids', group: 'outerwear', category: 'clothing', name: 'Sherpa Zip Jacket', price: 49.99, imageIndex: 4, sizes: kidsSizes, description: 'Plush sherpa warmth with smooth-lined sleeves and easy zipper pulls.' }),
        product({ id: 'kids-denim-overshirt', section: 'kids', group: 'outerwear', category: 'clothing', name: 'Denim Overshirt', price: 39.99, imageIndex: 0, sizes: kidsSizes, description: 'A sturdy denim overshirt cut roomy for layering over tees and hoodies.' }),
      ],
      shoes: [
        product({ id: 'kids-canvas-slip-on', section: 'kids', group: 'shoes', category: 'shoe', name: 'Canvas Slip-On', price: 29.99, imageIndex: 6, sizes: kidsShoeSizes, description: 'No-fuss canvas slip-ons with elastic gores and grippy rubber outsoles.' }),
        product({ id: 'kids-playground-runner', section: 'kids', group: 'shoes', category: 'shoe', name: 'Playground Runner', price: 39.99, imageIndex: 5, sizes: kidsShoeSizes, description: 'Lightweight runners with hook-and-loop straps and cushioned soles for all-day play.' }),
        product({ id: 'kids-rain-boot', section: 'kids', group: 'shoes', category: 'shoe', name: 'Rain Boot', price: 34.99, imageIndex: 4, sizes: kidsShoeSizes, description: 'Waterproof pull-on rain boots with easy handles and a flexible lug sole.' }),
      ],
    },
  },
};

export const menClothing = catalog.men.groups.clothing;
export const menOuterwear = catalog.men.groups.outerwear;
export const menShoes = catalog.men.groups.shoes;
export const womenClothing = catalog.women.groups.clothing;
export const womenOuterwear = catalog.women.groups.outerwear;
export const womenShoes = catalog.women.groups.shoes;
export const kidsClothing = catalog.kids.groups.clothing;
export const kidsOuterwear = catalog.kids.groups.outerwear;
export const kidsShoes = catalog.kids.groups.shoes;

export const allProducts: Product[] = Object.values(catalog).flatMap((collection) =>
  Object.values(collection.groups).flat(),
);

export function getCollection(section: ProductSection): ProductCollection {
  return catalog[section];
}

export function getProductsBySection(section: ProductSection): Product[] {
  return Object.values(catalog[section].groups).flat();
}

export function getProductById(id: string): Product | undefined {
  return allProducts.find((product) => product.id === id);
}

export function getProductSection(id: string): ProductSection | null {
  return getProductById(id)?.section ?? null;
}

export function getRelatedProducts(product: Product, limit = 6): Product[] {
  return allProducts
    .filter((p) => p.id !== product.id && (p.section === product.section || p.category === product.category))
    .sort((a, b) => {
      const aScore = Number(a.section === product.section) + Number(a.group === product.group) + Number(a.category === product.category);
      const bScore = Number(b.section === product.section) + Number(b.group === product.group) + Number(b.category === product.category);
      return bScore - aScore;
    })
    .slice(0, limit);
}
