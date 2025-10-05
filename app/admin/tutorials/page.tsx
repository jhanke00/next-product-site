'use client';

import React, { useState, useEffect } from 'react';
import { LearningResource } from '@/src/types/learning';
import Link from 'next/link';

const TutorialsManagement: React.FC = () => {
  const [tutorials, setTutorials] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/learning-resources?limit=100');
        const data = await response.json();

        if (data.success && Array.isArray(data.data?.resources)) {
          setTutorials(data.data.resources);
        } else {
          console.error('Failed to fetch tutorials:', data.error);
          setTutorials([]); // Ensure tutorials is always an array
        }
      } catch (error) {
        console.error('Error fetching tutorials:', error);
        setTutorials([]); // Ensure tutorials is always an array
      } finally {
        setLoading(false);
      }
    };

    fetchTutorials();
  }, []);

  const filteredTutorials = Array.isArray(tutorials)
    ? tutorials.filter((tutorial) => {
        const matchesSearch =
          tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || tutorial.type === filterType;
        const matchesDifficulty = filterDifficulty === 'all' || tutorial.difficulty === filterDifficulty;

        return matchesSearch && matchesType && matchesDifficulty;
      })
    : [];

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this tutorial?')) {
      try {
        const response = await fetch(`/api/learning-resources/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setTutorials(tutorials.filter((t) => t.id !== id));
        } else {
          alert('Failed to delete tutorial');
        }
      } catch (error) {
        console.error('Error deleting tutorial:', error);
        alert('Error deleting tutorial');
      }
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
        <span className='ml-2 text-gray-600'>Loading tutorials...</span>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Tutorials Management</h1>
          <p className='text-gray-600 dark:text-gray-400 mt-2'>
            Create, edit, and manage learning resources and tutorials
          </p>
        </div>
        <Link
          href='/admin/tutorials/new'
          className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2'
        >
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
          </svg>
          <span>Create Tutorial</span>
        </Link>
      </div>

      {/* Filters */}
      <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {/* Search */}
          <div>
            <label htmlFor='search' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Search Tutorials
            </label>
            <input
              type='text'
              id='search'
              placeholder='Search by title or description...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
            />
          </div>

          {/* Type Filter */}
          <div>
            <label htmlFor='type' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Type
            </label>
            <select
              id='type'
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
            >
              <option value='all'>All Types</option>
              <option value='video'>Video</option>
              <option value='article'>Article</option>
              <option value='course'>Course</option>
              <option value='interactive'>Interactive</option>
              <option value='pdf'>PDF</option>
              <option value='webinar'>Webinar</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label htmlFor='difficulty' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Difficulty
            </label>
            <select
              id='difficulty'
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
            >
              <option value='all'>All Difficulties</option>
              <option value='beginner'>Beginner</option>
              <option value='intermediate'>Intermediate</option>
              <option value='advanced'>Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tutorials Grid */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow'>
        {filteredTutorials.length === 0 ? (
          <div className='p-12 text-center'>
            <svg className='mx-auto h-12 w-12 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
              />
            </svg>
            <h3 className='mt-2 text-sm font-medium text-gray-900 dark:text-white'>No tutorials found</h3>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              {searchTerm || filterType !== 'all' || filterDifficulty !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Get started by creating a new tutorial.'}
            </p>
            {!searchTerm && filterType === 'all' && filterDifficulty === 'all' && (
              <div className='mt-6'>
                <Link
                  href='/admin/tutorials/new'
                  className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                >
                  <svg className='mr-2 h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                  </svg>
                  Create Tutorial
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
              <thead className='bg-gray-50 dark:bg-gray-700'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Tutorial
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Type
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Difficulty
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Views
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                {filteredTutorials.map((tutorial) => (
                  <tr key={tutorial.id} className='hover:bg-gray-50 dark:hover:bg-gray-700'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='flex-shrink-0 h-10 w-10'>
                          <img
                            className='h-10 w-10 rounded-lg object-cover'
                            src={tutorial.thumbnailUrl}
                            alt={tutorial.title}
                          />
                        </div>
                        <div className='ml-4'>
                          <div className='text-sm font-medium text-gray-900 dark:text-white'>{tutorial.title}</div>
                          <div className='text-sm text-gray-500 dark:text-gray-400'>{tutorial.author}</div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tutorial.type === 'video'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                            : tutorial.type === 'article'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : tutorial.type === 'course'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                : tutorial.type === 'interactive'
                                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                                  : tutorial.type === 'pdf'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                        }`}
                      >
                        {tutorial.type}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tutorial.difficulty === 'beginner'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : tutorial.difficulty === 'intermediate'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}
                      >
                        {tutorial.difficulty}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tutorial.status === 'published'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                        }`}
                      >
                        {tutorial.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white'>
                      {tutorial.viewCount?.toLocaleString() || 0}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <div className='flex space-x-2'>
                        <Link
                          href={`/admin/tutorials/${tutorial.id}`}
                          className='text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300'
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(tutorial.id)}
                          className='text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Summary</h3>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div className='text-center'>
            <p className='text-2xl font-bold text-blue-600 dark:text-blue-400'>{filteredTutorials.length}</p>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              {searchTerm || filterType !== 'all' || filterDifficulty !== 'all' ? 'Filtered' : 'Total'} Tutorials
            </p>
          </div>
          <div className='text-center'>
            <p className='text-2xl font-bold text-green-600 dark:text-green-400'>
              {Array.isArray(filteredTutorials) ? filteredTutorials.filter((t) => t.status === 'published').length : 0}
            </p>
            <p className='text-sm text-gray-600 dark:text-gray-400'>Published</p>
          </div>
          <div className='text-center'>
            <p className='text-2xl font-bold text-yellow-600 dark:text-yellow-400'>
              {Array.isArray(filteredTutorials) ? filteredTutorials.filter((t) => t.status === 'draft').length : 0}
            </p>
            <p className='text-sm text-gray-600 dark:text-gray-400'>Drafts</p>
          </div>
          <div className='text-center'>
            <p className='text-2xl font-bold text-purple-600 dark:text-purple-400'>
              {Array.isArray(filteredTutorials)
                ? filteredTutorials.reduce((sum, t) => sum + (t.viewCount || 0), 0).toLocaleString()
                : 0}
            </p>
            <p className='text-sm text-gray-600 dark:text-gray-400'>Total Views</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialsManagement;
