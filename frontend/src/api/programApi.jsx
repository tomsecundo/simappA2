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
  const enrollAsMentor = async (program_id) => {
    const res = await axiosInstance.post(
      `/api/mentor/enroll`,
      { program_id },
      { headers: getAuthHeaders() }
    );
    return res.data;
  };

  const leaveProgram = async (program_id) => {
    const res = await axiosInstance.post(
      `/api/mentor/leave`,
      { program_id },
      { headers: getAuthHeaders() }
    );
    return res.data;
  };

  // Admin assign/remove mentor to program
  const addProgramToMentor = async ({ mentorId, program_id }) => {
    const res = await axiosInstance.post(
      `/api/mentor/${mentorId}/add-program`,
      { program_id },
      { headers: getAuthHeaders() }
    );
    return res.data;
  };

  const removeProgramFromMentor = async ({ mentorId, program_id }) => {
    const res = await axiosInstance.post(
      `/api/mentor/${mentorId}/remove-program`,
      { program_id },
      { headers: getAuthHeaders() }
    );
    return res.data;
  };

  // Applications
  const getProgramApplications = async (program_id) => {
    const res = await axiosInstance.get(`/api/applications?programId=${program_id}`, {
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
