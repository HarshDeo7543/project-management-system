import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentUser = useMemo(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }, []);

  const loadTasks = () => {
    if (!currentUser) {
      setError('Could not identify user.');
      setLoading(false);
      return;
    }
    setLoading(true);
    // Use the API's query parameter to fetch only tasks for the current user
    api.get(`/tasks?assignedTo=${currentUser.id}`)
      .then(res => {
        setTasks(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not fetch tasks.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadTasks();
  }, [currentUser]);

  const handleStatusChange = (task, newStatus) => {
    api.put(`/tasks/${task.id}`, { status: newStatus })
      .then(res => {
        // Update the status of the task in the local state for immediate feedback
        setTasks(currentTasks => 
          currentTasks.map(t => t.id === task.id ? res.data : t)
        );
      })
      .catch(() => {
        alert('Failed to update task status.');
      });
  };

  if (loading) return <div className="text-center p-4">Loading your tasks...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Tasks</h1>

      <div className="space-y-4">
        {tasks.length > 0 ? tasks.map(task => (
          <div key={task.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{task.title}</h2>
              <p className="text-sm text-gray-600 mt-1">Project: {task.Project?.name || 'N/A'}</p>
              {task.deadline && <p className="text-sm text-gray-500">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>}
            </div>
            <div>
              <select 
                value={task.status}
                onChange={(e) => handleStatusChange(task, e.target.value)}
                className="border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option>To Do</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </div>
          </div>
        )) : (
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <p className="text-gray-600">You have no tasks assigned to you.</p>
          </div>
        )}
      </div>
    </div>
  );
}