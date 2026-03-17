// apps/server/src/services/notification.service.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class NotificationService {
  /**
   * Simule l'envoi d'un email
   */
  static async sendEmail(to: string, subject: string, body: string) {
    console.log('\x1b[36m%s\x1b[0m', '✉️ [SIMULATION EMAIL]');
    console.log(`À: ${to}`);
    console.log(`Sujet: ${subject}`);
    console.log(`Contenu: ${body}`);
    console.log('--------------------------');
  }

  /**
   * Simule l'envoi d'un SMS (Twilio-like)
   */
  static async sendSMS(to: string, message: string) {
    console.log('\x1b[33m%s\x1b[0m', '📱 [SIMULATION SMS]');
    console.log(`Vers: ${to}`);
    console.log(`Message: ${message}`);
    console.log('--------------------------');
  }

  /**
   * Notifie le statut du dossier
   */
  static async notifyStatusUpdate(dossierId: string, status: string) {
    const dossier = await prisma.dossier.findUnique({
      where: { id: dossierId },
      include: { user: true }
    });

    if (dossier && dossier.user) {
      const statusLabel = status.replace(/_/g, ' ');
      await this.sendEmail(
        dossier.user.email,
        `Mise à jour de votre dossier ${dossier.reference}`,
        `Bonjour ${dossier.user.name},\n\nLe statut de votre dossier est passé à : ${statusLabel}.\nConnectez-vous à votre tableau de bord pour plus de détails.`
      );

      if (dossier.user.phone) {
        await this.sendSMS(
          dossier.user.phone,
          `FormalEasy: Votre dossier ${dossier.reference} est maintenant en statut ${statusLabel}.`
        );
      }
    }
  }

  /**
   * Notifie un nouveau message
   */
  static async notifyNewMessage(dossierId: string, fromName: string) {
    const dossier = await prisma.dossier.findUnique({
      where: { id: dossierId },
      include: { user: true }
    });

    if (dossier && dossier.user) {
      await this.sendEmail(
        dossier.user.email,
        `Nouveau message sur votre dossier ${dossier.reference}`,
        `Bonjour ${dossier.user.name},\n\n${fromName} vous a envoyé un nouveau message.\nRépondez sur votre dashboard FormalEasy.`
      );
    }
  }
}
