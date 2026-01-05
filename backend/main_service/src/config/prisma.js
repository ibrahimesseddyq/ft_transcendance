const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], 
});

// Test connection
prisma.$connect()
  .then(() => console.log('✅ Prisma connected to MySQL'))
  .catch(err => console.error('❌ Prisma connection failed:', err));

module.exports = prisma;