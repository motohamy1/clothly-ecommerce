import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user';

const router = express.Router();

function parseCookieHeader(header: string | undefined, name: string): string | null {
  if (!header) return null;
  const parts = header.split(';');
  for (const part of parts) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return decodeURIComponent(rest.join('='));
  }
  return null;
}

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (typeof password !== 'string' || !password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const user = await UserModel.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { sub: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { algorithm: 'HS256', expiresIn: '7d' },
    );

    res.cookie('clothly_session', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ ok: true, user: { email: user.email, role: user.role } });
  } catch (err) {
    return next(err);
  }
});

router.post('/signup', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await UserModel.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await UserModel.create({
      email: normalizedEmail,
      password: passwordHash,
      role: 'customer',
    });

    const token = jwt.sign(
      { sub: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { algorithm: 'HS256', expiresIn: '7d' },
    );

    res.cookie('clothly_session', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({ ok: true, user: { email: user.email, role: user.role } });
  } catch (err) {
    if (err && typeof err === 'object' && 'code' in err && (err as { code: number }).code === 11000) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    return next(err);
  }
});

router.get('/me', async (req, res, next) => {
  try {
    const token = parseCookieHeader(req.headers.cookie, 'clothly_session');
    if (!token) {
      return res.status(200).json({ user: null });
    }

    let payload: { sub: string; email: string; role: string };
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!) as typeof payload;
    } catch {
      return res.status(200).json({ user: null });
    }

    return res.status(200).json({ user: { email: payload.email, role: payload.role } });
  } catch (err) {
    return next(err);
  }
});

router.post('/logout', async (_req, res, next) => {
  try {
    res.clearCookie('clothly_session', { path: '/' });
    return res.status(200).json({ ok: true });
  } catch (err) {
    return next(err);
  }
});

export default router;
