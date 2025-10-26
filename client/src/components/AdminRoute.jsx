import React, { useMemo } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const currentUser = useMemo(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }, []);

  // Check for token and if the user role is 'Admin'
  const isAuthorized = currentUser && currentUser.role === 'Admin';

  return isAuthorized ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
