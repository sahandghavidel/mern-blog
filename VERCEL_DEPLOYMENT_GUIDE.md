# MERN Stack Deployment Guide for Vercel

This guide shows how to deploy a MERN (MongoDB, Express, React, Node.js) application to Vercel using separate frontend and backend deployments, with proper authentication and cross-site cookie handling.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Environment Variables](#environment-variables)
- [Database Configuration](#database-configuration)
- [Authentication & Cookies](#authentication--cookies)
- [Common Issues & Solutions](#common-issues--solutions)

## Prerequisites

- MongoDB Atlas account and cluster
- Vercel account
- GitHub repository with your MERN project
- Node.js and npm installed locally

## Project Structure

Your project should have this structure:

```
your-project/
├── api/                    # Backend folder
│   ├── src/               # Source files (routes, controllers, models, utils)
│   ├── index.js           # Main server file
│   ├── package.json       # Backend dependencies
│   └── vercel.json        # Backend Vercel config
├── client/                # Frontend folder
│   ├── src/              # React source files
│   ├── package.json      # Frontend dependencies
│   └── vercel.json       # Frontend Vercel config
└── package.json          # Root package.json
```

## Backend Deployment

### 1. Backend File Structure

Ensure your backend follows this structure to avoid Vercel's 12-function limit:

```
api/
├── src/                   # All source files go here
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── utils/
├── index.js              # Single entry point
├── package.json
└── vercel.json
```

### 2. Backend Configuration Files

**api/vercel.json:**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ]
}
```

**api/package.json** (key parts):

```json
{
  "name": "your-backend",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "build": ""
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.4.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  }
}
```

### 3. Backend Express Configuration

**api/index.js** (essential parts):

```javascript
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import your routes from src/
import userRoutes from './src/routes/user.route.js';
import authRoutes from './src/routes/auth.route.js';

// Configure environment variables
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = express();

// CORS configuration - UPDATE THESE DOMAINS
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? [
            'https://your-frontend-domain.vercel.app',
            'https://your-custom-domain.com',
            /\.vercel\.app$/,
          ]
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
app.use(cookieParser()); // Required for cookie-based authentication

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
```

### 4. Deploy Backend to Vercel

1. **Create new Vercel project:**

   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set **Root Directory** to `api`
   - Set **Framework Preset** to "Other"

2. **Configure build settings:**

   - **Build Command:** `npm install` (or leave empty)
   - **Output Directory:** Leave empty
   - **Install Command:** `npm install`

3. **Add environment variables** (see Environment Variables section)

4. **Deploy and test:**
   ```bash
   curl https://your-backend.vercel.app/api/test
   ```

## Frontend Deployment

### 1. Frontend Configuration

**client/vercel.json:**

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**client/package.json** (key parts):

```json
{
  "name": "your-frontend",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "vite": "^4.4.5"
  }
}
```

### 2. Update API Calls in Frontend

Replace all relative API calls with environment variable:

**Before:**

```javascript
const response = await fetch('/api/listing');
```

**After (for public endpoints):**

```javascript
const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/listing`);
```

**After (for authenticated endpoints):**

```javascript
const response = await fetch(
  `${import.meta.env.VITE_BACKEND_URL}/api/listing/create`,
  {
    method: 'POST',
    credentials: 'include', // Essential for cross-site cookies
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }
);
```

### 3. Deploy Frontend to Vercel

1. **Create another Vercel project:**

   - Click "New Project"
   - Import the same GitHub repository
   - Set **Root Directory** to `client`
   - Set **Framework Preset** to "Vite"

2. **Configure build settings:**

   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

3. **Add environment variables** (see Environment Variables section)

## Environment Variables

### Backend Environment Variables

Add these to your **backend** Vercel project:

```
NODE_ENV=production
MONGO=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key
```

### Frontend Environment Variables

Add these to your **frontend** Vercel project:

```
VITE_BACKEND_URL=https://your-backend.vercel.app
VITE_FIREBASE_API_KEY=your-firebase-api-key (if using Firebase)
```

## Database Configuration

