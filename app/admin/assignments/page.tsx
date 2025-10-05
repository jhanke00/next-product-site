'use client';

import React, { useState, useEffect } from 'react';
import { LearningResource, ProductResourceAssignment } from '@/src/types/learning';
import Link from 'next/link';
import smallData from '@/src/mock/small/products.json';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  rating: number;
  numReviews: number;
  countInStock: number;
}

interface EnrichedAssignment extends ProductResourceAssignment {
  resource: LearningResource | null;
  productName: string;
}

const AssignmentsManagement: React.FC = () => {
  const [assignments, setAssignments] = useState<EnrichedAssignment[]>([]);
  const [tutorials, setTutorials] = useState<LearningResource[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form state for creating new assignment
  const [newAssignment, setNewAssignment] = useState({
    productId: '',
    resourceId: '',
    isRequired: true,
    orderIndex: 0,
    customDescription: '',
    estimatedCompletionTime: 0,
    prerequisites: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch tutorials
        const tutorialsResponse = await fetch('/api/learning-resources?limit=100');
        const tutorialsData = await tutorialsResponse.json();
        const tutorialsList =
          tutorialsData.success && Array.isArray(tutorialsData.data?.resources) ? tutorialsData.data.resources : [];
        setTutorials(tutorialsList);

        // Get first 10 products from mock data for assignment selection
        const allProducts = smallData;
        const firstProducts = allProducts.slice(0, 10);
        setProducts(firstProducts);

        // Fetch assignments for all products
        const allAssignments: EnrichedAssignment[] = [];

        for (const product of firstProducts) {
          try {
            const assignmentsResponse = await fetch(`/api/products/${product.id}/assignments`);
            const assignmentsData = await assignmentsResponse.json();

            if (assignmentsData.success && assignmentsData.data) {
              const productAssignments = assignmentsData.data.map((assignment: any) => ({
                ...assignment,
                productName: product.name,
              }));
              allAssignments.push(...productAssignments);
            }
          } catch (error) {
            console.error(`Error fetching assignments for product ${product.id}:`, error);
          }
        }

        setAssignments(allAssignments);
      } catch (error) {
        console.error('Error fetching data:', error);
        setTutorials([]); // Ensure tutorials is always an array
        setProducts([]); // Ensure products is always an array
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const assignmentData = {
        ...newAssignment,
        prerequisites: newAssignment.prerequisites
          .split(',')
          .map((p) => p.trim())
          .filter((p) => p),
        assignedBy: 'admin_user', // Would come from auth context
        assignedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch(`/api/products/${newAssignment.productId}/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignmentData),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh assignments list
        window.location.reload();
      } else {
        alert(`Failed to create assignment: ${result.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Error creating assignment. Please try again.');
    }
  };

  const handleDeleteAssignment = async (productId: string, assignmentId: string) => {
    if (confirm('Are you sure you want to delete this assignment?')) {
      try {
        const response = await fetch(`/api/products/${productId}/assignments/${assignmentId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setAssignments(assignments.filter((a) => a.id !== assignmentId));
        } else {
          alert('Failed to delete assignment');
        }
      } catch (error) {
        console.error('Error deleting assignment:', error);
        alert('Error deleting assignment');
      }
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
        <span className='ml-2 text-gray-600'>Loading assignments...</span>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Product Assignments</h1>
          <p className='text-gray-600 dark:text-gray-400 mt-2'>
            Manage learning resource assignments to products. Products shown here are from the{' '}
            <Link href='/products' className='text-blue-600 hover:text-blue-800 underline'>
              main products page
            </Link>
            .
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2'
        >
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
          </svg>
          <span>Create Assignment</span>
        </button>
      </div>

      {/* Info Box */}
      <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
        <div className='flex'>
          <div className='flex-shrink-0'>
            <svg className='h-5 w-5 text-blue-400' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <div className='ml-3'>
            <p className='text-sm text-blue-700 dark:text-blue-300'>
              When you assign a tutorial to a product here, it will appear on that product's detail page for customers
              to access. You can assign multiple tutorials to each product to provide comprehensive learning resources.
            </p>
          </div>
        </div>
      </div>

      {/* Create Assignment Form */}
      {showCreateForm && (
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Create New Assignment</h3>
          <form onSubmit={handleCreateAssignment} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label htmlFor='productId' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Product *
                </label>
                <select
                  id='productId'
                  value={newAssignment.productId}
                  onChange={(e) => setNewAssignment({ ...newAssignment, productId: e.target.value })}
                  required
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                >
                  <option value=''>Select a product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - ${product.price} ({product.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor='resourceId' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Tutorial *
                </label>
                <select
                  id='resourceId'
                  value={newAssignment.resourceId}
                  onChange={(e) => setNewAssignment({ ...newAssignment, resourceId: e.target.value })}
                  required
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                >
                  <option value=''>Select a tutorial</option>
                  {Array.isArray(tutorials)
                    ? tutorials.map((tutorial) => (
                        <option key={tutorial.id} value={tutorial.id}>
                          {tutorial.title} ({tutorial.type})
                        </option>
                      ))
                    : null}
                </select>
              </div>

              <div>
                <label className='flex items-center'>
                  <input
                    type='checkbox'
                    checked={newAssignment.isRequired}
                    onChange={(e) => setNewAssignment({ ...newAssignment, isRequired: e.target.checked })}
                    className='rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50'
                  />
                  <span className='ml-2 text-sm text-gray-700 dark:text-gray-300'>Required</span>
                </label>
              </div>

              <div>
                <label htmlFor='orderIndex' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Order Index
                </label>
                <input
                  type='number'
                  id='orderIndex'
                  value={newAssignment.orderIndex}
                  onChange={(e) => setNewAssignment({ ...newAssignment, orderIndex: Number(e.target.value) })}
                  min='0'
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                />
              </div>

              <div>
                <label
                  htmlFor='estimatedCompletionTime'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                >
                  Estimated Time (minutes)
                </label>
                <input
                  type='number'
                  id='estimatedCompletionTime'
                  value={newAssignment.estimatedCompletionTime}
                  onChange={(e) =>
                    setNewAssignment({ ...newAssignment, estimatedCompletionTime: Number(e.target.value) })
                  }
                  min='0'
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                />
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
                  value={newAssignment.prerequisites}
                  onChange={(e) => setNewAssignment({ ...newAssignment, prerequisites: e.target.value })}
                  placeholder='Comma separated tutorial IDs'
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                />
              </div>

              <div className='md:col-span-2'>
                <label
                  htmlFor='customDescription'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                >
                  Custom Description
                </label>
                <textarea
                  id='customDescription'
                  value={newAssignment.customDescription}
                  onChange={(e) => setNewAssignment({ ...newAssignment, customDescription: e.target.value })}
                  rows={3}
                  placeholder='Product-specific context for this tutorial'
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                />
              </div>
            </div>

            <div className='flex justify-end space-x-4'>
              <button
                type='button'
                onClick={() => setShowCreateForm(false)}
                className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg'
              >
                Cancel
              </button>
              <button
                type='submit'
                className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg'
              >
                Create Assignment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Assignments List */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow'>
        {assignments.length === 0 ? (
          <div className='p-12 text-center'>
            <svg className='mx-auto h-12 w-12 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
              />
            </svg>
            <h3 className='mt-2 text-sm font-medium text-gray-900 dark:text-white'>No assignments found</h3>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              Get started by creating a new product assignment.
            </p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
              <thead className='bg-gray-50 dark:bg-gray-700'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Product
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Tutorial
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Type
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Required
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Order
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Est. Time
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                {assignments.map((assignment) => (
                  <tr key={assignment.id} className='hover:bg-gray-50 dark:hover:bg-gray-700'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900 dark:text-white'>{assignment.productName}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='flex-shrink-0 h-8 w-8'>
                          {assignment.resource?.thumbnailUrl && (
                            <img
                              className='h-8 w-8 rounded object-cover'
                              src={assignment.resource.thumbnailUrl}
                              alt={assignment.resource.title}
                            />
                          )}
                        </div>
                        <div className='ml-3'>
                          <div className='text-sm font-medium text-gray-900 dark:text-white'>
                            {assignment.resource?.title || 'Tutorial not found'}
                          </div>
                          <div className='text-sm text-gray-500 dark:text-gray-400'>{assignment.resource?.author}</div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          assignment.resource?.type === 'video'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                            : assignment.resource?.type === 'article'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : assignment.resource?.type === 'course'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                        }`}
                      >
                        {assignment.resource?.type || 'Unknown'}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          assignment.isRequired
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        }`}
                      >
                        {assignment.isRequired ? 'Required' : 'Optional'}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white'>
                      {assignment.orderIndex}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white'>
                      {assignment.estimatedCompletionTime} min
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <button
                        onClick={() => handleDeleteAssignment(assignment.productId, assignment.id)}
                        className='text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center'>
          <p className='text-2xl font-bold text-blue-600 dark:text-blue-400'>{assignments.length}</p>
          <p className='text-sm text-gray-600 dark:text-gray-400'>Total Assignments</p>
        </div>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center'>
          <p className='text-2xl font-bold text-red-600 dark:text-red-400'>
            {assignments.filter((a) => a.isRequired).length}
          </p>
          <p className='text-sm text-gray-600 dark:text-gray-400'>Required</p>
        </div>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center'>
          <p className='text-2xl font-bold text-green-600 dark:text-green-400'>
            {assignments.filter((a) => !a.isRequired).length}
          </p>
          <p className='text-sm text-gray-600 dark:text-gray-400'>Optional</p>
        </div>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center'>
          <p className='text-2xl font-bold text-purple-600 dark:text-purple-400'>{products.length}</p>
          <p className='text-sm text-gray-600 dark:text-gray-400'>Products</p>
        </div>
      </div>
    </div>
  );
};

export default AssignmentsManagement;
