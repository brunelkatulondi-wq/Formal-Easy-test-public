import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middlewares/authJwt";
import { broadcastEvent } from "../index";
import { DossierService } from "../services/dossier.service";
import { NotificationService } from "../services/notification.service";

const prisma = new PrismaClient();

export const getAllDossiers = async (req: AuthRequest, res: Response) => {
  try {
    const dossiers = await prisma.dossier.findMany({
      include: {
        user: { select: { name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(dossiers);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des dossiers" });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
  }
};

export const getAdminStats = async (req: AuthRequest, res: Response) => {
  try {
    const total = await prisma.dossier.count();
    const pending = await prisma.dossier.count({ where: { status: 'PAY_PENDING' } });
    const guce = await prisma.dossier.count({ where: { status: 'GUCE_DEPOSIT' } });
    const done = await prisma.dossier.count({ where: { status: 'DONE' } });
    const totalUsers = await prisma.user.count({ where: { role: 'CLIENT' } });

    res.json({ total, pending, guce, done, totalUsers });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du calcul des stats" });
  }
};

export const updateDossierStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const dossier = await DossierService.updateStatus(id, status, req.user.id);

    broadcastEvent(id, {
      type: 'STATUS_UPDATE',
      status,
      message: `Votre dossier est passé au statut : ${status.replace(/_/g, ' ')}`,
    });

    // Envoyer notifications (Email/SMS)
    await NotificationService.notifyStatusUpdate(id, status);

    res.json(dossier);
  } catch (error: any) {
    console.error("Admin Status Update Error:", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du statut", error: error.message });
  }
};

export const addDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, url } = req.body;

    const document = await prisma.document.create({
      data: {
        name,
        url,
        dossierId: id
      }
    });

    broadcastEvent(id, {
      type: 'DOCUMENT_ADDED',
      document
    });

    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout du document" });
  }
};
