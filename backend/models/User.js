const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_\-])[A-Za-z\d@$!%*?&_\-]{8,}$/;

const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"]
    },
    password: { 
        type: String, 
        required: true,
        minlength: [8, "Password must be at least 8 characters long"],
        validate: {
            validator: function (value) {
                if (value.startsWith("$2b$")) return true;
                return passwordRegex.test(value);
            },
        }
    },
    validationCode: String,
    validationCodeExpires: Date,
    validated: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
