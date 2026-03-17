// apps/server/src/routes/payment.routes.ts
import { Router } from 'express';
import { initiatePayment } from '../controllers/payment.controller';
import { protect } from '../middlewares/authJwt';
import { validateBody } from '../middlewares/validate';
import { paymentCreateSchema } from '../validation/schemas';

const router = Router();

// Route protégée pour initier un paiement
router.post('/create-session', protect, validateBody(paymentCreateSchema), initiatePayment);

export default router;
