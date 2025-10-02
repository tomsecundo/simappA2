import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUserHook } from '../../hooks/userHook';
import { useMentorsHook } from '../../hooks/mentorHook';
import { UserRole } from '../../constants/UserRole';

const Profile = () => {
  const { user } = useAuth();
  const { profileQuery: userProfileQuery, updateProfile: updateUserProfile } = useUserHook();
  const { updateOwnProfile: updateMentorProfile } = useMentorsHook();

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const ifMentor = formData.role === UserRole.MENTOR || user?.role === UserRole.MENTOR;

  // Load profile
  useEffect(() => {
    if (userProfileQuery.data) {
      const data = userProfileQuery.data;
      if (data.role === UserRole.MENTOR) {
        setFormData({
          name: data.name,
          role: data.role,
          email: data.email || '',
          address: data.address || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          number: data.number || '',
          expertise: data.expertise || '',
          affiliation: data.affiliation || '',
        });
      } else {
        setFormData({
          name: data.name || '',
          email: data.email || '',
          role: data.role,
          affiliation: data.affiliation || '',
          address: data.address || '',
          firstName: '',
          lastName: '',
          number: '',
          expertise: '',
        });
      }
    }
  }, [userProfileQuery.data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Build payload
    const payload = ifMentor
      ? {
          firstName: formData.firstName,
          lastName: formData.lastName,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          number: formData.number,
          expertise: formData.expertise || '',
          affiliation: formData.affiliation || '',
          address: formData.address || '',
        }
      : {
          name: formData.name,
          email: formData.email,
          affiliation: formData.affiliation || '',
          address: formData.address || '',
        };

    try {
      if (ifMentor) {
        await updateMentorProfile.mutateAsync(payload);
      } else {
        await updateUserProfile.mutateAsync(payload);
      }
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (userProfileQuery.isLoading)
    return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-20">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">Your Profile</h1>

        {/* Shared fields */}
        <input
          type="email"
          placeholder="Email"
          value={formData.email || ''}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
          disabled
        />

        <select
          value={formData.role || ''}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
          disabled
        >
          <option value={UserRole.ADMIN}>Admin</option>
          <option value={UserRole.MENTOR}>Mentor</option>
          <option value={UserRole.STARTUP}>Startup</option>
        </select>

        {/* Mentor fields */}
        {ifMentor ? (
          <>
            <input
              type="text"
              placeholder="First Name"
              value={formData.firstName || ''}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="w-full mb-4 p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={formData.lastName || ''}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className="w-full mb-4 p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Contact Number"
              value={formData.number || ''}
              onChange={(e) =>
                setFormData({ ...formData, number: e.target.value })
              }
              className="w-full mb-4 p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Expertise"
              value={formData.expertise || ''}
              onChange={(e) =>
                setFormData({ ...formData, expertise: e.target.value })
              }
              className="w-full mb-4 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Affiliation"
              value={formData.affiliation || ''}
              onChange={(e) =>
                setFormData({ ...formData, affiliation: e.target.value })
              }
              className="w-full mb-4 p-2 border rounded"
            />
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full mb-4 p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Affiliation"
              value={formData.affiliation || ''}
              onChange={(e) =>
                setFormData({ ...formData, affiliation: e.target.value })
              }
              className="w-full mb-4 p-2 border rounded"
            />
          </>
        )}

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
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
