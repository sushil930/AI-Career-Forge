import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Placeholder for a loading component
const LoadingSpinner = () => <div>Loading...</div>;

export const ProtectedRoute: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        // Optional: Show a loading indicator while checking auth status
        return <LoadingSpinner />;
    }

    if (!user) {
        // Redirect to login page if not authenticated
        // Replace '/login' with your actual login route
        return <Navigate to="/login" replace />;
    }

    // Render the protected content (nested routes)
    return <Outlet />;
}; 