import { NextResponse } from 'next/server';
import { backendFetchRaw } from '@/lib/auth';

export async function POST(request: Request) {
  const body = await request.json();
  const backendRes = await backendFetchRaw('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  const setCookie = backendRes.headers.get('set-cookie');
  const data = await backendRes.json().catch(() => ({}));

  const response = NextResponse.json(data, { status: backendRes.status });
  if (setCookie) {
    response.headers.set('set-cookie', setCookie);
  }
  return response;
}
