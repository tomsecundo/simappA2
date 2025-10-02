import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../services/axiosConfig';

const Assignment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Fetch assignments
  useEffect(() => {
    if (!user) return; 

    const fetchAssignment = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = user?.token || localStorage.getItem('token');

        const {data} = await axiosInstance.get('/api/assignment', {
          headers: token ? {Authorization: `Bearer ${token}`} : undefined,
        });
        setAssignments(data);
      } catch (err) {
        const msg = 
          err?.response?.status === 401
          ? 'Not authorized (401). Please log in again.'
          : err?.response?.data?.message || 'Failed to fetch assignments';
        setError(msg);

      } finally {         
        setLoading(false);
      }
    };
    
    
    fetchAssignment();
  }, [user?.token]);
  
  // Handle view assignments details
  const handleViewAssignments = (id) => {
    navigate(`/assignment/${id}`);
  };
  
  // Filter assignments by status
  const filteredAssignments = statusFilter === 'All' 
    ? assignments 
    : assignments.filter(app => app.status === statusFilter);
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };
  
  if (loading) return <div className="text-center py-10">Loading assignments...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  
  return (
    <div className="container-fluid mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assignments</h1>
        
        <div className="flex items-center">
        <button
        onClick={() => navigate('/assignment/new')}
        className="text-white bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded mr-4" // Added mr-4 for spacing
      >
        New Assignment
      </button>
          <label htmlFor="statusFilter" className="mr-2">Filter by Status:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="All">All Assignments</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto bg-white shadow-md rounded">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                title
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                description
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                startup
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                applicationName
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Phase
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                deadline
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAssignments.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-4 text-center text-sm text-gray-500">
                  No assignments found
                </td>
              </tr>
            ) : (
              filteredAssignments.map((assignment) => (
                <tr key={assignment._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {assignment.title}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {assignment.description}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {assignment.startup}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {assignment.applicationName}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      assignment.phase === 'Phase 1' ? 'bg-yellow-100 text-yellow-800' :
                      assignment.phase === 'Phase 2' ? 'bg-blue-100 text-blue-800' :
                      assignment.phase === 'Phase 3' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {assignment.phase}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(assignment.deadline)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      assignment.status === 'Ongoing' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : assignment.status === 'Completed' 
                      ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {assignment.status || '-'}
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
export default function ProtectedApplications() {
  return (
   
      <Assignment />
    
  );
}