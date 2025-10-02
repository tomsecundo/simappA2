import { Route } from "react-router-dom";
import AssignmentForm from "../pages/Assignment/AssignmentForm";
import AssignmentList from "../pages/Assignment/AssignmentList";

const assignmentRoutes = [
  <Route key="assignments" path="/assignment" element={<AssignmentList />} />,
  <Route
    key="assignment-new"
    path="/assignment/new"
    element={
        <AssignmentForm />
    }
  />,
];

export default assignmentRoutes;
