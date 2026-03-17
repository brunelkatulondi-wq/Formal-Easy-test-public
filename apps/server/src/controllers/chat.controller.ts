// apps/server/src/controllers/chat.controller.ts
import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middlewares/authJwt";
import { broadcastEvent } from "../index";

const prisma = new PrismaClient();

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { dossierId, content } = req.body;
    const fromUserId = req.user.id;

    // Vérifier si le dossier existe
    const dossier = await prisma.dossier.findUnique({
      where: { id: dossierId },
    });

    if (!dossier) return res.status(404).json({ message: "Dossier introuvable" });

    // Autorisation : un client ne peut écrire que dans son dossier
    const isAdmin = req.user.role === 'ADMIN' || req.user.role === 'GERANT';
    if (!isAdmin && dossier.userId !== fromUserId) {
      return res.status(403).json({ message: "Accès refusé à ce dossier" });
    }

    const message = await prisma.message.create({
      data: {
        content,
        userId: fromUserId,
        dossierId: dossierId,
      },
      include: {
        user: { select: { name: true, role: true } }
      }
    });

    // Notifier via WebSockets
    broadcastEvent(dossierId, {
      type: 'NEW_MESSAGE',
      message
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'envoi du message" });
  }
};

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { dossierId } = req.params;

    const dossier = await prisma.dossier.findUnique({ where: { id: dossierId } });
    if (!dossier) return res.status(404).json({ message: "Dossier introuvable" });

    const isAdmin = req.user.role === 'ADMIN' || req.user.role === 'GERANT';
    if (!isAdmin && dossier.userId !== req.user.id) {
      return res.status(403).json({ message: "Accès refusé à ce dossier" });
    }

    const messages = await prisma.message.findMany({
      where: { dossierId },
      include: {
        user: { select: { name: true, role: true } }
      },
      orderBy: { sentAt: 'asc' },
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des messages" });
  }
};
