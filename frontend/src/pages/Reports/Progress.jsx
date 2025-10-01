// src/pages/Progress.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../services/axiosConfig';

const Progress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const role = user.role;

  // Fetch progress
  useEffect(() => {
    const fetchProgress = async (res, req) => {
      try {
        
        //const { id } = req.params;
        const response = await axiosInstance.get('/api/progress', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        
        setProgress(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message + ': Failed to fetch progress');
         
        setLoading(false);
      }
    };
    
    
    fetchProgress();
  }, [user]);

  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

   // Phase Color Logic
   const getPhaseClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500';
      case 'Ongoing':
        return 'bg-yellow-500';
      case 'Not Started':
        return 'bg-gray-300';
      default:
        return 'bg-gray-300';
    }
  };
  
  if (loading) return <div className="text-center py-10">Loading progress...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  


  return (
    <div className="container-fluid mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Startup Progress</h1>
      
      </div>
      
      <div className="overflow-x-auto bg-white shadow-md rounded">
        
        {/* Progress Bar */}
        <div className="w-full flex mb-4">
          {progress.length > 0 ? (
            progress.map((progress) => (
              <div
               
                className={`flex-1 h-6 mx-1 rounded-lg ${getPhaseClass(progress.phase1)}`}
              >
                <span className="text-white text-center block py-1">{"Phase 1"}</span>
              </div>
              
            ))
          ) : (
            <div>No progress data available</div>
          )}
          {progress.length > 0 ? (
            progress.map((progress) => (
              <div
               
                className={`flex-1 h-6 mx-1 rounded-lg ${getPhaseClass(progress.phase2)}`}
              >
                <span className="text-white text-center block py-1">{"Phase 2"}</span>
              </div>
              
            ))
          ) : (
            <div>No progress data available</div>
          )}
          {progress.length > 0 ? (
            progress.map((progress) => (
              <div
               
                className={`flex-1 h-6 mx-1 rounded-lg ${getPhaseClass(progress.phase3)}`}
              >
                <span className="text-white text-center block py-1">{"Phase 3"}</span>
              </div>
              
            ))
          ) : (
            <div>No progress data available</div>
          )}
          {progress.length > 0 ? (
            progress.map((progress) => (
              <div
               
                className={`flex-1 h-6 mx-1 rounded-lg ${getPhaseClass(progress.phase4)}`}
              >
                <span className="text-white text-center block py-1">{"Phase 4"}</span>
              </div>
              
            ))
          ) : (
            <div>No progress data available</div>
          )}
        </div>

        {/* Optional: Showing progress data below */}
        <div className="space-y-4">
          {progress.map((progress) => (
            <div>
              <p>Application ID: {progress.applicationId}</p>
              <p>Mentor: {progress.mentorEmail}</p>
              <p>Startup Name: {progress.startupName}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Export with authentication protection
export default function ProtectedApplications() {
  return (
   
      <Progress />
    
  );
}