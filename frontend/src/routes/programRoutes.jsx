import { Route } from "react-router-dom";
import ProgramList from "../pages/Program/ProgramList";
import ProgramForm from "../pages/Program/ProgramForm";
import RequireRole from "../components/RequireRole";
import { UserRole } from "../constants/UserRole";

const programRoutes = [
  <Route key="programs" path="/programs" element={<ProgramList />} />,
  <Route
    key="programs-new"
    path="/programs/new"
    element={
      <RequireRole allowedRoles={[UserRole.ADMIN]}>
        <ProgramForm />
      </RequireRole>
    }
  />,
  <Route
    key="programs-edit"
    path="/programs/:id/edit"
    element={
      <RequireRole allowedRoles={[UserRole.ADMIN]}>
        <ProgramForm />
      </RequireRole>
    }
  />,
];

export default programRoutes;
