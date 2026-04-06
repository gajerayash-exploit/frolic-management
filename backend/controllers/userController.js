import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
    try {
        const users = await User.find(req.query).select('-UserPassword');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-UserPassword');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new user
// @route   POST /api/users
// @access  Private/Admin
export const createUser = async (req, res) => {
    try {
        const { UserName, EmailAddress, UserPassword, PhoneNumber, Role, IsAdmin } = req.body;

        const userExists = await User.findOne({ EmailAddress });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            UserName,
            EmailAddress,
            UserPassword,
            PhoneNumber,
            Role,
            IsAdmin: IsAdmin || false
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                UserName: user.UserName,
                EmailAddress: user.EmailAddress,
                Role: user.Role,
                IsAdmin: user.IsAdmin
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.UserName = req.body.UserName || user.UserName;
            user.EmailAddress = req.body.EmailAddress || user.EmailAddress;
            user.PhoneNumber = req.body.PhoneNumber || user.PhoneNumber;
            user.Role = req.body.Role || user.Role;
            user.IsAdmin = req.body.IsAdmin !== undefined ? req.body.IsAdmin : user.IsAdmin;

            if (req.body.UserPassword) {
                user.UserPassword = req.body.UserPassword;
            }

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                UserName: updatedUser.UserName,
                EmailAddress: updatedUser.EmailAddress,
                Role: updatedUser.Role,
                IsAdmin: updatedUser.IsAdmin
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
