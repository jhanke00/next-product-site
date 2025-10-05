'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  LearningResource,
  ResourceSearchFilters,
  ResourceSearchResponse,
  UserProgress,
  ApiResponse,
} from '@/src/types/learning';
import ResourceCard from '@/src/components/learning/ResourceCard';
import SearchAndFilter from '@/src/components/learning/SearchAndFilter';
import { ChevronLeft, ChevronRight, Plus, BookOpen, TrendingUp, Users } from 'lucide-react';

interface LearningDashboardProps {
  userId?: string;
  showUserProgress?: boolean;
}

const LearningDashboard: React.FC<LearningDashboardProps> = ({ userId = 'user_001', showUserProgress = true }) => {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});
  const [bookmarkedResources, setBookmarkedResources] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<ResourceSearchFilters>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 9,
  });

  // Fetch learning resources
  const fetchResources = useCallback(async (searchFilters: ResourceSearchFilters) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchFilters.query) params.append('query', searchFilters.query);
      if (searchFilters.types?.length) params.append('types', searchFilters.types.join(','));
      if (searchFilters.categories?.length) params.append('categories', searchFilters.categories.join(','));
      if (searchFilters.difficulties?.length) params.append('difficulties', searchFilters.difficulties.join(','));
      if (searchFilters.tags?.length) params.append('tags', searchFilters.tags.join(','));
      if (searchFilters.sortBy) params.append('sortBy', searchFilters.sortBy);
      if (searchFilters.sortOrder) params.append('sortOrder', searchFilters.sortOrder);
      if (searchFilters.page) params.append('page', searchFilters.page.toString());
      if (searchFilters.limit) params.append('limit', searchFilters.limit.toString());

      const response = await fetch(`/api/learning-resources?${params.toString()}`);
      const data: ApiResponse<ResourceSearchResponse> = await response.json();

      if (data.success && data.data) {
        setResources(data.data.resources);
        setTotalPages(data.data.totalPages);
        setCurrentPage(data.data.page);
      } else {
        throw new Error(data.error?.message || 'Failed to fetch resources');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user progress
  const fetchUserProgress = useCallback(async () => {
    if (!showUserProgress || !userId) return;

    try {
      const response = await fetch(`/api/user-progress?userId=${userId}`);
      const data: ApiResponse<UserProgress[]> = await response.json();

      if (data.success && data.data) {
        const progressMap = data.data.reduce(
          (acc, progress) => {
            acc[progress.resourceId] = progress;
            return acc;
          },
          {} as Record<string, UserProgress>
        );

        setUserProgress(progressMap);

        // Extract bookmarked resources
        const bookmarked = new Set(data.data.filter((p) => p.bookmarked).map((p) => p.resourceId));
        setBookmarkedResources(bookmarked);
      }
    } catch (err) {
      console.error('Error fetching user progress:', err);
    }
  }, [userId, showUserProgress]);

  // Handle bookmark toggle
  const handleBookmark = useCallback(
    async (resourceId: string) => {
      try {
        const isBookmarked = bookmarkedResources.has(resourceId);
        const currentProgress = userProgress[resourceId];

        const response = await fetch('/api/user-progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            resourceId,
            status: currentProgress?.status || 'not_started',
            progressPercentage: currentProgress?.progressPercentage || 0,
            timeSpent: currentProgress?.timeSpent || 0,
            bookmarked: !isBookmarked,
          }),
        });

        const data: ApiResponse<UserProgress> = await response.json();

        if (data.success && data.data) {
          setUserProgress((prev) => ({
            ...prev,
            [resourceId]: data.data!,
          }));

          setBookmarkedResources((prev) => {
            const newSet = new Set(prev);
            if (isBookmarked) {
              newSet.delete(resourceId);
            } else {
              newSet.add(resourceId);
            }
            return newSet;
          });
        }
      } catch (err) {
        console.error('Error updating bookmark:', err);
      }
    },
    [userId, userProgress, bookmarkedResources]
  );

  // Handle resource click
  const handleResourceClick = useCallback((resource: LearningResource) => {
    // In a real app, this would navigate to the resource detail page
    console.log('Resource clicked:', resource);
    // For now, we'll just update the view count locally
    setResources((prev) => prev.map((r) => (r.id === resource.id ? { ...r, viewCount: r.viewCount + 1 } : r)));
  }, []);

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: ResourceSearchFilters) => {
    setFilters(newFilters);
  }, []);

  // Handle pagination
  const handlePageChange = useCallback(
    (page: number) => {
      const newFilters = { ...filters, page };
      setFilters(newFilters);
    },
    [filters]
  );

  // Load data on mount and when filters change
  useEffect(() => {
    fetchResources(filters);
  }, [fetchResources, filters]);

  useEffect(() => {
    fetchUserProgress();
  }, [fetchUserProgress]);

  // Calculate stats
  const stats = {
    totalResources: resources.length,
    completedResources: Object.values(userProgress).filter((p) => p.status === 'completed').length,
    inProgressResources: Object.values(userProgress).filter((p) => p.status === 'in_progress').length,
    bookmarkedCount: bookmarkedResources.size,
  };

  if (error) {
    return (
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <div className='bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-6'>
          <h3 className='text-lg font-semibold text-red-800 dark:text-red-200 mb-2'>Error Loading Resources</h3>
          <p className='text-red-600 dark:text-red-300'>{error}</p>
          <button
            onClick={() => fetchResources(filters)}
            className='mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>Learning Resources</h1>
        <p className='text-gray-600 dark:text-gray-400'>
          Discover and track your learning progress across various resources
        </p>
      </div>

      {/* Stats */}
      {showUserProgress && (
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6'>
            <div className='flex items-center'>
              <BookOpen className='h-8 w-8 text-blue-600 dark:text-blue-400' />
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>Total Resources</p>
                <p className='text-2xl font-semibold text-gray-900 dark:text-white'>{stats.totalResources}</p>
              </div>
            </div>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6'>
            <div className='flex items-center'>
              <TrendingUp className='h-8 w-8 text-green-600 dark:text-green-400' />
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>Completed</p>
                <p className='text-2xl font-semibold text-gray-900 dark:text-white'>{stats.completedResources}</p>
              </div>
            </div>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6'>
            <div className='flex items-center'>
              <Users className='h-8 w-8 text-yellow-600 dark:text-yellow-400' />
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>In Progress</p>
                <p className='text-2xl font-semibold text-gray-900 dark:text-white'>{stats.inProgressResources}</p>
              </div>
            </div>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6'>
            <div className='flex items-center'>
              <Plus className='h-8 w-8 text-purple-600 dark:text-purple-400' />
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>Bookmarked</p>
                <p className='text-2xl font-semibold text-gray-900 dark:text-white'>{stats.bookmarkedCount}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <SearchAndFilter filters={filters} onFiltersChange={handleFiltersChange} className='mb-8' />

      {/* Loading State */}
      {loading && (
        <div className='flex justify-center items-center py-12'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
          <span className='ml-2 text-gray-600 dark:text-gray-400'>Loading resources...</span>
        </div>
      )}

      {/* Resources Grid */}
      {!loading && (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
            {resources.map((resource) => {
              const progress = userProgress[resource.id];
              return (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  showProgress={showUserProgress}
                  progress={progress?.progressPercentage || 0}
                  onResourceClick={handleResourceClick}
                  onBookmark={showUserProgress ? handleBookmark : undefined}
                  isBookmarked={bookmarkedResources.has(resource.id)}
                />
              );
            })}
          </div>

          {/* Empty State */}
          {resources.length === 0 && (
            <div className='text-center py-12'>
              <BookOpen className='mx-auto h-12 w-12 text-gray-400' />
              <h3 className='mt-2 text-sm font-medium text-gray-900 dark:text-white'>No resources found</h3>
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='flex items-center justify-between'>
              <div className='flex-1 flex justify-between sm:hidden'>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className='relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className='ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Next
                </button>
              </div>

              <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
                <div>
                  <p className='text-sm text-gray-700 dark:text-gray-300'>
                    Showing page <span className='font-medium'>{currentPage}</span> of{' '}
                    <span className='font-medium'>{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className='relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      <ChevronLeft className='h-5 w-5' />
                    </button>

                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNumber
                              ? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-300'
                              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      <ChevronRight className='h-5 w-5' />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LearningDashboard;
