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
        <ProgramForm />
    }
  />,
  <Route
    key="programs-view"
    path="/programs/:id"
    element={
        <ProgramDetail />
    }
  />,
  <Route
    key="programs-edit"
    path="/programs/:id/edit"
    element={
        <ProgramForm />
    }
  />,
];

export default programRoutes;
