import express from 'express';
import {
    registerGroup,
    getGroups,
    getGroupById,
    updateGroup
} from '../controllers/groupController.js';
import { protect, authorize, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', registerGroup);

// Public routes (Previously protected)
router.get('/', getGroups);
router.get('/:id', getGroupById);
router.put('/:id', updateGroup);

export default router;
