const { Report, phaseStatus } = require('../models/Report');
const crypto = require('crypto');

// Generate a unique  ID
const generateReportId = async () => {
    const timestamp = new Date().getTime().toString();
    const randomStr = crypto.randomBytes(4).toString('hex');
    const reportId = `app-${timestamp.substring(timestamp.length - 6)}-${randomStr}`;
    
    // Make sure the ID is unique
    const existingReport = await Report.findOne({ reportId });
    if (existingReport) {
        return generateReportId();
    }
    
    return reportId;
};

// Create a new application
const createReport = async (req, res) => {
    try {
        const { mentorEmail,
                submissionDate,
                phase,
                startupName,
                programApplied,
                description,
                remarks,
                timestamps } = req.body;
        
        // Generate a unique application ID
        const reportId = await generateReportId();
        const report = new Report({ reportId, mentorEmail, submissionDate, phase, programApplied, startupName, description, remarks, timestamps });
        console.log(report);
        const submittedReport = await report.save();
        res.status(201).json(submittedReport);
    } catch (error) {
        res.status(500).json({ message: error.message, error: error.message });
    }
};

// Get all applications (Read)
const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find().sort({ submissionDate: -1 });
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch reports', error: error.message });
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
// Get reports by application ID
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

// Update application status
const updateReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        // Validate status
        const validStatuses = Object.values(phaseStatus);
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid phase status value' });
        }
        
        const report = await Report.findById(id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        
        report.phase1 = status;
        report.phase2 = status;
        report.phase3 = status;
        report.phase4 = status;
        const updatedApplication = await application.save();
        
        res.status(200).json(updatedApplication);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update application status', error: error.message });
    }
};

// Delete application
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
    createReport, 
    getAllReports,
    getReportById,
    getReportByApplicationId,
    updateReport,
    deleteReport
};