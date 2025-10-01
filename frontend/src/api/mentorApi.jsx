import axiosInstance from '../services/axiosConfig';
import { useAuth } from '../context/AuthContext';

const API_URL = '/api/mentor';

export function useMentorApi() {
    const { getAuthHeaders } = useAuth();

    const getMentors = async () => {
        const res = await axiosInstance.get(API_URL, { headers: getAuthHeaders() });
        return res.data;
    };

    const getMentorById = async (id) => {
        const res = await axiosInstance.get(`${API_URL}/${id}`, { headers: getAuthHeaders() });
        return res.data;
    };

    const updateMentor = async (id, data) => {
        const res = await axiosInstance.put(`${API_URL}/${id}`, data, { headers: getAuthHeaders() });
        return res.data;
    };

    const deleteMentor = async (id) => {
        const res = await axiosInstance.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
        return res.data;
    };

    const enrollProgram = async (programId) => {
        const res = await axiosInstance.post(`${API_URL}/enroll`, { programId }, { headers: getAuthHeaders() });
        return res.data;
    };

    const leaveProgram = async (programId) => {
        const res = await axiosInstance.post(`${API_URL}/leave`, { programId }, { headers: getAuthHeaders() });
        return res.data;
    };

    return { getMentors, getMentorById, updateMentor, deleteMentor, enrollProgram, leaveProgram };
}
