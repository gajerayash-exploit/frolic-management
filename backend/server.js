import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import instituteRoutes from './routes/instituteRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import participantRoutes from './routes/participantRoutes.js';
import winnerRoutes from './routes/winnerRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const trimTrailingSlash = (value) => value.replace(/\/+$/, '');
const configuredOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || '')
    .split(',')
    .map(origin => trimTrailingSlash(origin.trim()))
    .filter(Boolean);
const allowedOrigins = configuredOrigins.length > 0
    ? configuredOrigins
    : ['http://localhost:5173', 'http://localhost:3000'];

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }

        const normalizedOrigin = trimTrailingSlash(origin);

        if (allowedOrigins.includes(normalizedOrigin)) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import userRoutes from './routes/userRoutes.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/institutes', instituteRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/participants', participantRoutes);
app.use('/api/winners', winnerRoutes);
app.use('/api/settings', settingsRoutes);


// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Frolic API is running',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`\n🚀 Frolic Server running on port ${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
