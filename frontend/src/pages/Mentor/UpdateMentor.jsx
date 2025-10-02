// pages/Mentor/UpdateMentor.jsx
import { useParams, useNavigate } from 'react-router-dom';
import RequireRole from '../../components/RequireRole';
import { UserRole } from '../../constants/UserRole';
import UpdateMentorForm from '../../components/Mentor/UpdateMentorForm';

const UpdateMentor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <UpdateMentorForm mentorId={id} onUpdated={() => navigate('/mentor')} />
  );
};

export default function ProtectedUpdateMentor() {
  return (
    <RequireRole allowedRoles={[UserRole.ADMIN]}>
      <UpdateMentor />
    </RequireRole>
  );
}
