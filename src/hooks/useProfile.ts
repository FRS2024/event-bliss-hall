
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Profile {
  id: string;
  full_name?: string;
  business_name?: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!user,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  });

  return {
    profile,
    isLoading,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending
  };
};

export const useUserProfile = (userId: string) => {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!userId,
  });

  return { profile, isLoading };
};
