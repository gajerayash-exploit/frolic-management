import mongoose from 'mongoose';

const winnerSchema = new mongoose.Schema({
    EventID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: [true, 'Event reference is required']
    },
    GroupID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: [true, 'Group reference is required']
    },
    Sequence: {
        type: Number,
        required: [true, 'Winner sequence is required'],
        enum: {
            values: [1, 2, 3],
            message: 'Sequence must be 1 (1st), 2 (2nd), or 3 (3rd)'
        }
    },
    DeclaredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Declared by user reference is required']
    },
    DeclaredAt: {
        type: Date,
        default: Date.now
    },
    Prize: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Compound index: Only one winner per sequence per event
winnerSchema.index({ EventID: 1, Sequence: 1 }, { unique: true });

// Compound index: A group can only win once per event
winnerSchema.index({ EventID: 1, GroupID: 1 }, { unique: true });

const Winner = mongoose.model('Winner', winnerSchema);

export default Winner;
