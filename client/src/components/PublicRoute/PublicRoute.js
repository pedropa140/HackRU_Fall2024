import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
    const isAuthenticated = !sessionStorage.getItem('userEmail');

    return isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

export default PublicRoute;