### MongoDB Atlas Setup

1. **Create MongoDB Atlas cluster**
2. **Configure Network Access:**

   - Go to Network Access
   - Add IP Address: `0.0.0.0/0` (Allow access from anywhere)
   - This allows Vercel's dynamic IPs to connect

3. **Create database user:**
   - Go to Database Access
   - Add new database user with read/write permissions
   - Use these credentials in your `MONGO` environment variable

## Authentication & Cookies

### Cross-Site Cookie Configuration

For authentication to work between separate frontend and backend deployments, you need proper cookie handling:

#### Backend Cookie Setup

In your auth controller, configure cookies for cross-site requests:

```javascript
export const signin = async (req, res, next) => {
  // ... authentication logic ...

  const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
  const expiryDate = new Date(Date.now() + 3600000 * 24 * 7); // 7 days

  // Cookie options for cross-site requests
  const cookieOptions = {
    httpOnly: true,
    expires: expiryDate,
  };

  // In production, set sameSite and secure for cross-site cookies
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.sameSite = 'none';
    cookieOptions.secure = true;
  }

  res.cookie('access_token', token, cookieOptions).status(200).json(rest);
};
```

#### Frontend Credentials Configuration

**CRITICAL:** All authenticated API calls must include `credentials: 'include'`:

```javascript
// Sign in
const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signin`, {
  method: 'POST',
  credentials: 'include', // Required for cookies
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});

// Protected routes (create, update, delete)
const res = await fetch(
  `${import.meta.env.VITE_BACKEND_URL}/api/listing/create`,
  {
    method: 'POST',
    credentials: 'include', // Required for auth cookies
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }
);

// OAuth sign in
const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google`, {
  method: 'POST',
  credentials: 'include', // Required for cookies
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(googleData),
});

// Sign out
await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signout`, {
  credentials: 'include',
});
```

#### Auth Token Verification

Your auth middleware should read cookies:

```javascript
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return next(errorHandler(401, 'You are not authenticated!'));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, 'Token is not valid!'));
    req.user = user;
    next();
  });
};
```

### Debug Authentication Issues

Add a debug endpoint to verify cookie handling:

```javascript
// In your auth routes
router.get('/whoami', (req, res) => {
  const cookies = req.cookies || {};
  const token = cookies.access_token;
  if (!token) {
    return res.json({ authenticated: false, cookies });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ authenticated: true, cookies, decoded });
  } catch (err) {
    return res.json({ authenticated: false, cookies, error: err.message });
  }
});
```

Test with: `GET https://your-backend.vercel.app/api/auth/whoami`

## Common Issues & Solutions

### 1. CORS Errors

**Problem:** `Access to fetch at '...' has been blocked by CORS policy`

**Solution:** Update CORS configuration in your backend:

```javascript
app.use(
  cors({
    origin: [
      'https://your-frontend-domain.vercel.app',
      'https://your-custom-domain.com',
      /\.vercel\.app$/,
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
  })
);
```

**Important:** When using `credentials: true`, you cannot use wildcard (`*`) for origins. You must specify exact domains.

### 2. Too Many Serverless Functions

**Problem:** `Error: No more than 12 Serverless Functions can be added`

**Solution:** Move all source files to a `src/` subdirectory in your backend:

```
api/
├── src/           # Move routes, controllers, models here
├── index.js       # Keep as single entry point
└── vercel.json
```

