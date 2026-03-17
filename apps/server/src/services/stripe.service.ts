// apps/server/src/services/stripe.service.ts
import Stripe from 'stripe';

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || '';
const stripe = STRIPE_KEY
  ? new Stripe(STRIPE_KEY, { apiVersion: '2024-04-10' as any })
  : null;

export const createCheckoutSession = async (userId: string, dossierId: string, pack: string) => {
  // Mode dégradé sans clé Stripe : renvoyer un lien factice pour tests
  if (!stripe || !STRIPE_KEY || STRIPE_KEY.includes('dummy')) {
    return { url: `https://checkout.stripe.com/pay/test?dossier=${dossierId}&pack=${pack}` };
  }

  const packPrices: Record<string, number> = {
    'ESSENTIEL': 24900, // 249.00 USD
    'CONFORT': 34900,
    'PREMIUM': 56900,
  };

  const amount = packPrices[pack] || 34900;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `FormalEasy DRC - Pack ${pack}`,
            description: `Frais de création d'entreprise et honoraires pour le pack ${pack}`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&dossierId=${dossierId}`,
    cancel_url: `${process.env.FRONTEND_URL}/payment/cancel?dossierId=${dossierId}`,
    metadata: {
      userId,
      dossierId,
      pack,
    },
  });

  return session;
};

export const verifyWebhook = (body: any, signature: string) => {
  if (!stripe) {
    throw new Error('Stripe non configuré');
  }
  return stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET || ''
  );
};
