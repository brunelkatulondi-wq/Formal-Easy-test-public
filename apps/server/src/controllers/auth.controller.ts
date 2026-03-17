// apps/server/src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "superrefreshkey";
const REFRESH_COOKIE = process.env.REFRESH_COOKIE_NAME || "refreshToken";
const ACCESS_EXPIRES_IN = "15m";
const REFRESH_EXPIRES_IN = "7d";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, phone } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email déjà utilisé" });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, passwordHash, phone, role: "CLIENT" },
    });

    const tokens = await issueTokens(res, user);
    res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, ...tokens });
  } catch (e) {
    res.status(500).json({ message: "Erreur serveur lors de l'inscription" });
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Identifiants invalides" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: "Identifiants invalides" });

    const tokens = await issueTokens(res, user);
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, ...tokens });
  } catch (e) {
    res.status(500).json({ message: "Erreur serveur lors de la connexion" });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (!token) return res.status(401).json({ message: "Refresh token manquant" });

    const decoded: any = jwt.verify(token, REFRESH_SECRET);
    const tokenHash = hashToken(token);

    const stored = await prisma.refreshToken.findFirst({
      where: { tokenHash, userId: decoded.sub, revoked: false, expiresAt: { gt: new Date() } },
    });
    if (!stored) return res.status(401).json({ message: "Refresh token révoqué ou expiré" });

    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
    if (!user) return res.status(401).json({ message: "Utilisateur inconnu" });

    await prisma.refreshToken.update({ where: { id: stored.id }, data: { revoked: true } });
    const tokens = await issueTokens(res, user);
    return res.json({ accessToken: tokens.accessToken });
  } catch (e: any) {
    return res.status(401).json({ message: "Refresh token invalide ou expiré" });
  }
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (token) {
    const tokenHash = hashToken(token);
    await prisma.refreshToken.updateMany({ where: { tokenHash }, data: { revoked: true } });
  }
  res.clearCookie(REFRESH_COOKIE, cookieOptions());
  res.status(204).send();
};

async function issueTokens(res: Response, user: any) {
  const payload = { sub: user.id, name: user.name, email: user.email, role: user.role };
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
  const refreshToken = jwt.sign({ ...payload, jti: crypto.randomUUID() }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const tokenHash = hashToken(refreshToken);
  await prisma.refreshToken.create({
    data: { tokenHash, userId: user.id, expiresAt },
  });

  res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions());
  return { accessToken, refreshToken };
}

function cookieOptions() {
  const allowCrossSite = process.env.NODE_ENV === 'production' && !(process.env.FRONTEND_URL || '').includes('localhost');
  return {
    httpOnly: true,
    sameSite: allowCrossSite ? 'none' as const : 'lax' as const,
    secure: allowCrossSite,
    path: '/api/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
