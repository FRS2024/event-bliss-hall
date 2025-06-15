
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type AdminRole = 'super_admin' | 'platform_manager' | 'content_moderator' | 'support_agent' | 'analyst';

export interface AdminUser {
  id: string;
  user_id: string;
  role: AdminRole;
  permissions: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useAdminAuth = () => {
  const { user } = useAuth();

  const { data: adminUser, isLoading, error } = useQuery({
    queryKey: ['admin-auth', user?.id],
    queryFn: async () => {
      if (!user) return null;

      console.log('Checking admin status for user:', user.id);

      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Error checking admin status:', error);
        throw error;
      }

      console.log('Admin user data:', data);
      return data as AdminUser | null;
    },
    enabled: !!user,
  });

  const isAdmin = !!adminUser;
  const adminRole = adminUser?.role || null;

  const hasPermission = (requiredRole: AdminRole | AdminRole[]) => {
    if (!adminUser) return false;
    
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return roles.includes(adminUser.role);
  };

  return {
    adminUser,
    isAdmin,
    adminRole,
    hasPermission,
    isLoading,
    error
  };
};
