import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on actual role
        if (user.role === 'Admin') return <Navigate to="/admin/dashboard" replace />;
        if (user.role === 'Teacher') return <Navigate to="/teacher/dashboard" replace />;
        if (user.role === 'Student') return <Navigate to="/student/dashboard" replace />;
        if (user.role === 'Parent') return <Navigate to="/parent/dashboard" replace />;

        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
