// apps/server/test-api.ts
import axios from 'axios';
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

  console.log('--- Testing API ---');
  try {
    const stats = await axios.get('http://localhost:4000/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Stats Response:', stats.data);

    const dossiers = await axios.get('http://localhost:4000/api/admin/dossiers', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Dossiers Count:', dossiers.data.length);
    if (dossiers.data.length > 0) {
        console.log('First Dossier Ref:', dossiers.data[0].reference);
    }
  } catch (err: any) {
    console.error('API Error:', err.response?.status, err.response?.data || err.message);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
