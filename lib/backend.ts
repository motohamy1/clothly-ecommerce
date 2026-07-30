const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export function backendUrl(path: string): string {
  return `${BACKEND_URL}${path}`;
}

export async function backendFetch(path: string, init?: RequestInit) {
  const response = await fetch(backendUrl(path), {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    // Never cache catalog reads; admin changes must show up immediately.
    cache: 'no-store',
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(typeof data.error === 'string' ? data.error : `Backend request failed (${response.status})`);
  }

  return data;
}
