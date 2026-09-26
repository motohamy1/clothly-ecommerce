import { beforeEach, describe, expect, it, vi } from 'vitest';
import type * as AuthModule from '@/lib/auth';

const mocks = vi.hoisted(() => ({
  backendFetch: vi.fn(),
  cookies: vi.fn(),
  requireAdmin: vi.fn(),
}));

vi.mock('@/lib/backend', () => ({ backendFetch: mocks.backendFetch }));
vi.mock('next/headers', () => ({ cookies: mocks.cookies }));
vi.mock('@/lib/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof AuthModule>();
  return { ...actual, requireAdmin: mocks.requireAdmin };
});

import { DELETE } from './route';

describe('DELETE /api/admin/products/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.cookies.mockResolvedValue({
      get: () => ({ value: 'admin-session-token' }),
    });
    mocks.backendFetch.mockResolvedValue({ ok: true });
  });

  it('forwards the admin session cookie to the backend delete route', async () => {
    const response = await DELETE(new Request('http://localhost/api/admin/products/item-1'), {
      params: Promise.resolve({ id: 'item-1' }),
    });

    expect(response.status).toBe(200);
    expect(mocks.backendFetch).toHaveBeenCalledWith('/shop/products/item-1', {
      method: 'DELETE',
      headers: { Cookie: 'clothly_session=admin-session-token' },
    });
  });
});
