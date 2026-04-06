import express from 'express';
import {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
} from '../controllers/eventController.js';
import { protect, authorize, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Public routes (Previously protected)
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router;
