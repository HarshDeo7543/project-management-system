import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function TeamForm({ onSave, teamToEdit, onCancel }) {
  const [name, setName] = useState('');
  const [memberIds, setMemberIds] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [error, setError] = useState('');

  const isEditing = !!teamToEdit;

  useEffect(() => {
    // Fetch all users to populate the multi-select
    api.get('/users').then(res => {
      setAllUsers(res.data);
    }).catch(() => setError('Could not load users'));

    if (teamToEdit) {
      setName(teamToEdit.name || '');
      setMemberIds(teamToEdit.members ? teamToEdit.members.map(m => m.id) : []);
    } else {
      setName('');
      setMemberIds([]);
    }
  }, [teamToEdit]);

  const handleMemberChange = (e) => {
    const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
    setMemberIds(selectedIds);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      setError('Team name is required.');
      return;
    }
    onSave({ name, memberIds });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Team Name</label>
        <input 
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Team Members</label>
        <select 
          multiple
          value={memberIds}
          onChange={handleMemberChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-48"
        >
          {allUsers.map(user => (
            <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">Hold Ctrl or Cmd to select multiple users.</p>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
          Cancel
        </button>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Save Team
        </button>
      </div>
    </form>
  );
}
