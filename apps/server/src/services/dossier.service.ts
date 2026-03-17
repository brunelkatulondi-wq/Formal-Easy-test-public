// apps/server/src/services/dossier.service.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const DossierService = {
  async create(userId: string, data: any) {
    const reference = `FE-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`;
    
    const dossier = await prisma.dossier.create({
      data: {
        ...data,
        reference,
        userId,
        capital: parseInt(data.capital) || 0,
      }
    });

    await prisma.event.create({
      data: {
        type: "DOSSIER_CREATION",
        payload: JSON.stringify({ pack: data.pack, legalForm: data.legalForm }),
        dossierId: dossier.id,
      }
    });

    return dossier;
  },

  async updateStatus(dossierId: string, status: string, adminId?: string) {
    const dossier = await prisma.dossier.update({
      where: { id: dossierId },
      data: { status }
    });

    await prisma.event.create({
      data: {
        type: "STATUS_CHANGE",
        payload: JSON.stringify({ status, updatedAt: new Date(), adminId }),
        dossierId: dossier.id,
      }
    });

    return dossier;
  }
};
