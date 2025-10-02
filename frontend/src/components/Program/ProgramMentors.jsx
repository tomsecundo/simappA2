import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useProgramsHook } from "../../hooks/programHook";
import { useMentorsHook } from "../../hooks/mentorHook";

const ProgramMentors = ({ programId, mentors }) => {
  const { user } = useAuth();
  const {
    enrollAsMentor,
    leaveProgram,
    addProgramToMentor,
    removeProgramFromMentor,
  } = useProgramsHook();
  const { mentorsQuery } = useMentorsHook();
  const [selectedMentor, setSelectedMentor] = useState("");

  // Mentor self actions
  if (user?.role === "Mentor") {
    return (
      <div className="bg-white shadow p-4 rounded">
        <div className="flex gap-2">
          <button
            onClick={() => enrollAsMentor.mutate(programId)}
            className="px-6 py-2 bg-blue-500 text-white rounded"
          >
            Apply as Mentor
          </button>
          <button
            onClick={() => leaveProgram.mutate(programId)}
            className="px-6 py-2 bg-red-500 text-white rounded"
          >
            Leave Program
          </button>
        </div>
      </div>
    );
  }

  // Admin actions
  if (user?.role === "Admin") {
    return (
      <div className="bg-white shadow p-4 rounded">
        <h3 className="font-bold mb-3">Assigned Mentors</h3>
        <div className="flex gap-2 mb-3">
          <select
            value={selectedMentor}
            onChange={(e) => setSelectedMentor(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">-- Select Mentor --</option>
            {mentorsQuery?.data?.map((m) => (
              <option key={m._id} value={m._id}>
                {m.firstName} {m.lastName}
              </option>
            ))}
          </select>
          <button
            onClick={() =>
              addProgramToMentor.mutate({ mentorId: selectedMentor, programId })
            }
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Add
          </button>
        </div>

        <ul className="divide-y">
          {mentors?.length ? (
            mentors.map((m) => (
              <li
                key={m._id}
                className="flex justify-between items-center py-2"
              >
                <span>
                  {m.firstName} {m.lastName}
                </span>
                <button
                  onClick={() =>
                    removeProgramFromMentor.mutate({ mentorId: m._id, programId })
                  }
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                >
                  Remove
                </button>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No mentors assigned yet.</p>
          )}
        </ul>
      </div>
    );
  }

  return null;
};

export default ProgramMentors;
