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
  
  // Filter events by event coverage
  const filteredEvents = 
  coverageFilter === 'All' 
    ? events 
    : events.filter(ev => ev.coverage === coverageFilter);
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };
  
  if (loading) return <div className="text-center py-10">Loading events...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  
  return (
    <div className="container-fluid mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Events</h1>
        
        <div className="flex items-center">
        <button
        onClick={() => navigate('/events/new')}
        className="text-white bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded mr-4" 
      >
        New Event
      </button>
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
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-center text-sm text-gray-500">
                  No events found
                </td>
              </tr>
            ) : (
              filteredEvents.map((event) => (
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Export with authentication protection
export default function ProtectedEvent() {
  return (
   
      <EventList />
    
  );
}