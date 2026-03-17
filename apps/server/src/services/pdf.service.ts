// apps/server/src/services/pdf.service.ts
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { generateStatutesText, FormData } from '../utils/legalEngine';
import { generateFullStatutesDraft, hasRealKey } from './ai.service';

export async function generateStatutsPdf(dossierData: any): Promise<Uint8Array> {
  // 1. Générer le texte brut via le moteur
  const formData: FormData = {
    type: dossierData.legalForm,
    denomination: dossierData.companyName,
    siegeSocial: dossierData.siegeSocial || 'Kinshasa, RDC', 
    capitalSocialCDF: dossierData.capital || 0,
    objetSocial: dossierData.socialObject || dossierData.activityDescription || 'Néant',
    gerant: dossierData.user?.name || 'Le Promoteur',
    associes: [], 
  };
  
  let text = generateStatutesText(formData);

  // Si une clé OpenAI est dispo, tenter la génération complète des statuts
  if (hasRealKey) {
    try {
      text = await generateFullStatutesDraft({
        type: dossierData.legalForm || 'SARL',
        denomination: dossierData.companyName || 'LA SOCIÉTÉ',
        siegeSocial: formData.siegeSocial,
        capitalSocialCDF: formData.capitalSocialCDF,
        objetSocial: formData.objetSocial,
        gerant: formData.gerant,
      });
    } catch (e) {
      // fallback silencieux sur le template statique
      text = generateStatutesText(formData);
    }
  }

  // 2. Créer le document PDF
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  let page = pdfDoc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();
  const fontSize = 10;
  const margin = 50;
  let y = height - margin;

  const lines = text.split('\n');

  for (const line of lines) {
    if (y < margin + 20) {
      page = pdfDoc.addPage([595, 842]);
      y = height - margin;
    }

    const isBold = line.startsWith('**') && line.endsWith('**');
    const cleanLine = line.replace(/\*\*/g, '');

    page.drawText(cleanLine, {
      x: margin,
      y,
      size: isBold ? fontSize + 1 : fontSize,
      font: isBold ? boldFont : font,
      color: rgb(0, 0, 0),
      maxWidth: width - margin * 2,
    });

    const textHeight = isBold ? fontSize + 6 : fontSize + 4;
    y -= textHeight;
  }

  // Pied de page avec référence dossier
  page.drawText(`Réf: ${dossierData.reference || ''} | Généré par FormalEasy DRC`, {
    x: margin,
    y: margin / 2,
    size: 8,
    font,
    color: rgb(0.4, 0.4, 0.4),
  });

  return await pdfDoc.save();
}
