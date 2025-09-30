import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApplicationsHook } from '../../hooks/useApplicationsHook';
import { ApplicationStatus } from '../../constants/ApplicationStatus';
import ErrorBanner from '../../components/common/ErrorBanner';

function ApplicationDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const { useApplication, updateStatus, deleteApplication } = useApplicationsHook();

    const { data: application, isLoading, isError } = useApplication(id);

    // Handlers
    const handleStatusChange = (newStatus) => {
        if (!id) return;
        updateStatus.mutate({ id, status: newStatus });
    };
    
    const handleDelete = () => {
        if (!window.confirm('Are you sure you want to remove this application? This action cannot be undone.')) return;

        setError(null);

        deleteApplication.mutate(id, {
            onSuccess: () => navigate('/applications'),
            onError: (error) => {
                setError(error.response?.data?.message || 'Failed to remove application');
            }
        });
    }

    if (isLoading) return <p>Loading application...</p>;
    if (isError || !application) return <ErrorBanner message="Failed to load application details" />;

    return (
        <div className="p-6">
            <button
                onClick={() => navigate('/applications')}
                className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
                Back to Applications
            </button>

            <h1 className="text-2xl font-bold mb-4">Application Details</h1>

            <div className="bg-white shadow-md rounded p-6 mb-6">
                <p><strong>Startup:</strong> {application.startupName}</p>
                <p><strong>Program Applied:</strong> {application.programApplied}</p>
                <p><strong>Email:</strong> {application.applicationEmail}</p>
                <p><strong>Phone:</strong> {application.applicationPhone}</p>
                <p><strong>Status:</strong> {application.status}</p>
                <p><strong>Description:</strong> {application.description}</p>
            </div>

            {/* Status Update Section */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Update Application Status</h2>
                <div className="flex flex-wrap gap-2">
                    {Object.values(ApplicationStatus).map((status) => (
                        <button
                            key={status}
                            onClick={() => handleStatusChange(status)}
                            disabled={updateStatus.isLoading || application.status === status}
                            className={`px-4 py-2 rounded ${
                                application.status === status
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                }`
                            }
                        >
                            {updateStatus.isLoading && updateStatus.variables?.status === status ? 'Updating...' : status}
                        </button>
                    ))}
                </div>
                {updateStatus.isError && (
                    <div className="text-red-600 text-sm mt-2">
                        Failed to update status
                    </div>
                )}
            </div>
            <div className="border-top pt-3 mt-4">
                <h2 className="text-xl text-danger font-semibold mb-3">Remove Application</h2>
                <button 
                    onClick={handleDelete} 
                    disabled={deleteApplication.isLoading}
                    className="btn btn-danger"
                >
                    { deleteApplication.isLoading ? 'Removing...' : 'Remove' }
                </button>
                { error ? <div className='text-danger small mt-1'>{{error}}</div> : null }
            </div>
        </div>
    );
}

export default ApplicationDetail;
