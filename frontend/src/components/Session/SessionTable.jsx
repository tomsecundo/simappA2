import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSessionApi } from "../../api/sessionAPI";
import ErrorBanner from "../common/ErrorBanner";

function SessionTable({ sessions, reload, loading }) {
    const { deleteSession } = useSessionApi();
    const [error, setError] = useState("");

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this session?")) return;
        try {
            await deleteSession(id);
            if(reload) reload();
        } catch (err) {
            if (err.response?.status === 401) {
                setError("Unauthorized: please log in again.");
            } else {
                setError("Failed to delete session.");
            }
        }
    };
    
    if (loading) return <p>Loading sessions...</p>;

    return (
        <>
            <div>
                <ErrorBanner message={error} onClose={() => setError("")} />

                {sessions.length === 0 ? (
                    <p>No sessions available.</p>
                ) : (
                    <table className="table table-striped table-bordered">
                    <thead className="table-light">
                        <tr>
                        <th>Application Name</th>
                        <th>Mentor First Name</th>
                        <th>Mentor Last Name</th>
                        <th>Session Date</th>
                        <th style={{ width: "150px" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.map((p) => (
                        <tr key={p.id}>
                            <td>{p.applicationName}</td>
                            <td>{p.mentorfirstName}</td>
                            <td>{p.mentorlastName}</td>
                            <td>
                            {new Date(p.sessionDate).toLocaleDateString()}
                            </td>
                            <td>
                            <Link
                                to={`/sessions/${p.id}/edit`}
                                className="btn btn-sm btn-warning me-2"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(p.id)}
                                className="btn btn-sm btn-danger"
                            >
                                Delete
                            </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                )}
            </div>
        </>
    );
}
export default SessionTable;
