'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { Spinner } from '@/components/admin/ui';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard - Simple authentication guard component
 * Redirects to login if not authenticated after initial check
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect after auth state is initialized
    if (isInitialized && !isAuthenticated) {
      const redirectUrl = `/admin/login?redirect=${encodeURIComponent(pathname)}`;
      router.replace(redirectUrl);
    }
  }, [isAuthenticated, isInitialized, router, pathname]);

  // Show loading spinner while checking auth
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center gap-5">
        <Spinner size="lg" />
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // Show loading while redirecting
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center gap-5">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    );
  }

  return <>{children}</>;
}
