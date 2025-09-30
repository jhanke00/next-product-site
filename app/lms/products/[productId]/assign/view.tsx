'use client';

import React, { useState } from 'react';
import { ArrowLeft, Save, Video, FileText } from 'lucide-react';
import { LearningResource } from '@/src/type/products';
import Link from 'next/link';

interface ProductAssignment {
  productId: number;
  assignedResources: string[];
  customGuide?: string;
  updatedAt: string;
}

interface ViewProps {
  productId: number;
  resources: LearningResource[];
  assignment: ProductAssignment;
}

interface ResourceCheckboxProps {
  resource: LearningResource;
  isChecked: boolean;
  onToggle: (resourceId: string) => void;
}

const ResourceCheckbox: React.FC<ResourceCheckboxProps> = ({ resource, isChecked, onToggle }) => {
  return (
    <div className='flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50'>
      <input
        type='checkbox'
        id={resource.id}
        checked={isChecked}
        onChange={() => onToggle(resource.id)}
        className='mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
      />
      <label htmlFor={resource.id} className='flex-1 cursor-pointer'>
        <div className='flex items-center space-x-2 mb-1'>
          {resource.type === 'training' ? (
            <Video className='w-4 h-4 text-blue-600' />
          ) : (
            <FileText className='w-4 h-4 text-green-600' />
          )}
          <h3 className='font-medium text-gray-900'>{resource.title}</h3>
        </div>
        <p className='text-sm text-gray-600'>{resource.description}</p>
        {resource.duration && <p className='text-xs text-gray-500 mt-1'>Duration: {resource.duration}</p>}
        {resource.files && resource.files.length > 0 && (
          <p className='text-xs text-gray-400 mt-1'>Files: {resource.files.map((f) => f.name).join(', ')}</p>
        )}
      </label>
    </div>
  );
};

export function View({ productId, resources, assignment }: ViewProps) {
  const [assignedResources, setAssignedResources] = useState<string[]>(assignment.assignedResources);
  const [customGuide, setCustomGuide] = useState(assignment.customGuide || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const trainingModules = resources.filter((r) => r.type === 'training');
  const tutorials = resources.filter((r) => r.type === 'tutorial');

  const handleToggleResource = (resourceId: string) => {
    setAssignedResources((prev) =>
      prev.includes(resourceId) ? prev.filter((id) => id !== resourceId) : [...prev, resourceId]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      const response = await fetch(`/api/products/${productId}/assignments`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignedResources,
          customGuide: customGuide.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save assignments');
      }

      setSaveMessage('Successfully saved assignments!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving assignments:', error);
      setSaveMessage('Failed to save assignments. Please try again.');
      setTimeout(() => setSaveMessage(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-4xl mx-auto px-6 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <Link
            href={`/products/${productId}`}
            className='inline-flex items-center text-blue-600 hover:text-blue-800 mb-4'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back to Product
          </Link>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Assign Learning Resources</h1>
          <p className='text-gray-600'>Select training modules and tutorials to assign to Product #{productId}</p>
        </div>

        <div className='space-y-8'>
          {/* Training Modules Section */}
          <div>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>
              Training Modules ({assignedResources.filter((id) => trainingModules.some((t) => t.id === id)).length}/
              {trainingModules.length} selected)
            </h2>
            <div className='space-y-3'>
              {trainingModules.map((resource) => (
                <ResourceCheckbox
                  key={resource.id}
                  resource={resource}
                  isChecked={assignedResources.includes(resource.id)}
                  onToggle={handleToggleResource}
                />
              ))}
              {trainingModules.length === 0 && <p className='text-gray-500 italic'>No training modules available.</p>}
            </div>
          </div>

          {/* Tutorials Section */}
          <div>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>
              Tutorials ({assignedResources.filter((id) => tutorials.some((t) => t.id === id)).length}/
              {tutorials.length} selected)
            </h2>
            <div className='space-y-3'>
              {tutorials.map((resource) => (
                <ResourceCheckbox
                  key={resource.id}
                  resource={resource}
                  isChecked={assignedResources.includes(resource.id)}
                  onToggle={handleToggleResource}
                />
              ))}
              {tutorials.length === 0 && <p className='text-gray-500 italic'>No tutorials available.</p>}
            </div>
          </div>

          {/* Custom Guide Section */}
          <div>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>Custom Product Guide</h2>
            <div className='bg-white border border-gray-200 rounded-lg p-4'>
              <label htmlFor='customGuide' className='block text-sm font-medium text-gray-700 mb-2'>
                Product-specific instructions and guidelines
              </label>
              <textarea
                id='customGuide'
                value={customGuide}
                onChange={(e) => setCustomGuide(e.target.value)}
                rows={8}
                className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                placeholder='Enter custom instructions, dosage information, safety guidelines, or any product-specific information...'
              />
              <p className='text-xs text-gray-500 mt-1'>
                This guide will be displayed in the Learning Resources section for this product.
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className='flex items-center justify-between pt-6 border-t border-gray-200'>
            <div className='flex items-center space-x-4'>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className='bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg flex items-center space-x-2 font-medium'
              >
                <Save className='w-4 h-4' />
                <span>{isSaving ? 'Saving...' : 'Save Assignments'}</span>
              </button>

              {saveMessage && (
                <span className={`text-sm ${saveMessage.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                  {saveMessage}
                </span>
              )}
            </div>

            <div className='text-sm text-gray-500'>
              {assignedResources.length} resource{assignedResources.length !== 1 ? 's' : ''} selected
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
