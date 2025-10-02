import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAvailabilityApi } from "../../api/availabilityAPI";
import ErrorBanner from "../common/ErrorBanner";

function AvailabilityTable({ availability, reload, loading }) {
    const { deleteAvailability } = useAvailabilityApi();
    const [error, setError] = useState("");

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this availability?")) return;
        try {
            await deleteAvailability(id);
            if(reload) reload();
        } catch (err) {
            if (err.response?.status === 401) {
                setError("Unauthorized: please log in again.");
            } else {
                setError("Failed to delete availability.");
            }
        }
    };
    
    if (loading) return <p>Loading availability...</p>;

    return (
        <>
            <div>
                <ErrorBanner message={error} onClose={() => setError("")} />

                {availability.length === 0 ? (
                    <p>No availability available.</p>
                ) : (
                    <table className="table table-striped table-bordered">
                    <thead className="table-light">
                        <tr>
                        <th>Dates</th>
                        <th style={{ width: "150px" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {availability.map((p) => (
                        <tr key={p.id}>
                            <td>
                            {new Date(p.startDate).toLocaleDateString()} –{" "}
                            {new Date(p.endDate).toLocaleDateString()}
                            </td>
                            <td>
                            <Link
                                to={`/availabilitylist/${p.id}/edit`}
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
export default AvailabilityTable;
