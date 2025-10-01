import axiosInstance from '../services/axiosConfig';
import { useAuthHeaders } from './authHeaders';

const API_URL = "/api/availabilitylist";

export function useAvailabilityApi() {
    const headers = useAuthHeaders();
    
    const getAvailabilityList = async () => {
        const res = await axiosInstance.get(API_URL, { headers });
        return res.data;
    }

    const getAvailabilityById = async (id) => {
        const res = await axiosInstance.get(`${API_URL}/${id}`, { headers });
        return res.data;
    }

    const createAvailability = async (availability) => {
        const res = await axiosInstance.post(API_URL, availability, { headers });
        return res.data;
    }

    const updateAvailability = async (id, availability) => {
        const res = await axiosInstance.patch(`${API_URL}/${id}`, availability, { headers });
        return res.data;
    }

    const deleteAvailability = async (id) => {
        const res = await axiosInstance.delete(`${API_URL}/${id}`, { headers });
        return res.data;
    }

    return { getAvailabilityList, getAvailabilityById, createAvailability, updateAvailability, deleteAvailability };
}