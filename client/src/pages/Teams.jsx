import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Modal from '../components/Modal';
import TeamForm from '../components/TeamForm';

export default function TeamManagement() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamToEdit, setTeamToEdit] = useState(null);

  const loadTeams = () => {
    setLoading(true);
    api.get('/teams')
      .then(res => {
        setTeams(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not fetch teams.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const openCreateModal = () => {
    setTeamToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (team) => {
    setTeamToEdit(team);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTeamToEdit(null);
  };

  const handleSave = (teamData) => {
    const savePromise = teamToEdit
      ? api.put(`/teams/${teamToEdit.id}`, teamData)
      : api.post('/teams', teamData);

    savePromise
      .then(() => {
        loadTeams();
        closeModal();
      })
      .catch(err => {
        alert(err?.response?.data?.message || 'Save failed. Please try again.');
      });
  };

  const handleDelete = (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      api.delete(`/teams/${teamId}`)
        .then(() => {
          loadTeams();
        })
        .catch(err => {
          alert(err?.response?.data?.message || 'Delete failed. Please try again.');
        });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Team Management</h1>
          <p className="text-sm text-gray-500 mt-1">Create, edit, and manage teams.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 shadow-sm flex items-center"
        >
          Create Team
        </button>
      </div>

      {loading && <div className="text-center py-4">Loading teams...</div>}
      {error && <div className="text-center text-red-500 py-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map(team => (
          <div key={team.id} className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{team.name}</h2>
              <div className="flex gap-2">
                <button onClick={() => openEditModal(team)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                <button onClick={() => handleDelete(team.id)} className="text-red-600 hover:text-red-900">Delete</button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">{team.members.length} members</p>
            <div className="space-y-2">
              {team.members.map(member => (
                <div key={member.id} className="flex items-center text-sm text-gray-700">
                  {member.name} ({member.role})
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={teamToEdit ? 'Edit Team' : 'Create Team'}>
        <TeamForm 
          onSave={handleSave} 
          teamToEdit={teamToEdit} 
          onCancel={closeModal} 
        />
      </Modal>
    </div>
  );
}
