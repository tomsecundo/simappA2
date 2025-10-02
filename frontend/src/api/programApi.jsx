// api/programApi.jsx
import axiosInstance from '../services/axiosConfig';
import { useAuth } from '../context/AuthContext';

const API_URL = '/api/programs';

export function useProgramApi() {
  const { getAuthHeaders } = useAuth();

  const getPrograms = async () => {
    const res = await axiosInstance.get(API_URL, { headers: getAuthHeaders() });
    return res.data;
  };

  const getProgramById = async (id) => {
    const res = await axiosInstance.get(`${API_URL}/${id}`, { headers: getAuthHeaders() });
    return res.data;
  };

  // Mentor self
  const enrollAsMentor = async (programId) => {
    const res = await axiosInstance.post(
      `/api/mentor/enroll`,
      { programId },
      { headers: getAuthHeaders() }
    );
    return res.data;
  };

  const leaveProgram = async (programId) => {
    const res = await axiosInstance.post(
      `/api/mentor/leave`,
      { programId },
      { headers: getAuthHeaders() }
    );
    return res.data;
  };

  // Admin assign/remove mentor to program
  const addProgramToMentor = async ({ mentorId, programId }) => {
    const res = await axiosInstance.post(
      `/api/mentor/${mentorId}/add-program`,
      { programId },
      { headers: getAuthHeaders() }
    );
    return res.data;
  };

  const removeProgramFromMentor = async ({ mentorId, programId }) => {
    const res = await axiosInstance.post(
      `/api/mentor/${mentorId}/remove-program`,
      { programId },
      { headers: getAuthHeaders() }
    );
    return res.data;
  };

  // Applications
  const getProgramApplications = async (programId) => {
    const res = await axiosInstance.get(`/api/applications?programId=${programId}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  };

  const acceptApplication = async ({ applicationId }) => {
    const res = await axiosInstance.patch(
      `/api/applications/${applicationId}/status`,
      { status: 'accepted' },
      { headers: getAuthHeaders() }
    );
    return res.data;
  };

  return {
    getPrograms,
    getProgramById,
    enrollAsMentor,
    leaveProgram,
    addProgramToMentor,
    removeProgramFromMentor,
    getProgramApplications,
    acceptApplication,
  };
}
