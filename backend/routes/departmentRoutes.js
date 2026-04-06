import express from 'express';
import {
    getAllDepartments,
    getDepartmentsByInstitute,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment
} from '../controllers/departmentController.js';
import { getEventsByDepartment } from '../controllers/eventController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Nested route for events
router.get('/:id/events', getEventsByDepartment);

// Public routes
router.get('/', getAllDepartments);
router.get('/:id', getDepartmentById);

// Public routes
router.post('/', createDepartment);
router.put('/:id', updateDepartment);
router.delete('/:id', deleteDepartment);

export default router;

// Note: The route GET /api/institutes/:id/departments is defined in instituteRoutes.js
