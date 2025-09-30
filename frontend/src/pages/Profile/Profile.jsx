import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../services/axiosConfig';
import RequireAuth from '../../components/RequireAuth';
import { UserRole } from '../../constants/UserRole';

const Profile = () => {
  const { user } = useAuth(); // Access user token from context
  const [formData, setFormData] = useState({
   
  //common
    name: '',
    email: '',
    role: '',
    university: '',
    address: '',
    password:'',

  //mentor
  firstName: '',
  lastName: '',
  number: '',
  expertise: '',
  affiliation: '',
  });

  const [loading, setLoading] = useState(false);

  const ifMentor = formData.role === UserRole.MENTOR || user?.role === UserRole.MENTOR;
  const ifAdmin = user && user.role === UserRole.ADMIN;

  useEffect(() => {
    // Fetch profile data from the backend
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const {data} = await axiosInstance.get('/api/user/profile', {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (data.role === UserRole.MENTOR) {
          setFormData((prev)=> ({
            ...prev,
            role: data.role,
            email: data.email || '',
            address: data.address || '',
            password: '',

          //mentor info
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          number: data.number || '',
          expertise: data.expertise || '',
          affiliation: data.affiliation || '',

          name: '',
          university: '',
          }));
        } else {
        setFormData((prev) => ({
          ...prev,
          name: data.name || '',
          email: data.email || '',
          role: data.role,
          university: data.university || '',
          address: data.address || '',
          password: '',

          //mentor
          firstName: '',
          lastName:  '',
          number:  '',
          expertise:  '',
          affiliation: '',
        }));
      }
      } catch (e) {
        alert('Failed to fetch profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = ifMentor
    ? {
      email: formData.email,
      ...(formData.password ? {password: formData.password} : {}),
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
        ...(user.role === UserRole.ADMIN ? { role: formData.role} : {}),
        university: formData.university || '',
        address: formData.address || '',
        ...(formData.password ? {password: formData.password}: {}),
      };
    try {
      const {data} = await axiosInstance.put('/api/user/profile', payload,{
        headers: {Authorization: `Bearer ${user.token}`},
      });

      if (data.role === UserRole.MENTOR) {
        setFormData((prev)=> ({
          ...prev,
          role: data.role,
          email: data.email || '',
          address: data.address || '',
          password: '',
          firstName: data.firstName || prev.firstName,
          lastName: data.lastName || prev.lastName,
          number: data.number || prev.number,
          expertise: data.expertise || '',
          affiliation: data.affiliation || '',
          name: '',
          university: '',
        }));
      } else{
        setFormData((prev)=> ({
          ...prev,
          role: data.role || prev.role,
          email: data.email || '',
          address: data.address || '',
          password: '',
          name: data.name || prev.name,
          university: data.university || '',
          firstName: '',
          lastName: '',
          number: '',
          expertise: '',
          affiliation: '',          
        }));
    }
      alert('Profile updated successfully!');
    } catch (e) {
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  const canEditRole = user && user.role === UserRole.ADMIN;

  return (
    <div className="max-w-md mx-auto mt-20">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">Your Profile</h1>
      
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        {!ifMentor && (
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
          disabled={!canEditRole}
        >
          <option value={UserRole.ADMIN}>Admin</option>
          <option value={UserRole.MENTOR}>Mentor</option>
          <option value={UserRole.STARTUP}>Startup</option>
        </select>
        )}
        { ifMentor ? (
          <>
            <div>
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full mb-4 p-2 border rounded"
                required              
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full mb-4 p-2 border rounded"
                required              
              />
            </div>
            <input
                type="text"
                placeholder="Contact Number"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                className="w-full mb-4 p-2 border rounded"
                required              
              />
              <input
                type="text"
                placeholder="Expertise (optional)"
                value={formData.expertise}
                onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                className="w-full mb-4 p-2 border rounded"            
              />
              <input
                type="text"
                placeholder="Affiliation"
                value={formData.affiliation}
                onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                className="w-full mb-4 p-2 border rounded"          
              />
          </>
        ): (
          //common
          <>
            <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
          />
            <input
              type="text"
              placeholder="University (optional)"
              value={formData.university}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              className="w-full mb-4 p-2 border rounded"
            />
          </>
        )}
        <input
          type="text"
          placeholder="Address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

// export default Profile;
export default function ProtectedProfile() {
  return (
    <RequireAuth>
      <Profile />
    </RequireAuth>
  );
};
