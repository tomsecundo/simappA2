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
        university: { type: String },
        address: { type: String }
    }, 
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

//Mentor Schema
const mentorSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: Object.values(UserRole),
            required: true
        },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        number: { type: String, required: true, unique: true },
        expertise: { type: String },
        affliation: { type: String },
        address: { type: String },
        password: { type: String, required: true }
    }, 
    { timestamps: true }
);


mentorSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = { 
    User: mongoose.model('User', userSchema), 
    Mentor: mongoose.model('Mentor', mentorSchema), UserRole 
};
