import Department from '../models/Department.js';
import Institute from '../models/Institute.js';

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
export const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find(req.query)
            .populate('InstituteID', 'InstituteName')
            .populate('DepartmentCoordinatorID', 'UserName EmailAddress')
            .sort({ DepartmentName: 1 });

        res.status(200).json({
            success: true,
            count: departments.length,
            data: departments
        });
    } catch (error) {
        console.error('Get all departments error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching departments'
        });
    }
};

// @desc    Get departments by institute
// @route   GET /api/institutes/:id/departments
// @access  Public
export const getDepartmentsByInstitute = async (req, res) => {
    try {
        // Verify institute exists
        const institute = await Institute.findById(req.params.id);
        if (!institute) {
            return res.status(404).json({
                success: false,
                message: 'Institute not found'
            });
        }

        const departments = await Department.find({
            InstituteID: req.params.id
        })
            .populate('DepartmentCoordinatorID', 'UserName EmailAddress')
            .sort({ DepartmentName: 1 });

        res.status(200).json({
            success: true,
            count: departments.length,
            data: departments
        });
    } catch (error) {
        console.error('Get departments by institute error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Institute not found'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error while fetching departments'
        });
    }
};

// @desc    Get single department by ID
// @route   GET /api/departments/:id
// @access  Public
export const getDepartmentById = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id)
            .populate('InstituteID', 'InstituteName InstituteImage')
            .populate('DepartmentCoordinatorID', 'UserName EmailAddress PhoneNumber');

        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        res.status(200).json({
            success: true,
            data: department
        });
    } catch (error) {
        console.error('Get department by ID error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error while fetching department'
        });
    }
};

// @desc    Create new department
// @route   POST /api/departments
// @access  Private (Admin only)
export const createDepartment = async (req, res) => {
    try {
        const { DepartmentName, DepartmentImage, InstituteID, DepartmentCoordinatorID } = req.body;

        // Check if institute exists
        const institute = await Institute.findById(InstituteID);
        if (!institute) {
            return res.status(404).json({
                success: false,
                message: 'Institute not found'
            });
        }

        // Check for duplicate department name in same institute
        const existingDepartment = await Department.findOne({
            DepartmentName,
            InstituteID
        });
        if (existingDepartment) {
            return res.status(400).json({
                success: false,
                message: 'Department with this name already exists in this institute'
            });
        }

        const department = await Department.create({
            DepartmentName,
            DepartmentImage,
            InstituteID,
            DepartmentCoordinatorID
        });

        res.status(201).json({
            success: true,
            message: 'Department created successfully',
            data: department
        });
    } catch (error) {
        console.error('Create department error:', error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Department with this name already exists in this institute'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while creating department'
        });
    }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private (Admin only)
export const updateDepartment = async (req, res) => {
    try {
        let department = await Department.findById(req.params.id);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        // If updating InstituteID, verify it exists
        if (req.body.InstituteID) {
            const institute = await Institute.findById(req.body.InstituteID);
            if (!institute) {
                return res.status(404).json({
                    success: false,
                    message: 'Institute not found'
                });
            }
        }

        department = await Department.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Department updated successfully',
            data: department
        });
    } catch (error) {
        console.error('Update department error:', error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Department with this name already exists in this institute'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while updating department'
        });
    }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private (Admin only)
export const deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        // Hard delete - permanently remove from database
        await department.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Department deleted successfully'
        });
    } catch (error) {
        console.error('Delete department error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting department'
        });
    }
};
