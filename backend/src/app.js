import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import intersectionRoutes from './routes/intersection.routes.js';
import alertRoutes from './routes/alert.routes.js';
import reportRoutes from './routes/report.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import systemRoutes from './routes/system.routes.js';

const app = express();

// CORS Configuration — allow Vercel frontend and local dev
const corsOptions = {
  origin: [
    'https://smart-traffic-mngmnt.vercel.app',
    'http://localhost:5173',
    'http://localhost:5002',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Handle preflight OPTIONS requests for all routes
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

app.use(express.json());

// Logger Middleware (simple morgan alternative)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Root Ping Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/intersections', intersectionRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', systemRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({ error: 'An internal server error occurred' });
});

export default app;
