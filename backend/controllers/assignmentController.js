const { Assignment, assignmentStatus } = require('../models/AssignmentModel');

// Create a new assignment
const createAssignment = async (req, res) => {
    try {
        const { title,
                description,
                startup,
                applicationName,
                phase,
                deadline} = req.body;
        
        const assignment = new Assignment({
                title,
                description,
                startup,
                applicationName,
                phase,
                deadline,
        });

        const submittedAssignment = await assignment.save();
        res.status(201).json(submittedAssignment);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation failed',
                details: Object.values(error.errors).map(e => e.message)
            });
        }
        res.status(500).json({message: 'Failed to submit an assignment', error: error.message});
    }
};

// Get all assignment (Read)
const getAllAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find().sort({ deadline: -1 });
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch assignments', error: error.message });
    }
};

// Get an assignment by status
const getAssignmentByStatus = async (req, res) => {
    try {
        const {status} = req.params;
        const{phase} = req.query;

        if (!Object.values(assignmentStatus).includes(status)) {
            return res.status(400).json({message: 'Invalid status value'});
        }
        
        const query = {status};
        if (phase) query.phase = phase;

        const assignments = await Assignment.find(query).sort({createdDateTime: -1});
        if (!assignments.length) {
            return res.status(404).json({message: 'No assignments found.'})
        }

        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch assignment/s', error: error.message });
    }
};

// Get an assignment by assignmentID
const getAssignmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const assignment = await Assignment.findById(id);
        
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        
        res.status(200).json(assignment);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch assignment', error: error.message });
    }
};
// Get assignments by assignment ID
const getAssignmentByApplicationId = async (req, res) => {
    try {
        const { id } = req.params;

        const assignment = await Assignment
            .find({applicationName: id})
            .sort({createdDateTime: -1});
        
        if (!assignment.length) {
            return res.status(404).json({ message: 'No assignments found' });
        }
        
        res.status(200).json(assignment);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch assignment/s', error: error.message });
    }
};

// Update assignment remarks
const updateAssignment = async (req, res) => {
    try {
        const { id } = req.params;

        if ('status' in req.body) {
            return res.status(400).json({message: 'This is auto generated from Report Status.'});
        }

        const assignment = await Assignment
        .findById(id)

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        const {
            title,
            description,
            startup,
            applicationName,
            phase,
            deadline,
        } = req.body; 

        if (title !== undefined) assignment.title = title;
        if (description !== undefined) assignment.description = description;
        if (startup !== undefined) assignment.startup = startup;
        if (applicationName !== undefined) assignment.applicationName = applicationName;
        if (phase !== undefined) assignment.phase = phase;
        if (deadline !== undefined) assignment.deadline = deadline;

        const updatedAssignment = await assignment.save();
        res.status(200).json(updatedAssignment);
    } catch (error) {
         if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation failed',
                details: Object.values(error.errors).map(e => e.message)
            });
        }
        res.status(500).json({ message: 'Failed to update application status', error: error.message });
    }
};

// Delete assignment
const deleteAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        
        // Only allow admin to delete it
        // if (req.user.role !== 'admin' && application.userId.toString() !== req.user.id)
        // if (req.user.role !== 'admin') {
        //     return res.status(403).json({ message: 'Not authorized to delete this application' });
        // }
        
        await Assignment.deleteOne({ _id: req.params.id });
        res.json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        console.error('Deleting assignment error:', error);
        res.status(500).json({ 
            message: 'Failed to delete assignment', 
            error: error.message 
        });
    }
};

module.exports = { 
    createAssignment, 
    getAllAssignments,
    getAssignmentById,
    getAssignmentByApplicationId,
    getAssignmentByStatus,
    updateAssignment,
    deleteAssignment
};