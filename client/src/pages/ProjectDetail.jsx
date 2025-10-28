import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';
import AIStoriesModal from '../components/AIStoriesModal';

export default function ProjectDetail() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Get logged-in user from localStorage to check roles
  const currentUser = useMemo(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }, []);

  const isManagerOrAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'ProjectManager';

  const loadProject = () => {
    setLoading(true);
    api.get(`/projects/${id}`)
      .then(res => {
        setProject(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not fetch project details.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  const openCreateModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const openAIModal = () => {
    setIsAIModalOpen(true);
  };

  const closeAIModal = () => {
    setIsAIModalOpen(false);
  };

  const openEditModal = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  const handleSaveTask = (taskData) => {
    const taskPayload = { ...taskData, projectId: id };
    const savePromise = taskToEdit
      ? api.put(`/tasks/${taskToEdit.id}`, taskPayload)
      : api.post('/tasks', taskPayload);

    savePromise
      .then(() => {
        loadProject();
        closeModal();
      })
      .catch(err => alert(err?.response?.data?.message || 'Save failed.'));
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      api.delete(`/tasks/${taskId}`)
        .then(() => loadProject())
        .catch(err => alert(err?.response?.data?.message || 'Delete failed.'));
    }
  };

  if (loading) return <div className="text-center p-4">Loading project...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;
  if (!project) return <div className="text-center p-4">Project not found.</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">{project.name}</h1>
          <button onClick={openAIModal} className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 shadow-sm">Generate Stories with AI</button>
        </div>
        <p className="text-md text-gray-600 mt-2">{project.description}</p>
        {project.deadline && <p className="text-sm text-gray-500 mt-1">Deadline: {new Date(project.deadline).toLocaleDateString()}</p>}
      </div>

      <div className="mb-8">
        <div className="flex justify-between mb-1"><span className="text-base font-medium text-blue-700">Progress</span><span className="text-sm font-medium text-blue-700">{project.progress}%</span></div>
        <div className="w-full bg-gray-200 rounded-full h-4"><div className="bg-blue-600 h-4 rounded-full" style={{ width: `${project.progress}%` }}></div></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-700">Tasks</h2>
            <div className="flex gap-2">
              {isManagerOrAdmin && <button onClick={openCreateModal} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow-sm">Create Task</button>}
            </div>
          </div>
          <div className="space-y-4">
            {(project.tasks && project.tasks.length > 0) ? project.tasks.map(task => {
              const canEdit = isManagerOrAdmin || (currentUser?.role === 'Developer' && task.assignedToId === currentUser.id);
              return (
                <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{task.title}</h3>
                      <p className="text-sm text-gray-600">Assigned to: {task.assignedTo?.name || 'Unassigned'}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${task.status === 'Done' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{task.status}</span>
                      <div className="mt-2 flex gap-2 justify-end">
                        {canEdit && <button onClick={() => openEditModal(task)} className="text-sm text-blue-600 hover:underline">Edit</button>}
                        {isManagerOrAdmin && <button onClick={() => handleDeleteTask(task.id)} className="text-sm text-red-600 hover:underline">Delete</button>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }) : <p className="text-gray-500">No tasks for this project yet.</p>}
          </div>
        </div>

        <div className="md:col-span-1">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Team</h2>
          <div className="space-y-3">
            {project.teamMembers?.map(member => (
              <div key={member.id} className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                <div className="text-gray-800 font-medium">{member.name}</div>
                <div className="text-sm text-gray-500 ml-auto">({member.role})</div>
              </div>
            ))}
          </div>

          {project.userStories && project.userStories.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">AI Generated User Stories</h2>
              <div className="space-y-3">
                {project.userStories.map((story, index) => (
                  <div key={index} className="bg-purple-50 p-3 rounded-lg shadow-sm border-l-4 border-purple-500">
                    <p className="text-sm text-gray-800">{story}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={taskToEdit ? 'Edit Task' : 'Create Task'}>
        <TaskForm onSave={handleSaveTask} taskToEdit={taskToEdit} onCancel={closeModal} teamMembers={project.teamMembers} />
      </Modal>

      <AIStoriesModal
        isOpen={isAIModalOpen}
        onClose={closeAIModal}
        projectId={id}
        onStoriesGenerated={loadProject}
      />
    </div>
  );
}
