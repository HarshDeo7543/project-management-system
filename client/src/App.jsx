import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import ProjectDetail from './pages/ProjectDetail';
import UserManagement from './pages/UserManagement';
import Teams from './pages/Teams';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

export default function App() {
  // Get user from local storage to conditionally render UI elements
  const [currentUser, setCurrentUser] = useState(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const user = localStorage.getItem('user');
      setCurrentUser(user ? JSON.parse(user) : null);
    };

    const handleUserLogin = () => {
      const user = localStorage.getItem('user');
      setCurrentUser(user ? JSON.parse(user) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLogin', handleUserLogin);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogin', handleUserLogin);
    };
  }, []);

  const getDashboardTitle = () => {
    if (!currentUser) return 'Dashboard';
    switch (currentUser.role) {
      case 'Admin':
        return 'Admin Dashboard';
      case 'ProjectManager':
        return 'Manager Dashboard';
      case 'Developer':
        return 'My Dashboard';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-bold text-lg">{getDashboardTitle()}</Link>
            <Link to="/projects" className="text-gray-600 hover:text-gray-900">Projects</Link>
            <Link to="/tasks" className="text-gray-600 hover:text-gray-900">My Tasks</Link>
            {currentUser?.role === 'Admin' && (
              <>
                <Link to="/admin/users" className="text-gray-600 hover:text-gray-900">User Management</Link>
                <Link to="/admin/teams" className="text-gray-600 hover:text-gray-900">Team Management</Link>
              </>
            )}
          </div>
          {/* Placeholder for logout button or user profile */}
          <div></div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Routes protected for all logged-in users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/tasks" element={<Tasks />} />
          </Route>

          {/* Routes protected for Admins only */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/teams" element={<Teams />} />
          </Route>
        </Routes> 
      </main>
    </div>
  );
}