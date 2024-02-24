import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='min-h-screen flex flex-grow items-center justify-center bg-gray-50'>
      <div className='rounded-lg bg-white p-8 text-center shadow-xl'>
        <h1 className='mb-4 text-4xl font-bold'>404</h1>
        <p className='text-gray-600'>Oops! The page you are looking for could not be found.</p>
        <a href='/products' className='group rounded-lg border border-transparent px-5 py-4 transition-colors'>
          <h2 className={`mb-3 text-md font-semibold`}>
            Go back to Product{' '}
            <span className='inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none'>
              -&gt;
            </span>
          </h2>
        </a>
      </div>
    </div>
  );
}
