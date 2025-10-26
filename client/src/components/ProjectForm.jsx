import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function ProjectForm({ onSave, projectToEdit, onCancel }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [teamMemberIds, setTeamMemberIds] = useState([]);
  
  const [allUsers, setAllUsers] = useState([]);
  const [error, setError] = useState('');

  // Fetch users for the team member selection
  useEffect(() => {
    api.get('/users')
      .then(res => setAllUsers(res.data))
      .catch(() => setError('Could not load users for team selection.'));
  }, []);

  // If we are editing, populate the form with existing project data
  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name || '');
      setDescription(projectToEdit.description || '');
      // Format date for input field, which expects YYYY-MM-DD
      setDeadline(projectToEdit.deadline ? new Date(projectToEdit.deadline).toISOString().split('T')[0] : '');
      setTeamMemberIds(projectToEdit.teamMembers ? projectToEdit.teamMembers.map(m => m.id) : []);
    } else {
      // If creating new, reset form
      setName('');
      setDescription('');
      setDeadline('');
      setTeamMemberIds([]);
    }
  }, [projectToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      setError('Project name is required.');
      return;
    }
    const projectData = { name, description, deadline, teamMemberIds };
    onSave(projectData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Project Name</label>
        <input 
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          placeholder="e.g., New Website Launch"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          rows="3"
          placeholder="A brief summary of the project"
        ></textarea>
      </div>

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
        <label className="block text-sm font-medium text-gray-700">Team Members</label>
        <select 
          multiple
          value={teamMemberIds}
          onChange={e => setTeamMemberIds(Array.from(e.target.selectedOptions, option => option.value))}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-32"
        >
          {allUsers.map(user => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.role})
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">Hold Ctrl or Cmd to select multiple users.</p>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
          Cancel
        </button>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Save Project
        </button>
      </div>
    </form>
  );
}
