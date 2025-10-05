'use client';

import React, { useState, useEffect } from 'react';
import { LearningResource, ProductResourceAssignment, ApiResponse } from '@/src/types/learning';
import ResourceCard from '@/src/components/learning/ResourceCard';
import { BookOpen, Clock, User, CheckCircle, AlertCircle } from 'lucide-react';

interface ProductLearningResourcesProps {
  productId: string;
  userId?: string;
  className?: string;
}

interface EnrichedAssignment extends ProductResourceAssignment {
  resource: LearningResource | null;
}

const ProductLearningResources: React.FC<ProductLearningResourcesProps> = ({
  productId,
  userId = 'user_001',
  className = '',
}) => {
  const [assignments, setAssignments] = useState<EnrichedAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/products/${productId}/assignments`);
        const data: ApiResponse<EnrichedAssignment[]> = await response.json();

        if (data.success && data.data) {
          setAssignments(data.data);
        } else {
          throw new Error(data.error?.message || 'Failed to fetch learning resources');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching product assignments:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchAssignments();
    }
  }, [productId]);

  const handleResourceClick = (resource: LearningResource) => {
    // In a real app, this would navigate to the resource detail page
    console.log('Learning resource clicked:', resource);
  };

  if (loading) {
    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}
      >
        <div className='flex items-center justify-center py-8'>
          <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600'></div>
          <span className='ml-2 text-gray-600 dark:text-gray-400'>Loading learning resources...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}
      >
        <div className='flex items-center text-red-600 dark:text-red-400'>
          <AlertCircle className='h-5 w-5 mr-2' />
          <span>Error loading learning resources: {error}</span>
        </div>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}
      >
        <div className='text-center py-8'>
          <BookOpen className='mx-auto h-12 w-12 text-gray-400 mb-4' />
          <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>No Learning Resources</h3>
          <p className='text-gray-600 dark:text-gray-400'>
            There are currently no learning resources assigned to this product.
          </p>
        </div>
      </div>
    );
  }

  const requiredResources = assignments.filter((a) => a.isRequired);
  const optionalResources = assignments.filter((a) => !a.isRequired);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>Learning Resources</h2>
            <p className='text-gray-600 dark:text-gray-400'>
              Enhance your understanding of this product with these curated learning materials
            </p>
          </div>
          <div className='text-right'>
            <div className='text-sm text-gray-600 dark:text-gray-400'>
              {assignments.length} resource{assignments.length !== 1 ? 's' : ''}
            </div>
            <div className='text-xs text-gray-500 dark:text-gray-500'>
              {requiredResources.length} required • {optionalResources.length} optional
            </div>
          </div>
        </div>
      </div>

      <div className='p-6'>
        {/* Required Resources */}
        {requiredResources.length > 0 && (
          <div className='mb-8'>
            <div className='flex items-center mb-4'>
              <CheckCircle className='h-5 w-5 text-red-600 dark:text-red-400 mr-2' />
              <h3 className='text-lg font-medium text-gray-900 dark:text-white'>Required Resources</h3>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {requiredResources.map((assignment) => {
                if (!assignment.resource) return null;

                return (
                  <div key={assignment.id} className='relative'>
                    <div className='absolute top-2 right-2 z-10'>
                      <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'>
                        Required
                      </span>
                    </div>
                    <ResourceCard
                      resource={assignment.resource}
                      onResourceClick={handleResourceClick}
                      className='h-full'
                    />
                    {assignment.customDescription && (
                      <div className='mt-2 p-3 bg-blue-50 dark:bg-blue-900 rounded-md'>
                        <p className='text-sm text-blue-800 dark:text-blue-200'>
                          <strong>Product Context:</strong> {assignment.customDescription}
                        </p>
                      </div>
                    )}
                    {assignment.estimatedCompletionTime && (
                      <div className='mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400'>
                        <Clock className='h-4 w-4 mr-1' />
                        Estimated time: {assignment.estimatedCompletionTime} minutes
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Optional Resources */}
        {optionalResources.length > 0 && (
          <div>
            <div className='flex items-center mb-4'>
              <BookOpen className='h-5 w-5 text-blue-600 dark:text-blue-400 mr-2' />
              <h3 className='text-lg font-medium text-gray-900 dark:text-white'>Optional Resources</h3>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {optionalResources.map((assignment) => {
                if (!assignment.resource) return null;

                return (
                  <div key={assignment.id} className='relative'>
                    <div className='absolute top-2 right-2 z-10'>
                      <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'>
                        Optional
                      </span>
                    </div>
                    <ResourceCard
                      resource={assignment.resource}
                      onResourceClick={handleResourceClick}
                      className='h-full'
                    />
                    {assignment.customDescription && (
                      <div className='mt-2 p-3 bg-blue-50 dark:bg-blue-900 rounded-md'>
                        <p className='text-sm text-blue-800 dark:text-blue-200'>
                          <strong>Product Context:</strong> {assignment.customDescription}
                        </p>
                      </div>
                    )}
                    {assignment.estimatedCompletionTime && (
                      <div className='mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400'>
                        <Clock className='h-4 w-4 mr-1' />
                        Estimated time: {assignment.estimatedCompletionTime} minutes
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Prerequisites Info */}
        {assignments.some((a) => a.prerequisites && a.prerequisites.length > 0) && (
          <div className='mt-6 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-md'>
            <h4 className='text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2'>Learning Path Information</h4>
            <div className='text-sm text-yellow-700 dark:text-yellow-300'>
              Some resources have prerequisites. Complete them in the suggested order for the best learning experience.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductLearningResources;
