import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthUser } from '@large-event/api';

export interface Instance {
  id: number;
  name: string;
  accessLevel: 'web_user' | 'web_admin' | 'both';
  ownerOrganization: {
    id: number;
    name: string;
    acronym: string | null;
  };
}

interface AuthContextType {
  user: AuthUser | null;
  instances: Instance[];
  login: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  refreshInstances: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [instances, setInstances] = useState<Instance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  // Listen for logout events from TeamD tabs
  useEffect(() => {
    const CHANNEL_NAME = 'large-event-auth';
    const STORAGE_KEY = 'large-event-logout-event';

    const handleLogout = () => {
      console.log('[Main Portal] Received logout from TeamD');
      setUser(null);
      setInstances([]);
    };

    // Listen via BroadcastChannel
    let channel: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      channel = new BroadcastChannel(CHANNEL_NAME);
      channel.onmessage = (event) => {
        if (event.data?.type === 'logout') {
          handleLogout();
        }
      };
    }

    // Listen via localStorage event (fallback)
    const storageHandler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        handleLogout();
      }
    };
    window.addEventListener('storage', storageHandler);

    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', storageHandler);
    };
  }, []);

  const refreshInstances = async () => {
    try {
      const response = await fetch('/api/instances', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setInstances(data.instances || []);
      }
    } catch (error) {
      console.error('Failed to fetch instances:', error);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        await refreshInstances();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        await refreshInstances();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      setInstances([]);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, instances, login, logout, loading, refreshInstances }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}