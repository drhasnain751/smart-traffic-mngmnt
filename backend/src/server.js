import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import app from './app.js';
import { startTrafficSimulator } from './services/simulator.js';
import prisma from './config/prisma.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Store io in express app
app.set('io', io);

// Handle Web Socket connections
io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  // Send an immediate system verification event
  socket.emit('system_status', { status: 'connected', version: '1.0.0' });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

// Connect to Database and Start Server
const startServer = async () => {
  try {
    // Verify DB Connection
    await prisma.$connect();
    console.log('[Database] Connected successfully.');

    // Start Simulator
    startTrafficSimulator(io);

    server.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`   Smart IoT Traffic Server is running on port ${PORT}`);
      console.log(`   Health Check: http://localhost:${PORT}/api/health`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('[Startup Error] Database connection failed:', error);
    process.exit(1);
  }
};

startServer();
