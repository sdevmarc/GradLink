// ProtectedRoute.tsx

import { AuthContext } from '@/hooks/AuthContext';
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);

    if (isAuthenticated === null) {
        // Show a loading indicator while checking auth status
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        // Redirect to login page if not authenticated
        return <Navigate to="/" replace />;
    }

    // Render the protected component if authenticated
    return children;
};

export default ProtectedRoute;
