import { useAuth } from '../context/AuthContext';

export function useAuthHeaders() {
    const { token } = useAuth();
    return token ? { Authorization: `Bearer ${token}`} : {};
}
