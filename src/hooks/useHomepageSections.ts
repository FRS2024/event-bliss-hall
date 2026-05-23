import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface HomepageSection {
  id: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  content: Record<string, unknown>;
  background_image: string | null;
  is_active: boolean;
  updated_at: string;
  updated_by: string | null;
}

export interface HeroContent {
  categories: string[];
}

export interface StatsContent {
  items: Array<{ value: string; label: string }>;
}

export interface HowItWorksContent {
  steps: Array<{ number: number; title: string; description: string }>;
}

export interface CTAContent {
  buttonText: string;
  buttonLink: string;
}

export const useHomepageSection = (sectionKey: string) => {
  return useQuery({
    queryKey: ['homepage-section', sectionKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_sections')
        .select('*')
        .eq('section_key', sectionKey)
        .single();
      
      if (error) throw error;
      return data as HomepageSection;
    },
    enabled: !!sectionKey,
  });
};

export const useHomepageSections = () => {
  return useQuery({
    queryKey: ['homepage-sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_sections')
        .select('*')
        .order('section_key');
      
      if (error) throw error;
      return data as HomepageSection[];
    },
  });
};

export const useUpdateHomepageSection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<HomepageSection> & { id: string }) => {
      const { data, error } = await supabase
        .from('homepage_sections')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as unknown as HomepageSection;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['homepage-sections'] });
      queryClient.invalidateQueries({ queryKey: ['homepage-section', data.section_key] });
    },
  });
};
