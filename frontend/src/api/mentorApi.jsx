import axiosInstance from '../services/axiosConfig';
import { useAuth } from '../context/AuthContext';

const API_URL = '/api/mentor';

export function useMentorApi() {
    const { getAuthHeaders } = useAuth();

    // Admin or public
    const getMentors = async () => {
        const res = await axiosInstance.get(API_URL, { headers: getAuthHeaders() });
        return res.data;
    };

    const getMentorById = async (id) => {
        const res = await axiosInstance.get(`${API_URL}/${id}`, { headers: getAuthHeaders() });
        return res.data;
    };

    // Admin update a mentor by ID
    const updateMentor = async (id, data) => {
        const res = await axiosInstance.put(`${API_URL}/${id}`, data, { headers: getAuthHeaders() });
        return res.data;
    };

    // Mentor self update
    const updateOwnProfile = async (data) => {
        const res = await axiosInstance.put(`${API_URL}/profile`, data, { headers: getAuthHeaders() });
        return res.data;
    };

    const deleteMentor = async (id) => {
        const res = await axiosInstance.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
        return res.data;
    };

    // Enrollment: backend expects { program_id }
    const enrollProgram = async (program_id) => {
        const res = await axiosInstance.post(`${API_URL}/enroll`, { program_id }, { headers: getAuthHeaders() });
        return res.data;
    };

    const leaveProgram = async (program_id) => {
        const res = await axiosInstance.post(`${API_URL}/leave`, { program_id }, { headers: getAuthHeaders() });
        return res.data;
    };

    // Password change for mentor
    const changePassword = async (payload) => {
        const res = await axiosInstance.put(`${API_URL}/change-password`, payload, { headers: getAuthHeaders() });
        return res.data;
    };

    return {
        getMentors,
        getMentorById,
        updateMentor,
        updateOwnProfile,
        deleteMentor,
        enrollProgram,
        leaveProgram,
        changePassword,
    };
}
