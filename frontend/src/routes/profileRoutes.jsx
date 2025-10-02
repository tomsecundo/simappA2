import { Route } from "react-router-dom";
import Profile from "../pages/Profile/Profile";
import Unauthorized from "../pages/Unauthorized";

const profileRoutes = [
  <Route key="profile" path="/profile" element={<Profile />} />,
  <Route key="unauthorized" path="/unauthorized" element={<Unauthorized />} />,
];

export default profileRoutes;
