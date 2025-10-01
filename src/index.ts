import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './config/db';

import authRoutes from './routes/auth';
import usersRouter from './routes/users';
import projectRoutes from './routes/projectRoutes';
import submissionRoutes from './routes/submissionRoutes';
import commentRoutes from './routes/commentRoutes';
import reviewRoutes from './routes/reviewRoutes';

import notificationRoutes from './routes/notificationRoutes';
import projectStatsRoutes from './routes/projectStatsRoutes';
import { setWSS } from './utils/websocket';
import { errorHandler } from './middleware/errorHandler';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRouter);
app.use('/api/projects', projectRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api', commentRoutes);
app.use('/api', reviewRoutes);
app.use('/api', notificationRoutes);
app.use('/api', projectStatsRoutes);

//error handler
app.use(errorHandler);
// Root route
app.get('/', (req, res) => {
  res.send('Collaborative Code Review API is running...');
});

// Start DB and then HTTP + WebSocket server
pool.connect()
  .then(() => {
    console.log('Connected to PostgreSQL');

    const server = http.createServer(app);
    const wss = new WebSocket.Server({ server });

    // Add broadcast method
    (wss as any).broadcast = function (data: string) {
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    };

    // Expose WebSocket server globally (if needed in other files)
    setWSS(wss);

    // WebSocket connection
    wss.on('connection', (ws) => {
      console.log('Client connected via WebSocket');

      ws.on('message', (message) => {
        console.log('Received:', message.toString());
      });

      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });

    // Start the HTTP server
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });


