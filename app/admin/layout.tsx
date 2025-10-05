import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Learning Management System',
  description: 'Administrative interface for managing learning resources and product assignments',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='flex'>
        {/* Admin Sidebar Navigation */}
        <aside className='w-64 bg-white dark:bg-gray-800 shadow-lg'>
          <div className='p-6'>
            <h1 className='text-xl font-bold text-gray-900 dark:text-white'>Admin Dashboard</h1>
            <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>Learning Management System</p>
          </div>

          <nav className='mt-6'>
            <div className='px-6 py-2'>
              <h3 className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                Management
              </h3>
            </div>
            <div className='mt-2 space-y-1'>
              <a
                href='/admin'
                className='flex items-center px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              >
                <svg className='mr-3 h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 5a2 2 0 012-2h4a2 2 0 012 2v0M8 5a2 2 0 012-2h4a2 2 0 012 2v0'
                  />
                </svg>
                Overview
              </a>
              <a
                href='/admin/tutorials'
                className='flex items-center px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              >
                <svg className='mr-3 h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                  />
                </svg>
                Tutorials
              </a>
              <a
                href='/admin/assignments'
                className='flex items-center px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              >
                <svg className='mr-3 h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                  />
                </svg>
                Product Assignments
              </a>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className='flex-1 p-8'>{children}</main>
      </div>
    </div>
  );
}
