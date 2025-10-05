'use client';

import React, { useState, useEffect } from 'react';
import { LearningResource } from '@/src/types/learning';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalTutorials: 0,
    totalAssignments: 0,
    totalProducts: 0,
    activeUsers: 0,
  });
  const [recentTutorials, setRecentTutorials] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch tutorials
        const tutorialsResponse = await fetch('/api/learning-resources?limit=100');
        const tutorialsData = await tutorialsResponse.json();
        const tutorials =
          tutorialsData.success && Array.isArray(tutorialsData.data?.resources) ? tutorialsData.data.resources : [];

        setStats({
          totalTutorials: tutorials.length,
          totalAssignments: 7, // From our sample data
          totalProducts: 2, // From our sample data
          activeUsers: 150, // Mock data
        });

        // Get recent tutorials (last 3)
        const recent = tutorials.length > 0 ? tutorials.slice(-3).reverse() : [];
        setRecentTutorials(recent);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
        <span className='ml-2 text-gray-600'>Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Admin Dashboard</h1>
        <p className='text-gray-600 dark:text-gray-400 mt-2'>
          Manage your learning resources and track system performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow'>
          <div className='flex items-center'>
            <div className='p-3 rounded-full bg-blue-100 dark:bg-blue-900'>
              <svg
                className='h-6 w-6 text-blue-600 dark:text-blue-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                />
              </svg>
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>Total Tutorials</p>
              <p className='text-2xl font-semibold text-gray-900 dark:text-white'>{stats.totalTutorials}</p>
            </div>
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow'>
          <div className='flex items-center'>
            <div className='p-3 rounded-full bg-green-100 dark:bg-green-900'>
              <svg
                className='h-6 w-6 text-green-600 dark:text-green-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                />
              </svg>
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>Assignments</p>
              <p className='text-2xl font-semibold text-gray-900 dark:text-white'>{stats.totalAssignments}</p>
            </div>
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow'>
          <div className='flex items-center'>
            <div className='p-3 rounded-full bg-yellow-100 dark:bg-yellow-900'>
              <svg
                className='h-6 w-6 text-yellow-600 dark:text-yellow-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
                />
              </svg>
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>Products</p>
              <p className='text-2xl font-semibold text-gray-900 dark:text-white'>{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow'>
          <div className='flex items-center'>
            <div className='p-3 rounded-full bg-purple-100 dark:bg-purple-900'>
              <svg
                className='h-6 w-6 text-purple-600 dark:text-purple-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'
                />
              </svg>
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>Active Users</p>
              <p className='text-2xl font-semibold text-gray-900 dark:text-white'>{stats.activeUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className='grid grid-cols-1 gap-8'>
        {/* Recent Tutorials */}
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Recent Tutorials</h3>
            <a
              href='/admin/tutorials'
              className='text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
            >
              View all →
            </a>
          </div>
          <div className='space-y-4'>
            {recentTutorials.length > 0 ? (
              recentTutorials.map((tutorial) => (
                <div key={tutorial.id} className='flex items-center space-x-4'>
                  <div className='flex-shrink-0'>
                    <div className='w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center'>
                      <svg
                        className='w-5 h-5 text-gray-600 dark:text-gray-400'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
                        />
                      </svg>
                    </div>
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-gray-900 dark:text-white truncate'>{tutorial.title}</p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {tutorial.type} • {tutorial.difficulty}
                    </p>
                  </div>
                  <div className='flex-shrink-0'>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tutorial.status === 'published'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}
                    >
                      {tutorial.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-gray-500 dark:text-gray-400 text-center py-4'>No tutorials found</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Quick Actions</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <a
            href='/admin/tutorials/new'
            className='flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            <svg className='mr-2 h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
            </svg>
            Create New Tutorial
          </a>
          <a
            href='/admin/assignments'
            className='flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            <svg className='mr-2 h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
              />
            </svg>
            Manage Assignments
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
