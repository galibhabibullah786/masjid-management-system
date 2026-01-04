'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { Spinner } from '@/components/admin/ui';

interface PublicGuardProps {
  children: React.ReactNode;
}

/**
 * PublicGuard - Guard for login page
 * Redirects authenticated users to the dashboard
 */
export function PublicGuard({ children }: PublicGuardProps) {
  const { isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      const redirect = searchParams.get('redirect') || '/admin/dashboard';
      router.replace(redirect);
    }
  }, [isAuthenticated, isInitialized, router, searchParams]);

  // Show loading while checking auth
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center gap-5">
        <Spinner size="lg" />
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // Show loading while redirecting
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center gap-5">
        <Spinner size="lg" />
        <p className="text-gray-600">Redirecting to dashboard...</p>
      </div>
    );
  }

  return <>{children}</>;
}
