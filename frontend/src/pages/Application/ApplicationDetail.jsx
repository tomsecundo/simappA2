import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useApplicationApi } from '../../api/applicationApi';
import ErrorBanner from '../../components/common/ErrorBanner';
import DeleteApplicationButton from '../../components/Application/DeleteApplicationButton';

function ApplicationDetail() {
    const { id } = useParams();
    const { getApplicationById, updateApplicationStatus } = useApplicationApi();
    const [application, setApplication] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        getApplicationById(id).then(setApplication).catch(() => setError('Failed to load application'));
    }, [id, getApplicationById]);

    const handleStatusChange = async (status) => {
        try {
        const updated = await updateApplicationStatus(id, status);
        setApplication(updated);
        } catch {
        setError('Failed to update application');
        }
    };

    if (!application) return <p>Loading...</p>;

    return (
        <div className="p-4">
        <h2>Application Detail</h2>
        <ErrorBanner message={error} onClose={() => setError('')} />
        <p><strong>Startup:</strong> {application.startupName}</p>
        <p><strong>Status:</strong> {application.status}</p>
        <button onClick={() => handleStatusChange('approved')} className="btn btn-success me-2">Approve</button>
        <button onClick={() => handleStatusChange('rejected')} className="btn btn-danger">Reject</button>
        <DeleteApplicationButton id={id} />
        </div>
    );
}

export default ApplicationDetail;
