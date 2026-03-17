// apps/server/src/services/ai.service.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateSocialObjectDraft = async (activityDescription: string, meta?: { legalForm?: string; capital?: number; city?: string; companyName?: string }) => {
  if (!activityDescription) throw new Error("Description requise");

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
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
      {
        role: "user",
        content: activityDescription
      }
    ],
    temperature: 0.5,
  });

  return response.choices[0].message.content;
};
