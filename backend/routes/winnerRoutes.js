import express from 'express';
import {
    declareWinner,
    getWinners,
    deleteWinner
} from '../controllers/winnerController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getWinners);
router.post('/', protect, declareWinner);
router.delete('/:id', protect, deleteWinner);

export default router;
