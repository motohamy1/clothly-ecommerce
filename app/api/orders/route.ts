import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { backendFetchRaw } from '@/lib/auth';

export async function POST(request: Request) {
  // The session cookie is httpOnly: only this server-side handler can read it
  // and forward it to the backend, which enforces auth and reprices the order.
  const cookieStore = await cookies();
  const token = cookieStore.get('clothly_session')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const backendRes = await backendFetchRaw('/orders', {
    method: 'POST',
    headers: { Cookie: `clothly_session=${token}` },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json().catch(() => ({}));
  return NextResponse.json(data, { status: backendRes.status });
}
