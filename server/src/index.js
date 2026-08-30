const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const documentsRoutes = require('./routes/documents');
const chatRoutes = require('./routes/chat');
const statsRoutes = require('./routes/stats');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Configured CORS allowing production Vercel frontend and local development
const allowedOrigins = (process.env.CORS_ORIGINS || 'https://eduqueryai.vercel.app')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean)
  .concat([
  'http://localhost:3000',
  'http://localhost:5173'
]);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS origin is not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-role', 'x-user-email', 'x-access-token']
}));

app.use(express.json());

// API Routes
app.use('/api/documents', documentsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', statsRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'EduQuery AI RAG Engine',
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    stage: 'server',
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`=================================================`);
  console.log(`🎓 EduQuery AI RAG Backend Engine Running on Port ${PORT}`);
  console.log(`📍 Health Check: http://0.0.0.0:${PORT}/api/health`);
  console.log(`=================================================`);
});
