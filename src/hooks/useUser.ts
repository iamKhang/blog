import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
  bio?: string | null;
  dob?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: authUser } = useAuthStore();

  const fetchUser = useCallback(async () => {
    if (!authUser?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/users/${authUser.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [authUser?.id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, isLoading, error, refresh: fetchUser };
} 