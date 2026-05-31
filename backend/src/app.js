import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import intersectionRoutes from './routes/intersection.routes.js';
import alertRoutes from './routes/alert.routes.js';
import reportRoutes from './routes/report.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import systemRoutes from './routes/system.routes.js';

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for local demonstration purposes
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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
