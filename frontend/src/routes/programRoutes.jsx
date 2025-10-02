// routes/programRoutes.jsx
import { Route } from "react-router-dom";
import { UserRole } from "../constants/UserRole";
import RequireRole from "../components/RequireRole";

import ProgramList from "../pages/Program/ProgramList";
import ProgramForm from "../pages/Program/ProgramForm";
import ProgramDetailPage from "../pages/Program/ProgramDetailPage"; // new detail wrapper

const programRoutes = [
    // List all programs
    <Route key="programs" path="/programs" element={<ProgramList />} />,

    // Program details (any authenticated user)
    <Route key="programs-view" path="/programs/:id" element={<ProgramDetailPage />} />,

    // Create new program (Admin only)
    <Route
        key="programs-new"
        path="/programs/new"
        element={
        <RequireRole allowedRoles={[UserRole.ADMIN]}>
            <ProgramForm />
        </RequireRole>
        }
    />,

    // Edit program (Admin only)
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
