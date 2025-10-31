'use client';

import React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthBar() {
  const [user, setUser] = React.useState<{ id: string; email: string; name?: string } | null>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const loginHref = React.useMemo(() => {
    const search = searchParams?.toString();
    const returnTo = pathname + (search ? `?${search}` : '');
    return `/login?returnTo=${encodeURIComponent(returnTo)}`;
  }, [pathname, searchParams]);

  const fetchMe = React.useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data?.authenticated && data?.user) {
          setUser({ id: data.user.id, email: data.user.email, name: data.user.name });
          return;
        }
      }
      setUser(null);
    } catch {
      // On error, assume logged out
      setUser(null);
    }
  }, []);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await fetchMe();
    })();
    return () => {
      mounted = false;
    };
  }, [fetchMe, pathname]);

  React.useEffect(() => {
    const handler = () => {
      fetchMe();
      // In case cookie application is slightly delayed, try again shortly
      setTimeout(() => {
        fetchMe();
      }, 250);
    };
    window.addEventListener('focus', handler);
    document.addEventListener('visibilitychange', handler);
    window.addEventListener('auth-change', handler as EventListener);
    return () => {
      window.removeEventListener('focus', handler);
      document.removeEventListener('visibilitychange', handler);
      window.removeEventListener('auth-change', handler as EventListener);
    };
  }, [fetchMe]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      if (res.ok) {
        setUser(null);
        if (typeof window !== 'undefined') window.location.reload();
      }
    } catch {}
  };

  return (
    <div className='w-full bg-gray-100 border-b border-gray-200 text-sm text-gray-700'>
      <div className='max-w-6xl mx-auto px-4 py-2 flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          <Link href='/products' className='text-blue-600 hover:text-blue-800'>
            Products
          </Link>
          <Link href='/product-search' className='text-blue-600 hover:text-blue-800'>
            Search
          </Link>
        </div>
        <div className='flex items-center space-x-3'>
          {user ? (
            <button className='text-red-600 hover:text-red-700' onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link href={loginHref} className='text-blue-600 hover:text-blue-800'>
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
