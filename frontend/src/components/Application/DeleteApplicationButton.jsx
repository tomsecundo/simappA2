import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplicationsHook } from '../../hooks/useApplicationsHook';

const DeleteApplicationButton = ({ applicationId, className, onDelete }) => {
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
        <>
            <button 
                type='button'
                onClick={handleDelete} 
                disabled={deleteApplication.isLoading}
                className={className || 'btn btn-sm btn-danger'}
            >
                {deleteApplication.isLoading ? 'Removing...' : 'Remove'}
            </button>
            { error ? <div className='text-danger small mt-1'>{{error}}</div> : null }
        </>
    );
};

export default DeleteApplicationButton;