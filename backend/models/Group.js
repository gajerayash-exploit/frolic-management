import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
    GroupName: {
        type: String,
        required: [true, 'Group name is required'],
        trim: true,
        maxlength: [50, 'Group name cannot exceed 50 characters']
    },
    EventID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: [true, 'Event reference is required']
    },
    IsPaymentDone: {
        type: Boolean,
        default: false
    },
    IsPresent: {
        type: Boolean,
        default: false
    },
    CreatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Creator reference is required']
    },
    PaymentVerifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    PaymentVerifiedAt: {
        type: Date,
        default: null
    },
    AttendanceMarkedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    AttendanceMarkedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual to get participants
groupSchema.virtual('participants', {
    ref: 'Participant',
    localField: '_id',
    foreignField: 'GroupID'
});

// Virtual to get participant count
groupSchema.virtual('participantCount', {
    ref: 'Participant',
    localField: '_id',
    foreignField: 'GroupID',
    count: true
});

// Compound index for unique group name per event
groupSchema.index({ GroupName: 1, EventID: 1 }, { unique: true });

const Group = mongoose.model('Group', groupSchema);

export default Group;
