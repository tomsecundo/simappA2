import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApplicationsHook } from '../../hooks/applicationHook';
import { ApplicationStatus } from '../../constants/ApplicationStatus';
import ErrorBanner from '../../components/common/ErrorBanner';

function ApplicationDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const { useApplication, updateStatus, deleteApplication } = useApplicationsHook();
    const { data: application, isLoading, isError } = useApplication(id);

    const handleStatusChange = (newStatus) => {
        if (!id) return;
        updateStatus.mutate({ id, status: newStatus });
    };

    const handleDelete = () => {
        if (!window.confirm('Are you sure you want to remove this application?')) return;
        setError(null);

        deleteApplication.mutate(id, {
            onSuccess: () => navigate('/applications'),
            onError: (error) => {
                setError(error.response?.data?.message || 'Failed to remove application');
            }
        });
    };

    if (isLoading) return <div className="text-center py-10">Loading application...</div>;
    if (isError || !application) return <ErrorBanner message="Failed to load application details" />;

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={() => navigate('/applications')}
                className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
                Back to Applications
            </button>

            <h1 className="text-2xl font-bold mb-6">Application Details</h1>

            <div className="bg-white shadow-md rounded p-6 mb-6">
                <p><strong>Startup:</strong> {application.startupName}</p>
                <p><strong>Program Applied:</strong> {application.programApplied}</p>
                <p><strong>Email:</strong> {application.applicationEmail}</p>
                <p><strong>Phone:</strong> {application.applicationPhone}</p>
                <p>
                    <strong>Status:</strong>
                    <span
                        className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            application.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : application.status === 'Under Review'
                                ? 'bg-blue-100 text-blue-800'
                                : application.status === 'Accepted'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                        }`}
                    >
                        {application.status}
                    </span>
                </p>
                <p><strong>Description:</strong> {application.description}</p>
            </div>

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
                            }`}
                        >
                            {updateStatus.isLoading && updateStatus.variables?.status === status ? 'Updating...' : status}
                        </button>
                    ))}
                </div>
                {updateStatus.isError && (
                    <div className="text-red-600 text-sm mt-2">Failed to update status</div>
                )}
            </div>

            <div className="border-t pt-4 mt-6">
                <h2 className="text-xl font-semibold text-red-600 mb-3">Remove Application</h2>
                <button
                    onClick={handleDelete}
                    disabled={deleteApplication.isLoading}
                    className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded"
                >
                    {deleteApplication.isLoading ? 'Removing...' : 'Remove'}
                </button>
                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            </div>
        </div>
    );
}

export default ApplicationDetail;
