import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosConfig';

const Register = () => {
  const [formData, setFormData] = useState({ 
    //role/base
    role: '', 
    email: '',
    password: '',

    //base user
    name: '',
    university: '',
    address: '',
  
    //mentor
    firstName:'',
    lastName: '',
    number: '',
    expertise: '',
    affiliation: '',
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    //If Mentor
    const ifMentor = formData.role === 'Mentor';
    const payload = ifMentor
      ? {
        role: 'Mentor',
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        number: formData.number,
        expertise: formData.expertise || undefined,
        affiliation: formData.affiliation || undefined,
        address: formData.address || undefined,
      }
    :{
      role: formData.role || 'Startup',
      email: formData.email,
      password: formData.password,
      name: formData.name,
      university: formData.university || undefined,
      address: formData.address || undefined,
    };

  try {
      await axiosInstance.post('/api/auth/register', payload);
      alert('Registration successful. Please log in.');
      navigate('/login');
    } catch (error) {
      alert('Registration failed. Please try again.');
      console.log(e)
    }
  };

  const ifMentor = formData.role === 'Mentor';

  return (
    <div className="max-w-md mx-auto mt-20">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
        
        {/*Role*/}
        <select
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
          className="w-full mb-4 p-2 border rounded"
          required        
        >
          <option value="" disabled>Select Role</option>
          <option value="Admin">Admin</option>
          <option value="Mentor">Mentor</option>
          <option value="Startup">Startup</option>
        </select>

        {/*Base*/}
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />

        {/*Mentor*/}
        {ifMentor? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full mb-4 p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full mb-4 p-2 border rounded"
                required
              />
            </div>

            <input
                type="text"
                placeholder="Contact Number"
                value={formData.number}
                onChange={(e) => setFormData({...formData, number: e.target.value})}
                className="w-full mb-4 p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Expertise (optional)"
                value={formData.expertise}
                onChange={(e) => setFormData({...formData, expertise: e.target.value})}
                className="w-full mb-4 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Affiliation (optional)"
                value={formData.affiliation}
                onChange={(e) => setFormData({...formData, affiliation: e.target.value})}
                className="w-full mb-4 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Address (optional)"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full mb-4 p-2 border rounded"
              />
          </>
        ) :(
          <>
            <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full mb-4 p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="University (optional)"
                value={formData.university}
                onChange={(e) => setFormData({...formData, university: e.target.value})}
                className="w-full mb-4 p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Address (optional)"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full mb-4 p-2 border rounded"
                required
              />
          </>
        )}

        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
