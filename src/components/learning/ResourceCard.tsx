'use client';

import React from 'react';
import { LearningResource, ResourceType, ResourceCategory, DifficultyLevel } from '@/src/types/learning';
import { Star, Clock, Users, BookOpen, Video, FileText, Award, Globe } from 'lucide-react';

interface ResourceCardProps {
  resource: LearningResource;
  showProgress?: boolean;
  progress?: number;
  onResourceClick?: (resource: LearningResource) => void;
  onBookmark?: (resourceId: string) => void;
  isBookmarked?: boolean;
  className?: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  showProgress = false,
  progress = 0,
  onResourceClick,
  onBookmark,
  isBookmarked = false,
  className = '',
}) => {
  const getTypeIcon = (type: ResourceType) => {
    switch (type) {
      case 'video':
        return <Video className='w-4 h-4' />;
      case 'pdf':
        return <FileText className='w-4 h-4' />;
      case 'article':
        return <BookOpen className='w-4 h-4' />;
      case 'quiz':
        return <Award className='w-4 h-4' />;
      case 'webinar':
        return <Globe className='w-4 h-4' />;
      default:
        return <BookOpen className='w-4 h-4' />;
    }
  };

  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'expert':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getCategoryColor = (category: ResourceCategory) => {
    switch (category) {
      case 'tutorial':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'guide':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'training':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      case 'documentation':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'reference':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300';
      case 'certification':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const handleCardClick = () => {
    if (onResourceClick) {
      onResourceClick(resource);
    }
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBookmark) {
      onBookmark(resource.id);
    }
  };

  return (
    <div
      className={`
        group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 
        shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer
        ${className}
      `}
      onClick={handleCardClick}
    >
      {/* Thumbnail */}
      {resource.thumbnailUrl && (
        <div className='relative w-full h-48 rounded-t-lg overflow-hidden'>
          <img
            src={resource.thumbnailUrl}
            alt={resource.altText || resource.title}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-200'
          />
          <div className='absolute top-2 left-2 flex gap-2'>
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}
            >
              {resource.difficulty}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${getCategoryColor(resource.category)}`}
            >
              {getTypeIcon(resource.type)}
              {resource.type}
            </span>
          </div>
          {onBookmark && (
            <button
              onClick={handleBookmarkClick}
              className={`
                absolute top-2 right-2 p-1 rounded-full transition-colors
                ${isBookmarked ? 'bg-yellow-500 text-white' : 'bg-black bg-opacity-50 text-white hover:bg-opacity-70'}
              `}
            >
              <Star className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>
      )}

      {/* Content */}
      <div className='p-4'>
        <div className='mb-2'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
            {resource.title}
          </h3>
          <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>by {resource.author}</p>
        </div>

        <p className='text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-3'>{resource.description}</p>

        {/* Progress bar */}
        {showProgress && (
          <div className='mb-3'>
            <div className='flex justify-between items-center mb-1'>
              <span className='text-xs text-gray-600 dark:text-gray-400'>Progress</span>
              <span className='text-xs text-gray-600 dark:text-gray-400'>{progress}%</span>
            </div>
            <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5'>
              <div
                className='bg-blue-600 h-1.5 rounded-full transition-all duration-300'
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className='flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3'>
          <div className='flex items-center gap-3'>
            {resource.duration && (
              <div className='flex items-center gap-1'>
                <Clock className='w-3 h-3' />
                {formatDuration(resource.duration)}
              </div>
            )}
            <div className='flex items-center gap-1'>
              <Users className='w-3 h-3' />
              {resource.viewCount} views
            </div>
            {resource.averageRating > 0 && (
              <div className='flex items-center gap-1'>
                <Star className='w-3 h-3 fill-current text-yellow-400' />
                {resource.averageRating.toFixed(1)}
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        {resource.tags.length > 0 && (
          <div className='flex flex-wrap gap-1'>
            {resource.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className='inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md'
              >
                {tag}
              </span>
            ))}
            {resource.tags.length > 3 && (
              <span className='inline-block px-2 py-1 text-xs text-gray-500 dark:text-gray-400'>
                +{resource.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceCard;
