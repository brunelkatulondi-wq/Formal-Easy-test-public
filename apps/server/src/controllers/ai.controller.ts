import { Response } from 'express';
import { AuthRequest } from '../middlewares/authJwt';
import { generateSocialObjectDraft } from '../services/ai.service';

export const generateSocialObject = async (req: AuthRequest, res: Response) => {
  try {
    const { activityDescription, legalForm, capital, city, companyName } = req.body;
    const aiDraft = await generateSocialObjectDraft(activityDescription, { legalForm, capital, city, companyName });
    res.json({ aiDraft });
  } catch (error: any) {
    console.error("AI Controller Error:", error);
    res.status(500).json({ message: "Erreur lors de la génération par l'IA", error: error.message });
  }
};
