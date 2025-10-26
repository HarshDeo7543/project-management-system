import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Modal from '../components/Modal';
import ProjectForm from '../components/ProjectForm';
import { Link } from 'react-router-dom';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);

  // Fetch all projects
  const loadProjects = () => {
    setLoading(true);
    api.get('/projects')
      .then(res => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not fetch projects.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openCreateModal = () => {
    setProjectToEdit(null); // Ensure form is empty for creation
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setProjectToEdit(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProjectToEdit(null);
  };

  const handleSave = (projectData) => {
    const savePromise = projectToEdit
      ? api.put(`/projects/${projectToEdit.id}`, projectData) // Update
      : api.post('/projects', projectData); // Create

    savePromise
      .then(() => {
        loadProjects(); // Refresh the list
        closeModal();
      })
      .catch(err => {
        alert(err?.response?.data?.message || 'Save failed. Please try again.');
      });
  };

  const handleDelete = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      api.delete(`/projects/${projectId}`)
        .then(() => {
          loadProjects(); // Refresh the list
        })
        .catch(err => {
          alert(err?.response?.data?.message || 'Delete failed. Please try again.');
        });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
        <button 
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow-sm"
        >
          Create Project
        </button>
      </div>

      {loading && <div className="text-center">Loading projects...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}

      <div className="space-y-4">
        {projects.map(p => (
          <div key={p.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
            <Link to={`/projects/${p.id}`} className="flex-grow">
              <div>
                <h2 className="text-xl font-bold text-gray-800 hover:text-blue-600">{p.name}</h2>
                <p className="text-sm text-gray-600 mt-1">{p.description}</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${p.progress}%` }}></div>
                </div>
              </div>
            </Link>
            <div className="flex gap-2">
              <button 
                onClick={() => openEditModal(p)}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm hover:bg-gray-300"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(p.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={projectToEdit ? 'Edit Project' : 'Create Project'}>
        <ProjectForm 
          onSave={handleSave} 
          projectToEdit={projectToEdit} 
          onCancel={closeModal} 
        />
      </Modal>
    </div>
  );
}