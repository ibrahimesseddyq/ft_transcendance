// prisma/seed.js
import { PrismaClient, UserRole } from '../generated/prisma/index.js';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import argon2 from 'argon2';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL || 'mysql://root:root@localhost:3307/hirefy');
const prisma = new PrismaClient({ adapter });

async function main() {
  const plainPassword = 'Abdellatif123@@';
  const passwordHash = await argon2.hash(plainPassword);

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
    password: plainPassword,
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