// apps/server/src/utils/legalEngine.ts
import { SARL_TEMPLATE, EI_TEMPLATE, SA_TEMPLATE, SAS_TEMPLATE, SNC_TEMPLATE } from '../templates/legalTemplates';

export interface FormData {
  type: string;
  denomination: string;
  siegeSocial: string;
  capitalSocialCDF: number;
  valeurPartCDF?: number;
  objetSocial: string;
  associes?: Array<{ nif?: string; nom: string; prenom: string; parts?: number }>;
  gerant: string;
  villeSignature?: string;
  dateSignature?: string;
}

export function generateStatutesText(formData: FormData): string {
  const {
    type,
    denomination,
    siegeSocial,
    capitalSocialCDF,
    valeurPartCDF,
    objetSocial,
    associes,
    gerant,
    villeSignature = 'Kinshasa',
    dateSignature = new Date().toLocaleDateString('fr-CD')
  } = formData;

  if (!denomination || !siegeSocial || !objetSocial) {
    throw new Error("Dénomination, siège social et objet social sont obligatoires.");
  }

  let template = SARL_TEMPLATE;
  if (type === 'EI') template = EI_TEMPLATE;
  else if (type === 'SA') template = SA_TEMPLATE;
  else if (type === 'SAS') template = SAS_TEMPLATE;
  else if (type === 'SNC') template = SNC_TEMPLATE;

   const valeurPart = valeurPartCDF || (capitalSocialCDF && capitalSocialCDF > 0 ? Math.max(1, Math.floor(capitalSocialCDF / 100)) : 0);

  let nombrePartsTotal = 0;
  let repartitionParts = "";
  let signaturesAssocies = "";

  if (associes && associes.length > 0) {
    associes.forEach(associe => {
      const nomComplet = `${associe.prenom} ${associe.nom}`;
      if (type === 'SARL' || type === 'SA' || type === 'SAS') {
        const parts = associe.parts || Math.max(1, Math.floor((capitalSocialCDF || 0) / (associes.length || 1) / (valeurPart || 1)));
        nombrePartsTotal += parts;
        repartitionParts += `- À ${nomComplet}, à concurrence de ${parts} parts sociales.\n`;
      }
      signaturesAssocies += `- ${nomComplet}\n`;
    });
  } else {
    signaturesAssocies = `- ${gerant}\n`;
  }

  let documentText = template
    .replace(/\{\{denomination\}\}/g, denomination)
    .replace(/\{\{siegeSocial\}\}/g, siegeSocial)
    .replace(/\{\{objetSocial\}\}/g, objetSocial)
    .replace(/\{\{gerant\}\}/g, gerant)
    .replace(/\{\{villeSignature\}\}/g, villeSignature)
    .replace(/\{\{dateSignature\}\}/g, dateSignature);

  if (type === 'SARL' || type === 'SA' || type === 'SAS') {
    documentText = documentText
      .replace(/\{\{capitalSocialCDF\}\}/g, (capitalSocialCDF || 0).toLocaleString('fr-CD'))
      .replace(/\{\{valeurPartCDF\}\}/g, (valeurPart || 0).toLocaleString('fr-CD'))
      .replace(/\{\{nombrePartsTotal\}\}/g, (nombrePartsTotal || Math.max(1, Math.floor((capitalSocialCDF || 0)/(valeurPart || 1) || 1))).toString())
      .replace(/\{\{repartitionParts\}\}/g, repartitionParts);
  }

  documentText = documentText.replace(/\{\{signaturesAssocies\}\}/g, signaturesAssocies);

  return documentText;
}
