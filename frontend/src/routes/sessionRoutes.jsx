import { Route } from "react-router-dom";
import SessionList from "../pages/Session/SessionList";
import SessionForm from "../pages/Session/SessionForm";
import RequireRole from "../components/RequireRole";
import { UserRole } from "../constants/UserRole";

const sessionRoutes = [
  <Route key="sessions" path="/sessions" element={<SessionList />} />,
  <Route
    key="session-new"
    path="/sessions/new"
    element={
      <RequireRole allowedRoles={[UserRole.ADMIN, UserRole.MENTOR]}>
        <SessionForm />
      </RequireRole>
    }
  />,
];

export default sessionRoutes;
