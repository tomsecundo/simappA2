import { Route } from "react-router-dom";
import ApplicationsList from "../pages/Application/ApplicationsList";
import ApplicationDetail from "../pages/Application/ApplicationDetail";
import ApplicationEditForm from "../pages/Application/ApplicationEditForm";
import ApplicationForm from "../pages/Application/ApplicationForm";
import RequireRole from "../components/RequireRole";
import { UserRole } from "../constants/UserRole";

const applicationRoutes = [
  <Route key="applications" path="/applications" element={<ApplicationsList />} />,
  <Route key="applications-new" path="/applications/new" element={<ApplicationForm />} />,
  <Route key="applications-detail" path="/applications/:id" element={<ApplicationDetail />} />,
  <Route key="applications-edit" path="/applications/:id/edit" element={<ApplicationEditForm />} />,
  <Route
    key="applications-apply"
    path="/applications/apply"
    element={
      <RequireRole>
        <ApplicationForm />
      </RequireRole>
    }
  />,
];

export default applicationRoutes;
