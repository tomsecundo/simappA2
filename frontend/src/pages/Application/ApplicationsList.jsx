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
            <ErrorBanner message={error} onClose={() => setError('')} />
                
            <h2>Applications</h2>
            <Link to="/applications/new" className="btn btn-primary my-3">New Application</Link>
            <ApplicationTable applications={applications} onView={(id) => navigate(`/applications/${id}`)} />
        </div>
    );
}

export default ApplicationsList;
