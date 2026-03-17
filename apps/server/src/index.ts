import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { Server as SocketIOServer } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';
import swaggerUi from 'swagger-ui-express';
import { stripeWebhook } from './controllers/payment.controller';
import authRoutes from './routes/auth.routes';
import dossierRoutes from './routes/dossier.routes';
import paymentRoutes from './routes/payment.routes';
import adminRoutes from './routes/admin.routes';
import aiRoutes from './routes/ai.routes';
import chatRoutes from './routes/chat.routes';
import { errorHandler } from './middlewares/errorHandler';
import { openApiSpec } from './docs/openapi';

dotenv.config();

const app = express();
const server = http.createServer(app);
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

// Redis Adapter for scalability
if (process.env.REDIS_URL) {
  const pubClient = new Redis(process.env.REDIS_URL);
  const subClient = pubClient.duplicate();
  io.adapter(createAdapter(pubClient, subClient));
  console.log('📡 Socket.io connected to Redis adapter');
}

// Sécurité et logs HTTP
app.use(helmet());
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
app.use(cookieParser());

// Rate limiting global (protection brute-force/bots)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again later.',
  })
);

// Stripe webhook doit recevoir le corps brut avant le JSON parser
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// Parsing JSON standard
app.use(express.json({ limit: '1mb' }));

// Routes
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.use('/api/auth', authRoutes);
app.use('/api/dossiers', dossierRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/chat', chatRoutes);

// 404 API
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler centralisé
app.use(errorHandler);

// Socket.io for Real-time tracking
io.on('connection', (socket) => {
  console.log('🟢 Client connected:', socket.id);
  
  socket.on('join-dossier', (dossierId) => {
    socket.join(`dossier-${dossierId}`);
    console.log(`📡 Client joined dossier room: dossier-${dossierId}`);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected');
  });
});

export const broadcastEvent = (dossierId: string, event: any) => {
  io.to(`dossier-${dossierId}`).emit('event', event);
};

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
