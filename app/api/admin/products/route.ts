import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try { await requireAdmin(); } catch (r) { return r as Response; }
  try {
    const data = await backendFetch('/shop/products');
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not reach the product backend', offline: true },
      { status: 502 },
    );
  }
}

export async function POST(request: Request) {
  try { await requireAdmin(); } catch (r) { return r as Response; }
  try {
    const body = await request.json();
    const data = await backendFetch('/shop/products', { method: 'POST', body: JSON.stringify(body) });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create product';
    return NextResponse.json({ error: message }, { status: message.includes('already exists') ? 409 : 400 });
  }
}
