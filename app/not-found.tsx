import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center'>
        <div className='mb-4'>
          <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100'>
            <svg className='h-6 w-6 text-yellow-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
              />
            </svg>
          </div>
        </div>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>404 - Page Not Found</h1>
        <p className='text-gray-600 mb-6'>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div className='space-y-3'>
          <Link
            href='/'
            className='block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors'
          >
            Go to homepage
          </Link>
          <Link
            href='/lms'
            className='block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors'
          >
            Browse Learning Resources
          </Link>
        </div>
      </div>
    </div>
  );
}
