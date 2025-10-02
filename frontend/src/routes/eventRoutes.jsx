import { Route } from "react-router-dom";
import EventForm from "../pages/Event/EventForm";
import EventEditForm from "../pages/Event/EventEditForm";
import EventList from "../pages/Event/EventList";

const eventRoutes = [
  <Route key="events-list" path="/events" element={<EventList />} />,
  <Route key="events-new"  path="/events/new" element={<EventForm />}/>,
  <Route key="events-edit"  path="/events/:id/edit" element={<EventEditForm />}/>,
];

export default eventRoutes;
