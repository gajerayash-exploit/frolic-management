import User from '../models/User.js';
import mongoose from 'mongoose';

// @desc    Update logged-in user profile
// @route   PUT /api/settings/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const { UserName, EmailAddress, PhoneNumber } = req.body;

        // Build update object with only provided fields
        const updateFields = {};
        if (UserName) updateFields.UserName = UserName;
        if (EmailAddress) updateFields.EmailAddress = EmailAddress.toLowerCase();
        if (PhoneNumber) updateFields.PhoneNumber = PhoneNumber;

        // Check for duplicate email (if changing)
        if (EmailAddress) {
            const existing = await User.findOne({
                EmailAddress: EmailAddress.toLowerCase(),
                _id: { $ne: req.user._id }
            });
            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: 'Email address is already in use'
                });
            }
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updateFields,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
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
        console.error('Update profile error:', error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Email address is already in use'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while updating profile'
        });
    }
};

// @desc    Change password for logged-in user
// @route   PUT /api/settings/password
// @access  Private
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide current password and new password'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters'
            });
        }

        // Get user with password field
        const user = await User.findById(req.user._id).select('+UserPassword');

        // Verify current password
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password (pre-save hook will hash it)
        user.UserPassword = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while changing password'
        });
    }
};

// @desc    Get system health & DB info
// @route   GET /api/settings/system
// @access  Private (Admin)
export const getSystemInfo = async (req, res) => {
    try {
        const dbState = mongoose.connection.readyState;
        const dbStates = {
            0: 'Disconnected',
            1: 'Connected',
            2: 'Connecting',
            3: 'Disconnecting'
        };

        // Get collection counts
        const counts = {
            users: await User.countDocuments(),
            institutes: await mongoose.connection.db.collection('institutes').countDocuments(),
            departments: await mongoose.connection.db.collection('departments').countDocuments(),
            events: await mongoose.connection.db.collection('events').countDocuments(),
            groups: await mongoose.connection.db.collection('groups').countDocuments(),
            winners: await mongoose.connection.db.collection('winners').countDocuments(),
        };

        res.status(200).json({
            success: true,
            data: {
                app: {
                    name: 'Frolic Management System',
                    version: '1.0.0',
                    framework: 'React 18 + Vite',
                    backend: 'Express.js + MongoDB',
                    environment: process.env.NODE_ENV || 'development'
                },
                database: {
                    status: dbStates[dbState] || 'Unknown',
                    connected: dbState === 1,
                    host: mongoose.connection.host,
                    name: mongoose.connection.name,
                    collections: counts
                },
                server: {
                    uptime: Math.floor(process.uptime()),
                    nodeVersion: process.version,
                    platform: process.platform
                }
            }
        });
    } catch (error) {
        console.error('Get system info error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching system info'
        });
    }
};
