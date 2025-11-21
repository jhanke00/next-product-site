'use client';

import { LearningResource } from '@/src/type/learning-resources';
import { useState, useEffect, useCallback } from 'react';

interface LearningResourcesListProps {
  productId: string;
}

export default function LearningResourcesList({ productId }: LearningResourcesListProps) {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/learning-resources?productId=${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch learning resources');
      }
      const data = await response.json();
      setResources(data.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this learning resource?')) {
      return;
    }

    try {
      const response = await fetch(`/api/learning-resources/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete learning resource');
      }

      // Refresh the list
      fetchResources();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete resource');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide':
        return '📖';
      case 'tutorial':
        return '🎓';
      case 'video':
        return '🎥';
      case 'documentation':
        return '📚';
      default:
        return '📄';
    }
  };

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (loading) {
    return (
      <div className='mt-8'>
        <h2 className='text-xl font-semibold mb-4'>Learning Resources</h2>
        <p className='text-sm opacity-50'>Loading resources...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='mt-8'>
        <h2 className='text-xl font-semibold mb-4'>Learning Resources</h2>
        <p className='text-sm text-red-500'>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className='mt-8'>
      <h2 className='text-xl font-semibold mb-4'>Learning Resources</h2>
      {resources.length === 0 ? (
        <p className='text-sm opacity-50'>No learning resources available for this product.</p>
      ) : (
        <div className='space-y-4'>
          {resources.map((resource) => (
            <div
              key={resource.id}
              className='border border-gray-300 dark:border-neutral-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-neutral-800/30 transition-colors'
            >
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-2'>
                    <span className='text-lg'>{getTypeIcon(resource.type)}</span>
                    <h3 className='text-lg font-medium'>{resource.title}</h3>
                    <span className='text-xs px-2 py-1 bg-gray-200 dark:bg-neutral-700 rounded'>
                      {getTypeLabel(resource.type)}
                    </span>
                  </div>
                  {resource.description && <p className='text-sm opacity-70 mb-2'>{resource.description}</p>}
                  <a
                    href={resource.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-sm text-blue-600 dark:text-blue-400 hover:underline'
                  >
                    {resource.url}
                  </a>
                </div>
                <button
                  onClick={() => handleDelete(resource.id)}
                  className='ml-4 text-sm text-red-600 dark:text-red-400 hover:underline'
                  aria-label='Delete resource'
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
