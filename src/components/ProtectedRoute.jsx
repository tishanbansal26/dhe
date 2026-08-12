import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, userProfile } = useAuth();

  if (!user) {
    // User not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    if (!userProfile) {
      return (
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        </div>
      );
    }
    if (!allowedRoles.includes(userProfile.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
