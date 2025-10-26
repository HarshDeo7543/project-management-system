import React, { useState } from 'react';
import api from '../api/axios';
import Modal from './Modal';

export default function AIStoriesModal({ isOpen, onClose, projectId, onStoriesGenerated }) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError('Please enter a project description.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/ai/generate-user-stories', {
        projectId,
        projectDescription: description,
      });

      // Call the callback to refresh the project data
      if (onStoriesGenerated) {
        onStoriesGenerated();
      }

      // Close modal and reset
      onClose();
      setDescription('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to generate user stories.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setDescription('');
    setError('');
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Generate User Stories with AI">
      <div className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Project Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your project in detail to generate relevant user stories..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={6}
            disabled={loading}
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Stories'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
