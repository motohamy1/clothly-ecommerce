export interface ProductVariant {
  colorName: string;
  colorValue: string;
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
// Types only. The seed data lives in ./product-seeds.ts.
