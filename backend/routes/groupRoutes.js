import express from 'express';
import {
    registerGroup,
    getGroups,
    getGroupById,
    updateGroup
} from '../controllers/groupController.js';
import { protect, authorize, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.post('/', protect, registerGroup);

// Other routes
router.get('/', getGroups);
router.get('/:id', getGroupById);
router.put('/:id', protect, updateGroup);

export default router;
