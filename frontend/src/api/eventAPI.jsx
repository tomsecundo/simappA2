import axiosInstance from '../services/axiosConfig';
import { useAuth } from '../context/AuthContext';

const API_URL = '/api/events';

export function useEventApi() {
    const { getAuthHeaders } = useAuth();

    const getAllEvents = async () => {
        const res = await axiosInstance.get(API_URL, { headers: getAuthHeaders() });
        return res.data; 
    };
    
    const getEventByType = async (eventType) => {
        const res = await axiosInstance.get(
            `${API_URL}/type/${encodeURIComponent(eventType)}`, { headers: getAuthHeaders() });
        return res.data;
    };

    const getEventByCoverage = async (coverage) => {
        const res = await axiosInstance.get(
            `${API_URL}/coverage/${encodeURIComponent(coverage)}`, { headers: getAuthHeaders() });
        return res.data;
    };

    const getEventById = async (id) => {
        const res = await axiosInstance.get(`${API_URL}/${id}`, { headers: getAuthHeaders() });
        return res.data;
    };
    
    const createEvent = async (data) => {
        const res = await axiosInstance.post(API_URL, data, { headers: getAuthHeaders() });
        return res.data;
    };

    const listMyRegistrations = async () => {
        const res = await axiosInstance.get(`${API_URL}/mine`, { headers: getAuthHeaders() });
        return res.data;
    };

     const listRegistrations = async (eventId) => {
        const res = await axiosInstance.get(`${API_URL}/${eventId}/registrations`, { headers: getAuthHeaders() });
        return res.data;
    };
    
    const registerForEvent = async (eventId) => {
        const res = await axiosInstance.post(`${API_URL}/${eventId}/register`, {}, { headers: getAuthHeaders() });
        return res.data;
    };

    const unregisterFromEvent = async (eventId) => {
        const res = await axiosInstance.delete(
            `${API_URL}/${eventId}/register`, { headers: getAuthHeaders() });
        return res.data;
    };

    const updateEvent = async (id, data) => {
        const res = await axiosInstance.put(`${API_URL}/${id}`, data, { headers: getAuthHeaders() });
        return res.data;
    };

    const deleteEvent = async (id) => {
        const res = await axiosInstance.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
        return res.data;
    };

    return { 
        createEvent, 
    getAllEvents,
    getEventById,
    getEventByType,
    getEventByCoverage,
    updateEvent,
    deleteEvent,
    registerForEvent,
    unregisterFromEvent,
    listRegistrations,
    listMyRegistrations
    };
}
