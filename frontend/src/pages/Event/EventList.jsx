import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../services/axiosConfig';

const EventList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coverageFilter, setCoverageFilter] = useState('All');

  const [openDetails, setOpenDetails] = useState(null);
  const [attendeesByEvent, setAttendeesByEvent] = useState({});
  const [myRegs, setMyRegs] = useState(new Set());

  const role = user?.role || '';
  const isAdmin = role === 'Admin';
  const isStartup = role === 'Startup';  

  // Fetch events
  useEffect(() => {
    if (!user) return; 

    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = user?.token || localStorage.getItem('token');

        const {data} = await axiosInstance.get('/api/events', {
          headers: token ? {Authorization: `Bearer ${token}`} : undefined,
        });
        setEvents(data);
      } catch (err) {
        const msg = 
          err?.response?.status === 401
          ? 'Not authorized (401). Please log in again.'
          : err?.response?.data?.message || 'Failed to fetch events';
        setError(msg);

      } finally {         
        setLoading(false);
      }
    };
    
    
    fetchEvent();
  }, [user?.token, user]);

  useEffect(() => {
    if (!user || !isStartup) return;

    const loadMine = async () => {
      try {
        const token = user?.token || localStorage.getItem('token');
        const {data} = await axiosInstance.get('/api/events/mine', {
          headers: token ? { Authorization: `Bearer ${token}`} : undefined,
        });

        const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.registrations)
          ? data.registrations
          : [];
        const ids = list.map(x => (typeof x === 'string' ? x : x.event));
        setMyRegs(new Set(ids.map(String)));
      } catch {
        setMyRegs(new Set());
      }
    };
    loadMine();
  }, [user, isStartup]);

  // Filter events by event coverage
  const filteredByCoverage = 
  coverageFilter === 'All' 
    ? events 
    : events.filter(ev => ev.coverage === coverageFilter);

  const filteredEvents = filteredByCoverage;
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const toggleDetails = async (eventId) => {
    if (!isAdmin) return;
    if (openDetails === eventId) {
      setOpenDetails(null);
      return;
    }
    setOpenDetails(eventId);

    if (attendeesByEvent[eventId]) return;

    try {
      const token = user?.token || localStorage.getItem('token');
        const {data} = await axiosInstance.get(
          `/api/events/${eventId}/registrations`, 
          {
          headers: token ? { Authorization: `Bearer ${token}`} : undefined,
        });
        setAttendeesByEvent((prev) => ({ ...prev, [eventId]: Array.isArray(data) ? data : []}));
    } catch {
      setAttendeesByEvent((prev) => ({ ...prev, [eventId]: []}));
    }
  };

  //Event registration
  const handleRegister = async(eventId) => {
    try {
      const token = user?.token || localStorage.getItem('token');
      await axiosInstance.post(
        `/api/events/${eventId}/register`, 
        {},
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined}
      );
      setMyRegs(prev => {
        const next = new Set(prev);
        next.add(String(eventId));
        return next;
      });
    } catch (e) {
      window.alert(e?.response?.data?.message || 'Failed to register');
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      const token = user?.token || localStorage.getItem('token');
      await axiosInstance.delete(`/api/events/${eventId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      setEvents((prev)=> prev.filter((e)=> e._id !== eventId));
    } catch (e) {
      window.alert(e?.response?.data?.message || 'Failed to delete event');
    }
  };

  const handleEdit = (eventId) => {
    navigate(`/events/${eventId}/edit`);
  };

  const handleCancel = async (eventId) => {
    if(!window.confirm('Cancel your registration for this event?')) return;
    try{
      const token = user?.token || localStorage.getItem('token');
      await axiosInstance.delete(`/api/events/${eventId}/register`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      setMyRegs(prev => {
        const next = new Set(prev);
        next.delete(String(eventId));
        return next;
      });
    } catch (e) {
      window.alert(e?.response?.data?.message || 'Failed to cancel registeration');
    }
    };

  
  if (loading) return <div className="text-center py-10">Loading events...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  
  return (
    <div className="container-fluid mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isStartup ? 'My Registered Events' : 'Events'}
        </h1>

        <div className="flex items-center">
        {isAdmin && (
          <button
          onClick={() => navigate('/events/new')}
          className="text-white bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded mr-4" 
        >
          New Event
        </button>
        )}
          <label htmlFor="coverage" className="mr-2">Filter by Event Coverage:</label>
          <select
            id="coverage"
            value={coverageFilter}
            onChange={(e) => setCoverageFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="All">All Coverage</option>
            <option value="Private">Private</option>
            <option value="Public">Public</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto bg-white shadow-md rounded">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Event Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Event Description
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Event Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Event Venue
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Event Type
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Event Coverage
              </th>
              {isAdmin && (
                <th className="px-4 py-4 text-sm text-right"> Attendees </th>)}
                <th className="px-4 py-3 text-sm text-right"> Actions </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 8 : 7 } className="px-4 py-4 text-center text-sm text-gray-500">
                  {isStartup ? 'No registered events' : 'No events found' }
                </td>
              </tr>
            ) : (
              filteredEvents.map((event) => {
                const mainRow = (
                <tr key={event._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {event.eventName}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {event.eventDescription}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(event.eventDate)}
                  </td>
                   <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.eventVenue}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      event.eventType === 'Networking' ? 'bg-yellow-100 text-yellow-800' :
                      event.eventType === 'Demo Day' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {event.eventType}
                    </span>
                  </td>               
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      event.coverage === 'Private' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {event.coverage}
                      </span>
                    </td>

                    {isAdmin && (
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                          <button
                            className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
                            onClick={() => toggleDetails(event._id)}
                            >
                              {openDetails === event._id ? 'Hide' : 'Show'} attendees
                            </button>
                        </td>
                      )}

                      {/* Actions */}
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right space-x-2">
                        {isStartup && (
                          myRegs.has(String(event._id)) ? (
                            <>
                            <span className="px-3 py-1 rounded bg-green-100 text-green-800 text-xs">
                              Registered
                            </span>
                            <button 
                              className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
                              onClick={() => handleCancel(event._id)}
                            >
                              Cancel
                            </button>
                            </>
                          ) : (
                            <button 
                              className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
                              onClick={() => handleRegister(event._id)}
                            >
                              Register
                            </button>
                          )
                        )}

                        {isAdmin && (
                          <>
                          <button 
                              className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
                              onClick={() => handleEdit(event._id)}
                          >
                              Update
                          </button>
                          <button 
                              className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
                              onClick={() => handleDelete(event._id)}
                          >
                              Delete
                          </button>
                          </>
                        )}
                      </td>
                    </tr>
                );
                      const detailsRow = (isAdmin && openDetails === event._id) ? (
                        <tr key={`${event._id}-details`}>
                          <td colSpan={8} className="px-6 py-4">
                            <div className="bg-gray-50 rounded p-4">
                              <h3 className="font-semibold mb-2"> Registered Startups </h3>
                              {Array.isArray(attendeesByEvent[event._id]) && 
                              attendeesByEvent[event._id].length > 0 ? (
                              <ul className="list-disc pl-5 space-y-1">
                              {attendeesByEvent[event._id].map((r)=> (
                                <li key={r._id}>
                                  <span className="font-medium">{r.user?.name} </span>
                                  {r.user?.email ? `(${r.user.email})` : ''}
                                  {r.application?.applicationName
                                  ? `-Application: ${r.application.applicationName}`
                                :''}
                                </li>
                              ))}
                              </ul>
                            ) : (
                              <div className="text-sm text-gray-500"> No registrations yet </div>
                            )}
                            </div>
                          </td>
                        </tr>
                      ) : null;
                        return [mainRow, detailsRow];
                      })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Export with authentication protection
export default function ProtectedEvent() {
  return <EventList />; 
}