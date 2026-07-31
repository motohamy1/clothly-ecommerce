import { NextResponse } from 'next/server';
import { backendFetchRaw } from '@/lib/auth';

export async function GET() {
  const backendRes = await backendFetchRaw('/auth/me', { method: 'GET' });
  const data = await backendRes.json().catch(() => ({ user: null }));
  return NextResponse.json(data, { status: backendRes.status });
}
