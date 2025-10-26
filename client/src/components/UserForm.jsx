import React, { useState, useEffect } from 'react';

export default function UserForm({ onSave, userToEdit, onCancel }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Developer');
  
  const [error, setError] = useState('');
  const isEditing = !!userToEdit;

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name || '');
      setEmail(userToEdit.email || '');
      setRole(userToEdit.role || 'Developer');
      setPassword(''); // Password should not be shown, only set if creating
    } else {
      setName('');
      setEmail('');
      setPassword('');
      setRole('Developer');
    }
  }, [userToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !role) {
      setError('Name, email, and role are required.');
      return;
    }
    if (!isEditing && !password) {
      setError('Password is required for new users.');
      return;
    }

    const userData = { name, email, role };
    if (!isEditing) {
      userData.password = password;
    }

    onSave(userData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input 
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input 
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      {!isEditing && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input 
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Set an initial password"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select 
          value={role}
          onChange={e => setRole(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option>Developer</option>
          <option>ProjectManager</option>
          <option>Admin</option>
        </select>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
          Cancel
        </button>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Save User
        </button>
      </div>
    </form>
  );
}