**Also ensure your vercel.json only builds the main file:**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ]
}
```

### 3. Database Connection Timeout

**Problem:** `Database connection failed`

**Solutions:**

- Check MongoDB Atlas IP whitelist (add `0.0.0.0/0`)
- Ensure connection string is correct
- Use proper MongoDB connection options for serverless:

```javascript
await mongoose.connect(process.env.MONGO, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  maxPoolSize: 1,
  minPoolSize: 0,
});
```

### 4. Environment Variables Not Working

**Problem:** `process.env.VARIABLE is undefined`

**Solutions:**

- Ensure variables are added in Vercel dashboard
- For frontend: Use `VITE_` prefix for Vite projects
- Redeploy after adding environment variables
- Check variable names for typos

### 5. Authentication Issues (401 Unauthorized)

**Problem:** `401 Unauthorized` when accessing protected routes

**Common Causes & Solutions:**

1. **Missing credentials in frontend requests:**

   ```javascript
   // ❌ Wrong - cookie not sent
   fetch(`${BACKEND_URL}/api/protected-route`);

   // ✅ Correct - includes cookies
   fetch(`${BACKEND_URL}/api/protected-route`, { credentials: 'include' });
   ```

2. **Incorrect cookie settings for cross-site requests:**

   ```javascript
   // In production, cookies need sameSite: 'none' and secure: true
   const cookieOptions = {
     httpOnly: true,
     expires: expiryDate,
   };
   if (process.env.NODE_ENV === 'production') {
     cookieOptions.sameSite = 'none';
     cookieOptions.secure = true;
   }
   ```

3. **CORS not allowing credentials:**

   ```javascript
   // Ensure CORS allows credentials
   app.use(
     cors({
       origin: ['https://your-frontend.vercel.app'],
       credentials: true, // Must be true for cookies
     })
   );
   ```

4. **Domain mismatch in CORS origins:**
   - Ensure your frontend domain is exactly listed in CORS origins
   - Check browser DevTools → Network → Request headers for `Origin`
   - Add that exact origin to your CORS configuration

**Debug steps:**

1. Test the debug endpoint: `GET /api/auth/whoami`
2. Check browser DevTools → Application → Cookies for `access_token`
3. Verify requests include `Cookie` header in Network tab
4. Confirm Set-Cookie header is present on signin response

### 6. MongoDB Connection Issues

**Problem:** `option buffermaxentries is not supported` or connection timeouts

**Solution:** Use Mongoose 7+ compatible options:

```javascript
await mongoose.connect(process.env.MONGO, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  maxPoolSize: 1, // For serverless
  minPoolSize: 0, // For serverless
  // Remove deprecated options like bufferMaxEntries, useNewUrlParser, etc.
});
```

### 7. Build Errors

**Problem:** Build fails during deployment

**Solutions:**

- Ensure `package.json` has correct scripts
- Check for syntax errors in your code
- Make sure all dependencies are listed in `package.json`
- For backend: Set build command to empty string if no build step needed

## Testing Your Deployment

### Backend Testing

```bash
# Test basic connectivity
curl https://your-backend.vercel.app/api/test

# Test environment variables
curl https://your-backend.vercel.app/api/debug

# Test database connection
curl https://your-backend.vercel.app/api/debug-db

# Test authentication (after signing in through browser)
curl https://your-backend.vercel.app/api/auth/whoami

# Test actual API endpoints
curl https://your-backend.vercel.app/api/listing
```

### Frontend Testing

1. Visit your frontend URL
2. Open browser DevTools → Console
3. Check for any CORS or API errors
4. Test all features that make API calls

## Best Practices

1. **Separate Deployments:** Deploy frontend and backend as separate Vercel projects
2. **Environment Variables:** Never commit sensitive data, use environment variables
3. **Authentication Security:**
   - Use `httpOnly` cookies for JWT tokens
   - Set `sameSite: 'none'` and `secure: true` in production
   - Always include `credentials: 'include'` for authenticated requests
4. **CORS Configuration:** Keep CORS settings restrictive but include all your domains
5. **Database Optimization:** Use Mongoose 7+ with serverless-optimized connection settings
6. **Error Handling:** Implement proper error handling in both frontend and backend
7. **Testing:** Always test authentication flow end-to-end after deployment
8. **Debug Endpoints:** Include debug endpoints to troubleshoot deployment issues

## Example Commands Summary

```bash
# Deploy backend
cd api
vercel --prod

# Deploy frontend
cd client
vercel --prod

# Test deployment
curl https://your-backend.vercel.app/api/test
```

---

This guide should help you deploy any MERN stack application to Vercel successfully. Remember to update domain names, API endpoints, and environment variables according to your specific project needs.
