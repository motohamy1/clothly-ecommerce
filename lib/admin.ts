import { backendFetch } from './backend';

export interface AdminStats {
  connected: boolean;
  error?: string;
  totalProducts: number;
  bySection: Record<'men' | 'women' | 'kids', number>;
  categoryCounts: {
    clothing: number;
    outerwear: number;
    shoes: number;
  };
}

export async function getAdminStats(): Promise<AdminStats> {
  try {
    const data = await backendFetch('/shop/products');
    const products = Array.isArray(data.products) ? data.products : [];

    const bySection = { men: 0, women: 0, kids: 0 };
    const categoryCounts = { clothing: 0, outerwear: 0, shoes: 0 };

    for (const product of products) {
      const section = product.section as keyof typeof bySection;
      if (section === 'men' || section === 'women' || section === 'kids') {
        bySection[section] += 1;
      }
      const group = product.group as keyof typeof categoryCounts;
      if (group === 'clothing' || group === 'outerwear' || group === 'shoes') {
        categoryCounts[group] += 1;
      }
    }

    return { connected: true, totalProducts: products.length, bySection, categoryCounts };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Backend is not reachable',
      totalProducts: 0,
      bySection: { men: 0, women: 0, kids: 0 },
      categoryCounts: { clothing: 0, outerwear: 0, shoes: 0 },
    };
  }
}
