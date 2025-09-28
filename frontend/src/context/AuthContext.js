import { createContext, useState, useContext, useEffect } from 'react';
import { UserRole } from '../constants/UserRole';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading] = useState(true);

  // Check for token on initial load
  useEffect(() => {
    // Sync user state with localStorage on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser && !user) {
      setUser(JSON.parse(storedUser));
    };
  }, [user]);

  // Login function
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }

  // Logout function 
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Role check helper functions
  const hasRole = (requiredRole) => {
    return user && user.role === requiredRole;
  };

  const isAdmin = () => hasRole(UserRole.ADMIN);
  const isMentor = () => hasRole(UserRole.MENTOR);
  const isStartup = () => hasRole(UserRole.STARTUP);

  // Check if user has any of the required roles
  const hasAnyRole = (requiredRoles) => {
    return user && requiredRoles.includes(user.role);
  };

  // Check if user has all of the required roles
  const hasAllRoles = (requiredRoles) => {
    return user && requiredRoles.every(role => user.role === role);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        loading, 
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