import Institute from '../models/Institute.js';

// @desc    Get all institutes
// @route   GET /api/institutes
// @access  Public
export const getAllInstitutes = async (req, res) => {
    try {
        const institutes = await Institute.find(req.query)
            .populate('InstituteCoordinatorID', 'UserName EmailAddress')
            .sort({ InstituteName: 1 });

        res.status(200).json({
            success: true,
            count: institutes.length,
            data: institutes
        });
    } catch (error) {
        console.error('Get all institutes error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching institutes'
        });
    }
};

// @desc    Get single institute by ID
// @route   GET /api/institutes/:id
// @access  Public
export const getInstituteById = async (req, res) => {
    try {
        const institute = await Institute.findById(req.params.id)
            .populate('InstituteCoordinatorID', 'UserName EmailAddress PhoneNumber');

        if (!institute) {
            return res.status(404).json({
                success: false,
                message: 'Institute not found'
            });
        }

        res.status(200).json({
            success: true,
            data: institute
        });
    } catch (error) {
        console.error('Get institute by ID error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Institute not found'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error while fetching institute'
        });
    }
};

// @desc    Create new institute
// @route   POST /api/institutes
// @access  Private (Admin only)
export const createInstitute = async (req, res) => {
    try {
        const { InstituteName, InstituteImage, InstituteDescription, InstituteCoordinatorID } = req.body;

        // Check if institute already exists
        const existingInstitute = await Institute.findOne({ InstituteName });
        if (existingInstitute) {
            return res.status(400).json({
                success: false,
                message: 'Institute with this name already exists'
            });
        }

        const institute = await Institute.create({
            InstituteName,
            InstituteImage,
            InstituteDescription,
            InstituteCoordinatorID
        });

        res.status(201).json({
            success: true,
            message: 'Institute created successfully',
            data: institute
        });
    } catch (error) {
        console.error('Create institute error:', error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Institute with this name already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while creating institute'
        });
    }
};

// @desc    Update institute
// @route   PUT /api/institutes/:id
// @access  Private (Admin only)
export const updateInstitute = async (req, res) => {
    try {
        let institute = await Institute.findById(req.params.id);

        if (!institute) {
            return res.status(404).json({
                success: false,
                message: 'Institute not found'
            });
        }

        institute = await Institute.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Institute updated successfully',
            data: institute
        });
    } catch (error) {
        console.error('Update institute error:', error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Institute with this name already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while updating institute'
        });
    }
};

// @desc    Delete institute
// @route   DELETE /api/institutes/:id
// @access  Private (Admin only)
export const deleteInstitute = async (req, res) => {
    try {
        const institute = await Institute.findById(req.params.id);

        if (!institute) {
            return res.status(404).json({
                success: false,
                message: 'Institute not found'
            });
        }

        // Hard delete - permanently remove from database
        await institute.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Institute deleted successfully'
        });
    } catch (error) {
        console.error('Delete institute error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting institute'
        });
    }
};
