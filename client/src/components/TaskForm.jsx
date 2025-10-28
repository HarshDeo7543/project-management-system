import React, { useState, useEffect } from 'react';

export default function TaskForm({ onSave, taskToEdit, onCancel, teamMembers = [] }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('To Do');
  const [assignedToId, setAssignedToId] = useState('');
  
  const [error, setError] = useState('');

  // If we are editing, populate the form with existing task data
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setDeadline(taskToEdit.deadline ? new Date(taskToEdit.deadline).toISOString().split('T')[0] : '');
      setStatus(taskToEdit.status || 'To Do');
      setAssignedToId(taskToEdit.assignedToId || '');
    } else {
      // If creating new, reset form
      setTitle('');
      setDescription('');
      setDeadline('');
      setStatus('To Do');
      setAssignedToId('');
    }
  }, [taskToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) {
      setError('Task title is required.');
      return;
    }
    const taskData = { title, description, deadline, status, assignedToId };
    onSave(taskData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input 
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          rows="3"
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Deadline</label>
          <input 
            type="date"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select 
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Assign To</label>
        <select
          value={assignedToId}
          onChange={e => setAssignedToId(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="">Unassigned</option>
          {teamMembers.map(member => (
            <option key={member.id} value={member.id}>
              {member.name} ({member.role})
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
          Cancel
        </button>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Save Task
        </button>
      </div>
    </form>
  );
}
