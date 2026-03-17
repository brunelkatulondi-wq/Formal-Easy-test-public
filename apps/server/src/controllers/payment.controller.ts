// apps/server/src/controllers/payment.controller.ts
import { Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import { createCheckoutSession, verifyWebhook } from '../services/stripe.service';
import { AuthRequest } from '../middlewares/authJwt';
import { broadcastEvent } from '../index';

const prisma = new PrismaClient();

export const initiatePayment = async (req: AuthRequest, res: Response) => {
  try {
    const { dossierId } = req.body;
    const dossier = await prisma.dossier.findUnique({
      where: { id: dossierId },
    });

    if (!dossier) return res.status(404).json({ message: "Dossier introuvable" });
    if (dossier.userId !== req.user.id) return res.status(403).json({ message: "Action non autorisée" });

    const session = await createCheckoutSession(req.user.id, dossier.id, dossier.pack);
    res.json({ url: session.url });
  } catch (error) {
    console.error('[Stripe] initiatePayment error', error);
    res.status(500).json({ message: "Erreur lors de l'initialisation du paiement" });
  }
};

export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event;

  try {
    event = verifyWebhook(req.body, sig);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const { dossierId } = session.metadata;

    // Mettre à jour le dossier
    const updatedDossier = await prisma.dossier.update({
      where: { id: dossierId },
      data: { status: 'PAY_PENDING' }, // En attente de traitement après paiement
    });

    // Enregistrer l'événement de paiement
    await prisma.event.create({
      data: {
        type: 'PAYMENT_RECEIVED',
        payload: JSON.stringify({ amount: session.amount_total, currency: session.currency }),
        dossierId: dossierId,
      },
    });

    // Notifier le client en temps réel via Socket.io
    broadcastEvent(dossierId, {
      type: 'PAYMENT_SUCCESS',
      status: 'PAY_PENDING',
      message: 'Paiement reçu ! Votre dossier est maintenant en cours de traitement.',
    });
  }

  res.json({ received: true });
};
