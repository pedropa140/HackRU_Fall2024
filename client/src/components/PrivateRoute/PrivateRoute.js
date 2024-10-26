import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = !!sessionStorage.getItem('userEmail');

    return isAuthenticated ? children : <Navigate to="/signin" replace />;
};

export default PrivateRoute;
