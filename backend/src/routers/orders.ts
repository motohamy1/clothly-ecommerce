import express from 'express';
import { OrderModel } from '../models/order';
import { ProductModel } from '../models/product';
import { requireAuth } from '../middleware/auth';
import { rateLimit } from '../middleware/rate-limit';
import { parseOrderItems, priceOrderItems } from '../lib/order-pricing';

const router = express.Router();

// Checkout: requires a session, validates the payload, then recomputes
// every line price from the catalog before persisting the order.
router.post('/', rateLimit(10, 60_000), requireAuth, async (req, res, next) => {
  try {
    const parsed = parseOrderItems(req.body);
    if (!parsed.ok) {
      return res.status(400).json({ error: parsed.error });
    }

    const ids = [...new Set(parsed.items.map((item) => item.productId))];
    const catalog = await ProductModel.find({ id: { $in: ids } })
      .select('id name price')
      .lean();

    const priced = priceOrderItems(parsed.items, catalog);
    if (!priced.ok) {
      return res.status(400).json({ error: priced.error });
    }

    const order = await OrderModel.create({
      user: req.auth!.sub,
      items: priced.items,
      total: priced.total,
    });

    return res.status(201).json({ order: order.toJSON() });
  } catch (error) {
    return next(error);
  }
});

export default router;
