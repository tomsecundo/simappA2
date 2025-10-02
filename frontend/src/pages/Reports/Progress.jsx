// src/pages/Progress.jsx
import { useState, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../services/axiosConfig';

const Progress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const role = user.role;
  const [selectedPhase, setSelectedPhase] = useState('phase1');
  const [selectedStatus, setSelectedStatus] = useState('Completed');

  // Fetch progress
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        let response;
  
        if (role === "Admin") {
          // Admin fetches all progress
          response = await axiosInstance.get('/api/progress', {
            headers: { Authorization: `Bearer ${user.token}` }
          });
        } 
        else if (role === "Mentor") {
          response = await axiosInstance.get(`/api/progress/mentor/${user.email}`, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
        } 
        else if (role === "Startup") {
          // Step 1: Fetch the startup's application document
          const appResponse = await axiosInstance.get(
            `/api/applications/user/${user.id}`, 
            { headers: { Authorization: `Bearer ${user.token}` } }
          );
  
          const application = appResponse.data[0];
          console.log(application);
          if (!application) {
            setError('No application found for this user.');
            setLoading(false);
            return;
          }
  
          const applicationId = application.applicationId; // Use the "applicationId" field
          console.log("Application ID:", applicationId);
  
          // Step 2: Fetch progress using applicationId
          response = await axiosInstance.get(
            `/api/progress/${applicationId}`, 
            { headers: { Authorization: `Bearer ${user.token}` } }
          );
        }
  
        setProgress(response.data);
        setLoading(false);
  
      } catch (err) {
        setError(err.response?.data?.message || err.message + ': Failed to fetch progress');
        setLoading(false);
      }
    };
  
    if (user) fetchProgress();
  }, [user, role]);


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
  
  // Update phase status
  const updatePhaseStatus = async (applicationId) => {
    try {
      const newStatus = selectedStatus; // For simplicity, button always sets Completed
      await axiosInstance.put(
        `/api/progress/${applicationId}/update-phase`,
        { phase: selectedPhase, status: newStatus },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      // Update local state
      setProgress(prev =>
        prev.map(p =>
          p.applicationId === applicationId ? { ...p, [selectedPhase]: newStatus } : p
        )
      );

    } catch (err) {
      console.error('Failed to update phase', err);
      alert('Failed to update phase. Please try again.');
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
        <div className="space-y-4">
          {progress.length > 0 ? (
            progress.map((item, index) => (
              <div key={index} className="mb-4">
                <p className="font-semibold mb-2">Application ID: {item.applicationId}</p>

                {/* 4-phase progress bar */}
                <div className="flex w-full">
                  <div className={`flex-1 h-6 mx-1 rounded-lg ${getPhaseClass(item.phase1)}`}>
                    <span className="text-white text-center block py-1">Phase 1</span>
                  </div>
                  <div className={`flex-1 h-6 mx-1 rounded-lg ${getPhaseClass(item.phase2)}`}>
                    <span className="text-white text-center block py-1">Phase 2</span>
                  </div>
                  <div className={`flex-1 h-6 mx-1 rounded-lg ${getPhaseClass(item.phase3)}`}>
                    <span className="text-white text-center block py-1">Phase 3</span>
                  </div>
                  <div className={`flex-1 h-6 mx-1 rounded-lg ${getPhaseClass(item.phase4)}`}>
                    <span className="text-white text-center block py-1">Phase 4</span>
                  </div>
                </div>

                {/* Optional details below the progress bar */}
                <div className="mt-2">
                  <p>Mentor: {item.mentorEmail}</p>
                  <p>Startup Name: {item.startupName}</p>
                </div>

                {/* Only show mentor controls */}
                {role === 'Mentor' && (
                  <div className=" bottom-4 right-4 flex items-center space-x-2">
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      value={selectedPhase}
                      onChange={(e) => setSelectedPhase(e.target.value)}
                    >
                      <option value="phase1">Phase 1</option>
                      <option value="phase2">Phase 2</option>
                      <option value="phase3">Phase 3</option>
                      <option value="phase4">Phase 4</option>
                    </select>
             
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="Started">Started</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                      onClick={() => updatePhaseStatus(item.applicationId)}
                    >
                      Update Phase
                    </button>
                  </div>
                )}

              </div>
            ))
          ) : (
            <div>No progress data available</div>
          )}
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