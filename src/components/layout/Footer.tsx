import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className='bg-gray-900 text-white'>
      <div className='max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          <div className='space-y-4'>
            <div className='flex items-center space-x-2'>
              <div className='bg-blue-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl'>
                L
              </div>
              <span className='text-xl font-bold'>LearnHub</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
