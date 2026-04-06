import express from 'express';
import {
    getAllInstitutes,
    getInstituteById,
    createInstitute,
    updateInstitute,
    deleteInstitute
} from '../controllers/instituteController.js';
import { getDepartmentsByInstitute } from '../controllers/departmentController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Nested route for departments
router.get('/:id/departments', getDepartmentsByInstitute);

// Public routes
router.get('/', getAllInstitutes);
router.get('/:id', getInstituteById);

// Public routes
router.post('/', createInstitute);
router.put('/:id', updateInstitute);
router.delete('/:id', deleteInstitute);

export default router;
