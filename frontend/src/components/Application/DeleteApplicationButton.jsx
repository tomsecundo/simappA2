import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplicationsHook } from '../../hooks/applicationHook';

const DeleteApplicationButton = ({ applicationId, className }) => {
    const navigate = useNavigate();
    const { deleteApplication } = useApplicationsHook();
    const [error, setError] = useState(null);

    const handleDelete = () => {
        if (!window.confirm('Are you sure you want to remove this application? This action cannot be undone.')) return;
        setError(null);

        deleteApplication.mutate(applicationId, {
            onSuccess: () => navigate('/applications'),
            onError: (error) => {
                setError(error.response?.data?.message || 'Failed to remove application');
            }
        });
    };

    return (
        <div className="inline-block">
            <button
                type="button"
                onClick={handleDelete}
                disabled={deleteApplication.isLoading}
                className={
                    className ||
                    'px-3 py-1 bg-red-500 hover:bg-red-700 text-white rounded text-xs'
                }
            >
                {deleteApplication.isLoading ? 'Removing...' : 'Remove'}
            </button>
            {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
        </div>
    );
};

export default DeleteApplicationButton;
