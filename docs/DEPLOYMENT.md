# Déploiement hébergé (Render + Vercel)

## API (Render)
1. Sur Render, **New Blueprint** et pointer ce repo (`render.yaml` à la racine).
2. Render crée la base `formal-easy-db` (Postgres) + le service web `formal-easy-api`.
3. Dans le service web, compléter les variables :
   - `OPENAI_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (si Stripe live), `REDIS_URL` si souhaité.
   - `FRONTEND_URL` : mettre l’URL Vercel finale + `http://localhost:5173` séparées par des virgules.
4. Deploy. Render exécutera `prisma migrate deploy` puis `node dist/index.js`.

## Front (Vercel)
1. Importer le repo sur Vercel, choisir la branche `master`.
2. Root directory : `apps/client`
3. Install command : `npm install`
4. Build command : `npm run build`
5. Output directory : `dist`
6. Variables d’env. Vercel :
   - `VITE_API_URL=https://<render-service>.onrender.com`
7. Déployer. Les appels API utiliseront cette URL (cookies cross-site déjà autorisés côté API).

## Local
```
cd apps/server && cp .env.example .env   # remplir secrets + DATABASE_URL
npx prisma migrate dev
npm run dev

cd ../client && cp .env.example .env     # mettre VITE_API_URL si API distante
npm run dev
```

## Accès admin
- Email : `admin@demo.cd`
- Mot de passe : `Admin123!`
