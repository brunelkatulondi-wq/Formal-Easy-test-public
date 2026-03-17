import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Erreur serveur';

  // Log complet côté serveur
  console.error('[API ERROR]', { status, message, stack: err.stack });

  // Ne pas exposer la stack en prod
  const payload: any = { message };
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    payload.stack = err.stack.split('\n').slice(0, 3);
  }

  res.status(status).json(payload);
};
