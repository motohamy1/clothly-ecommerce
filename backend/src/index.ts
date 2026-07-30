import express from 'express';
import mongoose from 'mongoose';
import clothesRouter from './routers/clothes';

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/clothly-ecommerce';

app.use(express.json());
app.use('/shop', clothesRouter);

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'clothly-backend' });
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

mongoose
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
