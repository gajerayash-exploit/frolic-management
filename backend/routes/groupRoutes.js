import express from 'express';
import {
    registerGroup,
    getGroups,
    getGroupById,
    updateGroup,
    editGroupByOwner
} from '../controllers/groupController.js';
import { protect, authorize, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.post('/', protect, registerGroup);

// Other routes
router.get('/', getGroups);
router.get('/:id', getGroupById);
router.put('/:id', protect, updateGroup);
router.put('/:id/edit', protect, editGroupByOwner);

export default router;
