
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
  user_role?: 'guest' | 'host';
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');

      console.log('🔍 Fetching profile for user:', user.id);
      
      // Use maybeSingle() instead of single() to handle missing profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('❌ Error fetching profile:', error);
        throw error;
      }
      
      // If no profile exists, create one
      if (!data) {
        console.log('📝 No profile found, creating new profile for user:', user.id);
        
        const newProfile = {
          id: user.id,
          full_name: user.user_metadata?.full_name || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (createError) {
          console.error('❌ Error creating profile:', createError);
          throw createError;
        }

        console.log('✅ Profile created successfully:', createdProfile);
        return createdProfile as Profile;
      }
      
      console.log('✅ Profile fetched successfully:', data);
      console.log('🖼️ Avatar URL in profile:', data?.avatar_url);
      return data as Profile;
    },
    enabled: !!user,
    staleTime: 0, // Always fetch fresh data
    gcTime: 1000 * 60 * 5, // Cache for 5 minutes (replaced cacheTime)
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!user) throw new Error('Not authenticated');

      console.log('🔄 Updating profile with:', updates);
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating profile:', error);
        throw error;
      }
      
      console.log('✅ Profile updated successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('🎉 Profile update mutation successful:', data);
      
      // Update the cache immediately
      queryClient.setQueryData(['profile', user?.id], data);
      
      // Invalidate all related queries to force refresh
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      
      // Also invalidate any auth-related queries that might cache user data
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      console.error('❌ Error in profile update mutation:', error);
      toast.error(`Failed to update profile: ${error.message}`);
    }
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending
  };
};

export const useUserProfile = (userId: string) => {
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required');

      console.log('🔍 Fetching user profile for:', userId);
      
      // Use maybeSingle() here as well for consistency
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('❌ Error fetching user profile:', error);
        throw error;
      }
      
      console.log('✅ User profile fetched:', data);
      return data as Profile;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  return { profile, isLoading, error };
};
