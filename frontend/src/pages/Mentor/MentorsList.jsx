import { Link, useNavigate } from 'react-router-dom';
import { useMentorsHook } from '../../hooks/mentorHook';
import MentorsTable from '../../components/Mentor/MentorsTable';

function MentorsList() {
  const { mentorsQuery } = useMentorsHook();
  const navigate = useNavigate();

  if (mentorsQuery.isLoading) return <p>Loading mentors...</p>;
  if (mentorsQuery.isError) return <p className="text-red-500">Failed to load mentors</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2>Mentors</h2>
      </div>
      <MentorsTable mentors={mentorsQuery.data || []} onUpdate={(m) => navigate(`/mentor/update/${m._id}`)} />
    </div>
  );
}

export default MentorsList;
