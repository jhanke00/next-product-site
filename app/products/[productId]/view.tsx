'use client';
import { ProductDetails } from '@type/products';

import Image from 'next/image';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Video } from 'lucide-react';

interface ExpandableSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({ title, children, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className='border-b border-gray-200'>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className='w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 px-4'
      >
        <span className='text-lg font-medium text-blue-600'>{title}</span>
        {isExpanded ? (
          <ChevronUp className='w-5 h-5 text-blue-600' />
        ) : (
          <ChevronDown className='w-5 h-5 text-blue-600' />
        )}
      </button>
      {isExpanded && <div className='px-4 pb-4'>{children}</div>}
    </div>
  );
};
export function View({ product }: { product: ProductDetails }) {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero Section */}
      <div className='relative h-64 bg-gray-800'>
        <Image
          src={product.imageUrl || '/media/manufacturing-facility.jpg'}
          alt='Image info'
          height={640}
          width={640}
          className='w-full h-full object-cover'
        />
      </div>

      {/* Content */}
      <div className='max-w-4xl mx-auto px-6 py-8'>
        {/* Product Title */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>{product.name}</h1>
          <p className='text-lg text-gray-600'>{product.description}</p>
        </div>

        {/* Product Details Section */}
        <div className='mb-8'>
          <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
            <ExpandableSection title='Product Details' defaultExpanded={true}>
              <div className='space-y-4'>
                <p className='text-gray-600'>{product.detailedDescription}</p>
                {product.usageInstructions && (
                  <div>
                    <h4 className='font-medium text-gray-800 mb-2'>Usage Instructions:</h4>
                    <p className='text-gray-600'>{product.usageInstructions}</p>
                  </div>
                )}
              </div>
            </ExpandableSection>
          </div>
        </div>

        {/* Learning Section */}
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-2xl font-semibold text-gray-800'>Learning resources</h2>
            <a
              href={`/lms/products/${product.id}/assign`}
              className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors'
            >
              Manage Resources
            </a>
          </div>

          {/* Custom Guide Section */}
          {product.customGuide && (
            <div className='mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4'>
              <h3 className='text-lg font-medium text-gray-800 mb-2'>Product Guide</h3>
              <div className='text-gray-700 whitespace-pre-line'>{product.customGuide}</div>
            </div>
          )}

          {product.learningResources && product.learningResources.length > 0 ? (
            <div className='space-y-6'>
              {/* Tutorials Section */}
              {product.learningResources.filter((r) => r.type === 'tutorial').length > 0 && (
                <div>
                  <h3 className='text-xl font-medium text-gray-800 mb-3'>Tutorials</h3>
                  <div className='bg-white rounded-lg border border-gray-200 p-4'>
                    <ul className='space-y-4'>
                      {product.learningResources
                        .filter((resource) => resource.type === 'tutorial')
                        .map((resource) => (
                          <li key={resource.id} className='border-b border-gray-100 last:border-b-0 pb-3 last:pb-0'>
                            <div className='flex items-start justify-between'>
                              <div className='flex-1'>
                                <h4 className='text-gray-900 font-medium mb-1'>{resource.title}</h4>
                                {resource.description && (
                                  <p className='text-sm text-gray-600 mb-2'>{resource.description}</p>
                                )}
                                {resource.duration && (
                                  <span className='text-sm text-gray-500'>Duration: {resource.duration}</span>
                                )}
                              </div>
                            </div>
                            {/* PDF Files */}
                            {resource.files && resource.files.length > 0 && (
                              <div className='mt-3 space-y-2'>
                                {resource.files
                                  .filter((file) => file.type === 'pdf')
                                  .map((file) => (
                                    <div key={file.id} className='flex items-center space-x-2'>
                                      <a
                                        href={file.url}
                                        download={file.name}
                                        className='flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors'
                                      >
                                        <FileText className='w-4 h-4' />
                                        <span className='text-sm font-medium'>{file.name}</span>
                                      </a>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Guides Section */}
              {product.learningResources.filter((r) => r.type === 'guide').length > 0 && (
                <div>
                  <h3 className='text-xl font-medium text-gray-800 mb-3'>Guides</h3>
                  <div className='bg-white rounded-lg border border-gray-200 p-4'>
                    <ul className='space-y-4'>
                      {product.learningResources
                        .filter((resource) => resource.type === 'guide')
                        .map((resource) => (
                          <li key={resource.id} className='border-b border-gray-100 last:border-b-0 pb-3 last:pb-0'>
                            <div className='flex items-start justify-between'>
                              <div className='flex-1'>
                                <h4 className='text-gray-900 font-medium mb-1'>{resource.title}</h4>
                                {resource.description && (
                                  <p className='text-sm text-gray-600 mb-2'>{resource.description}</p>
                                )}
                                {resource.duration && (
                                  <span className='text-sm text-gray-500'>Duration: {resource.duration}</span>
                                )}
                              </div>
                            </div>
                            {/* Guide Files */}
                            {resource.files && resource.files.length > 0 && (
                              <div className='mt-3 space-y-2'>
                                {resource.files.map((file) => (
                                  <div key={file.id} className='flex items-center space-x-2'>
                                    <a
                                      href={file.url}
                                      download={file.name}
                                      className='flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors'
                                    >
                                      <FileText className='w-4 h-4' />
                                      <span className='text-sm font-medium'>{file.name}</span>
                                    </a>
                                  </div>
                                ))}
                              </div>
                            )}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Training Modules Section */}
              {product.learningResources.filter((r) => r.type === 'training' || r.type === 'video').length > 0 && (
                <div>
                  <h3 className='text-xl font-medium text-gray-800 mb-3'>Training Modules</h3>
                  <div className='bg-white rounded-lg border border-gray-200 p-4'>
                    <ul className='space-y-4'>
                      {product.learningResources
                        .filter((resource) => resource.type === 'training' || resource.type === 'video')
                        .map((resource) => (
                          <li key={resource.id} className='border-b border-gray-100 last:border-b-0 pb-3 last:pb-0'>
                            <div className='flex items-start justify-between'>
                              <div className='flex-1'>
                                <h4 className='text-gray-900 font-medium mb-1'>{resource.title}</h4>
                                {resource.description && (
                                  <p className='text-sm text-gray-600 mb-2'>{resource.description}</p>
                                )}
                                {resource.duration && (
                                  <span className='text-sm text-gray-500'>Duration: {resource.duration}</span>
                                )}
                              </div>
                            </div>
                            {/* Video Files */}
                            {resource.files && resource.files.length > 0 && (
                              <div className='mt-3 space-y-2'>
                                {resource.files
                                  .filter((file) => file.type === 'video')
                                  .map((file) => (
                                    <div key={file.id} className='flex items-center space-x-2'>
                                      <a
                                        href={file.url}
                                        download={file.name}
                                        className='flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors'
                                      >
                                        <Video className='w-4 h-4' />
                                        <span className='text-sm font-medium'>
                                          {file.name.endsWith('.mp4') ? 'Training Video' : file.name}
                                        </span>
                                      </a>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className='text-center py-8 text-gray-500'>
              <p>No learning resources assigned to this product yet.</p>
              <p className='text-sm mt-1'>Click &#34;Manage Resources&#34; to assign training modules and tutorials.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
