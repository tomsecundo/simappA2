// src/pages/Reports.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../services/axiosConfig';

const Reports = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Fetch reports
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axiosInstance.get('/api/reports', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setReports(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch reports');
         
        setLoading(false);
      }
    };
    
    
    fetchReport();
  }, [user]);
  
  // Handle view reports details
  const handleViewReports = (id) => {
    navigate(`/reports/${id}`);
  };
  
  // Filter reports by status
  const filteredReports = statusFilter === 'All' 
    ? reports 
    : reports.filter(app => app.status === statusFilter);
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  if (loading) return <div className="text-center py-10">Loading reports...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  
  return (
    <div className="container-fluid mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reports</h1>
        
        <div className="flex items-center">
        <button
        onClick={() => navigate('/reports/new')}
        className="text-white bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded mr-4" // Added mr-4 for spacing
      >
        New Report
      </button>
          <label htmlFor="statusFilter" className="mr-2">Filter by Status:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="All">All Reports</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Submitted</option>
            <option value="Accepted">Reviewed</option>
            <option value="Rejected">Complete</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto bg-white shadow-md rounded">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Startup Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Mentor
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Program
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Submission Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Phase
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Remarks
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredReports.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center text-sm text-gray-500">
                  No reports found
                </td>
              </tr>
            ) : (
              filteredReports.map((reports) => (
                <tr key={reports._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {reports.startupName}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {reports.mentorEmail}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reports.programApplied}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(reports.submissionDate)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reports.phase}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      reports.remarks === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      reports.remarks === 'Under Review' ? 'bg-blue-100 text-blue-800' :
                      reports.remarks === 'Complete' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {reports.remarks}
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
   
      <Reports />
    
  );
}