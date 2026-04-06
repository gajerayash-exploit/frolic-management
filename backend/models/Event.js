import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    EventName: {
        type: String,
        required: [true, 'Event name is required'],
        trim: true,
        maxlength: [100, 'Event name cannot exceed 100 characters']
    },
    Tagline: {
        type: String,
        trim: true,
        maxlength: [200, 'Tagline cannot exceed 200 characters']
    },
    Image: {
        type: String,
        default: ''
    },
    Description: {
        type: String,
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    GroupMinParticipants: {
        type: Number,
        required: [true, 'Minimum participants is required'],
        min: [1, 'Minimum participants must be at least 1'],
        default: 1
    },
    GroupMaxParticipants: {
        type: Number,
        required: [true, 'Maximum participants is required'],
        min: [1, 'Maximum participants must be at least 1'],
        default: 5
    },
    Fees: {
        type: Number,
        min: [0, 'Fees cannot be negative'],
        default: 0
    },
    Prizes: {
        type: String,
        trim: true,
        maxlength: [500, 'Prizes description cannot exceed 500 characters']
    },
    DepartmentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: [true, 'Department reference is required']
    },
    EventCoordinatorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    Location: {
        type: String,
        trim: true,
        maxlength: [200, 'Location cannot exceed 200 characters']
    },
    MaxGroupsAllowed: {
        type: Number,
        min: [1, 'At least 1 group must be allowed'],
        default: 50
    },
    EventDate: {
        type: Date
    },
    EventTime: {
        type: String
    },
    IsActive: {
        type: Boolean,
        default: true
    },
    RegistrationOpen: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Validation: Max participants must be >= Min participants
eventSchema.pre('save', function (next) {
    if (this.GroupMaxParticipants < this.GroupMinParticipants) {
        this.GroupMaxParticipants = this.GroupMinParticipants;
    }
    next();
});

// Virtual to get groups count
eventSchema.virtual('groups', {
    ref: 'Group',
    localField: '_id',
    foreignField: 'EventID',
    count: true
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
