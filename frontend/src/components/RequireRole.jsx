import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RequireRole = ({ children, allowedRoles = [] }) => {
  const { user, hasAnyRole } = useAuth();
  const location = useLocation();

  // Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Not authorized → redirect to unauthorized
  if (!hasAnyRole || !hasAnyRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized → render children
  return children;
};

export default RequireRole;
