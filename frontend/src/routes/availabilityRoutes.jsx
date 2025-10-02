import { Route } from "react-router-dom";
import Availability from "../pages/Availability/Availability";
import AvailabilityList from "../pages/Availability/AvailabilityList";
// import AvailabilityForm from "../pages/Availability/AvailabilityForm";
// import RequireRole from "../components/RequireRole";
// import { UserRole } from "../constants/UserRole";

const availabilityRoutes = [
  <Route key="availability" path="/availability" element={<Availability />} />,
  <Route key="availability" path="/availability/list" element={<AvailabilityList />} />,
];

export default availabilityRoutes;
