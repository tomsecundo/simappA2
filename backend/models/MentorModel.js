const mongoose = require('mongoose');
const { UserModel } = require('./UserModel');

//Mentor Schema
const MentorSchema = new mongoose.Schema(
    {
        expertise: { type: String },
        programs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Program' }],
    }, 
    { timestamps: true }
);

const MentorModel = UserModel.discriminator('Mentor', MentorSchema);

module.exports = MentorModel;