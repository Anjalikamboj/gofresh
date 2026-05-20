/**
 * Seed script — Admin + test user
 * Mirrors backend/seed_users.py exactly.
 *
 * Usage:
 *   npx ts-node src/seeds/seed-users.ts
 */

import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { env } from '../config/env';
import { UserModel } from '../modules/auth/auth.model';

async function seedUsers(): Promise<void> {
  const mongoUri = `${env.MONGO_URL.replace(/\/$/, '')}/${env.MONGO_DB_NAME}`;
  await mongoose.connect(mongoUri);

  const users = [
    {
      email: 'admin@grofresh.com',
      full_name: 'Admin User',
      password: 'admin123',
      role: 'admin' as const,
    },
    {
      email: 'user@grofresh.com',
      full_name: 'Test User',
      password: 'user123',
      role: 'user' as const,
    },
  ];

  for (const u of users) {
    const existing = await UserModel.findOne({ email: u.email });

    if (existing) {
      console.log(`⚠️  User already exists: ${u.email}`);
      continue;
    }

    const hashed_password = await bcrypt.hash(u.password, 10);

    await UserModel.create({
      email: u.email,
      full_name: u.full_name,
      hashed_password,
      role: u.role,
      created_at: new Date(),
    });

    console.log(`✅ ${u.role === 'admin' ? 'Admin' : 'Test'} user created!`);
    console.log(`   Email:    ${u.email}`);
    console.log(`   Password: ${u.password}`);
    console.log(`   Role:     ${u.role}`);
  }

  await mongoose.connection.close();
}

seedUsers().catch((err: unknown) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
