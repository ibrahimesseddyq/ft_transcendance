// prisma/seed.js
import { PrismaClient, UserRole } from '../generated/prisma/index.js';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import dotenv from 'dotenv'
import argon2 from 'argon2';

// config(); 
// TODO !!!1 use just env var and remove plainpassword
const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = process.env.RECRUITER_PASS;
  const passwordHash = await argon2.hash(password);

  const recruiter = await prisma.user.upsert({
    where: { email: 'recruiter@company.com' },
    update: {},
    create: {
      email: 'recruiter@company.com',
      passwordHash,
      role: UserRole.recruiter,
      firstName: 'John',
      lastName: 'Recruiter',
      isVerified: true,
      twoFAEnabled: true,
      firstLogin: true,
    },
  });

  console.log('✅ Recruiter created:', {
    id: recruiter.id,
    email: recruiter.email,
    role: recruiter.role,
    password: password,
  });
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });