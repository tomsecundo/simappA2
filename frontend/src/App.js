import { BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";

// Route groups
import authRoutes from "./routes/authRoutes";
import programRoutes from "./routes/programRoutes";
import applicationRoutes from "./routes/applicationRoutes";
import mentorRoutes from "./routes/mentorRoutes";
import assignmentRoutes  from "./routes/assignmentRoutes";
import reportRoutes from "./routes/reportRoutes";
import sessionRoutes from "./routes/sessionRoutes";
import availabilityRoutes from "./routes/availabilityRoutes";
import eventRoutes from "./routes/eventRoutes";
import profileRoutes from "./routes/profileRoutes";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {authRoutes}
          {programRoutes}
          {applicationRoutes}
          {mentorRoutes}
          {assignmentRoutes}
          {reportRoutes}
          {sessionRoutes}
          {availabilityRoutes}
          {eventRoutes}
          {profileRoutes}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
