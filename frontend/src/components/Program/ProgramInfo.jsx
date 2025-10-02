// components/Program/ProgramInfo.jsx
const ProgramInfo = ({ program }) => {
  if (!program) return null;

  return (
    <div className="bg-white shadow p-6 rounded">
      <h1 className="text-3xl font-bold mb-2">{program.title}</h1>
      <p className="mb-4 text-gray-700">{program.description}</p>

      <div className="text-sm text-gray-600 space-y-1">
        <p>
          <span className="font-semibold">Start Date:</span>{" "}
          {program.startDate
            ? new Date(program.startDate).toLocaleDateString()
            : "N/A"}
        </p>
        <p>
          <span className="font-semibold">End Date:</span>{" "}
          {program.endDate
            ? new Date(program.endDate).toLocaleDateString()
            : "N/A"}
        </p>
        {program.createdBy && (
          <p>
            <span className="font-semibold">Created By:</span>{" "}
            {program.createdBy.name || program.createdBy.email}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProgramInfo;
