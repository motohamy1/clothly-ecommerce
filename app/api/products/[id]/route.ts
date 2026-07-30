import { NextResponse } from 'next/server';
import { getProductById, getRelatedProducts } from '@/lib/products';

interface ProductRouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: ProductRouteProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({ product, related: getRelatedProducts(product, 6) });
}
