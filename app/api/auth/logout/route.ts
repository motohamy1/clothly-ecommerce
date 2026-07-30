import { NextResponse } from 'next/server';
import { backendFetchRaw } from '@/lib/auth';

export async function POST() {
  const backendRes = await backendFetchRaw('/auth/logout', { method: 'POST' });

  const setCookie = backendRes.headers.get('set-cookie');
  const data = await backendRes.json().catch(() => ({}));

  const response = NextResponse.json(data, { status: backendRes.status });
  if (setCookie) {
    response.headers.set('set-cookie', setCookie);
  }
  return response;
}
