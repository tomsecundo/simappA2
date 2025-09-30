import { Link } from 'react-router-dom';
import { ApplicationStatus } from '../../constants/ApplicationStatus';
import DeleteApplicationButton from './DeleteApplicationButton';

function ApplicationsTable({ applications = [], onView }) {
    if (!applications.length) return <p>No applications found.</p>;

    return (
        <>
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                        <th scope="col">Startup</th>
                        <th scope="col">Program</th>
                        <th scope="col">Status</th>
                        <th scope="col">Submitted By</th>
                        <th scope="col">Date Submitted</th>
                        <th scope="col">Actions</th>
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
                                    type='button'
                                    onClick={() => onView(app._id)} 
                                    className="btn btn-sm btn-info"
                                >
                                    View
                                </button>
                                {[ApplicationStatus.PENDING, ApplicationStatus.UNDER_REVIEW].includes(app.status) && (
                                    <Link to={`/applications/${app._id}/edit`} 
                                    type='button' className="btn btn-sm btn-warning ms-2">
                                        Edit
                                    </Link>
                                )}
                                <DeleteApplicationButton 
                                    applicationId={app._id} 
                                    className="btn btn-sm btn-danger ms-2" 
                                />
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default ApplicationsTable;
