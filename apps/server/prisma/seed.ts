// apps/server/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@formaleasy.cd';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await prisma.user.create({
      data: {
        name: 'Administrateur',
        email: adminEmail,
        passwordHash: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log('✅ Compte Admin créé : admin@formaleasy.cd / admin123');
  } else {
    console.log('ℹ️ Le compte admin existe déjà.');
  }

  // Création de quelques dossiers fictifs pour l'admin
  const dossiersCount = await prisma.dossier.count();
  if (dossiersCount === 0) {
     const testUser = await prisma.user.upsert({
        where: { email: 'client@test.com' },
        update: {},
        create: {
            name: 'John Doe',
            email: 'client@test.com',
            passwordHash: await bcrypt.hash('password123', 12),
            role: 'CLIENT'
        }
     });

     await prisma.dossier.createMany({
        data: [
            { reference: 'FE-2026-001', companyName: 'KIN TECH SOLUTIONS SARL', legalForm: 'SARL', capital: 5000, pack: 'Confort', status: 'GUCE_DEPOSIT', userId: testUser.id, diaspora: false },
            { reference: 'FE-2026-002', companyName: 'MAMA AFRICA TRADING', legalForm: 'EI', capital: 1000, pack: 'Essentiel', status: 'PAY_PENDING', userId: testUser.id, diaspora: true },
            { reference: 'FE-2026-003', companyName: 'LUBUMBASHI MINING CORP', legalForm: 'SARL', capital: 100000, pack: 'Premium', status: 'DONE', userId: testUser.id, diaspora: false },
        ]
     });
     console.log('✅ Dossiers de test créés.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
