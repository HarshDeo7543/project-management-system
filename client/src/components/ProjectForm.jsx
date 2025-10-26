import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function ProjectForm({ onSave, projectToEdit, onCancel }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [teamId, setTeamId] = useState('');
  
  const [allTeams, setAllTeams] = useState([]);
  const [error, setError] = useState('');

  // Fetch teams for the dropdown
  useEffect(() => {
    api.get('/teams')
      .then(res => setAllTeams(res.data))
      .catch(() => setError('Could not load teams.'));
  }, []);

  // If we are editing, populate the form with existing project data
  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name || '');
      setDescription(projectToEdit.description || '');
      setDeadline(projectToEdit.deadline ? new Date(projectToEdit.deadline).toISOString().split('T')[0] : '');
      setTeamId(projectToEdit.teamId || '');
    } else {
      setName('');
      setDescription('');
      setDeadline('');
      setTeamId('');
    }
  }, [projectToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      setError('Project name is required.');
      return;
    }
    const projectData = { name, description, deadline, teamId };
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
        <label className="block text-sm font--medium text-gray-700">Assign to Team</label>
        <select 
          value={teamId}
          onChange={e => setTeamId(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="">No Team</option>
          {allTeams.map(team => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
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
