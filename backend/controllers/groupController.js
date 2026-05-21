import Group from '../models/Group.js';
import Event from '../models/Event.js';
import Participant from '../models/Participant.js';

// @desc    Register a new group for an event
// @route   POST /api/groups
// @access  Public
export const registerGroup = async (req, res) => {
    try {
        const { GroupName, EventID, Participants, IsPaymentDone } = req.body;

        // 1. Verify Event
        const event = await Event.findById(EventID);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        // 2. Validate Participants Count
        if (!Participants || Participants.length < event.GroupMinParticipants || Participants.length > event.GroupMaxParticipants) {
            return res.status(400).json({
                success: false,
                message: `Group size must be between ${event.GroupMinParticipants} and ${event.GroupMaxParticipants}`
            });
        }

        // 3. Check for Duplicate Group Name in this Event
        const existingGroup = await Group.findOne({ GroupName, EventID });
        if (existingGroup) {
            return res.status(400).json({ success: false, message: 'Group name already exists for this event' });
        }

        // 4. Create Group
        // If user is logged in, set CreatedBy, else user needs to provide leader details to create a user account? 
        // SRS says "One participant marked as Leader". 
        // For simplicity in this demo, we assume the user is logged in (Student/Coord) OR we handle anonymous registration if needed.
        // But the Group model requires `CreatedBy`. 
        // Let's assume for now the user MUST be logged in to register.
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Please login to register a group' });
        }

        const group = await Group.create({
            GroupName,
            EventID,
            CreatedBy: req.user._id,
            IsPaymentDone: IsPaymentDone || false,
            PaymentVerifiedBy: IsPaymentDone ? req.user._id : null,
            PaymentVerifiedAt: IsPaymentDone ? Date.now() : null
        });

        // 5. Create Participants
        const participantPromises = Participants.map(p => {
            return Participant.create({
                ...p,
                GroupID: group._id
            });
        });

        await Promise.all(participantPromises);

        res.status(201).json({
            success: true,
            message: 'Group registered successfully',
            data: group
        });

    } catch (error) {
        console.error('Register group error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while registering group'
        });
    }
};

// @desc    Get all groups (with filtering)
// @route   GET /api/groups
// @access  Private (Admin/Coordinator)
export const getGroups = async (req, res) => {
    try {
        const filter = { ...req.query };
        const groups = await Group.find(filter)
            .populate('EventID', 'EventName')
            .populate('CreatedBy', 'UserName EmailAddress')
            .populate('participants') // Virtual population
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: groups.length,
            data: groups
        });
    } catch (error) {
        console.error('Get groups error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get single group
// @route   GET /api/groups/:id
// @access  Private (Admin/Coordinator/Owner)
export const getGroupById = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id)
            .populate('EventID')
            .populate('participants')
            .populate('CreatedBy', 'UserName');

        if (!group) {
            return res.status(404).json({ success: false, message: 'Group not found' });
        }

        res.status(200).json({
            success: true,
            data: group
        });
    } catch (error) {
        console.error('Get group error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Update group (Attendance, Payment)
// @route   PUT /api/groups/:id
// @access  Private (Admin/Coordinator)
export const updateGroup = async (req, res) => {
    try {
        let group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ success: false, message: 'Group not found' });
        }

        // Logic for Payment Verification
        if (req.body.IsPaymentDone !== undefined && req.body.IsPaymentDone !== group.IsPaymentDone) {
            if (req.body.IsPaymentDone) {
                req.body.PaymentVerifiedBy = req.user._id;
                req.body.PaymentVerifiedAt = Date.now();
            } else {
                req.body.PaymentVerifiedBy = null;
                req.body.PaymentVerifiedAt = null;
            }
        }

        // Logic for Attendance
        if (req.body.IsPresent !== undefined && req.body.IsPresent !== group.IsPresent) {
            if (req.body.IsPresent) {
                req.body.AttendanceMarkedBy = req.user._id;
                req.body.AttendanceMarkedAt = Date.now();
            } else {
                req.body.AttendanceMarkedBy = null;
                req.body.AttendanceMarkedAt = null;
            }
        }

        group = await Group.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: group
        });
    } catch (error) {
        console.error('Update group error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
