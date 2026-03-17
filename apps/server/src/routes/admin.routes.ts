// apps/server/src/routes/admin.routes.ts
import { Router } from 'express';
import { getAllDossiers, getAdminStats, updateDossierStatus, getAllUsers, addDocument } from '../controllers/admin.controller';
import { protect, restrictTo } from '../middlewares/authJwt';
import { validateBody, validateParams } from '../middlewares/validate';
import { addDocumentSchema, statusUpdateSchema, idParamSchema } from '../validation/schemas';

const router = Router();

router.use(protect, restrictTo('ADMIN', 'GERANT'));

router.get('/dossiers', getAllDossiers);
router.get('/users', getAllUsers);
router.get('/stats', getAdminStats);
router.patch('/dossier/:id/status', validateParams(idParamSchema), validateBody(statusUpdateSchema), updateDossierStatus);
router.post('/dossier/:id/documents', validateParams(idParamSchema), validateBody(addDocumentSchema), addDocument);

export default router;
