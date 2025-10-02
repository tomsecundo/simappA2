import { Route } from "react-router-dom";
import MentorsList from "../pages/Mentor/MentorsList";
import UpdateMentor from "../pages/Mentor/UpdateMentor";
import RequireRole from "../components/RequireRole";
import { UserRole } from "../constants/UserRole";

const mentorRoutes = [
  <Route key="mentors" path="/mentor" element={<MentorsList />} />,
  <Route
    key="mentor-update"
    path="/mentor/update/:id"
    element={
      <RequireRole>
        <UpdateMentor />
      </RequireRole>
    }
  />,
];

export default mentorRoutes;
