import mongoose from 'mongoose';

const instituteSchema = new mongoose.Schema({
    InstituteName: {
        type: String,
        required: [true, 'Institute name is required'],
        trim: true,
        unique: true,
        maxlength: [100, 'Institute name cannot exceed 100 characters']
    },
    InstituteImage: {
        type: String,
        default: ''
    },
    InstituteDescription: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    InstituteCoordinatorID: {
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

// Virtual to get departments count
instituteSchema.virtual('departments', {
    ref: 'Department',
    localField: '_id',
    foreignField: 'InstituteID',
    count: true
});

const Institute = mongoose.model('Institute', instituteSchema);

export default Institute;
