import express from 'express';
import {
    declareWinner,
    getWinners,
    deleteWinner
} from '../controllers/winnerController.js';

const router = express.Router();

router.get('/', getWinners);
router.post('/', declareWinner);
router.delete('/:id', deleteWinner);

export default router;
