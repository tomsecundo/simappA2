const { Progress } = require('../models/Progress');
const crypto = require('crypto');

// Generate a unique  ID
const generateProgressId = async () => {
    const timestamp = new Date().getTime().toString();
    const randomStr = crypto.randomBytes(4).toString('hex');
    const progressId = `app-${timestamp.substring(timestamp.length - 6)}-${randomStr}`;
    
    // Make sure the ID is unique
    const existingProgress = await Progress.findOne({ progressId });
    if (existingProgress) {
        return generateProgressId();
    }
    
    return progressId;
};

// Create a new report
const createProgress = async (req, res) => {
    try {
        
        const { applicationId,
                mentorEmail,
                phase1,
                phase2,
                phase3,
                phase4,
                startupName,
                timestamps } = req.body;
        
        // Generate a unique report ID
        const progressId = await generateProgressId();
        
        const progress = new Progress({ progressId, applicationId, mentorEmail, phase1, phase2, phase3, phase4, startupName, timestamps });
        console.log(progress);
        const progressStartUp = await progress.save();
        res.status(201).json(progressStartUp);
    } catch (error) {
        res.status(500).json({ message: error.message + ": Failed to create", error: error.message });
    }
};

// Get progress (Read)
const getAllProgress = async (req, res) => {
    try {
        const progress = await Progress.find().sort({ applicationId: -1 });

        res.status(200).json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch progress chart', error: error.message });
    }
};

// Get a report by reportID
const getProgressById = async (req, res) => {
    try {
        const { id} = req.params;
        const progress = await Progress.findOne({ reportId: id});
        
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch report', error: error.message });
    }
};

// Get a report by reportID
const getReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await Report.findById(id);
        
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch report', error: error.message });
    }
};
// Get reports by report ID
const getReportByApplicationId = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await Report.findById(id);
        
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch report', error: error.message });
    }
};

// Update report remarks
const updateProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const { phase1, phase2, phase3, phase4 } = req.body;
        
        // Validate status
        const validStatuses = Object.values(phaseStatus);
        if (!validStatuses.includes(phase1)) {
            return res.status(400).json({ message: 'Invalid phase status value' });
        }
        
        const report = await Report.findById(id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        
        report.remarks = status;
        const updatedReport = await report.save();
        
        res.status(200).json(updatedReport);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update application status', error: error.message });
    }
};

// Delete report
const deleteReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        
        // Only allow admin to delete it
        // if (req.user.role !== 'admin' && application.userId.toString() !== req.user.id)
        // if (req.user.role !== 'admin') {
        //     return res.status(403).json({ message: 'Not authorized to delete this application' });
        // }
        
        await Report.deleteOne({ _id: req.params.id });
        res.json({ message: 'Report deleted successfully' });
    } catch (error) {
        console.error('Deleting report error:', error);
        res.status(500).json({ 
            message: 'Failed to delete report', 
            error: error.message 
        });
    }
};

module.exports = { 
    createProgress, 
    getAllProgress,
    getProgressById,
    updateProgress,
    deleteReport
};