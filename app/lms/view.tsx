'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { LearningResource } from '@/src/type/products';
import { ResourceCard } from '@/src/components/learning/ResourceCard';

interface CreateResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (resource: Omit<LearningResource, 'id' | 'createdAt'>) => void;
}

const CreateResourceModal: React.FC<CreateResourceModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'training' | 'tutorial'>('training');
  const [duration, setDuration] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onCreate({
      title,
      description,
      type,
      duration: duration || undefined,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setType('training');
    setDuration('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-md mx-4'>
        <h2 className='text-xl font-semibold mb-4'>Create Learning Resource</h2>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Title</label>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Type</label>
            <div className='flex space-x-4'>
              <label className='flex items-center'>
                <input
                  type='radio'
                  value='training'
                  checked={type === 'training'}
                  onChange={(e) => setType(e.target.value as 'training')}
                  className='mr-2'
                />
                Training (Video)
              </label>
              <label className='flex items-center'>
                <input
                  type='radio'
                  value='tutorial'
                  checked={type === 'tutorial'}
                  onChange={(e) => setType(e.target.value as 'tutorial')}
                  className='mr-2'
                />
                Tutorial (PDF)
              </label>
            </div>
          </div>

          {type === 'training' && (
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Duration</label>
              <input
                type='text'
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder='e.g., 45 minutes'
                className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
          )}

          <div>
            <p className='text-sm text-gray-600'>
              {type === 'training'
                ? 'Video files will be automatically assigned from existing media library.'
                : 'PDF files will be automatically assigned from existing media library.'}
            </p>
          </div>

          <div className='flex justify-end space-x-3 pt-4'>
            <button type='button' onClick={onClose} className='px-4 py-2 text-gray-600 hover:text-gray-800'>
              Cancel
            </button>
            <button type='submit' className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg'>
              Create Resource
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface ViewProps {
  resources: LearningResource[];
}

export function View({ resources: initialResources }: ViewProps) {
  const [resources, setResources] = useState<LearningResource[]>(initialResources);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const trainingModules = resources.filter((r) => r.type === 'training');
  const tutorials = resources.filter((r) => r.type === 'tutorial');

  const handleCreateResource = async (newResource: Omit<LearningResource, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/learning-resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newResource),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create resource');
      }

      const createdResource = await response.json();
      setResources([createdResource, ...resources]); // Add to beginning of list
    } catch (error) {
      console.error('Error creating resource:', error);
      alert('Failed to create resource. Please try again.');
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) {
      return;
    }

    try {
      const response = await fetch(`/api/learning-resources/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete resource');
      }

      setResources(resources.filter((r) => r.id !== id));
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert('Failed to delete resource. Please try again.');
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-6xl mx-auto px-6 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Learning Management System</h1>
          <p className='text-gray-600'>Manage training modules and tutorials for your products</p>
        </div>

        {/* Training Modules Section */}
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-2xl font-semibold text-gray-800'>Training Modules</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2'
            >
              <Plus className='w-4 h-4' />
              <span>Add Resource</span>
            </button>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {trainingModules.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} onDelete={handleDeleteResource} />
            ))}
            {trainingModules.length === 0 && (
              <div className='col-span-full text-center py-8 text-gray-500'>
                No training modules yet. Create your first one!
              </div>
            )}
          </div>
        </div>

        {/* Tutorials Section */}
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-2xl font-semibold text-gray-800'>Tutorials</h2>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {tutorials.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} onDelete={handleDeleteResource} />
            ))}
            {tutorials.length === 0 && (
              <div className='col-span-full text-center py-8 text-gray-500'>
                No tutorials yet. Create your first one!
              </div>
            )}
          </div>
        </div>

        {/* Create Resource Modal */}
        <CreateResourceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateResource}
        />
      </div>
    </div>
  );
}
