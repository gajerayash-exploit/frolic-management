import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
    DepartmentName: {
        type: String,
        required: [true, 'Department name is required'],
        trim: true,
        maxlength: [100, 'Department name cannot exceed 100 characters']
    },
    DepartmentImage: {
        type: String,
        default: ''
    },
    InstituteID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institute',
        required: [true, 'Institute reference is required']
    },
    DepartmentCoordinatorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    IsActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual to get events count
departmentSchema.virtual('events', {
    ref: 'Event',
    localField: '_id',
    foreignField: 'DepartmentID',
    count: true
});

// Compound index for unique department name per institute
departmentSchema.index({ DepartmentName: 1, InstituteID: 1 }, { unique: true });

const Department = mongoose.model('Department', departmentSchema);

export default Department;
