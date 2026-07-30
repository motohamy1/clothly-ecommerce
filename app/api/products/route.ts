import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';
import type { ProductSection } from '@/lib/products';

const sections = new Set<ProductSection>(['men', 'women', 'kids']);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get('section') as ProductSection | null;

  if (section) {
    if (!sections.has(section)) {
      return NextResponse.json({ error: 'Unknown product section' }, { status: 400 });
    }

    const data = await backendFetch('/shop/' + section);
    return NextResponse.json(data, { status: 200 });
  }

  const data = await backendFetch('/shop/products');
  return NextResponse.json(data, { status: 200 });
}
