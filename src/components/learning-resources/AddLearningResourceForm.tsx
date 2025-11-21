'use client';

import { useState } from 'react';
import { CreateLearningResourceInput } from '@/src/type/learning-resources';

interface AddLearningResourceFormProps {
  productId: string;
  onSuccess?: () => void;
}

export default function AddLearningResourceForm({ productId, onSuccess }: AddLearningResourceFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateLearningResourceInput>({
    productId,
    title: '',
    description: '',
    url: '',
    type: 'guide',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/learning-resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create learning resource');
      }

      // Reset form
      setFormData({
        productId,
        title: '',
        description: '',
        url: '',
        type: 'guide',
      });
      setIsOpen(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create learning resource');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className='mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
      >
        + Add Learning Resource
      </button>
    );
  }

  return (
    <div className='mt-4 border border-gray-300 dark:border-neutral-700 rounded-lg p-4'>
      <h3 className='text-lg font-semibold mb-4'>Add New Learning Resource</h3>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor='title' className='block text-sm font-medium mb-1'>
            Title *
          </label>
          <input
            type='text'
            id='title'
            name='title'
            value={formData.title}
            onChange={handleChange}
            required
            className='w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-800'
          />
        </div>

        <div>
          <label htmlFor='description' className='block text-sm font-medium mb-1'>
            Description
          </label>
          <textarea
            id='description'
            name='description'
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className='w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-800'
          />
        </div>

        <div>
          <label htmlFor='url' className='block text-sm font-medium mb-1'>
            URL *
          </label>
          <input
            type='url'
            id='url'
            name='url'
            value={formData.url}
            onChange={handleChange}
            required
            className='w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-800'
          />
        </div>

        <div>
          <label htmlFor='type' className='block text-sm font-medium mb-1'>
            Type *
          </label>
          <select
            id='type'
            name='type'
            value={formData.type}
            onChange={handleChange}
            required
            className='w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-800'
          >
            <option value='guide'>Guide</option>
            <option value='tutorial'>Tutorial</option>
            <option value='video'>Video</option>
            <option value='documentation'>Documentation</option>
          </select>
        </div>

        <div className='flex gap-2'>
          <button
            type='submit'
            disabled={loading}
            className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50'
          >
            {loading ? 'Adding...' : 'Add Resource'}
          </button>
          <button
            type='button'
            onClick={() => {
              setIsOpen(false);
              setFormData({
                productId,
                title: '',
                description: '',
                url: '',
                type: 'guide',
              });
            }}
            className='px-4 py-2 bg-gray-300 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-400 dark:hover:bg-neutral-600 transition-colors'
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
