import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

type Location = 'body' | 'params' | 'query';

export const validate =
  (schema: ZodSchema, location: Location = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    const data = req[location];
    const result = schema.safeParse(data);
    if (!result.success) {
      return res.status(400).json({
        message: 'Invalid request payload',
        errors: result.error.flatten(),
      });
    }
    // Remplacer par la version validée (ex: strings trim)
    (req as any)[location] = result.data;
    next();
  };

export const validateBody = (schema: ZodSchema) => validate(schema, 'body');
export const validateQuery = (schema: ZodSchema) => validate(schema, 'query');
export const validateParams = (schema: ZodSchema) => validate(schema, 'params');
