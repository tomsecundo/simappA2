import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RequireRole = ({ children, allowedRoles }) => {
  const { user, hasAnyRole } = useAuth();
  const location = useLocation();

  if (!user) {
    // Not logged in, redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasAnyRole(allowedRoles)) {
    // User's role is not authorized, redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized, render children
  return children;
};

export default RequireRole;