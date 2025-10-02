// components/Mentor/UpdateMentorForm.jsx
import { useState, useEffect } from 'react';
import { useMentor, useMentorsHook } from '../../hooks/mentorHook';
import { UserRole } from '../../constants/UserRole';

const UpdateMentorForm = ({ mentorId, onUpdated }) => {
  const { data: mentorData, isLoading } = useMentor(mentorId);
  const { updateMentor } = useMentorsHook();

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mentorData) {
      setFormData({
        email: mentorData.email || '',
        role: mentorData.role || UserRole.MENTOR,
        firstName: mentorData.firstName || '',
        lastName: mentorData.lastName || '',
        number: mentorData.number || '',
        expertise: mentorData.expertise || '',
        affiliation: mentorData.affiliation || '',
        address: mentorData.address || '',
      });
    }
  }, [mentorData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    updateMentor.mutate(
      { id: mentorId, data: formData },
      {
        onSuccess: () => {
          alert('Mentor updated successfully!');
          if (onUpdated) onUpdated();
        },
        onError: (err) => {
          alert(err?.response?.data?.message || 'Failed to update mentor');
        },
        onSettled: () => setLoading(false),
      }
    );
  };

  if (isLoading) return <div className="text-center mt-20">Loading mentor...</div>;

  return (
    <div className="max-w-md mx-auto mt-20">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">Update Mentor</h1>

        <input
          type="email"
          value={formData.email || ''}
          className="w-full mb-4 p-2 border rounded"
          disabled
        />

        <select
          value={formData.role}
          className="w-full mb-4 p-2 border rounded"
          disabled
        >
          <option value={UserRole.ADMIN}>Admin</option>
          <option value={UserRole.MENTOR}>Mentor</option>
          <option value={UserRole.STARTUP}>Startup</option>
        </select>

        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName || ''}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName || ''}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <input
          type="text"
          placeholder="Contact Number"
          value={formData.number || ''}
          onChange={(e) => setFormData({ ...formData, number: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Expertise"
          value={formData.expertise || ''}
          onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Affiliation"
          value={formData.affiliation || ''}
          onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Address"
          value={formData.address || ''}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Mentor'}
        </button>
      </form>
    </div>
  );
};

export default UpdateMentorForm;
