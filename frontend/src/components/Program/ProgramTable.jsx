import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useProgramsHook } from "../../hooks/programHook";

function ProgramTable({ programs }) {
  const { deleteProgram } = useProgramsHook();
  const [error, setError] = useState("");

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this program?")) return;
    try {
      await deleteProgram.mutateAsync(id);
    } catch (err) {
      setError("Failed to delete program.");
    }
  };

  if (!programs.length) return <p>No programs available.</p>;

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded">
      {error && <p className="text-red-500 p-2">{error}</p>}
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-left">Program Duration</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {programs.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{p.title}</td>
              <td className="px-4 py-2">
                {new Date(p.startDate).toLocaleDateString()} –{" "}
                {new Date(p.endDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 space-x-2">
                {/* ✅ View button */}
                <Link
                  to={`/programs/${p.id}`}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
                >
                  View
                </Link>

                <Link
                  to={`/programs/${p.id}/edit`}
                  className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(p.id)}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProgramTable;
