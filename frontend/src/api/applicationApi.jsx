import axiosInstance from '../services/axiosConfig';
import { useAuth } from '../context/AuthContext';

const API_URL = '/api/applications';

export function useApplicationApi() {
    const { getAuthHeaders } = useAuth();

    const getApplications = async () => {
        const res = await axiosInstance.get(API_URL, { headers: getAuthHeaders() });
        return res.data; 
    };
    
    const getApplicationById = async (id) => {
        const res = await axiosInstance.get(`${API_URL}/${id}`, { headers: getAuthHeaders() });
        return res.data;
    };
    
    const createApplication = async (data) => {
        const res = await axiosInstance.post(`${API_URL}`, data, { headers: getAuthHeaders() });
        return res.data;
    };

    const updateApplication = async (id, data) => {
        const res = await axiosInstance.put(`${API_URL}/${id}`, data, { headers: getAuthHeaders() });
        return res.data;
    };

    const updateApplicationStatus = async (id, status) => {
        const res = await axiosInstance.patch(`${API_URL}/${id}/status`, { status }, { headers: getAuthHeaders() });
        return res.data;
    };

    const deleteApplication = async (id) => {
        const res = await axiosInstance.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
        return res.data;
    };

    const getApplicationsByProgram = async (programId) => {
        const res = await fetch(`/api/applications/program/${programId}`);
        if (!res.ok) throw new Error('Failed to fetch program applications');
        return res.json();
    };

    return { 
        getApplications, 
        getApplicationById, 
        createApplication, 
        updateApplication,
        updateApplicationStatus, 
        deleteApplication,
        getApplicationsByProgram
    };
}
