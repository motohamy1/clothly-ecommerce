export interface ProductVariant {
  colorName: string;
  /** OKLCH swatch color shown in the color picker */
  colorValue: string;
  /**
   * Real per-color product photo. Populate this once the backend/catalog
   * exposes variant-specific imagery — until then the UI falls back to a
   * client-side color tint preview over the default product photo.
   */
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'clothing' | 'shoe';
  description?: string;
  images?: string[];
  /** Available sizes; will be fetched from backend later */
  sizes?: string[];
  /** Optional color variants; omit until the backend provides real per-color photography. */
  variants?: ProductVariant[];
  section?: 'men' | 'women' | 'kids';
}

export const menClothing: Product[] = [
  { id: 'mc1', name: 'Classic Linen Shirt', price: 49.99, image: '/images/products/download (1).png', category: 'clothing', sizes: ['S', 'M', 'L', 'XL', 'XXL'], description: 'Breathable European linen cut for warm days — relaxed through the shoulder, tapered at the waist, and finished with mother-of-pearl buttons.' },
  { id: 'mc2', name: 'Slim Fit Chinos', price: 59.99, image: '/images/products/download (2).png', category: 'clothing', sizes: ['S', 'M', 'L', 'XL'], description: 'A wardrobe staple in brushed cotton twill. Tailored through the thigh with a touch of stretch so it moves with you from desk to dinner.' },
  { id: 'mc3', name: 'Cotton Polo Tee', price: 34.99, image: '/images/products/download (3).png', category: 'clothing', sizes: ['S', 'M', 'L', 'XL', 'XXL'], description: 'Heavyweight combed cotton with a ribbed collar that holds its shape wash after wash. Effortless layering piece for every season.' },
  { id: 'mc4', name: 'Denim Jacket', price: 89.99, image: '/images/products/download (4).png', category: 'clothing', sizes: ['M', 'L', 'XL'], description: 'Rigid selvedge denim built to soften and fade with wear. A timeless silhouette that layers over anything in your closet.' },
  { id: 'mc5', name: 'Relaxed Cargo Pants', price: 54.99, image: '/images/products/download (5).png', category: 'clothing', sizes: ['S', 'M', 'L', 'XL', 'XXL'], description: 'Utility-inspired cargos in a durable ripstop weave, with reinforced pockets and a drawstring waist for all-day comfort.' },
  { id: 'mc6', name: 'V-Neck Sweater', price: 44.99, image: '/images/products/download (6).png', category: 'clothing', sizes: ['S', 'M', 'L', 'XL'], description: 'Fine-gauge merino blend knit with a clean V-neckline. Light enough to layer, warm enough to wear alone.' },
];

export const menOuterwear: Product[] = [
  { id: 'mo1', name: 'Puffer Vest', price: 99.99, image: '/images/products/download.png', category: 'clothing', sizes: ['S', 'M', 'L', 'XL'], description: 'Lightweight recycled-fill insulation with a packable shell — built to cut wind without weighing you down.' },
  { id: 'mo2', name: 'Windbreaker', price: 74.99, image: '/images/products/download (1).png', category: 'clothing', sizes: ['M', 'L', 'XL', 'XXL'], description: 'A water-resistant shell with taped seams and a stow-away hood, packed into a hip pocket for travel.' },
  { id: 'mo3', name: 'Wool Overcoat', price: 149.99, image: '/images/products/download (2).png', category: 'clothing', sizes: ['M', 'L', 'XL'], description: 'A double-breasted overcoat in Italian virgin wool. Structured shoulders and a full canvas lining for a coat that lasts decades.' },
  { id: 'mo4', name: 'Bomber Jacket', price: 89.99, image: '/images/products/download (3).png', category: 'clothing', sizes: ['S', 'M', 'L', 'XL'], description: 'Classic bomber silhouette in a brushed nylon shell with ribbed cuffs and hem for a close, comfortable fit.' },
  { id: 'mo5', name: 'Rain Parka', price: 69.99, image: '/images/products/download (4).png', category: 'clothing', sizes: ['S', 'M', 'L', 'XL', 'XXL'], description: 'Fully seam-sealed and breathable, this parka keeps you dry through a downpour without trapping heat.' },
];

export const menShoes: Product[] = [
  { id: 'ms1', name: 'Canvas Sneakers', price: 64.99, image: '/images/products/download (5).png', category: 'shoe', sizes: ['40', '41', '42', '43', '44', '45'], description: 'A low-profile canvas sneaker on a cushioned rubber sole — the easy everyday shoe that goes with everything.' },
  { id: 'ms2', name: 'Leather Loafers', price: 89.99, image: '/images/products/download (6).png', category: 'shoe', sizes: ['40', '41', '42', '43', '44', '45'], description: 'Hand-burnished full-grain leather loafers with a cushioned insole, built for long days that still call for polish.' },
  { id: 'ms3', name: 'Running Trainers', price: 79.99, image: '/images/products/download.png', category: 'shoe', sizes: ['40', '41', '42', '43', '44', '45'], description: 'Responsive foam midsole with a breathable knit upper — engineered for miles, styled for the street.' },
  { id: 'ms4', name: 'Suede Boots', price: 119.99, image: '/images/products/download (1).png', category: 'shoe', sizes: ['40', '41', '42', '43', '44', '45'], description: 'Rugged suede uppers on a Goodyear-welted sole, ready to be resoled for years of wear.' },
  { id: 'ms5', name: 'Slip-on Sandals', price: 39.99, image: '/images/products/download (2).png', category: 'shoe', sizes: ['40', '41', '42', '43', '44', '45'], description: 'Contoured footbed sandals with a soft strap and grippy outsole — built for warm days on the move.' },
  { id: 'ms6', name: 'High-top Trainers', price: 74.99, image: '/images/products/download (3).png', category: 'shoe', sizes: ['40', '41', '42', '43', '44', '45'], description: 'Ankle-supporting high-tops in premium leather with a vulcanized rubber sole for grip that lasts.' },
];

const allProductArrays: Product[][] = [menClothing, menOuterwear, menShoes];

export const allProducts: Product[] = allProductArrays.flat();

export function getProductById(id: string): Product | undefined {
  return allProducts.find((product) => product.id === id);
}

export function getProductSection(id: string): 'men' | 'women' | 'kids' | null {
  if (menClothing.some((p) => p.id === id)) return 'men';
  if (menOuterwear.some((p) => p.id === id)) return 'men';
  if (menShoes.some((p) => p.id === id)) return 'men';
  return null;
}

export function getRelatedProducts(product: Product, limit = 6): Product[] {
  return allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}
