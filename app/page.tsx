'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { getCurrentUser } from './store/slices/authSlice';

export default function Home() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAppSelector(state => state.auth as any);

  useEffect(() => {
    // Check if user is already authenticated on app load
    if (!user && !isLoading) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user, isLoading]);

  useEffect(() => {
    // Redirect based on authentication state
    if (!isLoading) {
      if (isAuthenticated && user) {
        router.push('/dashboard');
      } else if (!isAuthenticated && !user) {
        router.push('/authScreens');
      }
    }
  }, [router, isAuthenticated, user, isLoading]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F7F4ED' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // This will be briefly shown before redirect
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F7F4ED' }}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
