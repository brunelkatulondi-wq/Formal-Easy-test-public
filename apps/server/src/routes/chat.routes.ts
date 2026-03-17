// apps/server/src/routes/chat.routes.ts
import { Router } from 'express';
import { sendMessage, getMessages } from '../controllers/chat.controller';
import { protect } from '../middlewares/authJwt';
import { validateBody, validateParams } from '../middlewares/validate';
import { chatSendSchema, dossierIdParamSchema } from '../validation/schemas';

const router = Router();

router.use(protect);
router.get('/:dossierId', validateParams(dossierIdParamSchema), getMessages);
router.post('/', validateBody(chatSendSchema), sendMessage);

export default router;
