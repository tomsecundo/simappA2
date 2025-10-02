const mongoose = require('mongoose');

const assignmentStatus = {
    ONGOING: 'Ongoing',
    COMPLETED: 'Completed'
};
const assignmentSchema = new mongoose.Schema({
    title: { type: String, required: true},
    description:{ type: String, required: true},
    startup: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    applicationName: { type: String, required: true },
    phase: { type: String, required: true },
    deadline: {type: Date},
    status:  {
        type: String,
        enum: Object.values(assignmentStatus),
        default: assignmentStatus.ONGOING 
        }
}, {
    timestamps: { createdAt: 'createdDateTime', updatedAt: 'updatedDateTime' }
});

assignmentSchema.path('deadline').validate(function (v){
    if (!v) return true;
    const baseline = this.isNew
        ? new Date()
        : (this.createdDateTime || new Date());
    return v >= baseline;
}, 'Deadline must be after date creation.');

module.exports = {
    Assignment: mongoose.model('Assignment', assignmentSchema),
    assignmentStatus
};