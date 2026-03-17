// apps/server/src/routes/ai.routes.ts
import { Router } from 'express';
import { generateSocialObject } from '../controllers/ai.controller';
import { protect } from '../middlewares/authJwt';
import { validateBody } from '../middlewares/validate';
import { aiGenerateSchema } from '../validation/schemas';

const router = Router();

router.post('/generate-object', protect, validateBody(aiGenerateSchema), generateSocialObject);

export default router;
