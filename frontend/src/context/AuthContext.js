import { createContext, useState, useContext, useEffect } from 'react';
import { UserRole } from '../constants/UserRole';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem("token") || null;
    });

    // Check for token on initial load
    useEffect(() => {
        // Sync user state with localStorage on mount
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && !user) setUser(JSON.parse(storedUser));
        if (storedToken && !token) setToken(storedToken);
    }, [user, token]);

    // Login function
    const login = (userData, jwtToken) => {
        setUser(userData);
        setToken(jwtToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem("token", jwtToken);
    }

    // Logout function 
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    // Headers helper
    const getAuthHeaders = () => {
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    // Role check helper functions
    const hasRole = (requiredRole) => user && user.role === requiredRole;
    const isAdmin = () => hasRole(UserRole.ADMIN);
    const isMentor = () => hasRole(UserRole.MENTOR);
    const isStartup = () => hasRole(UserRole.STARTUP);

    // Check if user has any of the required roles
    const hasAnyRole = (requiredRoles) => user && requiredRoles.includes(user.role);

    // Check if user has all of the required roles
    const hasAllRoles = (requiredRoles) => user && requiredRoles.every(role => user.role === role);

    return (
        <AuthContext.Provider 
            value={{ 
                user, 
                token,
                login, 
                logout, 
                getAuthHeaders,
                isAdmin,
                isMentor,
                isStartup,
                hasRole,
                hasAnyRole,
                hasAllRoles
            }}
            >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);