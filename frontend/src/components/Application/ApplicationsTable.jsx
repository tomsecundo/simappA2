import { useState } from 'react';
import DeleteApplicationButton from './DeleteApplicationButton';

function ApplicationsTable({ applications = [], onView }) {
    const [statusFilter, setStatusFilter] = useState('All');

    if (!applications.length) {
        return (
            <div className="text-center py-6 text-gray-500">
                No applications found.
            </div>
        );
    }

    const filteredApplications =
        statusFilter === 'All'
            ? applications
            : applications.filter((app) => app.status === statusFilter);

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Header with filter */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Applications</h2>
                <div className="flex items-center">
                    <label htmlFor="statusFilter" className="mr-2 text-sm">
                        Filter by Status:
                    </label>
                    <select
                        id="statusFilter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="p-2 border rounded"
                    >
                        <option value="All">All</option>
                        <option value="Pending">Pending</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Applications Table */}
            <div className="overflow-x-auto bg-white shadow-md rounded">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Startup</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Program</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Submitted By</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Date Submitted</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredApplications.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-4 py-6 text-center text-sm text-gray-500">
                                    No applications match the selected filter
                                </td>
                            </tr>
                        ) : (
                            filteredApplications.map((app) => (
                                <tr key={app._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{app.startupName}</td>
                                    <td className="px-4 py-4 text-sm text-gray-500">{app.program?.title || 'n/a'}</td>
                                    <td className="px-4 py-4 text-sm">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                app.status === 'Pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : app.status === 'Under Review'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : app.status === 'Accepted'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-500">{app.createdBy?.name || ''}</td>
                                    <td className="px-4 py-4 text-sm text-gray-500">
                                        {new Date(app.submissionDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-4 text-sm flex gap-2">
                                        {/* View */}
                                        <button
                                            type="button"
                                            onClick={() => onView(app._id)}
                                            className="px-3 py-1 bg-blue-500 hover:bg-blue-700 text-white rounded text-xs"
                                        >
                                            View
                                        </button>

                                        {/* Edit */}
                                        {['Pending', 'Under Review'].includes(app.status) && (
                                            <a
                                                href={`/applications/${app._id}/edit`}
                                                className="px-3 py-1 bg-yellow-500 hover:bg-yellow-700 text-white rounded text-xs"
                                            >
                                                Edit
                                            </a>
                                        )}

                                        {/* Delete */}
                                        <DeleteApplicationButton
                                            applicationId={app._id}
                                            className="px-3 py-1 bg-red-500 hover:bg-red-700 text-white rounded text-xs"
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ApplicationsTable;
