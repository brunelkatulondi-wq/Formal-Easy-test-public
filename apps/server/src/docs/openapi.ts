export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'FormalEasy API',
    version: '1.0.0',
    description: 'Endpoints clé: auth, dossiers, admin, paiements, chat, IA.',
  },
  servers: [{ url: '/api' }],
  paths: {
    '/auth/login': { post: { summary: 'Login', tags: ['auth'] } },
    '/auth/register': { post: { summary: 'Register', tags: ['auth'] } },
    '/dossiers': { post: { summary: 'Créer un dossier', tags: ['dossiers'] } },
    '/dossiers/me': { get: { summary: 'Mes dossiers', tags: ['dossiers'] } },
    '/dossiers/{id}': { get: { summary: 'Détail dossier', tags: ['dossiers'] } },
    '/dossiers/{id}/pdf': { get: { summary: 'Télécharger statuts PDF', tags: ['dossiers'] } },
    '/dossiers/{id}/sign': { post: { summary: 'Signer', tags: ['dossiers'] } },
    '/admin/dossiers': { get: { summary: 'Lister tous les dossiers', tags: ['admin'] } },
    '/admin/users': { get: { summary: 'Lister utilisateurs', tags: ['admin'] } },
    '/admin/stats': { get: { summary: 'Stats admin', tags: ['admin'] } },
    '/admin/dossier/{id}/status': { patch: { summary: 'Maj statut', tags: ['admin'] } },
    '/admin/dossier/{id}/documents': { post: { summary: 'Ajouter document', tags: ['admin'] } },
    '/payments/create-session': { post: { summary: 'Créer session Stripe', tags: ['paiements'] } },
    '/ai/generate-object': { post: { summary: 'Générer objet social (IA)', tags: ['ia'] } },
    '/chat/{dossierId}': { get: { summary: 'Messages d’un dossier', tags: ['chat'] } },
    '/chat': { post: { summary: 'Envoyer un message', tags: ['chat'] } },
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
  },
  security: [{ bearerAuth: [] }],
};
