import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosConfig';
import { useAuthHeaders } from '../../api/authHeaders';
import { Button, Alert } from 'react-bootstrap';

const DeleteApplicationButton = ({ applicationId, onDelete }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);
    const headers = useAuthHeaders();
    const navigate = useNavigate();

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to remove this application? This action cannot be undone.')) return;

        setIsDeleting(true);
        setError(null);

        try {
            await axiosInstance.delete(`/api/applications/${applicationId}`, { headers });

            if (onDelete) onDelete(applicationId);
            else navigate('/applications');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to remove application');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div>
        <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Removing...' : 'Remove Application'}
        </Button>
        {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
        </div>
    );
};

export default DeleteApplicationButton;