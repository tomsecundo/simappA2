import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useProgramApi } from "../../api/programApi";
import ErrorBanner from "../common/ErrorBanner";

function ProgramTable({ programs, reload, loading }) {
    const { deleteProgram } = useProgramApi();
    const [error, setError] = useState("");

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this program?")) return;
        try {
            await deleteProgram(id);
            if(reload) reload();
        } catch (err) {
            if (err.response?.status === 401) {
                setError("Unauthorized: please log in again.");
            } else {
                setError("Failed to delete program.");
            }
        }
    };
    
    if (loading) return <p>Loading programs...</p>;

    return (
        <>
            <div>
                <ErrorBanner message={error} onClose={() => setError("")} />

                {programs.length === 0 ? (
                    <p>No programs available.</p>
                ) : (
                    <table className="table table-striped table-bordered">
                    <thead className="table-light">
                        <tr>
                        <th>Title</th>
                        <th>Dates</th>
                        <th style={{ width: "150px" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {programs.map((p) => (
                        <tr key={p.id}>
                            <td>{p.title}</td>
                            <td>
                            {new Date(p.startDate).toLocaleDateString()} –{" "}
                            {new Date(p.endDate).toLocaleDateString()}
                            </td>
                            <td>
                            <Link
                                to={`/programs/${p.id}/edit`}
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
export default ProgramTable;
