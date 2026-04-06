import Event from '../models/Event.js';
import Department from '../models/Department.js';

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find(req.query)
            .populate('DepartmentID', 'DepartmentName')
            .populate('EventCoordinatorID', 'UserName EmailAddress')
            .sort({ EventDate: -1, EventName: 1 });

        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        console.error('Get all events error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching events'
        });
    }
};

// @desc    Get events by department
// @route   GET /api/departments/:id/events
// @access  Public
export const getEventsByDepartment = async (req, res) => {
    try {
        // Verify department exists
        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        const events = await Event.find({
            DepartmentID: req.params.id
        })
            .populate('EventCoordinatorID', 'UserName EmailAddress')
            .sort({ EventDate: -1, EventName: 1 });

        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        console.error('Get events by department error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error while fetching events'
        });
    }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('DepartmentID', 'DepartmentName DepartmentImage InstituteID')
            .populate('EventCoordinatorID', 'UserName EmailAddress PhoneNumber');

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        console.error('Get event by ID error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error while fetching event'
        });
    }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Admin/DepartmentCoordinator)
export const createEvent = async (req, res) => {
    try {
        const {
            EventName,
            Tagline,
            Image,
            Description,
            GroupMinParticipants,
            GroupMaxParticipants,
            Fees,
            Prizes,
            DepartmentID,
            EventCoordinatorID,
            Location,
            MaxGroupsAllowed,
            EventDate,
            EventTime
        } = req.body;

        // Check if department exists
        const department = await Department.findById(DepartmentID);
        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        // Validate: groupMinParticipants <= groupMaxParticipants
        if (GroupMinParticipants && GroupMaxParticipants && GroupMinParticipants > GroupMaxParticipants) {
            return res.status(400).json({
                success: false,
                message: 'Minimum participants cannot be greater than maximum participants'
            });
        }

        // Validate: maxGroupsAllowed > 0
        if (MaxGroupsAllowed !== undefined && MaxGroupsAllowed <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Maximum groups allowed must be greater than 0'
            });
        }

        const event = await Event.create({
            EventName,
            Tagline,
            Image,
            Description,
            GroupMinParticipants: GroupMinParticipants || 1,
            GroupMaxParticipants: GroupMaxParticipants || 5,
            Fees: Fees || 0,
            Prizes,
            DepartmentID,
            EventCoordinatorID,
            Location,
            MaxGroupsAllowed: MaxGroupsAllowed || 50,
            EventDate,
            EventTime
        });

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: event
        });
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while creating event'
        });
    }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Admin/DepartmentCoordinator)
export const updateEvent = async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // If updating DepartmentID, verify it exists
        if (req.body.DepartmentID) {
            const department = await Department.findById(req.body.DepartmentID);
            if (!department) {
                return res.status(404).json({
                    success: false,
                    message: 'Department not found'
                });
            }
        }

        // Validate: groupMinParticipants <= groupMaxParticipants
        const minParticipants = req.body.GroupMinParticipants ?? event.GroupMinParticipants;
        const maxParticipants = req.body.GroupMaxParticipants ?? event.GroupMaxParticipants;
        if (minParticipants > maxParticipants) {
            return res.status(400).json({
                success: false,
                message: 'Minimum participants cannot be greater than maximum participants'
            });
        }

        // Validate: maxGroupsAllowed > 0
        if (req.body.MaxGroupsAllowed !== undefined && req.body.MaxGroupsAllowed <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Maximum groups allowed must be greater than 0'
            });
        }

        event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            data: event
        });
    } catch (error) {
        console.error('Update event error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while updating event'
        });
    }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin/DepartmentCoordinator)
export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Hard delete - permanently remove from database
        await event.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting event'
        });
    }
};
