import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useProgramsHook } from "../../hooks/programHook";
import { useMentorsHook } from "../../hooks/mentorHook";
import { useState } from "react";
import { UserRole } from "../../constants/UserRole";

const ProgramDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const {
        useProgram,
        enrollAsMentor,
        leaveProgram,
        useProgramApplications,
        acceptApplication,
    } = useProgramsHook();
    const { mentorsQuery } = useMentorsHook();

    const { data: program, isLoading } = useProgram(id);
    const { data: applications } = useProgramApplications(id);

    const [statusFilter, setStatusFilter] = useState("All");

    if (isLoading) return <p>Loading...</p>;

    const handleStatusChange = (appId, status) => {
        acceptApplication.mutate({ applicationId: appId, programId: id, status });
    };

    const normalize = Array.isArray(applications) ? applications : [];
    const filteredApplications =
        statusFilter === "All"
        ? normalize
        : normalize?.filter((app) => app.status === statusFilter);

    
    // Check is mentor is currently enrolled in program
    // const isEnrolled = program?.mentors?.some((m) => m._id === user?._id) ?? false;
    const isEnrolled = true;
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">{program?.title}</h1>
            <p className="mb-4">{program?.description}</p>
            {user?.role === UserRole.MENTOR && (
                <div className="flex gap-2 mb-6">
                    {!isEnrolled && (
                        <button
                            onClick={() => enrollAsMentor.mutate(id)}
                            className="px-3 py-1 bg-blue-500 text-white rounded"
                        >
                            Apply as Mentor
                        </button>
                    )}
                    {isEnrolled && (
                        <button
                            onClick={() => leaveProgram.mutate(id)}
                            className="px-3 py-1 bg-red-500 text-white rounded"
                        >
                            Leave
                        </button>
                    )}
                </div>
            )}

            {/* Applications Section */}
            <div className="bg-white p-4 shadow rounded">
                <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Startup Applications</h3>
                <div className="flex items-center gap-2">
                    <label htmlFor="statusFilter" className="text-sm">
                    Filter:
                    </label>
                    <select
                    id="statusFilter"
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
                </div>

                <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 text-left">Startup</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Submitted</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {filteredApplications?.length ? (
                        filteredApplications.map((app) => (
                        <tr key={app._id} className="hover:bg-gray-50">
                            <td className="px-4 py-2">{app.startupName}</td>
                            <td className="px-4 py-2">{app.status}</td>
                            <td className="px-4 py-2">
                            {new Date(app.submissionDate).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-2 space-x-2">
                            {/* View */}
                            <button
                                onClick={() => navigate(`/applications/${app._id}`)}
                                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
                            >
                                View
                            </button>

                            {/* Accept */}
                            {app.status !== "Accepted" && (
                                <button
                                onClick={() => handleStatusChange(app._id, "Accepted")}
                                className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
                                >
                                Accept
                                </button>
                            )}

                            {/* Reject */}
                            {app.status !== "Rejected" && (
                                <button
                                onClick={() => handleStatusChange(app._id, "Rejected")}
                                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                                >
                                Reject
                                </button>
                            )}
                            </td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                        <td colSpan="4" className="text-center py-4 text-gray-500">
                            No applications match this filter
                        </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    );
};

export default ProgramDetail;
