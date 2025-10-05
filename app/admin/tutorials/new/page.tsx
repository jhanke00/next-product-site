'use client';

import React, { useState } from 'react';
import { LearningResource } from '@/src/types/learning';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const NewTutorial: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'video' as LearningResource['type'],
    category: 'tutorial' as LearningResource['category'],
    difficulty: 'beginner' as LearningResource['difficulty'],
    status: 'draft' as LearningResource['status'],
    content: '',
    fileUrl: '',
    thumbnailUrl: '',
    duration: 0,
    author: '',
    tags: '',
    learningObjectives: '',
    prerequisites: '',
    seoTitle: '',
    seoDescription: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Transform form data to match API expectations
      const tutorialData: Partial<LearningResource> = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        category: formData.category,
        difficulty: formData.difficulty,
        status: formData.status,
        content: formData.content,
        fileUrl: formData.fileUrl || `/content/${formData.type}/${formData.title.toLowerCase().replace(/\s+/g, '-')}`,
        thumbnailUrl: formData.thumbnailUrl || `https://picsum.photos/400/240?random=${Date.now()}`,
        duration: formData.duration,
        author: formData.author,
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        learningObjectives: formData.learningObjectives
          .split('\n')
          .map((obj) => obj.trim())
          .filter((obj) => obj),
        prerequisites: formData.prerequisites
          .split(',')
          .map((prereq) => prereq.trim())
          .filter((prereq) => prereq),
        seoTitle: formData.seoTitle || formData.title,
        seoDescription: formData.seoDescription || formData.description,
        viewCount: 0,
        completionCount: 0,
        averageRating: 0,
        reviewCount: 0,
        fileSize: 0,
        version: '1.0.0',
      };

      const response = await fetch('/api/learning-resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tutorialData),
      });

      const result = await response.json();

      if (result.success) {
        router.push('/admin/tutorials');
      } else {
        alert(`Failed to create tutorial: ${result.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating tutorial:', error);
      alert('Error creating tutorial. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Create New Tutorial</h1>
          <p className='text-gray-600 dark:text-gray-400 mt-2'>Add a new learning resource to your library</p>
        </div>
        <Link
          href='/admin/tutorials'
          className='bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2'
        >
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
          </svg>
          <span>Back to Tutorials</span>
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Basic Information */}
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Basic Information</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='md:col-span-2'>
              <label htmlFor='title' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Title *
              </label>
              <input
                type='text'
                id='title'
                name='title'
                value={formData.title}
                onChange={handleInputChange}
                required
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                placeholder='Enter tutorial title'
              />
            </div>

            <div className='md:col-span-2'>
              <label htmlFor='description' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Description *
              </label>
              <textarea
                id='description'
                name='description'
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                placeholder='Enter tutorial description'
              />
            </div>

            <div>
              <label htmlFor='type' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Type *
              </label>
              <select
                id='type'
                name='type'
                value={formData.type}
                onChange={handleInputChange}
                required
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
              >
                <option value='video'>Video</option>
                <option value='article'>Article</option>
                <option value='course'>Course</option>
                <option value='interactive'>Interactive</option>
                <option value='pdf'>PDF</option>
                <option value='webinar'>Webinar</option>
              </select>
            </div>

            <div>
              <label htmlFor='category' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Category *
              </label>
              <select
                id='category'
                name='category'
                value={formData.category}
                onChange={handleInputChange}
                required
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
              >
                <option value='tutorial'>Tutorial</option>
                <option value='training'>Training</option>
                <option value='guide'>Guide</option>
                <option value='reference'>Reference</option>
              </select>
            </div>

            <div>
              <label htmlFor='difficulty' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Difficulty *
              </label>
              <select
                id='difficulty'
                name='difficulty'
                value={formData.difficulty}
                onChange={handleInputChange}
                required
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
              >
                <option value='beginner'>Beginner</option>
                <option value='intermediate'>Intermediate</option>
                <option value='advanced'>Advanced</option>
              </select>
            </div>

            <div>
              <label htmlFor='status' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Status *
              </label>
              <select
                id='status'
                name='status'
                value={formData.status}
                onChange={handleInputChange}
                required
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
              >
                <option value='draft'>Draft</option>
                <option value='published'>Published</option>
                <option value='archived'>Archived</option>
              </select>
            </div>

            <div>
              <label htmlFor='author' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Author *
              </label>
              <input
                type='text'
                id='author'
                name='author'
                value={formData.author}
                onChange={handleInputChange}
                required
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                placeholder='Enter author name'
              />
            </div>

            <div>
              <label htmlFor='duration' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Duration (minutes)
              </label>
              <input
                type='number'
                id='duration'
                name='duration'
                value={formData.duration}
                onChange={handleInputChange}
                min='0'
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                placeholder='Enter duration in minutes'
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Content</h3>
          <div className='space-y-6'>
            <div>
              <label htmlFor='content' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Content *
              </label>
              <textarea
                id='content'
                name='content'
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={6}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                placeholder='Enter the main content of the tutorial'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label htmlFor='fileUrl' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  File URL
                </label>
                <input
                  type='url'
                  id='fileUrl'
                  name='fileUrl'
                  value={formData.fileUrl}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                  placeholder='https://example.com/tutorial.mp4'
                />
              </div>

              <div>
                <label
                  htmlFor='thumbnailUrl'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                >
                  Thumbnail URL
                </label>
                <input
                  type='url'
                  id='thumbnailUrl'
                  name='thumbnailUrl'
                  value={formData.thumbnailUrl}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                  placeholder='https://example.com/thumbnail.jpg'
                />
              </div>
            </div>
          </div>
        </div>

        {/* Learning Details */}
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Learning Details</h3>
          <div className='space-y-6'>
            <div>
              <label
                htmlFor='learningObjectives'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
              >
                Learning Objectives
              </label>
              <textarea
                id='learningObjectives'
                name='learningObjectives'
                value={formData.learningObjectives}
                onChange={handleInputChange}
                rows={4}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                placeholder='Enter each learning objective on a new line'
              />
              <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>Enter each objective on a new line</p>
            </div>

            <div>
              <label
                htmlFor='prerequisites'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
              >
                Prerequisites
              </label>
              <input
                type='text'
                id='prerequisites'
                name='prerequisites'
                value={formData.prerequisites}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                placeholder='Enter prerequisites separated by commas'
              />
              <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                Separate multiple prerequisites with commas
              </p>
            </div>

            <div>
              <label htmlFor='tags' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Tags
              </label>
              <input
                type='text'
                id='tags'
                name='tags'
                value={formData.tags}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                placeholder='Enter tags separated by commas'
              />
              <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>Separate multiple tags with commas</p>
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>SEO (Optional)</h3>
          <div className='space-y-6'>
            <div>
              <label htmlFor='seoTitle' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                SEO Title
              </label>
              <input
                type='text'
                id='seoTitle'
                name='seoTitle'
                value={formData.seoTitle}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                placeholder='Enter SEO title (defaults to tutorial title)'
              />
            </div>

            <div>
              <label
                htmlFor='seoDescription'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
              >
                SEO Description
              </label>
              <textarea
                id='seoDescription'
                name='seoDescription'
                value={formData.seoDescription}
                onChange={handleInputChange}
                rows={3}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                placeholder='Enter SEO description (defaults to tutorial description)'
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className='flex justify-end space-x-4'>
          <Link
            href='/admin/tutorials'
            className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-6 rounded-lg'
          >
            Cancel
          </Link>
          <button
            type='submit'
            disabled={loading}
            className='bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-6 rounded-lg flex items-center space-x-2'
          >
            {loading ? (
              <>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
                <span>Create Tutorial</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTutorial;
