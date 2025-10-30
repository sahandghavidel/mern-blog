import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './src/routes/user.route.js';
import authRoutes from './src/routes/auth.route.js';
import postRoutes from './src/routes/post.route.js';
import commentRoutes from './src/routes/comment.route.js';
import cookieParser from 'cookie-parser';

// Configure environment variables
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = express();

// CORS configuration - UPDATE THESE DOMAINS WHEN YOU DEPLOY
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://blog.100jsprojects.com', /\.vercel\.app$/]
        : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
  })
);

// MongoDB connection for serverless
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 1,
      minPoolSize: 0,
    });
    isConnected = true;
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.log('❌ MongoDB connection error:', err.message);
    isConnected = false;
    throw err;
  }
};

// Middleware
app.use(express.json());
app.use(cookieParser());

// Database middleware (only for endpoints that need DB)
const connectMiddleware = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Database connection failed' });
  }
};

// Test endpoints
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!', timestamp: new Date() });
});

// Debug endpoints (helpful for deployment testing)
app.get('/api/debug', (req, res) => {
  res.json({
    message: 'Debug info',
    nodeEnv: process.env.NODE_ENV,
    hasMongoEnv: !!process.env.MONGO,
    hasJwtSecret: !!process.env.JWT_SECRET,
    timestamp: new Date(),
  });
});

app.get('/api/debug-db', async (req, res) => {
  try {
    await connectDB();
    res.json({
      message: 'Database connection successful!',
      connected: true,
      timestamp: new Date(),
    });
  } catch (error) {
    res.json({
      message: 'Database connection failed',
      connected: false,
      error: error.message,
      timestamp: new Date(),
    });
  }
});

// Routes
app.use('/api/user', connectMiddleware, userRoutes);
app.use('/api/auth', connectMiddleware, authRoutes);
app.use('/api/post', connectMiddleware, postRoutes);
app.use('/api/comment', connectMiddleware, commentRoutes);

// Error handling
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

// Export for Vercel
export default app;
