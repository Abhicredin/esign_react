import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = () => {
    return localStorage.getItem("TOKEN") ? true : false;
  };

  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

