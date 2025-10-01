import axiosInstance from '../services/axiosConfig';
import { useAuth } from '../context/AuthContext';

const API_URL = '/api/user';

export function useUserApi() {
    const { getAuthHeaders } = useAuth();

    const getProfile = async () => {
        const res = await axiosInstance.get(`${API_URL}/profile`, {
            headers: getAuthHeaders(),
        });
        return res.data;
    };

    const updateProfile = async (data) => {
        const res = await axiosInstance.put(`${API_URL}/profile`, data, {
            headers: getAuthHeaders(),
        });
        return res.data;
    };

    const changePassword = async (payload) => {
        const res = await axiosInstance.put(`${API_URL}/change-password`, payload, {
            headers: getAuthHeaders(),
        });
        return res.data;
    };

    // Admin-only
    const getAllUsers = async () => {
        const res = await axiosInstance.get(API_URL, {
            headers: getAuthHeaders(),
        });
        return res.data;
    };

    const getUserById = async (id) => {
        const res = await axiosInstance.get(`${API_URL}/${id}`, {
            headers: getAuthHeaders(),
        });
        return res.data;
    };

    const updateUserByAdmin = async (id, data) => {
        const res = await axiosInstance.put(`${API_URL}/${id}`, data, {
            headers: getAuthHeaders(),
        });
        return res.data;
    };

    const deleteUser = async (id) => {
        const res = await axiosInstance.delete(`${API_URL}/${id}`, {
            headers: getAuthHeaders(),
        });
        return res.data;
    };

    return {
        getProfile,
        updateProfile,
        changePassword,
        getAllUsers,
        getUserById,
        updateUserByAdmin,
        deleteUser,
    };
}
