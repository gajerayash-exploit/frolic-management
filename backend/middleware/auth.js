import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }
};

// Role-based access control
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.Role)) {
            return res.status(403).json({
                success: false,
                message: `Role '${req.user.Role}' is not authorized to access this route`
            });
        }
        next();
    };
};

// Admin only middleware
export const adminOnly = (req, res, next) => {
    if (req.user.Role !== 'admin' && !req.user.IsAdmin) {
        return res.status(403).json({
            success: false,
            message: 'Only admins can access this route'
        });
    }
    next();
};
