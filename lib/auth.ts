import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export interface SessionUser {
  sub: string;
  email: string;
  role: 'admin' | 'customer';
}

export const COOKIE_NAME = 'clothly_session';

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? '');
    const { payload } = await jwtVerify(token, secret);
    const { sub, email, role } = payload as unknown as SessionUser;

    if (role !== 'admin' && role !== 'customer') return null;

    return { sub, email, role };
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<SessionUser> {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return session;
}

export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    throw new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return session;
}

export async function backendFetchRaw(path: string, init?: RequestInit): Promise<Response> {
  const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
  return fetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    cache: 'no-store',
  });
}
