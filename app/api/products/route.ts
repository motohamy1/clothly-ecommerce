import { NextResponse } from 'next/server';
import { allProducts, catalog, getProductsBySection, type ProductSection } from '@/lib/products';

const sections = new Set<ProductSection>(['men', 'women', 'kids']);

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get('section') as ProductSection | null;

  if (section) {
    if (!sections.has(section)) {
      return NextResponse.json({ error: 'Unknown product section' }, { status: 400 });
    }

    return NextResponse.json({ collection: catalog[section], products: getProductsBySection(section) });
  }

  return NextResponse.json({ catalog, products: allProducts });
}
