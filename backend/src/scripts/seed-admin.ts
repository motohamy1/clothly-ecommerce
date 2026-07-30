import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/user';

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD are required');
    process.exit(1);
  }

  if (adminPassword.length < 12) {
    console.error(`ADMIN_PASSWORD must be at least 12 characters (got ${adminPassword.length})`);
    process.exit(1);
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/clothly-ecommerce';
  await mongoose.connect(mongoUri);

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const result = await UserModel.findOneAndUpdate(
    { email: adminEmail.toLowerCase().trim() },
    { $set: { email: adminEmail.toLowerCase().trim(), password: passwordHash, role: 'admin' } },
    { upsert: true, new: true, setDefaultsOnInsert: true, projection: { password: 0 } },
  );

  console.log(`Admin upserted: ${result.email} (id=${result._id})`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('seed-admin failed:', err);
  process.exit(1);
});
