const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const Database = require('./config/db');

dotenv.config();
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env file");
}

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/mentor', require('./routes/mentorRoutes'));

app.use('/api/programs', require('./routes/programRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes')); 
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/availability', require('./routes/availabilityRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/sessions', require('./routes/sessionRoutes'));
app.use('/api/assignment', require('./routes/assignmentRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));

// Export the app object for testing
if (require.main === module) {

    Database.connect().then(() => {
        const PORT = process.env.PORT || 5001;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    }).catch(error => {
        console.error("Failed to connect to database:", error.message);
        process.exit(1);
    });
}

module.exports = app