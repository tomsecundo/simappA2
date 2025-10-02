import { Link, useNavigate } from 'react-router-dom';
import { useApplicationsHook } from '../../hooks/applicationHook';
import ApplicationTable from '../../components/Application/ApplicationsTable';
// import ErrorBanner from '../../components/common/ErrorBanner';

function ApplicationsList() {
    const { applicationsQuery } = useApplicationsHook();
    const { data: applications = [], isLoading, error } = applicationsQuery;
    
    const navigate = useNavigate();

    if (isLoading) return <p>Loading applications...</p>;
    if (error) return <p>Failed to load applications</p>;

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h2>Applications</h2>
                <Link to="/applications/new" className="btn btn-primary my-3">
                    New Application
                </Link>
            </div>
            <ApplicationTable 
                applications={applications} 
                onView={(id) => navigate(`/applications/${id}`)} 
            />
        </div>
    );
}

export default ApplicationsList;
