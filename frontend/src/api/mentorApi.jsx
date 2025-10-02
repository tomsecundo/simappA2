// api/mentorApi.jsx
import axiosInstance from '../services/axiosConfig';
import { useAuth } from '../context/AuthContext';

const API_URL = '/api/mentor';

export function useMentorApi() {
  const { getAuthHeaders } = useAuth();

  // Mentor self-profile
  const getProfile = async () => {
    const res = await axiosInstance.get(`${API_URL}/profile`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  };

  const updateOwnProfile = async (data) => {
    const res = await axiosInstance.put(`${API_URL}/profile`, data, {
      headers: getAuthHeaders(),
    });
    return res.data;
  };

  // Admin updates mentor by ID
  const updateByAdmin = async (id, data) => {
    const res = await axiosInstance.put(`${API_URL}/${id}`, data, {
      headers: getAuthHeaders(),
    });
    return res.data;
  };

  // Shared (Admin & Mentor)
  const getAll = async () => {
    const res = await axiosInstance.get(API_URL, { headers: getAuthHeaders() });
    return res.data;
  };

  const getById = async (id) => {
    const res = await axiosInstance.get(`${API_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  };

  const deleteMentor = async (id) => {
    const res = await axiosInstance.delete(`${API_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  };

  return {
    getProfile,
    updateOwnProfile,
    updateByAdmin,
    getAll,
    getById,
    deleteMentor,
  };
}