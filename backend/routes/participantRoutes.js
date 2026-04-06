import express from 'express';
import {
    addParticipant,
    updateParticipant,
    deleteParticipant
} from '../controllers/participantController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// router.use(protect); // Disabling auth

router.post('/', addParticipant);
router.put('/:id', updateParticipant);
router.delete('/:id', deleteParticipant);

export default router;
