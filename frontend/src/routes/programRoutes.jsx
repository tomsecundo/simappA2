import { Route } from "react-router-dom";
import { UserRole } from "../constants/UserRole";
import RequireRole from "../components/RequireRole";

import ProgramList from "../pages/Program/ProgramList";
import ProgramForm from "../pages/Program/ProgramForm";
import ProgramDetail from "../components/Program/ProgramDetail";

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
    key="programs-view"
    path="/programs/:id"
    element={
      <RequireRole allowedRoles={[UserRole.ADMIN]}>
        <ProgramDetail />
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
