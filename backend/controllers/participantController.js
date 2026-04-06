import Participant from '../models/Participant.js';
import Group from '../models/Group.js';

// @desc    Add participant to group
// @route   POST /api/participants
// @access  Private (Owner/Coordinator)
export const addParticipant = async (req, res) => {
    try {
        const { GroupID } = req.body;

        // Check group
        const group = await Group.findById(GroupID).populate('EventID');
        if (!group) return res.status(404).json({ message: 'Group not found' });

        // Check limit
        const count = await Participant.countDocuments({ GroupID });
        // Need to fetch Event to check limit. 
        // group.EventID is populated.
        if (count >= group.EventID.GroupMaxParticipants) {
            return res.status(400).json({ message: 'Group is full' });
        }

        const participant = await Participant.create(req.body);

        res.status(201).json({ success: true, data: participant });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update participant
// @route   PUT /api/participants/:id
// @access  Private
export const updateParticipant = async (req, res) => {
    try {
        const participant = await Participant.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!participant) return res.status(404).json({ message: 'Participant not found' });
        res.status(200).json({ success: true, data: participant });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete participant
// @route   DELETE /api/participants/:id
// @access  Private
export const deleteParticipant = async (req, res) => {
    try {
        const participant = await Participant.findById(req.params.id);
        if (!participant) return res.status(404).json({ message: 'Participant not found' });

        await participant.deleteOne();
        res.status(200).json({ success: true, message: 'Participant removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
