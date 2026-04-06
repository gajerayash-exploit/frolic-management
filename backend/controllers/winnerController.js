import Winner from '../models/Winner.js';
import Group from '../models/Group.js';
import Event from '../models/Event.js';

// @desc    Declare a winner
// @route   POST /api/winners
// @access  Private (Admin/Coordinator)
export const declareWinner = async (req, res) => {
    try {
        const { EventID, GroupID, Sequence, Prize } = req.body;

        const event = await Event.findById(EventID);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        const group = await Group.findById(GroupID);
        if (!group) {
            return res.status(404).json({ success: false, message: 'Group not found' });
        }

        if (String(group.EventID) !== String(EventID)) {
            return res.status(400).json({ success: false, message: 'Group does not belong to this event' });
        }

        const winner = await Winner.create({
            EventID,
            GroupID,
            Sequence,
            Prize,
            DeclaredBy: req.user ? req.user._id : null
        });

        res.status(201).json({ success: true, data: winner });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Winner already declared for this position or group in this event' });
        }
        console.error('Declare winner error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};

// @desc    Get all winners (with optional EventID filter)
// @route   GET /api/winners
// @access  Public
export const getWinners = async (req, res) => {
    try {
        const filter = {};
        if (req.query.EventID) filter.EventID = req.query.EventID;

        const winners = await Winner.find(filter)
            .populate({
                path: 'EventID',
                select: 'EventName Tagline DepartmentID',
                populate: { path: 'DepartmentID', select: 'DepartmentName' }
            })
            .populate({
                path: 'GroupID',
                select: 'GroupName',
                populate: { path: 'participants' }
            })
            .populate('DeclaredBy', 'UserName')
            .sort({ EventID: 1, Sequence: 1 });

        res.status(200).json({ success: true, count: winners.length, data: winners });
    } catch (error) {
        console.error('Get winners error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Delete a winner declaration
// @route   DELETE /api/winners/:id
// @access  Private (Admin/Coordinator)
export const deleteWinner = async (req, res) => {
    try {
        const winner = await Winner.findById(req.params.id);
        if (!winner) {
            return res.status(404).json({ success: false, message: 'Winner not found' });
        }
        await winner.deleteOne();
        res.status(200).json({ success: true, message: 'Winner removed' });
    } catch (error) {
        console.error('Delete winner error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
