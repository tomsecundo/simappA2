import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useApplicationApi } from '../../api/applicationApi';
import { Alert } from 'react-bootstrap';
import { useState } from 'react';

const DeleteApplicationButton = ({ applicationId, className, onDelete }) => {
    const { deleteApplication } = useApplicationApi();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const mutation = useMutation({
        mutationFn: () => deleteApplication(applicationId),
        onSuccess: () => {
            queryClient.invalidateQueries(['applications']);
            if (onDelete) {
                onDelete(applicationId);
            } else {
                navigate('/applications');
            }
        },
        onError: (err) => {
            setError(err.response?.data?.message || 'Failed to remove application');
        }
    });

    const handleDelete = () => {
        if (!window.confirm('Are you sure you want to remove this application? This action cannot be undone.')) return;
        setError(null);
        mutation.mutate();
    };

    return (
        <div>
            {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
            <button 
                onClick={handleDelete} 
                disabled={mutation.isLoading}
                className={className}
            >
                {mutation.isLoading ? 'Removing...' : 'Remove'}
            </button>
        </div>
    );
};

export default DeleteApplicationButton;