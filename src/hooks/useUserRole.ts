
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type UserRole = 'host' | 'guest' | 'loading';

export const useUserRole = () => {
  const { user } = useAuth();

  const { data: userRole, isLoading } = useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user) return 'guest';

      console.log('Checking user role for:', user.id);

      const { data: venues, error } = await supabase
        .from('venues')
        .select('id')
        .eq('host_id', user.id)
        .limit(1);

      if (error) {
        console.error('Error checking user venues:', error);
        return 'guest';
      }

      const role = venues && venues.length > 0 ? 'host' : 'guest';
      console.log('User role determined:', role);
      return role;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  if (isLoading || !user) return 'loading';
  return userRole || 'guest';
};
