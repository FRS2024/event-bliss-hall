import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ContentSection {
  title: string;
  content: string;
}

export interface ContentPage {
  id: string;
  slug: string;
  title: string;
  content: ContentSection[];
  meta_description: string | null;
  is_published: boolean;
  last_updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export const useContentPage = (slug: string) => {
  return useQuery({
    queryKey: ['content-page', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_pages')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data as unknown as ContentPage;
    },
    enabled: !!slug,
  });
};

export const useContentPages = () => {
  return useQuery({
    queryKey: ['content-pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_pages')
        .select('*')
        .order('title');
      
      if (error) throw error;
      return data as unknown as ContentPage[];
    },
  });
};

export const useUpdateContentPage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ContentPage> & { id: string }) => {
      const { data, error } = await supabase
        .from('content_pages')
        .update(updates as unknown as Record<string, unknown>)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as unknown as ContentPage;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['content-pages'] });
      queryClient.invalidateQueries({ queryKey: ['content-page', data.slug] });
    },
  });
};

export const useCreateContentPage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (page: Omit<ContentPage, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('content_pages')
        .insert(page as unknown as Record<string, unknown>)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-pages'] });
    },
  });
};

export const useDeleteContentPage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('content_pages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-pages'] });
    },
  });
};
