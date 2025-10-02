import { Route } from "react-router-dom";
import Reports from "../pages/Reports/Reports";
import ReportForm from "../pages/Reports/ReportForm";
import Progress from "../pages/Reports/Progress";
import ProgressForm from "../pages/Reports/ProgressForm";
import RequireRole from "../components/RequireRole";
import { UserRole } from "../constants/UserRole";

const reportRoutes = [
  <Route key="reports" path="/reports" element={<Reports />} />,
  <Route
    key="report-new"
    path="/reports/new"
    element={
        <ReportForm />
    }
  />,
  <Route key="progress" path="/progress" element={<Progress />} />,
  <Route
    key="progress-new"
    path="/progress/new"
    element={
        <ProgressForm />
    }
  />,
];

export default reportRoutes;
