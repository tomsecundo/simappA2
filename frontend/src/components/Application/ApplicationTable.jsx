import { Link } from 'react-router-dom';
import { ApplicationStatus } from '../../constants/ApplicationStatus';

function ApplicationTable({ applications, onView }) {
    if (!applications.length) return <p>No applications found.</p>;

    return (
        <table className="table table-stripedf">
            <thead>
                <tr>
                <th>Startup</th>
                <th>Program</th>
                <th>Status</th>
                <th>Submitted By</th>
                <th>Date Submitted</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {applications.map((app) => (
                <tr key={app._id}>
                    <td>{app.startupName}</td>
                    <td>{app.program?.title || "n/a"}</td>
                    <td>{app.status}</td>
                    <td>{app.createdBy?.name || "" }</td>
                    <td>{app.submissionDate}</td>
                    <td>
                        <button 
                            onClick={() => onView(app._id)} 
                            className="btn btn-sm btn-info"
                        >
                            View
                        </button>
                        {[ApplicationStatus.PENDING, ApplicationStatus.UNDER_REVIEW].includes(app.status) && (
                            <Link
                                to={`/applications/${app._id}/edit`}
                                className="btn btn-sm btn-warning ms-2"
                            >
                                Edit
                            </Link>
                        )}
                    </td>
                </tr>
                ))}
            </tbody>
        </table>
    );
}

export default ApplicationTable;
