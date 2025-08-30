import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

export const useRoleRedirect = () => {
  const { user } = useAuth();
  const { profile, isLoading } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Skip if still loading or user not authenticated
    if (isLoading || !user || !profile) return;
    
    // Skip if already on role selection page
    if (location.pathname === '/select-role') return;
    
    // Skip if already on auth pages
    if (['/login', '/signup'].includes(location.pathname)) return;
    
    // Check if user needs to select a role (OAuth users without stored role)
    if (!profile.user_role) {
      navigate('/select-role');
    }
  }, [user, profile, isLoading, navigate, location.pathname]);

  return {
    needsRoleSelection: user && profile && !profile.user_role,
    isLoading
  };
};