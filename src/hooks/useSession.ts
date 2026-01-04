'use client';

import { useAuth } from '@/lib/context';

/**
 * useSession - Simple session hook
 * Returns the current user session state
 * Token refresh is handled automatically by the API interceptor
 */
export function useSession() {
  const { user, isAuthenticated, isInitialized } = useAuth();

  return {
    user,
    isAuthenticated,
    isLoading: !isInitialized,
  };
}
