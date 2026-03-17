// apps/server/get-token.ts
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = "superSecretJwtKey";

async function main() {
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@formaleasy.cd' }
  });

  if (!admin) {
    console.error('Admin not found');
    return;
  }

  const payload = { sub: admin.id, name: admin.name, email: admin.email, role: admin.role };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  console.log('TOKEN:', token);
}

main().catch(console.error).finally(() => prisma.$disconnect());
