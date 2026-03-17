// apps/server/check-db.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- DB Check Detailed ---');
  const users = await prisma.user.findMany();
  console.log(`Total Users: ${users.length}`);
  users.forEach(u => console.log(`- ${u.email} [${u.role}]`));
  
  const dossiers = await prisma.dossier.findMany({ include: { user: true } });
  console.log(`\nTotal Dossiers: ${dossiers.length}`);
  dossiers.forEach(d => {
    console.log(`- [${d.reference}] ${d.companyName} | Status: ${d.status} | Client: ${d.user?.email || 'N/A'}`);
  });
  console.log('-------------------------');
}

main().catch(console.error).finally(() => prisma.$disconnect());
