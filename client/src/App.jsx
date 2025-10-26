import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Tasks from './pages/Tasks'
import ProjectDetail from './pages/ProjectDetail'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex gap-4">
          <Link to="/" className="font-bold">PMS</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/tasks">Tasks</Link>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
          </Route>
        </Routes>
      </main>
    </div>
  )
}
