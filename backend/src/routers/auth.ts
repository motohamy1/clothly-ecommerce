import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user';

const router = express.Router();

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

router.post('/logout', async (_req, res, next) => {
  try {
    res.clearCookie('clothly_session', { path: '/' });
    return res.status(200).json({ ok: true });
  } catch (err) {
    return next(err);
  }
});

export default router;
