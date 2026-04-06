import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    UserName: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        minlength: [2, 'Username must be at least 2 characters']
    },
    UserPassword: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't return password by default
    },
    EmailAddress: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    PhoneNumber: {
        type: String,
        trim: true,
        match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
    },
    IsAdmin: {
        type: Boolean,
        default: false
    },
    Role: {
        type: String,
        enum: ['admin', 'student', 'institute_coordinator', 'department_coordinator', 'event_coordinator'],
        default: 'student'
    },
    Avatar: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('UserPassword')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.UserPassword = await bcrypt.hash(this.UserPassword, salt);
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.UserPassword);
};

const User = mongoose.model('User', userSchema);

export default User;
