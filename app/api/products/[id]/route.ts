import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';

interface ProductRouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: ProductRouteProps) {
  const { id } = await params;
  try {
    const data = await backendFetch('/shop/products/' + encodeURIComponent(id));
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const status = error instanceof Error && error.message.toLowerCase().includes('not found') ? 404 : 502;
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Backend request failed' }, { status });
  }
}
