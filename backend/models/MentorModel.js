const mongoose = require('mongoose');
const { UserModel } = require('./UserModel');

//Mentor Schema
const MentorSchema = new mongoose.Schema(
    {
        firstName: { type: String },
        lastName: { type: String },
        number: { type: String, unique: true, },
        expertise: { type: String },
        affiliaton: { type: String },
        address: { type: String },
        programs: [{ 
            type: mongoose.Schema.Types.ObjectId, ref: 'Program',
        }],
    }, 
    { timestamps: true }
);

const MentorModel = UserModel.discriminator('Mentor', MentorSchema);

module.exports = MentorModel;