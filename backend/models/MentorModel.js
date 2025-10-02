const mongoose = require('mongoose');
const { UserModel } = require('./UserModel');

//Mentor Schema
const MentorSchema = new mongoose.Schema(
    {
        firstName: { type: String },
        lastName: { type: String },
        expertise: { type: String },
        affiliation: { type: String },
        programs: [{ 
            type: mongoose.Schema.Types.ObjectId, ref: 'Program',
        }],
    }, 
    { timestamps: true }
);

const MentorModel = UserModel.discriminator('Mentor', MentorSchema);

module.exports = MentorModel;