import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthSession } from '@/types/api';

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const sessionData = await response.json();
        setSession(sessionData);
      } else {
        setSession(null);
      }
    } catch (error) {
      console.error('Error checking session:', error);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        await checkSession(); // Refresh session
        router.push('/');
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      setSession(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if request fails
      setSession(null);
      router.push('/login');
    }
  };

  const isAuthenticated =
    session?.isAuthenticated && session.expiresAt > Date.now();

  return {
    session,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkSession,
  };
}

export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  return { isAuthenticated, isLoading };
}
