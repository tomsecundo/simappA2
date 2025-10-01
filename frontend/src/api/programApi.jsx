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

    return { getPrograms, getProgramById, createProgram, updateProgram, deleteProgram };
}
