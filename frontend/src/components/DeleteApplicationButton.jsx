import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import { Button, Alert } from 'react-bootstrap';

const DeleteApplicationButton = ({ applicationId, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to remove this application? This action cannot be undone.')) return;

    setIsDeleting(true);
    setError(null);

    try {
      await axiosInstance.delete(`/api/applications/${applicationId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

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