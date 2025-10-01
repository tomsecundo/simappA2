import axiosInstance from '../services/axiosConfig';
import { useAuthHeaders } from './authHeaders';

const API_URL = "/api/sessions";

export function useSessionApi() {
    const headers = useAuthHeaders();
    
    const getSessions = async () => {
        const res = await axiosInstance.get(API_URL, { headers });
        return res.data;
    }

    const getSessionById = async (id) => {
        const res = await axiosInstance.get(`${API_URL}/${id}`, { headers });
        return res.data;
    }

    const createSession = async (session) => {
        const res = await axiosInstance.post(API_URL, session, { headers });
        return res.data;
    }

    const updateSession = async (id, session) => {
        const res = await axiosInstance.put(`${API_URL}/${id}`, session, { headers });
        return res.data;
    }

    const deleteSession = async (id) => {
        const res = await axiosInstance.delete(`${API_URL}/${id}`, { headers });
        return res.data;
    }

    return { getSessions, getSessionById, createSession, updateSession, deleteSession };
}