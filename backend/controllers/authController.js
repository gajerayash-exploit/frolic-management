import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user by email and include password for verification
        const user = await User.findOne({ EmailAddress: email.toLowerCase() }).select('+UserPassword');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Optional: Validate role if provided
        if (role && user.Role !== role) {
            return res.status(401).json({
                success: false,
                message: `This account is not registered as ${role}`
            });
        }

        // Generate token
        const token = generateToken(user._id, user.Role);

        // Return success response
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                UserName: user.UserName,
                EmailAddress: user.EmailAddress,
                PhoneNumber: user.PhoneNumber,
                role: user.Role,
                IsAdmin: user.IsAdmin
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                UserName: user.UserName,
                EmailAddress: user.EmailAddress,
                PhoneNumber: user.PhoneNumber,
                role: user.Role,
                IsAdmin: user.IsAdmin
            }
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Logout user (client-side - just for completeness)
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { UserName, EmailAddress, UserPassword, PhoneNumber } = req.body;

        // Validate input
        if (!UserName || !EmailAddress || !UserPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email and password'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ EmailAddress: EmailAddress.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create user (always as student role, not admin)
        const user = await User.create({
            UserName,
            EmailAddress: EmailAddress.toLowerCase(),
            UserPassword,
            PhoneNumber,
            Role: 'student',
            IsAdmin: false
        });

        // Generate token
        const token = generateToken(user._id, user.Role);

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                UserName: user.UserName,
                EmailAddress: user.EmailAddress,
                PhoneNumber: user.PhoneNumber,
                role: user.Role,
                IsAdmin: user.IsAdmin
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Server error during registration'
        });
    }
};
