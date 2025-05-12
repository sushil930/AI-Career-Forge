import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader } from "@/components/ui/loader";

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const ProtectedRoute: React.FC = () => {
    const { user, isLoading } = useAuth();
    const [isCheckingLocalStorage, setIsCheckingLocalStorage] = useState(true);
    const [localStorageHasToken, setLocalStorageHasToken] = useState(false);

    // Check if token exists in localStorage when component mounts
    useEffect(() => {
        const token = localStorage.getItem('firebaseIdToken');
        setLocalStorageHasToken(!!token);
        setIsCheckingLocalStorage(false);
    }, []);

    // Show loading spinner while authentication is being checked or we're checking localStorage
    if (isLoading || isCheckingLocalStorage) {
        return <Loader fullScreen color="#3B82F6" />;
    }

    // If user is not authenticated and no token in localStorage, redirect to login
    if (!user && !localStorageHasToken) {
        return <Navigate to="/login" replace />;
    }

    // If we have a user or a token in localStorage, render the protected routes
    return <Outlet />;
};

export default ProtectedRoute;
