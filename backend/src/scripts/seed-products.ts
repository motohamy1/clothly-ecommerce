import mongoose from 'mongoose';
import { ProductModel } from '../models/product';
import { productSeeds } from '../../../lib/product-seeds';

async function main() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/clothly-ecommerce';
  await mongoose.connect(mongoUri);

  const operations = productSeeds.map((seed) => ({
    updateOne: {
      filter: { id: seed.id },
      update: { $set: seed },
      upsert: true,
    },
  }));

  const result = await ProductModel.bulkWrite(operations);
  console.log(`Seeded ${productSeeds.length} products (matched: ${result.matchedCount}, upserted: ${result.upsertedCount}, modified: ${result.modifiedCount})`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('seed-products failed:', err);
  process.exit(1);
});
