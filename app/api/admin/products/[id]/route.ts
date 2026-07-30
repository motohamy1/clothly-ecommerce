import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';
import { requireAdmin } from '@/lib/auth';

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteProps) {
  try { await requireAdmin(); } catch (r) { return r as Response; }
  const { id } = await params;
  try {
    const body = await request.json();
    const data = await backendFetch(`/shop/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update product' },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteProps) {
  try { await requireAdmin(); } catch (r) { return r as Response; }
  const { id } = await params;
  try {
    const data = await backendFetch(`/shop/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete product' },
      { status: 400 },
    );
  }
}
