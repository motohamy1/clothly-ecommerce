"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const clothes_1 = __importDefault(require("./routers/clothes"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// --- JWT_SECRET: fail-fast if missing ---
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    console.error('[clothly-backend] FATAL: JWT_SECRET is required. Set it in your .env file.');
    process.exit(1);
}
// --- MONGODB_URI: env-driven with dev default + production warning ---
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/clothly-ecommerce';
if (!process.env.MONGODB_URI && process.env.NODE_ENV === 'production') {
    console.warn('[clothly-backend] WARNING: using default MONGODB_URI in production. Set MONGODB_URI in your env.');
}
app.use(express_1.default.json());
app.use('/shop', clothes_1.default);
app.get('/health', (_req, res) => {
    res.json({ ok: true, service: 'clothly-backend' });
});
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});
mongoose_1.default
    .connect(mongoUri)
    .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
    .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});
