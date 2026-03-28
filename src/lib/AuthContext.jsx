import React, { createContext, useState, useContext, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { supabase } from '@/api/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const syncFromSession = async (session, { showLoading = false } = {}) => {
      if (!session) {
        if (!cancelled) {
          setUser(null);
          setIsAuthenticated(false);
          setAuthError(null);
          setIsLoadingAuth(false);
        }
        return;
      }

      try {
        if (showLoading && !cancelled) setIsLoadingAuth(true);
        const currentUser = await base44.auth.me();
        if (cancelled) return;
        setUser(currentUser);
        setIsAuthenticated(true);
        setAuthError(null);
      } catch (error) {
        if (cancelled) return;
        const isUnauth =
          error?.status === 401 ||
          error?.message === 'Not authenticated';
        if (!isUnauth) {
          console.error('User auth check failed:', error);
        }
        setUser(null);
        setIsAuthenticated(false);
        if (error?.status === 401 || error?.status === 403) {
          setAuthError({
            type: 'auth_required',
            message: 'Authentication required',
          });
        }
      } finally {
        if (!cancelled) setIsLoadingAuth(false);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Ao voltar para a aba, o Supabase renova o token e dispara TOKEN_REFRESHED.
      // Antes isto punha isLoadingAuth=true e o App mostrava o ecrã de loading inteiro (parecia refresh).
      if (event === 'TOKEN_REFRESHED') {
        return;
      }

      const showLoading =
        event === 'INITIAL_SESSION' ||
        event === 'SIGNED_IN' ||
        event === 'PASSWORD_RECOVERY';

      void syncFromSession(session, { showLoading });
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);

    if (shouldRedirect) {
      void base44.auth.logout().finally(() => {
        window.location.assign('/login');
      });
    } else {
      void base44.auth.logout();
    }
  };

  const navigateToLogin = () => {
    base44.auth.redirectToLogin(window.location.href);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      authError,
      logout,
      navigateToLogin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
