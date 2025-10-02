import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProgramsHook } from '../../hooks/programHook';

const ProgramDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const {
    useProgram,
    enrollAsMentor,
    leaveProgram,
    useProgramApplications,
    acceptApplication,
  } = useProgramsHook();

  const { data: program, isLoading } = useProgram(id);
  const { data: applications } = useProgramApplications(id);

  if (isLoading) return <p>Loading...</p>;

  const handleAccept = (appId) => {
    acceptApplication.mutate({ applicationId: appId, programId: id });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{program?.title}</h1>
      <p className="mb-4">{program?.description}</p>

      {/* Mentor self enroll/leave */}
      {user?.role === 'Mentor' && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => enrollAsMentor.mutate(id)}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Enroll
          </button>
          <button
            onClick={() => leaveProgram.mutate(id)}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Leave
          </button>
        </div>
      )}

      {/* Applications list */}
      <div className="bg-white p-4 shadow rounded">
        <h3 className="font-bold mb-2">Startup Applications</h3>
        {applications?.length ? (
          <ul className="divide-y">
            {applications.map((app) => (
              <li key={app._id} className="flex justify-between py-2">
                <span>{app.startupName}</span>
                {(user.role === 'Admin' || user.role === 'Mentor') && (
                  <button
                    onClick={() => handleAccept(app._id)}
                    className="px-3 py-1 bg-green-500 text-white rounded"
                  >
                    Accept
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No applications yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProgramDetail;
