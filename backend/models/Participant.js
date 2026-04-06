import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: [true, 'Participant name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    EnrollmentNum: {
        type: String,
        required: [true, 'Enrollment number is required'],
        trim: true,
        maxlength: [50, 'Enrollment number cannot exceed 50 characters']
    },
    InstituteName: {
        type: String,
        required: [true, 'Institute name is required'],
        trim: true,
        maxlength: [100, 'Institute name cannot exceed 100 characters']
    },
    City: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
        maxlength: [50, 'City cannot exceed 50 characters']
    },
    Phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
    },
    Email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    IsGroupLeader: {
        type: Boolean,
        default: false
    },
    GroupID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: [true, 'Group reference is required']
    }
}, {
    timestamps: true
});

// Index for faster lookups
participantSchema.index({ GroupID: 1 });
participantSchema.index({ EnrollmentNum: 1, GroupID: 1 });

const Participant = mongoose.model('Participant', participantSchema);

export default Participant;
