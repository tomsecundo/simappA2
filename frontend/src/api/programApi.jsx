import axiosInstance from '../services/axiosConfig';
import { useAuth } from '../context/AuthContext';

const API_URL = '/api/programs';

export function useProgramApi() {
  const { getAuthHeaders } = useAuth();

  // CRUD
  const getPrograms = async () => {
    const res = await axiosInstance.get(API_URL, { headers: getAuthHeaders() });
    return res.data;
  };

  const getProgramById = async (id) => {
    const res = await axiosInstance.get(`${API_URL}/${id}`, { headers: getAuthHeaders() });
    return res.data;
  };

  const createProgram = async (data) => {
    const res = await axiosInstance.post(API_URL, data, { headers: getAuthHeaders() });
    return res.data;
  };

  const updateProgram = async (id, data) => {
    const res = await axiosInstance.put(`${API_URL}/${id}`, data, { headers: getAuthHeaders() });
    return res.data;
  };

  const deleteProgram = async (id) => {
    const res = await axiosInstance.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
    return res.data;
  };

  // Mentor/Admin actions (already there)
  const enrollAsMentor = async (programId) => {
    const res = await axiosInstance.post(`/api/mentor/enroll`, { programId }, { headers: getAuthHeaders() });
    return res.data;
  };

  const leaveProgram = async (programId) => {
    const res = await axiosInstance.post(`/api/mentor/leave`, { programId }, { headers: getAuthHeaders() });
    return res.data;
  };

  const addProgramToMentor = async ({ mentorId, programId }) => {
    const res = await axiosInstance.post(`/api/mentor/${mentorId}/add-program`, { programId }, { headers: getAuthHeaders() });
    return res.data;
  };

  const removeProgramFromMentor = async ({ mentorId, programId }) => {
    const res = await axiosInstance.post(`/api/mentor/${mentorId}/remove-program`, { programId }, { headers: getAuthHeaders() });
    return res.data;
  };

  const getProgramApplications = async (programId) => {
    const res = await axiosInstance.get(`/api/programs/${programId}/applications`, { headers: getAuthHeaders() });
    return res.data;
  };

  const acceptApplication = async ({ applicationId, status }) => {
    const res = await axiosInstance.patch(
      `/api/applications/${applicationId}/status`,
      { status },
      { headers: getAuthHeaders() }
    );
    return res.data;
  };

  return {
    getPrograms,
    getProgramById,
    createProgram,
    updateProgram,
    deleteProgram,
    enrollAsMentor,
    leaveProgram,
    addProgramToMentor,
    removeProgramFromMentor,
    getProgramApplications,
    acceptApplication,
  };
}
