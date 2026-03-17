// apps/server/src/services/ai.service.ts
import OpenAI from 'openai';

export const hasRealKey = Boolean(process.env.OPENAI_API_KEY && !/dummy|fake/i.test(process.env.OPENAI_API_KEY));
const openai = hasRealKey
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const buildFallback = (activityDescription: string, meta?: { legalForm?: string; capital?: number; city?: string; companyName?: string }) => {
  const form = meta?.legalForm || 'SARL';
  const capital = meta?.capital ? `${meta.capital} USD` : 'capital à fixer';
  const city = meta?.city || 'Kinshasa';
  const name = meta?.companyName || 'LA SOCIÉTÉ';

  return `La société ${name}, ${form} établie à ${city}, a pour objet principal: ${activityDescription}.
Elle pourra exercer toutes activités connexes ou complémentaires liées à ce secteur.
Elle pourra procéder à l'import-export, à la distribution, à la prestation de services, à la prise de participation et à la gestion de filiales.
Capital social prévu: ${capital}.
Plus généralement, elle pourra effectuer toutes opérations commerciales, industrielles, financières, mobilières ou immobilières se rattachant directement ou indirectement à l'objet social ou susceptibles d'en favoriser la réalisation.`;
};

export const generateSocialObjectDraft = async (activityDescription: string, meta?: { legalForm?: string; capital?: number; city?: string; companyName?: string }) => {
  if (!activityDescription) throw new Error("Description requise");

  // Fallback if no valid key
  if (!openai) {
    return buildFallback(activityDescription, meta);
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Tu es un expert en droit des sociétés OHADA, spécialisé dans la rédaction juridique pour la République Démocratique du Congo.
Transforme la description utilisateur en un "Objet Social" formel et extensif.

Structure attendue :
1. "La société a pour objet, tant en République Démocratique du Congo qu'à l'étranger..."
2. Détails techniques de l'activité.
3. Clause de généralité : "Et plus généralement toutes opérations commerciales, industrielles, financières, mobilières ou immobilières se rattachant directement ou indirectement à l'objet social..."

Contexte:
- Forme: ${meta?.legalForm || 'SARL'}
- Capital: ${meta?.capital || 'non communiqué'}
- Ville: ${meta?.city || 'Kinshasa'}
- Dénomination: ${meta?.companyName || 'Société'}
`
        },
        { role: "user", content: activityDescription }
      ],
      temperature: 0.4,
    });

    return response.choices[0].message.content || buildFallback(activityDescription, meta);
  } catch (e) {
    console.error('[AI] fallback due to error:', e);
    return buildFallback(activityDescription, meta);
  }
};

// Génère des statuts complets (pas seulement l'objet social)
export const generateFullStatutesDraft = async (formData: {
  type: string;
  denomination: string;
  siegeSocial: string;
  capitalSocialCDF: number;
  objetSocial: string;
  gerant: string;
}) => {
  if (!openai) {
    throw new Error('OpenAI non disponible'); // laisser le call site gérer le fallback
  }

  const { type, denomination, siegeSocial, capitalSocialCDF, objetSocial, gerant } = formData;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.4,
    messages: [
      {
        role: "system",
        content: `Tu es un juriste OHADA. Rédige des statuts complets et concis pour une société en RDC, en format texte brut (pas de markdown), avec articles numérotés.`
      },
      {
        role: "user",
        content: `
Forme: ${type}
Dénomination: ${denomination}
Siège: ${siegeSocial}
Capital (CDF): ${capitalSocialCDF}
Gérant/Président: ${gerant}
Objet social à intégrer et développer: ${objetSocial}

Attendus:
- En-tête avec le nom de la société.
- Articles classiques: Forme, Objet, Dénomination, Siège, Durée, Capital (avec mention des parts sans détailler la répartition), Gérance/Direction, Assemblées, Affectation des résultats, Exercice social, Cession de parts, Dissolution.
- Style juridique OHADA clair, concis (max 2-3 lignes par article).
- Pas d'information de répartition si inconnue; indique "répartition entre associés selon actes séparés" si nécessaire.
- Ajoute une clause de généralité.
`
      }
    ],
  });

  return response.choices[0].message.content || objetSocial;
};
