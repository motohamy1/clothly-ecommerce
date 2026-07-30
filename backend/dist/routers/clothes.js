"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_1 = require("../models/product");
const products_1 = require("../data/products");
const router = express_1.default.Router();
const sections = new Set(['men', 'women', 'kids']);
const groups = new Set(['clothing', 'outerwear', 'shoes']);
function isSection(value) {
    return sections.has(value);
}
function isGroup(value) {
    return groups.has(value);
}
function normalizeList(value) {
    if (Array.isArray(value))
        return value.map(String).filter(Boolean);
    if (typeof value === 'string')
        return value.split(',').map((item) => item.trim()).filter(Boolean);
    return [];
}
function productPayload(body) {
    return {
        id: String(body.id ?? '').trim(),
        name: String(body.name ?? '').trim(),
        price: Number(body.price),
        image: String(body.image ?? '').trim(),
        category: body.category,
        group: body.group,
        section: body.section,
        description: String(body.description ?? '').trim(),
        images: normalizeList(body.images),
        sizes: normalizeList(body.sizes),
        variants: Array.isArray(body.variants) ? body.variants : [],
    };
}
function validateProductPayload(payload) {
    if (!payload.id)
        return 'Product id is required';
    if (!payload.name)
        return 'Product name is required';
    if (!Number.isFinite(payload.price) || payload.price < 0)
        return 'Valid product price is required';
    if (!payload.image)
        return 'Product image is required';
    if (!payload.description)
        return 'Product description is required';
    if (!isSection(String(payload.section)))
        return 'Valid section is required';
    if (!isGroup(String(payload.group)))
        return 'Valid product group is required';
    if (payload.category !== 'clothing' && payload.category !== 'shoe')
        return 'Valid product category is required';
    return null;
}
router.get('/products', async (req, res, next) => {
    try {
        const { section, group } = req.query;
        const filter = {};
        if (typeof section === 'string') {
            if (!isSection(section))
                return res.status(400).json({ error: 'Unknown product section' });
            filter.section = section;
        }
        if (typeof group === 'string') {
            if (!isGroup(group))
                return res.status(400).json({ error: 'Unknown product group' });
            filter.group = group;
        }
        const products = await product_1.ProductModel.find(filter).sort({ section: 1, group: 1, name: 1 });
        return res.json({ products });
    }
    catch (error) {
        return next(error);
    }
});
router.get('/products/:id', async (req, res, next) => {
    try {
        const product = await product_1.ProductModel.findOne({ id: req.params.id });
        if (!product)
            return res.status(404).json({ error: 'Product not found' });
        const related = await product_1.ProductModel.find({
            id: { $ne: product.id },
            $or: [{ section: product.section }, { category: product.category }],
        }).limit(6);
        return res.json({ product, related });
    }
    catch (error) {
        return next(error);
    }
});
router.post('/products', async (req, res, next) => {
    try {
        const payload = productPayload(req.body);
        const validationError = validateProductPayload(payload);
        if (validationError)
            return res.status(400).json({ error: validationError });
        const product = await product_1.ProductModel.create({
            ...payload,
            images: payload.images.length > 0 ? payload.images : [payload.image],
            sizes: payload.sizes,
        });
        return res.status(201).json({ product });
    }
    catch (error) {
        if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
            return res.status(409).json({ error: 'A product with this id already exists' });
        }
        return next(error);
    }
});
router.put('/products/:id', async (req, res, next) => {
    try {
        const payload = productPayload({ ...req.body, id: req.params.id });
        const validationError = validateProductPayload(payload);
        if (validationError)
            return res.status(400).json({ error: validationError });
        const product = await product_1.ProductModel.findOneAndUpdate({ id: req.params.id }, { $set: { ...payload, images: payload.images.length > 0 ? payload.images : [payload.image] } }, { new: true, runValidators: true });
        if (!product)
            return res.status(404).json({ error: 'Product not found' });
        return res.json({ product });
    }
    catch (error) {
        return next(error);
    }
});
router.delete('/products/:id', async (req, res, next) => {
    try {
        const product = await product_1.ProductModel.findOneAndDelete({ id: req.params.id });
        if (!product)
            return res.status(404).json({ error: 'Product not found' });
        return res.json({ ok: true, product });
    }
    catch (error) {
        return next(error);
    }
});
router.get('/:section', async (req, res, next) => {
    try {
        const { section } = req.params;
        if (!isSection(section))
            return res.status(404).json({ error: 'Unknown product section' });
        const products = await product_1.ProductModel.find({ section }).sort({ group: 1, name: 1 });
        const collection = {
            section,
            groups: {
                clothing: products.filter((product) => product.group === 'clothing'),
                outerwear: products.filter((product) => product.group === 'outerwear'),
                shoes: products.filter((product) => product.group === 'shoes'),
            },
        };
        return res.json({ collection, products });
    }
    catch (error) {
        return next(error);
    }
});
router.get('/:section/:id', async (req, res, next) => {
    try {
        const { section, id } = req.params;
        if (!isSection(section))
            return res.status(404).json({ error: 'Unknown product section' });
        const product = await product_1.ProductModel.findOne({ section, id });
        if (!product)
            return res.status(404).json({ error: 'Product not found' });
        return res.json({ product });
    }
    catch (error) {
        return next(error);
    }
});
router.post('/seed', async (_req, res, next) => {
    try {
        const operations = products_1.productSeeds.map((seed) => ({
            updateOne: {
                filter: { id: seed.id },
                update: { $set: seed },
                upsert: true,
            },
        }));
        const result = await product_1.ProductModel.bulkWrite(operations);
        return res.json({ ok: true, matched: result.matchedCount, upserted: result.upsertedCount, modified: result.modifiedCount });
    }
    catch (error) {
        return next(error);
    }
});
exports.default = router;
