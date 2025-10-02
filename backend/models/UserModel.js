const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserRole = {
    ADMIN: 'Admin',
    MENTOR: 'Mentor',
    STARTUP: 'Startup',
};

//base
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        role: {
            type: String,
            enum: Object.values(UserRole),
            required: true
        },
        password: { type: String, required: true },
        number: { type: String },
        affiliation: { type: String },
        address: { type: String },
    }, 
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = { 
    UserModel: mongoose.model('User', userSchema), 
    UserRole
};