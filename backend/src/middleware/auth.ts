import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user';

function parseCookie(header: string | undefined, name: string): string | null {
  if (!header) return null;
  const parts = header.split(';');
  for (const part of parts) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return decodeURIComponent(rest.join('='));
  }
  return null;
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = parseCookie(req.headers.cookie, 'clothly_session');
  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string; email: string; role: string };
    req.auth = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired session' });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  requireAuth(req, res, () => {
    if (!req.auth || req.auth.role !== 'admin') {
      res.status(403).json({ error: 'Admin access required' });
      return;
    }
    next();
  });
}

export async function verifyUserExists(req: Request, _res: Response, next: NextFunction): Promise<void> {
  if (req.auth?.sub) {
    try {
      const user = await UserModel.findById(req.auth.sub).select('_id email role').lean();
      if (!user) {
        _res.status(401).json({ error: 'Account no longer exists' });
        return;
      }
      req.auth = { sub: user._id.toString(), email: user.email, role: user.role };
    } catch {
      // DB error — let the route handle it instead of blocking
    }
  }
  next();
}
