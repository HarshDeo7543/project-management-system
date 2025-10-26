import React, { useEffect, useState } from 'react';
import api from '../api/axios';

// A simple card component for displaying stats
function StatCard({ title, value, bgColor = 'bg-white' }) {
  return (
    <div className={`${bgColor} p-4 rounded-lg shadow-md`}>
      <div className="text-sm text-gray-700">{title}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/dashboard')
      .then(response => {
        setStats(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load dashboard data.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Projects" value={stats.totalProjects} />
        <StatCard title="Total Tasks" value={stats.totalTasks} />
        <StatCard title="Tasks To Do" value={stats.tasksByStatus['To Do'] || 0} />
        <StatCard title="In Progress" value={stats.tasksByStatus['In Progress'] || 0} />
        <StatCard title="Tasks Done" value={stats.tasksByStatus['Done'] || 0} />
        <StatCard title="Overdue Tasks" value={stats.overdueTasks} bgColor="bg-red-100" />
      </div>

      {/* A placeholder for future content */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700">Welcome</h2>
        <p className="text-gray-600 mt-2">
          This is your project management dashboard. More widgets and reports will be added here in the future.
        </p>
      </div>
    </div>
  );
}