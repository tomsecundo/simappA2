import { Link, useNavigate } from 'react-router-dom';
import { useApplications } from '../../hooks/useApplications';
import ApplicationTable from '../../components/Application/ApplicationTable';
import ErrorBanner from '../../components/common/ErrorBanner';

function ApplicationsList() {
    const { applications, loading, error, setError } = useApplications();
    const navigate = useNavigate();

    if (loading) return <p>Loading applications...</p>;

    return (
        <div className="p-4">
            <h2>Applications</h2>
            <ErrorBanner message={error} onClose={() => setError('')} />
            <ApplicationTable applications={applications} onView={(id) => navigate(`/applications/${id}`)} />
            <Link to="/applications/new" className="btn btn-primary mt-3">New Application</Link>
        </div>
    );
}

export default ApplicationsList;
