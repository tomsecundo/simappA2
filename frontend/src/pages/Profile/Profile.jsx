import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUserHook } from '../../hooks/userHook';
import { UserRole } from '../../constants/UserRole';

const Profile = () => {
  const { user } = useAuth();
  const { profileQuery, updateProfile } = useUserHook();

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const ifMentor = formData.role === UserRole.MENTOR || user?.role === UserRole.MENTOR;
  const canEditRole = user && user.role === UserRole.ADMIN;

  // Load profile
  useEffect(() => {
    if (profileQuery.data) {
      const data = profileQuery.data;
      if (data.role === UserRole.MENTOR) {
        setFormData({
          role: data.role,
          email: data.email || '',
          address: data.address || '',
          password: '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          number: data.number || '',
          expertise: data.expertise || '',
          affiliation: data.affiliation || '',
          name: '',
          university: '',
        });
      } else {
        setFormData({
          name: data.name || '',
          email: data.email || '',
          role: data.role,
          university: data.university || '',
          address: data.address || '',
          password: '',
          firstName: '',
          lastName: '',
          number: '',
          expertise: '',
          affiliation: '',
        });
      }
    }
  }, [profileQuery.data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = ifMentor
      ? {
          email: formData.email,
          ...(formData.password ? { password: formData.password } : {}),
          firstName: formData.firstName,
          lastName: formData.lastName,
          number: formData.number,
          expertise: formData.expertise || undefined,
          affiliation: formData.affiliation || undefined,
          address: formData.address || undefined,
        }
      : {
          name: formData.name,
          email: formData.email,
          ...(user.role === UserRole.ADMIN ? { role: formData.role } : {}),
          university: formData.university || '',
          address: formData.address || '',
          ...(formData.password ? { password: formData.password } : {}),
        };

    try {
      await updateProfile.mutateAsync(payload);
      alert('Profile updated successfully!');
    } catch {
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (profileQuery.isLoading) return <div className="text-center mt-20">Loading...</div>;

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
        />

        {!ifMentor && (
          <select
            value={formData.role || ''}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
            disabled={!canEditRole}
          >
            <option value={UserRole.ADMIN}>Admin</option>
            <option value={UserRole.MENTOR}>Mentor</option>
            <option value={UserRole.STARTUP}>Startup</option>
          </select>
        )}

        {/* Mentor fields */}
        {ifMentor ? (
          <>
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
              required
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
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full mb-4 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="University"
              value={formData.university || ''}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
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
