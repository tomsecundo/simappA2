import axiosInstance from '../services/axiosConfig';
import { useAuthHeaders } from './authHeaders';

const API_URL = "/api/programs";

export function useProgramApi() {
    const headers = useAuthHeaders();
    
    const getPrograms = async () => {
        const res = await axiosInstance.get(API_URL, { headers });
        return res.data;
    }

    const getProgramById = async (id) => {
        const res = await axiosInstance.get(`${API_URL}/${id}`, { headers });
        return res.data;
    }

    const createProgram = async (program) => {
        const res = await axiosInstance.post(API_URL, program, { headers });
        return res.data;
    }

    const updateProgram = async (id, program) => {
        const res = await axiosInstance.put(`${API_URL}/${id}`, program, { headers });
        return res.data;
    }

    const deleteProgram = async (id) => {
        const res = await axiosInstance.delete(`${API_URL}/${id}`, { headers });
        return res.data;
    }

    return { getPrograms, getProgramById, createProgram, updateProgram, deleteProgram };
}