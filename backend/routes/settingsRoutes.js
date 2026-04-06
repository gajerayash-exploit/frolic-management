import express from 'express';
import { updateProfile, changePassword, getSystemInfo } from '../controllers/settingsController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// All settings routes require authentication
router.use(protect);

// Profile & password — any authenticated user
router.put('/profile', updateProfile);
router.put('/password', changePassword);

// System info — admin only
router.get('/system', adminOnly, getSystemInfo);

export default router;
