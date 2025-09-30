import React from 'react';
import { Trash2, FileText, Video } from 'lucide-react';
import { LearningResource } from '@/src/type/products';

interface ResourceCardProps {
  resource: LearningResource;
  onDelete: (id: string) => void;
  showDeleteButton?: boolean;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onDelete, showDeleteButton = true }) => {
  return (
    <div className='bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'>
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          <div className='flex items-center space-x-2 mb-2'>
            {resource.type === 'training' ? (
              <Video className='w-5 h-5 text-blue-600' />
            ) : (
              <FileText className='w-5 h-5 text-green-600' />
            )}
            <h3 className='text-lg font-medium text-gray-900'>{resource.title}</h3>
          </div>
          <p className='text-gray-600 text-sm mb-3'>{resource.description}</p>
          {resource.duration && <p className='text-sm text-gray-500'>Duration: {resource.duration}</p>}
          <div className='mt-2'>
            <p className='text-xs text-gray-400'>
              Files: {resource?.files?.map((f) => f.name).join(', ') || 'No files'}
            </p>
          </div>
        </div>
        {showDeleteButton && (
          <button
            onClick={() => onDelete(resource.id)}
            className='text-red-500 hover:text-red-700 p-1'
            title='Delete resource'
          >
            <Trash2 className='w-4 h-4' />
          </button>
        )}
      </div>
    </div>
  );
};
