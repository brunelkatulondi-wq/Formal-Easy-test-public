import { Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middlewares/authJwt";
import { generateStatutsPdf } from "../services/pdf.service";
import { DossierService } from "../services/dossier.service";

const prisma = new PrismaClient();

export const createDossier = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const dossier = await DossierService.create(req.user.id, req.body);
    res.status(201).json({ status: 'success', data: dossier });
  } catch (e: any) {
    console.error("Dossier Creation Error:", e);
    res.status(500).json({ message: "Erreur lors de la création du dossier", error: e.message });
  }
};

export const getMyDossiers = async (req: AuthRequest, res: Response) => {
  const dossiers = await prisma.dossier.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
  });
  res.json(dossiers);
};

export const getDossier = async (req: AuthRequest, res: Response) => {
  const dossier = await prisma.dossier.findUnique({
    where: { id: req.params.id },
    include: { events: true, documents: true, messages: true },
  });
  
  if (!dossier) return res.status(404).json({ message: "Dossier introuvable" });
  if (dossier.userId !== req.user.id && req.user.role === 'CLIENT') {
    return res.status(403).json({ message: "Accès refusé" });
  }

  res.json(dossier);
};

export const downloadStatuts = async (req: AuthRequest, res: Response) => {
  try {
    const dossier = await prisma.dossier.findUnique({
      where: { id: req.params.id },
      include: { user: true }
    });

    if (!dossier) return res.status(404).json({ message: "Dossier introuvable" });
    const isAdmin = req.user.role === 'ADMIN' || req.user.role === 'GERANT';
    if (!isAdmin && dossier.userId !== req.user.id) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const pdfBuffer = await generateStatutsPdf(dossier);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${dossier.reference}_statuts.pdf"`);
    res.send(Buffer.from(pdfBuffer));
  } catch (e) {
    res.status(500).json({ message: "Erreur lors de la génération du PDF" });
  }
};

export const signDossier = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { signature } = req.body;

    const dossier = await prisma.dossier.findUnique({
      where: { id },
    });

    if (!dossier) return res.status(404).json({ message: "Dossier introuvable" });
    if (dossier.userId !== req.user.id) return res.status(403).json({ message: "Accès refusé" });

    // Enregistrer l'événement de signature
    await prisma.event.create({
      data: {
        type: 'SIGNED',
        payload: JSON.stringify({ signature, signedBy: req.user.name }),
        dossierId: id
      }
    });

    // Mettre à jour le statut du dossier
    const updatedDossier = await prisma.dossier.update({
      where: { id },
      data: { status: 'SIGNED_BY_CLIENT' }
    });

    res.json({ status: 'success', data: updatedDossier });
  } catch (e) {
    res.status(500).json({ message: "Erreur lors de la signature" });
  }
};
