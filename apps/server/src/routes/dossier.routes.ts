import { Router } from 'express';
import { createDossier, getMyDossiers, getDossier, downloadStatuts, signDossier } from '../controllers/dossier.controller';
import { protect } from '../middlewares/authJwt';
import { validateBody, validateParams } from '../middlewares/validate';
import { dossierCreateSchema, dossierSignSchema, idParamSchema } from '../validation/schemas';

const router = Router();
router.use(protect);
router.post('/', validateBody(dossierCreateSchema), createDossier);
router.get('/me', getMyDossiers);
router.get('/:id', validateParams(idParamSchema), getDossier);
router.get('/:id/pdf', validateParams(idParamSchema), downloadStatuts);
router.post('/:id/sign', validateParams(idParamSchema), validateBody(dossierSignSchema), signDossier);

export default router;
