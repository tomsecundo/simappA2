import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProgramsHook } from "../../hooks/programHook";
import { useAuth } from "../../context/AuthContext";

const ProgramApplications = ({ programId }) => {
    const { user } = useAuth();
    const { useProgramApplications, acceptApplication } = useProgramsHook();
    const { data: applications, isLoading } = useProgramApplications(programId);
    const navigate = useNavigate();

    const [statusFilter, setStatusFilter] = useState("All");

    if (isLoading) return <p>Loading applications...</p>;

    const handleStatusChange = (appId, status) => {
        acceptApplication.mutate({ applicationId: appId, programId, status });
    };

    const normalize = Array.isArray(applications) ? applications : [];
    const filtered = statusFilter === "All" ? normalize : normalize?.filter((app) => app.status === statusFilter);

    return (
        <div className="">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Startup Applications</h3>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="p-2 border rounded text-sm"
                >
                    <option value="All">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                    <tr>
                    <th className="px-4 py-2 text-left">Startup</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {filtered?.length ? (
                        filtered.map((app) => (
                            <tr key={app._id} className="hover:bg-gray-50">
                            <td className="px-4 py-2">{app.startupName}</td>
                            <td className="px-4 py-2">{app.status}</td>
                            <td className="px-4 py-2 space-x-2">
                                <button
                                onClick={() => navigate(`/applications/${app._id}`)}
                                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                                >
                                View
                                </button>
                                {user?.role !== "Startup" && (
                                <>
                                    {app.status !== "Accepted" && (
                                    <button
                                        onClick={() => handleStatusChange(app._id, "Accepted")}
                                        className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                                    >
                                        Accept
                                    </button>
                                    )}
                                    {app.status !== "Rejected" && (
                                    <button
                                        onClick={() => handleStatusChange(app._id, "Rejected")}
                                        className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                                    >
                                        Reject
                                    </button>
                                    )}
                                </>
                                )}
                            </td>
                            </tr>
                        ))
                    ) : (
                    <tr>
                        <td colSpan="3" className="text-center py-4 text-gray-500">
                            No applications found.
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProgramApplications;
