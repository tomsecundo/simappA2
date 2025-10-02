import { Route } from "react-router-dom";
import EventForm from "../pages/Event/EventForm";
import EventList from "../pages/Event/EventList";

const eventRoutes = [
  <Route key="events-list" path="/events" element={<EventList />} />,
  <Route key="events-new"  path="/events/new" element={<EventForm />}/>,
];

export default eventRoutes;
