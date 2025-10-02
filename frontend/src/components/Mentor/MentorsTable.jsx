import { useMentorsHook } from '../../hooks/mentorHook';

function MentorsTable({ mentors, onUpdate }) {
  const { deleteMentor } = useMentorsHook();

  if (!mentors.length) {
    return <p className="text-gray-500">No mentors available.</p>;
  }

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this mentor?')) return;
    deleteMentor.mutate(id);
  };

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Expertise</th>
            <th className="px-4 py-2 text-left">Affiliation</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {mentors.map((m) => (
            <tr key={m._id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{`${m.firstName || ''} ${m.lastName || ''}`}</td>
              <td className="px-4 py-2">{m.email}</td>
              <td className="px-4 py-2">{m.expertise || '-'}</td>
              <td className="px-4 py-2">{m.affiliation || '-'}</td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => onUpdate(m)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(m._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
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

export default MentorsTable;
